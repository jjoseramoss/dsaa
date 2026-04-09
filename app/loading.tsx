export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/70 px-5 py-4 shadow-sm backdrop-blur">
        <span className="dsaa-spinner" aria-hidden />
        <span className="text-sm text-muted-foreground">Loading…</span>
      </div>
    </div>
  );
}

