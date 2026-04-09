import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="dsaa-enter">
      <section className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-6xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          <h1 className="text-balance text-6xl font-semibold dsaa-type-hero sm:text-8xl">
            DSAA_
          </h1>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/announcements"
              className={cn(buttonVariants({ variant: "default" }), "dsaa-shine")}
            >
              See announcements <ArrowRight className="size-4" />
            </Link>
            <Link href="/resources" className={buttonVariants({ variant: "outline" })}>
              Browse resources
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
