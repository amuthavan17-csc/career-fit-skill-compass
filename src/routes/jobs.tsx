import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { SkillList } from "@/components/skill-list";
import { jobsQuery } from "@/lib/queries";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Job roles & required skills — SkillMatch" },
      { name: "description", content: "Browse the job roles SkillMatch compares your resume against, with the required and optional skills for each." },
      { property: "og:title", content: "Job roles & required skills — SkillMatch" },
      { property: "og:description", content: "The job roles and skill requirements used to score your resume." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(jobsQuery),
  component: JobsPage,
});

function JobsPage() {
  const { data: jobs } = useSuspenseQuery(jobsQuery);
  return (
    <main className="mx-auto max-w-5xl px-4 pt-8 sm:pt-12">
      <p className="eyebrow">Job database · {jobs.length} roles</p>
      <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Job roles</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Every resume is scored against these roles. Companies are sample names for demonstration — these are not live vacancies.
      </p>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <li key={job.id} className="paper-card flex flex-col gap-4 p-5">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold">{job.title}</h2>
                {job.is_demo && <Badge variant="demo">Demo data</Badge>}
              </div>
              {job.company && <p className="mt-0.5 text-sm text-muted-foreground">{job.company}</p>}
              <p className="mt-2 text-sm">{job.description}</p>
            </div>
            <div>
              <p className="eyebrow mb-2">Required · {job.required_skills.length}</p>
              <SkillList skills={job.required_skills} empty="No required skills configured." />
            </div>
            {job.optional_skills.length > 0 && (
              <div>
                <p className="eyebrow mb-2">Nice to have</p>
                <p className="text-sm text-muted-foreground">{job.optional_skills.join(" · ")}</p>
              </div>
            )}
            {job.apply_url && (
              <a href={job.apply_url} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                Apply →
              </a>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
