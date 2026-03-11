'use client';

import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  Legend,
} from 'recharts';

interface DuneRow {
  day: string;
  btc_price_usd: number;
  usdc_netflow_m: number;
  usdc_inflow_m: number;
  usdc_outflow_m: number;
  pair_vol_m: number;
  usdc_cb_balance_m: number;
  btc_mktcap_b: number;
  coinbase_usdc_ssr: number | null;
}

// ── Formatting helpers ─────────────────────────────────────────────────────────

function shortDate(raw: string) {
  const d = new Date(raw);
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

function fmtUSD(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}

function fmtM(v: number) {
  const abs = Math.abs(v);
  if (abs >= 1_000) return `${(v / 1_000).toFixed(1)}B`;
  return `${v.toFixed(1)}M`;
}

// ── Shared style ──────────────────────────────────────────────────────────────

const tooltipStyle = {
  backgroundColor: '#0a0a0a',
  border: '1px solid #27272a',
  borderRadius: 0,
  fontFamily: 'monospace',
  fontSize: 12,
  color: '#a1a1aa',
};

const tickStyle = { fill: '#71717a', fontSize: 10, fontFamily: 'monospace' };

// ── Main component ────────────────────────────────────────────────────────────

export default function DuneCharts() {
  const [rows, setRows] = useState<DuneRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/dune')
      .then((r) => r.json())
      .then((json) => {
        if (json.error) {
          setError(json.error);
        } else {
          const raw: DuneRow[] = json?.result?.rows ?? [];
          const sorted = [...raw].sort(
            (a, b) => new Date(a.day).getTime() - new Date(b.day).getTime()
          );
          setRows(sorted);
        }
      })
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false));
  }, []);

  // X-axis ticks — one per month (every ~30 rows for daily data)
  const tickEvery = Math.max(1, Math.floor(rows.length / 12));
  const xTicks = rows.filter((_, i) => i % tickEvery === 0).map((r) => r.day);

  return (
    <div className="w-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-mono text-[var(--accent-color)] uppercase tracking-widest mb-1">
            Dune Analytics · Query #6647840
          </p>
          <h2 className="text-xl font-bold tracking-tight">BTC Price vs USDC Net Flow</h2>
          <p className="text-xs font-mono text-[var(--text-secondary)] mt-0.5">
            Daily on-chain stablecoin flow signal overlaid with BTC price
          </p>
        </div>
        {!loading && !error && (
          <span className="text-xs font-mono text-[var(--text-secondary)] border border-[var(--border-color)] px-2 py-1">
            {rows.length.toLocaleString()} days
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="border border-red-800 bg-red-950/20 p-6">
          <p className="text-sm font-mono text-red-400">{error}</p>
        </div>
      )}

      {/* Chart */}
      {!error && (
        <div className="border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
          {loading ? (
            <div className="h-[420px] flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-pulse [animation-delay:150ms]" />
              <div className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-pulse [animation-delay:300ms]" />
              <span className="text-xs font-mono text-[var(--text-secondary)] ml-2">Loading Dune data…</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={420}>
              <ComposedChart data={rows} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="btcGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#4ade80" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="#1c1c1e" strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="day"
                  ticks={xTicks}
                  tickFormatter={shortDate}
                  tick={tickStyle}
                  axisLine={false}
                  tickLine={false}
                />

                {/* Left Y — BTC Price */}
                <YAxis
                  yAxisId="btc"
                  orientation="left"
                  tickFormatter={fmtUSD}
                  tick={tickStyle}
                  axisLine={false}
                  tickLine={false}
                  width={64}
                />

                {/* Right Y — USDC Net Flow (M) */}
                <YAxis
                  yAxisId="flow"
                  orientation="right"
                  tickFormatter={fmtM}
                  tick={tickStyle}
                  axisLine={false}
                  tickLine={false}
                  width={56}
                />

                <ReferenceLine yAxisId="flow" y={0} stroke="#3f3f46" strokeWidth={1} />

                <Tooltip
                  contentStyle={tooltipStyle}
                  labelFormatter={(v) => shortDate(String(v))}
                  formatter={(v: number, name: string) => {
                    if (name === 'btc_price_usd') return [`$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, 'BTC Price'];
                    return [fmtM(v), 'USDC Net Flow'];
                  }}
                />

                <Legend
                  wrapperStyle={{ fontFamily: 'monospace', fontSize: 11, color: '#71717a', paddingTop: 8 }}
                  formatter={(value) =>
                    value === 'btc_price_usd' ? 'BTC Price (USD)' : 'USDC Net Flow (M)'
                  }
                />

                {/* USDC Net Flow bars (behind BTC line) */}
                <Bar
                  yAxisId="flow"
                  dataKey="usdc_netflow_m"
                  fill="#3b82f6"
                  opacity={0.65}
                  radius={[1, 1, 0, 0]}
                  maxBarSize={4}
                />

                {/* BTC Price area */}
                <Area
                  yAxisId="btc"
                  type="monotone"
                  dataKey="btc_price_usd"
                  stroke="#4ade80"
                  strokeWidth={1.5}
                  fill="url(#btcGrad)"
                  dot={false}
                  activeDot={{ r: 3, fill: '#4ade80' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* Footer */}
      {!error && !loading && (
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[10px] font-mono text-[var(--text-secondary)]">
            <span><span className="inline-block w-3 h-0.5 bg-green-400 mr-1 align-middle" />BTC Price (left axis)</span>
            <span><span className="inline-block w-3 h-2 bg-blue-500 opacity-65 mr-1 align-middle" />USDC Net Flow in M (right axis)</span>
          </div>
          <p className="text-[10px] font-mono text-[var(--text-secondary)]">
            Source: Dune Analytics · {rows[0]?.day} → {rows[rows.length - 1]?.day}
          </p>
        </div>
      )}

    </div>
  );
}
