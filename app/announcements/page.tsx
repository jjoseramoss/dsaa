import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageShell } from "@/components/site/page-shell";

const announcements = [
  {
    id: "1",
    title: "Welcome to DSAA",
    body: "We’re building a consistent practice loop: learn a pattern, solve a problem, reflect, repeat.",
    pinned: true,
    createdAt: "Today",
  },
  {
    id: "2",
    title: "Next meeting: problem walkthrough",
    body: "Bring one tricky question you solved recently. We’ll do fast pattern decomposition and multiple solution paths.",
    pinned: false,
    createdAt: "This week",
  },
  {
    id: "3",
    title: "Resource drop: graphs + BFS/DFS",
    body: "New links added to the Resources page. Check the Graphs tag for a clean starter set.",
    pinned: false,
    createdAt: "Last week",
  },
];

export default function AnnouncementsPage() {
  return (
    <PageShell
      title="Announcements"
      description="Club updates, reminders, and meeting notes."
    >
      <div className="dsaa-stagger grid grid-cols-1 gap-5">
        {announcements
          .slice()
          .sort((a, b) => Number(b.pinned) - Number(a.pinned))
          .map((item) => (
            <Card key={item.id} className="dsaa-card bg-background/20 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="min-w-0">
                  <CardTitle className="truncate">{item.title}</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.createdAt}
                  </p>
                </div>
                {item.pinned ? <Badge>pinned</Badge> : null}
              </CardHeader>
              <CardContent className="text-sm leading-7 text-muted-foreground">
                {item.body}
              </CardContent>
            </Card>
          ))}
      </div>
    </PageShell>
  );
}
