import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MAX_BYTES = 5 * 1024 * 1024;

export interface JobRecord {
  id: string;
  title: string;
  company: string | null;
  description: string;
  required_skills: string[];
  optional_skills: string[];
  apply_url: string | null;
  is_demo: boolean;
}

export const listJobs = createServerFn({ method: "GET" }).handler(async (): Promise<JobRecord[]> => {
  const { createPublicClient } = await import("./db-public.server");
  const { data, error } = await createPublicClient()
    .from("jobs")
    .select("id, title, company, description, required_skills, optional_skills, apply_url, is_demo")
    .order("title");
  if (error) {
    console.error("listJobs", error);
    throw new Error("Could not load the job list.");
  }
  return data ?? [];
});

export type AnalyzeResult =
  | { ok: true; duplicate: false; reportId: string; message: string }
  | { ok: true; duplicate: true; reportId: string; message: string }
  | { ok: false; error: string };

export const analyzeResume = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (!(data instanceof FormData)) throw new Error("Expected form data");
    const name = String(data.get("name") ?? "").trim();
    const jobId = String(data.get("jobId") ?? "").trim();
    const file = data.get("file");
    return { name, jobId, file: file instanceof File ? file : null };
  })
  .handler(async ({ data }): Promise<AnalyzeResult> => {
    const { name, jobId, file } = data;
    if (!name || name.length > 100) return { ok: false, error: "Please enter your name (up to 100 characters)." };
    if (!z.string().uuid().safeParse(jobId).success) return { ok: false, error: "Please choose a preferred job role." };
    if (!file || file.size === 0) return { ok: false, error: "Please choose a resume file to upload." };
    if (file.size > MAX_BYTES) return { ok: false, error: "That file is larger than 5 MB. Please upload a smaller resume." };

    const { detectFileType, sha256Hex, extractResumeText } = await import("./resume-parse.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { extractSkills, extractCandidateDetails, rankJobs } = await import("./skills");

    const bytes = new Uint8Array(await file.arrayBuffer());
    const type = detectFileType(file.name, bytes);
    if (!type) return { ok: false, error: "Only PDF and DOCX resumes are supported. Please upload a .pdf or .docx file." };

    // Duplicate detection by file content (SHA-256), not by filename.
    const hash = await sha256Hex(bytes);
    const { data: existing } = await supabaseAdmin.from("resumes").select("id").eq("file_hash", hash).maybeSingle();
    if (existing) {
      return {
        ok: true,
        duplicate: true,
        reportId: existing.id,
        message: "Duplicate resume detected. This identical file has already been uploaded.",
      };
    }

    const { data: job } = await supabaseAdmin.from("jobs").select("id").eq("id", jobId).maybeSingle();
    if (!job) return { ok: false, error: "The selected job role no longer exists. Please choose another." };

    let text = "";
    try {
      text = await extractResumeText(type, bytes);
    } catch (e) {
      console.error("extractResumeText", e);
      return { ok: false, error: "We couldn't read this file. It may be damaged or password-protected." };
    }
    if (text.replace(/\s/g, "").length < 20) {
      return {
        ok: false,
        error:
          "No readable text was found in this resume. Scanned or image-only PDFs aren't supported yet — please upload a text-based PDF or a DOCX file.",
      };
    }

    const skills = extractSkills(text);
    const details = extractCandidateDetails(text);

    const { data: resume, error: insertError } = await supabaseAdmin
      .from("resumes")
      .insert({
        candidate_name: name,
        filename: file.name.slice(0, 200),
        file_type: type,
        file_hash: hash,
        education: details.education,
        experience: details.experience,
        extracted_skills: skills,
        preferred_job_id: jobId,
        status: "processed",
      })
      .select("id")
      .single();
    if (insertError || !resume) {
      // A concurrent identical upload can win the unique-hash race.
      if (insertError?.code === "23505") {
        const { data: dup } = await supabaseAdmin.from("resumes").select("id").eq("file_hash", hash).single();
        if (dup) return { ok: true, duplicate: true, reportId: dup.id, message: "Duplicate resume detected. This identical file has already been uploaded." };
      }
      console.error("insert resume", insertError);
      return { ok: false, error: "Something went wrong saving your resume. Please try again." };
    }

    const { data: jobs } = await supabaseAdmin.from("jobs").select("id, title, required_skills");
    const ranked = rankJobs(skills, jobs ?? []).filter((r) => r.percentage !== null);
    if (ranked.length > 0) {
      const { error: aErr } = await supabaseAdmin.from("analyses").insert(
        ranked.map((r) => ({
          resume_id: resume.id,
          job_id: r.job.id,
          match_percentage: r.percentage!,
          matched_skills: r.matched,
          missing_skills: r.missing,
        })),
      );
      if (aErr) console.error("insert analyses", aErr);
    }

    return { ok: true, duplicate: false, reportId: resume.id, message: "Resume uploaded successfully. No duplicate detected." };
  });

export interface ReportData {
  resume: {
    id: string;
    candidate_name: string;
    filename: string;
    file_type: string;
    education: string | null;
    experience: string | null;
    extracted_skills: string[];
    status: string;
    created_at: string;
    preferred_job_id: string | null;
  };
  jobs: JobRecord[];
}

export const getReport = createServerFn({ method: "GET" })
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }): Promise<ReportData | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: resume } = await supabaseAdmin
      .from("resumes")
      .select("id, candidate_name, filename, file_type, education, experience, extracted_skills, status, created_at, preferred_job_id")
      .eq("id", data.id)
      .maybeSingle();
    if (!resume) return null;
    const { data: jobs } = await supabaseAdmin
      .from("jobs")
      .select("id, title, company, description, required_skills, optional_skills, apply_url, is_demo");
    return { resume, jobs: jobs ?? [] };
  });
