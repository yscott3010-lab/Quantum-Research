'use client';

import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';

interface DuneRow {
  week: string;
  net_inflow: number;
  cumulative_usdc_liquidity: number;
  btc_price: number;
}

// ── Formatting helpers ────────────────────────────────────────────────────────

function shortDate(raw: string) {
  const d = new Date(raw);
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

function fmtK(v: number) {
  const abs = Math.abs(v);
  if (abs >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000)     return `${(v / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000)         return `${(v / 1_000).toFixed(1)}K`;
  return v.toFixed(0);
}

function fmtUSD(v: number) {
  return `$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

// ── Shared tooltip style ──────────────────────────────────────────────────────

const tooltipStyle = {
  backgroundColor: '#0a0a0a',
  border: '1px solid #27272a',
  borderRadius: 0,
  fontFamily: 'monospace',
  fontSize: 12,
  color: '#a1a1aa',
};

// ── Loading skeleton ──────────────────────────────────────────────────────────

function ChartSkeleton() {
  return (
    <div className="border border-[var(--border-color)] bg-[var(--card-bg)] h-52 flex items-center justify-center gap-2">
      <div className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-pulse" />
      <div className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-pulse [animation-delay:150ms]" />
      <div className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-pulse [animation-delay:300ms]" />
      <span className="text-xs font-mono text-[var(--text-secondary)] ml-2">Loading Dune data…</span>
    </div>
  );
}

// ── Chart card wrapper ────────────────────────────────────────────────────────

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
      <div className="mb-4">
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--accent-color)]">{title}</p>
        {subtitle && <p className="text-xs font-mono text-[var(--text-secondary)] mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

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
          // Sort ascending by week so charts read left→right oldest→newest
          const sorted = [...raw].sort(
            (a, b) => new Date(a.week).getTime() - new Date(b.week).getTime()
          );
          setRows(sorted);
        }
      })
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false));
  }, []);

  // ── Tick interval so X-axis isn't crowded (every ~12 weeks ≈ quarter) ──────
  const tickEvery = Math.max(1, Math.floor(rows.length / 8));
  const xTicks = rows
    .filter((_, i) => i % tickEvery === 0)
    .map((r) => r.week);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-mono text-[var(--accent-color)] uppercase tracking-widest mb-1">
            Dune Analytics · Query #6647840
          </p>
          <h2 className="text-xl font-bold tracking-tight">On-Chain Signal Data</h2>
        </div>
        {!loading && !error && (
          <span className="text-xs font-mono text-[var(--text-secondary)] border border-[var(--border-color)] px-2 py-1">
            {rows.length} weeks
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="border border-red-800 bg-red-950/20 p-6">
          <p className="text-sm font-mono text-red-400">{error}</p>
        </div>
      )}

      {/* Charts grid */}
      {!error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* 1 — BTC Price */}
          <ChartCard title="BTC Price" subtitle="Weekly close (USD)">
            {loading ? <ChartSkeleton /> : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={rows} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="btcGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#4ade80" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="week" ticks={xTicks} tickFormatter={shortDate}
                    tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={fmtK}
                    tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={false} tickLine={false} width={48} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelFormatter={(v) => shortDate(String(v))}
                    formatter={(v: number) => [fmtUSD(v), 'BTC Price']}
                  />
                  <Area type="monotone" dataKey="btc_price"
                    stroke="#4ade80" strokeWidth={1.5}
                    fill="url(#btcGrad)" dot={false} activeDot={{ r: 3, fill: '#4ade80' }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* 2 — Net Inflow */}
          <ChartCard title="Net Inflow" subtitle="Weekly net USDC inflow (USD)">
            {loading ? <ChartSkeleton /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={rows} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="week" ticks={xTicks} tickFormatter={shortDate}
                    tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={fmtK}
                    tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={false} tickLine={false} width={48} />
                  <ReferenceLine y={0} stroke="#27272a" />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelFormatter={(v) => shortDate(String(v))}
                    formatter={(v: number) => [fmtK(v), 'Net Inflow']}
                  />
                  <Bar dataKey="net_inflow"
                    fill="#4ade80"
                    radius={[1, 1, 0, 0]}
                    // Negative bars render in red
                    label={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* 3 — Cumulative USDC Liquidity (full width) */}
          <ChartCard
            title="Cumulative USDC Liquidity"
            subtitle="Running total of on-chain USDC liquidity (USD)"
          >
            {loading ? <ChartSkeleton /> : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={rows} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="usdcGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#60a5fa" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="week" ticks={xTicks} tickFormatter={shortDate}
                    tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={fmtK}
                    tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={false} tickLine={false} width={56} />
                  <ReferenceLine y={0} stroke="#27272a" />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelFormatter={(v) => shortDate(String(v))}
                    formatter={(v: number) => [fmtK(v), 'Cumulative Liquidity']}
                  />
                  <Area type="monotone" dataKey="cumulative_usdc_liquidity"
                    stroke="#60a5fa" strokeWidth={1.5}
                    fill="url(#usdcGrad)" dot={false} activeDot={{ r: 3, fill: '#60a5fa' }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* 4 — BTC vs Net Inflow overlay hint card */}
          <ChartCard title="BTC vs Net Inflow" subtitle="Price correlation view">
            {loading ? <ChartSkeleton /> : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={rows} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="btcGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#4ade80" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="week" ticks={xTicks} tickFormatter={shortDate}
                    tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={fmtK}
                    tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={false} tickLine={false} width={48} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelFormatter={(v) => shortDate(String(v))}
                    formatter={(v: number, name: string) => [
                      name === 'btc_price' ? fmtUSD(v) : fmtK(v),
                      name === 'btc_price' ? 'BTC Price' : 'Net Inflow',
                    ]}
                  />
                  <Area type="monotone" dataKey="btc_price"
                    stroke="#4ade80" strokeWidth={1.5}
                    fill="url(#btcGrad2)" dot={false} activeDot={{ r: 3 }} />
                  <Area type="monotone" dataKey="net_inflow"
                    stroke="#f59e0b" strokeWidth={1}
                    fill="none" dot={false} activeDot={{ r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

        </div>
      )}
    </div>
  );
}
