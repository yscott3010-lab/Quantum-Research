'use client';

import { useState } from 'react';
import TradingViewChart from '@/app/components/TradingViewChart';
import DuneCharts from '@/app/components/DuneCharts';

const ASSETS = [
  { label: 'BTC / USDT',      symbol: 'BINANCE:BTCUSDT' },
  { label: 'ETH / USDT',      symbol: 'BINANCE:ETHUSDT' },
  { label: 'S&P 500',         symbol: 'FOREXCOM:SPXUSD' },
  { label: 'NASDAQ 100',      symbol: 'FOREXCOM:NASUSD' },
  { label: 'KOSPI',           symbol: 'KRXKOSPI:KOSPI' },
  { label: 'Hang Seng',       symbol: 'TVC:HSI' },
  { label: 'VIX',             symbol: 'TVC:VIX' },
  { label: 'Gold (US$/OZ)',   symbol: 'TVC:GOLD' },
  { label: 'Silver (US$/OZ)', symbol: 'TVC:SILVER' },
];

export default function TradingSignalsPage() {
  const [activeSymbol, setActiveSymbol] = useState(ASSETS[0].symbol);
  const activeLabel = ASSETS.find(a => a.symbol === activeSymbol)?.label ?? '';

  return (
    <div className="container py-16">

      {/* Page Header */}
      <div className="mb-12 pb-10 border-b border-[var(--border-color)]">
        <p className="text-xs font-mono text-[var(--accent-color)] uppercase tracking-widest mb-3">
          Live Market Data
        </p>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">Trading Signals</h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl">
          Real-time charts across crypto and traditional markets, combined with on-chain signal data.
        </p>
      </div>

      {/* Asset Selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {ASSETS.map((asset) => (
          <button
            key={asset.symbol}
            onClick={() => setActiveSymbol(asset.symbol)}
            className={`px-4 py-2 text-sm font-mono font-bold uppercase tracking-widest border transition-all duration-200 ${
              activeSymbol === asset.symbol
                ? 'border-[var(--accent-color)] text-[var(--accent-color)] bg-[var(--card-bg)]'
                : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]'
            }`}
          >
            {asset.label}
          </button>
        ))}
      </div>

      {/* Full-width TradingView Chart */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-[var(--text-secondary)]">
          Price Chart — <span className="text-[var(--text-primary)]">{activeLabel}</span>
        </h2>
        <span className="text-xs font-mono text-[var(--text-secondary)] border border-[var(--border-color)] px-2 py-1">
          Powered by TradingView
        </span>
      </div>
      <TradingViewChart symbol={activeSymbol} height={560} />

      {/* Dune Analytics Charts */}
      <div className="mt-16 pt-12 border-t border-[var(--border-color)]">
        <DuneCharts />
      </div>

      {/* Disclaimer */}
      <div className="mt-10 pt-8 border-t border-[var(--border-color)]">
        <p className="text-xs font-mono text-[var(--text-secondary)]">
          Charts powered by TradingView. On-chain data sourced from Dune Analytics.
          All data is for informational purposes only and does not constitute financial advice.
        </p>
      </div>

    </div>
  );
}
