import { Badge } from "@/components/ui/badge";

export function SkillList({
  skills,
  variant = "skill",
  empty = "None",
}: {
  skills: string[];
  variant?: "skill" | "matched" | "missing";
  empty?: string;
}) {
  if (skills.length === 0) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {skills.map((s) => (
        <li key={s}>
          <Badge variant={variant} className="rounded-full px-3 py-1 text-xs">
            {s}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
