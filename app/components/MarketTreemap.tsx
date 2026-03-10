'use client';

import { useEffect, useState, useCallback } from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

interface MapItem {
  name: string;
  symbol: string;
  size: number;
  changePercent: number;
  group: string;
}

interface GroupNode {
  name: string;
  children: MapItem[];
}

function getColor(change: number): string {
  if (change >= 3)    return '#14532d';
  if (change >= 2)    return '#166534';
  if (change >= 1)    return '#15803d';
  if (change >= 0.1)  return '#16a34a';
  if (change > -0.1)  return '#292929';
  if (change > -1)    return '#991b1b';
  if (change > -2)    return '#b91c1c';
  if (change > -3)    return '#dc2626';
  return '#ef4444';
}

/* ---------- Custom cell renderer ---------- */
function CustomContent(props: Record<string, unknown>) {
  const x = props.x as number ?? 0;
  const y = props.y as number ?? 0;
  const width = props.width as number ?? 0;
  const height = props.height as number ?? 0;
  const name = props.name as string ?? '';
  const changePercent = props.changePercent as number ?? 0;
  const depth = props.depth as number ?? 0;

  if (!width || !height) return null;

  // depth=1 → group label frame (nested futures data)
  if (depth === 1 && Array.isArray(props.children)) {
    return (
      <g>
        <rect x={x} y={y} width={width} height={height} fill="transparent" stroke="#111" strokeWidth={3} />
        {width > 60 && (
          <text
            x={x + 5}
            y={y + 14}
            fill="#666"
            fontSize={10}
            fontWeight={700}
            fontFamily="monospace"
          >
            {name}
          </text>
        )}
      </g>
    );
  }

  // depth=0 → root, skip
  if (depth === 0) return null;

  const color = getColor(changePercent);
  const fs = Math.max(9, Math.min(15, Math.sqrt(width * height) / 8));
  const showPct = height > 40 && width > 50;
  const showName = height > 22 && width > 32;

  return (
    <g>
      <rect x={x + 1} y={y + 1} width={width - 2} height={height - 2} fill={color} />
      {showName && (
        <text
          x={x + width / 2}
          y={y + height / 2 + (showPct ? -fs * 0.75 : 0)}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize={fs}
          fontWeight={600}
          fontFamily="monospace"
        >
          {name}
        </text>
      )}
      {showPct && (
        <text
          x={x + width / 2}
          y={y + height / 2 + fs * 0.85}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(255,255,255,0.75)"
          fontSize={fs * 0.82}
          fontFamily="monospace"
        >
          {changePercent > 0 ? '+' : ''}
          {changePercent.toFixed(2)}%
        </text>
      )}
    </g>
  );
}

/* ---------- Tooltip ---------- */
function MapTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: MapItem }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  if (!d?.name) return null;
  return (
    <div className="bg-black border border-[var(--border-color)] px-3 py-2 text-xs font-mono space-y-0.5">
      <p className="text-white font-bold">{d.name}</p>
      <p className={d.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}>
        {d.changePercent > 0 ? '+' : ''}
        {d.changePercent.toFixed(2)}%
      </p>
      <p className="text-[var(--text-secondary)]">{d.symbol}</p>
    </div>
  );
}

/* ---------- Group futures into nested structure ---------- */
function groupFutures(items: MapItem[]): GroupNode[] {
  const map = new Map<string, MapItem[]>();
  for (const item of items) {
    if (!map.has(item.group)) map.set(item.group, []);
    map.get(item.group)!.push(item);
  }
  return Array.from(map.entries()).map(([name, children]) => ({ name, children }));
}

/* ---------- Main component ---------- */
export default function MarketTreemap({ type }: { type: 'sp500' | 'futures' }) {
  const [data, setData] = useState<MapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveData, setLiveData] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/market-map?type=${type}`)
      .then((r) => r.json())
      .then((json) => {
        setData(json.data ?? []);
        setLiveData(json.liveData !== false);
      })
      .catch(() => setLiveData(false))
      .finally(() => setLoading(false));
  }, [type]);

  useEffect(() => {
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, [load]);

  if (loading) {
    return (
      <div className="w-full h-[620px] flex items-center justify-center border border-[var(--border-color)]">
        <span className="text-[var(--text-secondary)] font-mono text-sm animate-pulse">
          Loading market data…
        </span>
      </div>
    );
  }

  const treemapData = type === 'futures' ? groupFutures(data) : data;

  return (
    <div>
      <div className="w-full" style={{ height: 620 }}>
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={treemapData}
            dataKey="size"
            aspectRatio={16 / 9}
            isAnimationActive={false}
            content={(props) => <CustomContent {...(props as Record<string, unknown>)} />}
          >
            <Tooltip content={(props) => <MapTooltip {...(props as { active?: boolean; payload?: Array<{ payload: MapItem }> })} />} />
          </Treemap>
        </ResponsiveContainer>
      </div>

      {/* Footer row */}
      <div className="mt-3 flex items-center gap-6 flex-wrap">
        {/* Legend */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { label: '≥ +3%', color: '#14532d' },
            { label: '+1%',   color: '#16a34a' },
            { label: '0%',    color: '#292929' },
            { label: '-1%',   color: '#b91c1c' },
            { label: '≤ -3%', color: '#ef4444' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
              <span className="text-[10px] font-mono text-[var(--text-secondary)]">{label}</span>
            </div>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3 text-[10px] font-mono text-[var(--text-secondary)]">
          {!liveData && <span className="text-yellow-500">⚠ Live data unavailable</span>}
          <span>Data: Yahoo Finance · Auto-refreshes every 60s</span>
        </div>
      </div>
    </div>
  );
}
