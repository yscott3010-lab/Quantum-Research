'use client';

import { useEffect, useRef } from 'react';

interface TradingViewSignalsProps {
  symbol?: string;
}

export default function TradingViewSignals({
  symbol = 'BINANCE:BTCUSDT',
}: TradingViewSignalsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Capture ref value at effect run time — safe for cleanup
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      interval: '1D',
      width: '100%',
      isTransparent: true,
      height: 450,
      symbol,
      showIntervalTabs: true,
      displayMode: 'single',
      locale: 'en',
      colorTheme: 'dark',
    });
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [symbol]);

  return (
    <div
      ref={containerRef}
      className="tradingview-widget-container w-full border border-[var(--border-color)]"
      style={{ minHeight: 450, width: '100%' }}
    />
  );
}
