'use client';

import { useState } from 'react';
import TradingViewChart from '@/app/components/TradingViewChart';
import TradingViewSignals from '@/app/components/TradingViewSignals';

const ASSETS = [
  { label: 'BTC / USDT', symbol: 'BINANCE:BTCUSDT' },
  { label: 'ETH / USDT', symbol: 'BINANCE:ETHUSDT' },
  { label: 'SOL / USDT', symbol: 'BINANCE:SOLUSDT' },
  { label: 'S&P 500',    symbol: 'SP:SPX' },
  { label: 'NASDAQ',     symbol: 'NASDAQ:NDX' },
  { label: 'Gold',       symbol: 'TVC:GOLD' },
];

export default function TradingSignalsPage() {
  const [activeSymbol, setActiveSymbol] = useState(ASSETS[0].symbol);
  const activeLabel = ASSETS.find(a => a.symbol === activeSymbol)?.label ?? '';

  return (
    <div className="container py-16">

      {/* Page Header */}
      <div className="mb-12 pb-10 border-b border-[var(--border-color)]">
        <p className="text-xs font-mono text-[var(--accent-color)] uppercase tracking-widest mb-3">Live Market Data</p>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">Trading Signals</h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl">
          Real-time technical analysis and indicator signals across crypto and traditional markets.
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

      {/* Chart + Signals Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Main Chart — takes 2/3 width on xl screens */}
        <div className="xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-[var(--text-secondary)]">
              Price Chart — <span className="text-[var(--text-primary)]">{activeLabel}</span>
            </h2>
            <span className="text-xs font-mono text-[var(--text-secondary)] border border-[var(--border-color)] px-2 py-1">
              Powered by TradingView
            </span>
          </div>
          <TradingViewChart symbol={activeSymbol} height={520} />
        </div>

        {/* Technical Analysis Signals — 1/3 width on xl screens */}
        <div className="xl:col-span-1">
          <div className="mb-3">
            <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-[var(--text-secondary)]">
              Indicator Signals — <span className="text-[var(--text-primary)]">{activeLabel}</span>
            </h2>
          </div>
          <TradingViewSignals symbol={activeSymbol} />
        </div>
      </div>

      {/* Info Footer */}
      <div className="mt-10 pt-8 border-t border-[var(--border-color)]">
        <p className="text-xs font-mono text-[var(--text-secondary)]">
          Signals are derived from standard technical indicators (RSI, MACD, EMA, Stochastic, etc.) via TradingView.
          Data is for informational purposes only and does not constitute financial advice.
        </p>
      </div>

    </div>
  );
}
