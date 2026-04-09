"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Resource = {
  id: string;
  title: string;
  url: string;
  description: string;
  tag: string;
};

const resources: Resource[] = [
  {
    id: "r1",
    title: "NeetCode 150",
    url: "https://neetcode.io/practice",
    description: "A clean, topic-based practice plan with explanations and patterns.",
    tag: "Roadmap",
  },
  {
    id: "r2",
    title: "Two Pointers Pattern",
    url: "https://leetcode.com/tag/two-pointers/",
    description: "Problems that collapse search space with left/right movement.",
    tag: "Arrays",
  },
  {
    id: "r3",
    title: "Binary Search Template",
    url: "https://leetcode.com/tag/binary-search/",
    description: "Bounded monotonic functions, low/high invariants, and variants.",
    tag: "Searching",
  },
  {
    id: "r4",
    title: "Graphs: BFS/DFS essentials",
    url: "https://cp-algorithms.com/graph/breadth-first-search.html",
    description: "Core traversal mechanics and how to model adjacency.",
    tag: "Graphs",
  },
  {
    id: "r5",
    title: "Dynamic Programming: patterns",
    url: "https://www.youtube.com/watch?v=oBt53YbR9Kk",
    description: "How to identify state, transitions, and base cases.",
    tag: "DP",
  },
];

export function ResourcesClient() {
  const tags = useMemo(() => {
    const tagSet = new Set(resources.map((resource) => resource.tag));
    return ["All", ...Array.from(tagSet).sort((a, b) => a.localeCompare(b))];
  }, []);

  const [activeTag, setActiveTag] = useState("All");

  const filtered = useMemo(() => {
    if (activeTag === "All") return resources;
    return resources.filter((resource) => resource.tag === activeTag);
  }, [activeTag]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isActive = tag === activeTag;
          return (
            <Button
              key={tag}
              type="button"
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={isActive ? "dsaa-shine" : undefined}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </Button>
          );
        })}
      </div>

      <div className="dsaa-stagger grid grid-cols-1 gap-5 md:grid-cols-2">
        {filtered.map((resource) => (
          <Card
            key={resource.id}
            className="dsaa-card bg-background/20 backdrop-blur-sm"
          >
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="min-w-0">
                <CardTitle className="truncate">{resource.title}</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">{resource.url}</p>
              </div>
              <Badge>{resource.tag}</Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm leading-7 text-muted-foreground">
                {resource.description}
              </p>
              <Link
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "justify-between"
                )}
              >
                Open link
                <span className="text-muted-foreground">↗</span>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
