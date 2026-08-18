type Props = {
  seed: string;
  className?: string;
};

/**
 * A tiny deterministic "barcode" strip derived from a string seed.
 * Not a real scannable barcode — a visual signature that ties each
 * article tag back to the Part Number / SKU / Barcode language the
 * content itself keeps returning to.
 */
export default function BarcodeMark({ seed, className }: Props) {
  const bars: number[] = [];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  for (let i = 0; i < 24; i++) {
    hash = (hash * 1103515245 + 12345) >>> 0;
    bars.push(1 + (hash % 3)); // bar width: 1, 2, or 3
  }

  let x = 0;
  const rects = bars.map((w, i) => {
    const rect = (
      <rect key={i} x={x} y={0} width={w} height={28} fill="currentColor" opacity={i % 5 === 0 ? 1 : 0.55} />
    );
    x += w + 1.4;
    return rect;
  });

  return (
    <svg
      viewBox={`0 0 ${x} 28`}
      width={x * 1.4}
      height={28}
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      {rects}
    </svg>
  );
}
