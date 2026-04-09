import { ResourcesClient } from "@/app/resources/resources-client";
import { PageShell } from "@/components/site/page-shell";

export default function ResourcesPage() {
  return (
    <PageShell
      title="Resources"
      description="A curated library of explanations, patterns, and practice lists."
    >
      <ResourcesClient />
    </PageShell>
  );
}
