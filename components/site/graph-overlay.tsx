export function GraphOverlay() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 700"
      className="dsaa-graph-overlay absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="dsaa-graph" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="oklch(0.72 0.18 268)" stopOpacity="0.7" />
          <stop offset="0.5" stopColor="oklch(0.78 0.16 165)" stopOpacity="0.7" />
          <stop offset="1" stopColor="oklch(0.82 0.14 80)" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#dsaa-graph)" strokeWidth="2">
        <path className="dsaa-graph-line" d="M170 420 L330 300 L490 360 L650 240 L820 320 L1000 210" />
        <path className="dsaa-graph-line" d="M210 520 L360 520 L510 460 L680 540 L880 470" />
        <path className="dsaa-graph-line" d="M260 220 L430 160 L560 200 L710 140 L860 190" />
      </g>
      <g fill="oklch(0.986 0.012 90)" stroke="url(#dsaa-graph)" strokeWidth="2">
        {[
          [170, 420],
          [330, 300],
          [490, 360],
          [650, 240],
          [820, 320],
          [1000, 210],
          [210, 520],
          [360, 520],
          [510, 460],
          [680, 540],
          [880, 470],
          [260, 220],
          [430, 160],
          [560, 200],
          [710, 140],
          [860, 190],
        ].map(([cx, cy], index) => (
          <circle
            key={`${cx}-${cy}`}
            className="dsaa-graph-node"
            cx={cx}
            cy={cy}
            r={index % 3 === 0 ? 10 : 7}
            style={{ animationDelay: `${index * 120}ms` }}
          />
        ))}
      </g>
    </svg>
  );
}
