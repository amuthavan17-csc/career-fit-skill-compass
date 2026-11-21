import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Printer } from "lucide-react";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MatchMeter } from "@/components/match-meter";
import { SkillList } from "@/components/skill-list";
import { reportQuery } from "@/lib/queries";
import { buildRecommendation, matchSkills, rankJobs } from "@/lib/skills";

export const Route = createFileRoute("/report/$id")({
  validateSearch: z.object({ duplicate: z.boolean().optional() }),
  head: () => ({
    meta: [
      { title: "Resume analysis report — SkillMatch" },
      { name: "description", content: "SkillMatch resume analysis: extracted skills, skill gaps, match scores and recommended job roles." },
      { property: "og:title", content: "Resume analysis report — SkillMatch" },
      { property: "og:description", content: "Extracted skills, skill gaps, match scores and recommended job roles." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: async ({ context, params }) => {
    const parsed = z.string().uuid().safeParse(params.id);
    if (!parsed.success) throw notFound();
    const data = await context.queryClient.ensureQueryData(reportQuery(params.id));
    if (!data) throw notFound();
  },
  notFoundComponent: () => (
    <main className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-3xl font-semibold">Report not found</h1>
      <p className="mt-2 text-muted-foreground">This report doesn't exist or the link is incomplete.</p>
      <Button asChild variant="ink" className="mt-6"><Link to="/">Analyze a resume</Link></Button>
    </main>
  ),
  component: ReportPage,
});

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/70 py-2.5 last:border-0 sm:flex-row sm:gap-4">
      <dt className="eyebrow sm:w-36 sm:shrink-0 sm:pt-0.5">{label}</dt>
      <dd className="text-sm">{value || <span className="text-muted-foreground">Not found in resume</span>}</dd>
    </div>
  );
}

function ReportPage() {
  const { id } = Route.useParams();
  const { duplicate } = Route.useSearch();
  const { data } = useSuspenseQuery(reportQuery(id));
  if (!data) return null;
  const { resume, jobs } = data;

  const skills = resume.extracted_skills;
  const ranked = rankJobs(skills, jobs);
  const selectedJob = jobs.find((j) => j.id === resume.preferred_job_id) ?? null;
  const selected = selectedJob ? { title: selectedJob.title, result: matchSkills(skills, selectedJob.required_skills) } : null;
  const rec = buildRecommendation({ skills, selected, ranked });
  const date = new Date(resume.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

  return (
    <main className="mx-auto max-w-5xl px-4 pt-6 sm:pt-10">
      <div className="no-print mb-5 flex items-center justify-between gap-3">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Analyze another</Link>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer /> Download PDF
        </Button>
      </div>

      {duplicate ? (
        <div role="status" className="mb-5 flex gap-3 rounded-lg border border-gap/30 bg-gap-soft p-4 text-sm text-gap">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p><strong>Duplicate resume detected.</strong> This identical file has already been uploaded, so here is its original report.</p>
        </div>
      ) : null}

      <header className="paper-card overflow-hidden">
        <div className="bg-ink px-5 py-5 text-ink-foreground sm:px-7">
          <p className="font-mono text-[0.68rem] tracking-[0.16em] uppercase opacity-70">SkillMatch · Resume analysis report</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{resume.candidate_name}</h1>
          <p className="mt-1 text-sm opacity-75">{resume.filename} · {date}</p>
        </div>
        <dl className="px-5 py-2 sm:px-7">
          <Row label="Education" value={resume.education} />
          <Row label="Experience" value={resume.experience} />
          <Row label="Resume status" value={resume.status === "processed" ? "Successfully processed" : resume.status} />
          <Row label="Duplicate check" value={duplicate ? "Duplicate — identical file uploaded before" : "Original upload — no duplicate found"} />
        </dl>
      </header>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.15fr]">
        <section className="paper-card p-5 sm:p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold">Extracted skills</h2>
            <span className="font-mono text-sm text-muted-foreground">{skills.length} found</span>
          </div>
          <div className="mt-4">
            <SkillList skills={skills} empty="No recognised technical skills were found in this resume." />
          </div>
        </section>

        <section className="paper-card p-5 sm:p-6">
          <p className="eyebrow">Skill gap · selected role</p>
          <h2 className="mt-1 text-xl font-semibold">{selectedJob?.title ?? "No role selected"}</h2>
          {selected && (
            selected.result.percentage === null ? (
              <p className="mt-3 text-sm text-muted-foreground">No job requirements available for this role.</p>
            ) : (
              <>
                <MatchMeter value={selected.result.percentage} size="lg" className="mt-4" />
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {selected.result.matched.length} of {selected.result.totalRequired} required skills matched
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="eyebrow mb-2 flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-success" aria-hidden /> Matched</p>
                    <SkillList skills={selected.result.matched} variant="matched" />
                  </div>
                  <div>
                    <p className="eyebrow mb-2 flex items-center gap-1.5"><AlertTriangle className="size-3.5 text-gap" aria-hidden /> Missing</p>
                    <SkillList skills={selected.result.missing} variant="missing" empty="Nothing — full match" />
                  </div>
                </div>
              </>
            )
          )}
        </section>
      </div>

      <section className="paper-card mt-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-semibold">Job recommendations</h2>
          <span className="eyebrow">Sorted by match · demo job data</span>
        </div>
        <ol className="mt-4 divide-y divide-border/70">
          {ranked.map((r, i) => (
            <li key={r.job.id} className="grid gap-3 py-4 sm:grid-cols-[2rem_1fr_10rem] sm:items-start">
              <span className="font-mono text-sm text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-lg font-semibold">{r.job.title}</h3>
                  {r.job.id === selectedJob?.id && <Badge variant="skill" className="rounded-full">Your pick</Badge>}
                </div>
                {r.job.company && <p className="text-xs text-muted-foreground">{r.job.company}</p>}
                <p className="mt-1 text-sm text-muted-foreground">{r.job.description}</p>
                {r.percentage !== null && (
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    {r.matched.length > 0 && <span><span className="text-success">✓</span> {r.matched.join(", ")}</span>}
                    {r.missing.length > 0 && <span className="text-gap">Missing: {r.missing.join(", ")}</span>}
                  </div>
                )}
                {r.job.apply_url && (
                  <a href={r.job.apply_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">Apply →</a>
                )}
              </div>
              {r.percentage === null ? (
                <p className="text-xs text-muted-foreground">No job requirements available.</p>
              ) : (
                <MatchMeter value={r.percentage} />
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-5 rounded-xl border border-ink/80 bg-secondary p-5 sm:p-7">
        <p className="eyebrow">Final recommendation</p>
        <div className="mt-3 space-y-2.5 font-display text-lg leading-snug">
          {rec.summary.map((s) => <p key={s}>{s}</p>)}
        </div>
        {rec.learningAreas.length > 0 && (
          <div className="mt-5">
            <p className="eyebrow mb-2">Suggested learning areas</p>
            <SkillList skills={rec.learningAreas} variant="missing" />
          </div>
        )}
      </section>

      <p className="mt-6 text-xs text-muted-foreground">
        Scores = matched required skills ÷ total required skills × 100. This report is a guide to support, not replace, human review.
      </p>
    </main>
  );
}
