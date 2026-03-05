'use client';

import { useEffect, useState } from 'react';

interface DuneRow {
  [key: string]: string | number | boolean | null;
}

interface DuneResult {
  result?: {
    rows: DuneRow[];
    metadata?: {
      column_names: string[];
      column_types: string[];
    };
  };
  error?: string;
}

function formatCell(value: string | number | boolean | null): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') {
    // Format large numbers with commas
    if (Math.abs(value) >= 1000) {
      return value.toLocaleString('en-US', { maximumFractionDigits: 4 });
    }
    return value.toLocaleString('en-US', { maximumFractionDigits: 6 });
  }
  // Format ISO date strings
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  }
  return String(value);
}

function formatHeader(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DuneTable() {
  const [data, setData] = useState<DuneResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/dune')
      .then((r) => r.json())
      .then((json) => {
        if (json.error) setError(json.error);
        else setData(json);
      })
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false));
  }, []);

  const rows = data?.result?.rows ?? [];
  const columns = data?.result?.metadata?.column_names ?? (rows[0] ? Object.keys(rows[0]) : []);

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-mono text-[var(--accent-color)] uppercase tracking-widest mb-1">
            Dune Analytics · Query #6647840
          </p>
          <h2 className="text-xl font-bold tracking-tight">On-Chain Signal Data</h2>
        </div>
        {!loading && !error && (
          <span className="text-xs font-mono text-[var(--text-secondary)] border border-[var(--border-color)] px-2 py-1">
            {rows.length} rows
          </span>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="border border-[var(--border-color)] bg-[var(--card-bg)] p-12 flex items-center justify-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-pulse delay-150" />
          <div className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-pulse delay-300" />
          <span className="text-sm font-mono text-[var(--text-secondary)] ml-2">Loading from Dune...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="border border-red-800 bg-red-950/20 p-6">
          <p className="text-sm font-mono text-red-400">{error}</p>
        </div>
      )}

      {/* Data Table */}
      {!loading && !error && rows.length > 0 && (
        <div className="overflow-x-auto border border-[var(--border-color)]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-[var(--accent-color)]">
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] bg-[var(--card-bg)] whitespace-nowrap"
                  >
                    {formatHeader(col)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-[var(--border-color)] hover:bg-[var(--card-bg)] transition-colors duration-100"
                >
                  {columns.map((col) => (
                    <td
                      key={col}
                      className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)] whitespace-nowrap"
                    >
                      {formatCell(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && rows.length === 0 && (
        <div className="border border-[var(--border-color)] bg-[var(--card-bg)] p-12 text-center">
          <p className="text-sm font-mono text-[var(--text-secondary)]">No data returned from query.</p>
        </div>
      )}
    </div>
  );
}
