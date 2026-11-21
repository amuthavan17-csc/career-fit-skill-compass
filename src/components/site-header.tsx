import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="no-print sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-baseline gap-1.5">
          <span className="font-display text-xl font-semibold tracking-tight">SkillMatch</span>
          <span className="hidden font-mono text-[0.65rem] text-muted-foreground sm:inline">resume analyzer</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/"
            className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground font-medium" }}
            activeOptions={{ exact: true }}
          >
            Analyze
          </Link>
          <Link
            to="/jobs"
            className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground font-medium" }}
          >
            Job roles
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="no-print mt-16 border-t border-border/70">
      <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-muted-foreground">
        SkillMatch is a screening aid, not a hiring decision. All companies and job roles shown are demonstration data, not live vacancies.
      </div>
    </footer>
  );
}
