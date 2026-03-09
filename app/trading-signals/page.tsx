'use client';

import { useState } from 'react';
import TradingViewChart from '@/app/components/TradingViewChart';

const ASSETS = [
  { label: 'BTC / USDT',      symbol: 'BINANCE:BTCUSDT' },
  { label: 'ETH / USDT',      symbol: 'BINANCE:ETHUSDT' },
  { label: 'S&P 500',         symbol: 'FOREXCOM:SPX500' },
  { label: 'NASDAQ 100',      symbol: 'OANDA:NAS100USD' },
  { label: 'KOSPI',           symbol: 'TVC:KOSPI' },
  { label: 'Hang Seng',       symbol: 'OANDA:HK33HKD' },
  { label: 'VIX',             symbol: 'CBOE:VIX' },
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
          Real-time charts across crypto and traditional markets.
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

      {/* Label row */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-[var(--text-secondary)]">
          Price Chart — <span className="text-[var(--text-primary)]">{activeLabel}</span>
        </h2>
        <span className="text-xs font-mono text-[var(--text-secondary)] border border-[var(--border-color)] px-2 py-1">
          Powered by TradingView
        </span>
      </div>

      {/* Full-height TradingView chart */}
      <TradingViewChart symbol={activeSymbol} height={700} />

      {/* Disclaimer */}
      <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
        <p className="text-xs font-mono text-[var(--text-secondary)]">
          Charts powered by TradingView. All data is for informational purposes only and does not constitute financial advice.
        </p>
      </div>

    </div>
  );
}
