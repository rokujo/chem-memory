import { COLOR_PALETTE, LIGHT_COLOR_NAMES } from '../lib/color-palette';

export function ChipSwatch({ name, size = 14 }: { name: string; size?: number }) {
  if (name === '無色') {
    const px = size;
    const half = Math.max(px / 2, 4);
    const quarter = Math.max(px / 4, 2);
    return (
      <span
        className="inline-block rounded-full border border-slate-500"
        style={{
          width: px,
          height: px,
          backgroundImage:
            'linear-gradient(45deg, #475569 25%, transparent 25%), linear-gradient(-45deg, #475569 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #475569 75%), linear-gradient(-45deg, transparent 75%, #475569 75%)',
          backgroundSize: `${half}px ${half}px`,
          backgroundPosition: `0 0, 0 ${quarter}px, ${quarter}px -${quarter}px, -${quarter}px 0`,
          backgroundColor: '#1e293b',
        }}
      />
    );
  }
  const isLight = LIGHT_COLOR_NAMES.has(name);
  return (
    <span
      className="inline-block rounded-full flex-shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: COLOR_PALETTE[name] ?? '#888',
        border: isLight ? '1px solid #64748b' : '1px solid rgba(148, 163, 184, 0.4)',
      }}
    />
  );
}
