import { createFileRoute } from "@tanstack/react-router";
import { UploadForm } from "@/components/upload-form";
import { jobsQuery } from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillMatch — Smart Resume Analyzer & Job Matcher" },
      { name: "description", content: "Upload your resume to see your skills, your match score for each role, the skills you're missing and the jobs that fit you best." },
      { property: "og:title", content: "SkillMatch — Smart Resume Analyzer & Job Matcher" },
      { property: "og:description", content: "See your skills, match scores, skill gaps and best-fit job roles from one resume upload." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(jobsQuery),
  component: Index,
});

const STEPS = [
  ["01", "Read", "We pull the text out of your PDF or DOCX."],
  ["02", "Spot", "Skills are matched exactly — Java is never JavaScript."],
  ["03", "Compare", "Your skills are scored against every role."],
  ["04", "Report", "See gaps, best-fit roles and what to learn next."],
] as const;

function Index() {
  return (
    <main className="mx-auto max-w-5xl px-4 pt-8 sm:pt-14">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-12">
        <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <p className="eyebrow">Resume analysis · job matching</p>
          <h1 className="mt-3 text-[2.6rem] leading-[1.02] font-semibold sm:text-6xl">
            See how your resume <span className="highlight-mark italic">measures up.</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-muted-foreground">
            Upload your resume and get a clear report: the skills it shows, your match score for each role, and exactly what's missing.
          </p>
          <ol className="mt-8 hidden gap-3 sm:grid sm:grid-cols-2">
            {STEPS.map(([n, t, d]) => (
              <li key={n} className="rounded-lg border border-border/80 bg-paper/70 p-4">
                <span className="font-mono text-xs text-primary">{n}</span>
                <p className="mt-1 font-display text-lg font-semibold">{t}</p>
                <p className="text-sm text-muted-foreground">{d}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className="animate-in fade-in slide-in-from-bottom-3 duration-700">
          <UploadForm />
        </section>
      </div>
      <ol className="mt-10 grid gap-3 sm:hidden">
        {STEPS.map(([n, t, d]) => (
          <li key={n} className="flex gap-4 border-b border-border/70 pb-3">
            <span className="font-mono text-xs text-primary pt-1">{n}</span>
            <div>
              <p className="font-display text-lg font-semibold">{t}</p>
              <p className="text-sm text-muted-foreground">{d}</p>
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}
