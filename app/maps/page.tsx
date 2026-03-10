'use client';

import { useState } from 'react';
import MarketTreemap from '@/app/components/MarketTreemap';

type Tab = 'sp500' | 'futures';

const TABS: { id: Tab; label: string; description: string }[] = [
  { id: 'sp500',   label: 'S&P 500',  description: '11 GICS sectors · sized by market cap weight' },
  { id: 'futures', label: 'Futures',  description: 'Indices · Energy · Metals · Grains · Softs · Bonds · Currencies · Meats' },
];

export default function MapsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('sp500');
  const active = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="container py-16">

      {/* Header */}
      <div className="mb-12 pb-10 border-b border-[var(--border-color)]">
        <p className="text-xs font-mono text-[var(--accent-color)] uppercase tracking-widest mb-3">
          Market Visualization
        </p>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">Market Maps</h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl">
          Live heat maps of market performance. Box size reflects market weight; color reflects daily % change.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 text-sm font-mono font-bold uppercase tracking-widest border transition-all duration-200 ${
              activeTab === tab.id
                ? 'border-[var(--accent-color)] text-[var(--accent-color)] bg-[var(--card-bg)]'
                : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub-description */}
      <p className="text-xs font-mono text-[var(--text-secondary)] mb-6 tracking-wide">
        {active.description}
      </p>

      {/* Treemap */}
      <MarketTreemap type={activeTab} />

      {/* Disclaimer */}
      <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
        <p className="text-xs font-mono text-[var(--text-secondary)]">
          Market data via Yahoo Finance. All data is for informational purposes only and does not constitute financial advice.
        </p>
      </div>

    </div>
  );
}
