"use client";

import { useEffect, useRef } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function GlassesMark() {
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const leftRef = useRef<HTMLSpanElement | null>(null);
  const rightRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const left = leftRef.current;
    const right = rightRef.current;
    if (!left || !right) return;

    const setPupil = (lens: HTMLElement, x: number, y: number) => {
      const rect = lens.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.max(1, Math.hypot(dx, dy));
      const maxMove = Math.min(rect.width, rect.height) * 0.16;
      const px = clamp((dx / dist) * maxMove, -maxMove, maxMove);
      const py = clamp((dy / dist) * maxMove, -maxMove, maxMove);

      lens.style.setProperty("--pupil-x", `${px}px`);
      lens.style.setProperty("--pupil-y", `${py}px`);
    };

    const onMove = (event: PointerEvent) => {
      setPupil(left, event.clientX, event.clientY);
      setPupil(right, event.clientX, event.clientY);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <span ref={containerRef} className="dsaa-glasses" aria-hidden>
      <span ref={leftRef} className="dsaa-lens">
        <span className="dsaa-eye">
          <span className="dsaa-pupil" />
        </span>
      </span>
      <span className="dsaa-bridge" />
      <span ref={rightRef} className="dsaa-lens">
        <span className="dsaa-eye">
          <span className="dsaa-pupil" />
        </span>
      </span>
    </span>
  );
}
