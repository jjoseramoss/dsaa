"use client";

import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

type Edge = {
  a: number;
  b: number;
  w: number;
};

type Step = {
  type: "visit" | "relax";
  node?: number;
  from?: number;
  to?: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function hypot(dx: number, dy: number) {
  return Math.sqrt(dx * dx + dy * dy);
}

function mulberry32(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function buildGraph(count: number, seed: number) {
  const rand = mulberry32(seed);
  const nodes: Node[] = Array.from({ length: count }, () => ({
    x: rand(),
    y: rand(),
    vx: (rand() - 0.5) * 0.0002,
    vy: (rand() - 0.5) * 0.0002,
  }));

  const edges: Edge[] = [];
  const linkRadius = 0.24;

  for (let i = 0; i < count; i += 1) {
    const distances: Array<{ j: number; d: number }> = [];
    for (let j = 0; j < count; j += 1) {
      if (i === j) continue;
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d = hypot(dx, dy);
      if (d < linkRadius) distances.push({ j, d });
    }
    distances.sort((a, b) => a.d - b.d);
    for (const { j, d } of distances.slice(0, 3)) {
      if (i < j) edges.push({ a: i, b: j, w: d });
    }
  }

  return { nodes, edges };
}

function dijkstraSteps(nodeCount: number, edges: Edge[], start: number, goal: number) {
  const adj: Array<Array<{ to: number; w: number }>> = Array.from({ length: nodeCount }, () => []);
  for (const e of edges) {
    adj[e.a].push({ to: e.b, w: e.w });
    adj[e.b].push({ to: e.a, w: e.w });
  }

  const dist = Array.from({ length: nodeCount }, () => Number.POSITIVE_INFINITY);
  const prev = Array.from({ length: nodeCount }, () => -1);
  const visited = Array.from({ length: nodeCount }, () => false);
  dist[start] = 0;

  const steps: Step[] = [{ type: "visit", node: start }];

  for (let k = 0; k < nodeCount; k += 1) {
    let u = -1;
    let best = Number.POSITIVE_INFINITY;
    for (let i = 0; i < nodeCount; i += 1) {
      if (visited[i]) continue;
      if (dist[i] < best) {
        best = dist[i];
        u = i;
      }
    }

    if (u === -1) break;
    visited[u] = true;
    steps.push({ type: "visit", node: u });

    if (u === goal) break;

    for (const { to, w } of adj[u]) {
      if (visited[to]) continue;
      const nd = dist[u] + w;
      steps.push({ type: "relax", from: u, to, node: to });
      if (nd < dist[to]) {
        dist[to] = nd;
        prev[to] = u;
      }
    }
  }

  const path: number[] = [];
  let cur = goal;
  let guard = 0;
  while (cur !== -1 && guard < nodeCount + 2) {
    path.push(cur);
    cur = prev[cur];
    guard += 1;
  }

  return { steps, path: path.reverse() };
}

export function InteractiveGraphBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const seedRef = useRef(1337);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let alive = true;

    if (seedRef.current === 1337) {
      seedRef.current = (Date.now() ^ (window.innerWidth << 8) ^ window.innerHeight) >>> 0;
    }

    const seed = seedRef.current;
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const { nodes, edges } = buildGraph(46, seed);

    let width = 0;
    let height = 0;

    const highlightNodes = new Map<number, number>();
    const highlightEdges = new Map<string, number>();

    const bumpNode = (id: number, amount: number) => {
      highlightNodes.set(id, Math.min(1, (highlightNodes.get(id) ?? 0) + amount));
    };

    const bumpEdge = (a: number, b: number, amount: number) => {
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      highlightEdges.set(key, Math.min(1, (highlightEdges.get(key) ?? 0) + amount));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (event.clientX - rect.left) / rect.width;
      mouseRef.current.y = (event.clientY - rect.top) / rect.height;
      mouseRef.current.active = true;
    };

    const onLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });

    const rand = mulberry32(seed ^ 0xa53a);

    let run = dijkstraSteps(nodes.length, edges, 0, nodes.length - 1);
    let stepIndex = 0;
    let lastTick = performance.now();
    let nextRunAt = performance.now() + 2600;

    const setNewRun = () => {
      const start = Math.floor(rand() * nodes.length);
      let goal = Math.floor(rand() * nodes.length);
      if (goal === start) goal = (goal + 7) % nodes.length;
      run = dijkstraSteps(nodes.length, edges, start, goal);
      stepIndex = 0;
      nextRunAt = performance.now() + 3200;
    };

    const tick = (now: number) => {
      if (!alive) return;

      const dt = clamp((now - lastTick) / 1000, 0, 0.05);
      lastTick = now;

      for (let i = 0; i < nodes.length; i += 1) {
        const n = nodes[i];
        n.x += n.vx * (dt * 60);
        n.y += n.vy * (dt * 60);

        const edgePad = 0.04;
        if (n.x < edgePad) {
          n.x = edgePad;
          n.vx = Math.abs(n.vx);
        }
        if (n.x > 1 - edgePad) {
          n.x = 1 - edgePad;
          n.vx = -Math.abs(n.vx);
        }
        if (n.y < edgePad) {
          n.y = edgePad;
          n.vy = Math.abs(n.vy);
        }
        if (n.y > 1 - edgePad) {
          n.y = 1 - edgePad;
          n.vy = -Math.abs(n.vy);
        }

        const jitter = 0.00002;
        n.vx += (rand() - 0.5) * jitter;
        n.vy += (rand() - 0.5) * jitter;

        const speed = hypot(n.vx, n.vy);
        if (speed > 0.001) {
          const scale = 0.001 / speed;
          n.vx *= scale;
          n.vy *= scale;
        }
      }

      if (mouseRef.current.active) {
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        for (let i = 0; i < nodes.length; i += 1) {
          const n = nodes[i];
          const dx = n.x - mx;
          const dy = n.y - my;
          const d = Math.max(0.001, hypot(dx, dy));
          const influence = clamp((0.32 - d) / 0.32, 0, 1);
          const repulse = influence * influence * 0.0007;
          n.vx += (dx / d) * repulse;
          n.vy += (dy / d) * repulse;
        }
      }

      for (const [id, val] of Array.from(highlightNodes.entries())) {
        const nv = val - dt * 0.9;
        if (nv <= 0) highlightNodes.delete(id);
        else highlightNodes.set(id, nv);
      }

      for (const [key, val] of Array.from(highlightEdges.entries())) {
        const nv = val - dt * 0.8;
        if (nv <= 0) highlightEdges.delete(key);
        else highlightEdges.set(key, nv);
      }

      if (now > nextRunAt) {
        setNewRun();
      }

      const stepRate = 12;
      const stepsToAdvance = Math.floor((dt * stepRate) * 60);
      for (let s = 0; s < stepsToAdvance; s += 1) {
        const step = run.steps[stepIndex];
        if (!step) break;
        if (step.type === "visit" && typeof step.node === "number") {
          bumpNode(step.node, 0.45);
        }
        if (step.type === "relax" && typeof step.from === "number" && typeof step.to === "number") {
          bumpEdge(step.from, step.to, 0.35);
          bumpNode(step.to, 0.2);
        }
        stepIndex += 1;
      }

      ctx.clearRect(0, 0, width, height);

      const baseStroke = "rgba(245, 244, 236, 0.13)";
      const strongStroke = "rgba(245, 244, 236, 0.7)";

      ctx.lineWidth = 1;

      for (const e of edges) {
        const a = nodes[e.a];
        const b = nodes[e.b];
        const ax = a.x * width;
        const ay = a.y * height;
        const bx = b.x * width;
        const by = b.y * height;

        const key = e.a < e.b ? `${e.a}-${e.b}` : `${e.b}-${e.a}`;
        const hl = highlightEdges.get(key) ?? 0;

        ctx.strokeStyle = hl > 0.02 ? strongStroke : baseStroke;
        ctx.globalAlpha = 0.9 * (0.35 + hl * 0.65);

        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      for (let i = 0; i < nodes.length; i += 1) {
        const n = nodes[i];
        const x = n.x * width;
        const y = n.y * height;
        const hl = highlightNodes.get(i) ?? 0;

        const r = 1.7 + hl * 2.2;
        ctx.fillStyle = hl > 0.02 ? "rgba(245, 244, 236, 0.92)" : "rgba(245, 244, 236, 0.42)";

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 0.85;
      ctx.strokeStyle = "rgba(245, 244, 236, 0.65)";
      ctx.lineWidth = 2;

      if (run.path.length > 1) {
        ctx.beginPath();
        for (let i = 0; i < run.path.length; i += 1) {
          const p = nodes[run.path[i]];
          const px = p.x * width;
          const py = p.y * height;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame((t) => {
      lastTick = t;
      tick(t);
    });

    return () => {
      alive = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full dsaa-graph-overlay"
    />
  );
}
