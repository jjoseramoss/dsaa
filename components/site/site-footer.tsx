import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-background/60 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-muted-foreground">
          DSAA — Data Structures and Algorithms Architects
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/resources"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Resources
          </Link>
          <Link
            href="/announcements"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Announcements
          </Link>
        </div>
      </div>
    </footer>
  );
}

