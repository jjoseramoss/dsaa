import Link from "next/link";

import { PageShell } from "@/components/site/page-shell";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  return (
    <PageShell
      title="Log in"
      description="Sign in to join streaks, challenges, and the leaderboard."
    >
      <div className="dsaa-stagger grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="dsaa-card bg-background/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Coming soon</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-muted-foreground">
            Auth is in progress. For now, explore announcements and resources.
          </CardContent>
        </Card>

        <Card className="dsaa-card bg-background/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Meanwhile…</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link href="/resources" className={cn(buttonVariants({ variant: "default" }))}>
              Browse resources
            </Link>
            <Link
              href="/announcements"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              See announcements
            </Link>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
