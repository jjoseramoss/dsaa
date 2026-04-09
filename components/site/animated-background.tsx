import { InteractiveGraphBackground } from "@/components/site/interactive-graph-background";

export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 dsaa-blueprint" />
      <div className="absolute inset-0 dsaa-blueprint dsaa-blueprint-fine" />
      <div className="absolute inset-0 overflow-hidden">
        <InteractiveGraphBackground />
      </div>
      <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full dsaa-blob dsaa-blob-a" />
      <div className="absolute -bottom-48 left-6 h-[520px] w-[520px] rounded-full dsaa-blob dsaa-blob-b" />
      <div className="absolute -bottom-40 right-6 h-[420px] w-[420px] rounded-full dsaa-blob dsaa-blob-c" />
    </div>
  );
}
