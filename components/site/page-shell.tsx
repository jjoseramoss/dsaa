import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function PageShell({
  title,
  description,
  children,
  actions,
  className,
}: PageShellProps) {
  return (
    <div className={cn("dsaa-enter", className)}>
      <div className="mx-auto w-full max-w-6xl px-4 pt-14 pb-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-background/25 p-7 shadow-sm backdrop-blur-sm sm:p-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-3">
              <h1 className="text-balance text-3xl font-semibold dsaa-type-hero sm:text-5xl">
                {title}
              </h1>
              {description ? (
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base dsaa-type-mono">
                  {description}
                </p>
              ) : null}
            </div>
            {actions ? <div className="shrink-0">{actions}</div> : null}
          </div>
        </div>

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
