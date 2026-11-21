import { cn } from "@/lib/utils";

export function MatchMeter({ value, className, size = "md" }: { value: number | null; className?: string; size?: "md" | "lg" }) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <span className={cn("font-mono font-semibold tabular-nums", size === "lg" ? "text-4xl" : "text-lg")}>
          {value === null ? "—" : `${value}%`}
        </span>
        {size === "lg" && <span className="eyebrow">skill match</span>}
      </div>
      <div className="meter-track mt-2" role="progressbar" aria-valuenow={value ?? 0} aria-valuemin={0} aria-valuemax={100}>
        <div className="meter-fill" style={{ width: `${value ?? 0}%` }} />
      </div>
    </div>
  );
}
