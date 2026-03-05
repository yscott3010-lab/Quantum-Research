'use client';

import { useEffect, useRef } from 'react';

interface TradingViewSignalsProps {
  symbol?: string;
}

export default function TradingViewSignals({ symbol = 'BINANCE:BTCUSDT' }: TradingViewSignalsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
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
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [symbol]);

  return (
    <div
      className="tradingview-widget-container w-full rounded border border-[var(--border-color)] overflow-hidden"
      ref={containerRef}
      style={{ minHeight: 450 }}
    />
  );
}
