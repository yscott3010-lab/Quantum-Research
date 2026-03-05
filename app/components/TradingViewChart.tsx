'use client';

import { useEffect, useRef } from 'react';

// Tell TypeScript about the global TradingView object loaded by tv.js
declare global {
  interface Window {
    TradingView?: {
      widget: new (config: Record<string, unknown>) => void;
    };
  }
}

interface TradingViewChartProps {
  symbol?: string;
  height?: number;
}

export default function TradingViewChart({
  symbol = 'BINANCE:BTCUSDT',
  height = 600,
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous chart
    container.innerHTML = '';

    // Create inner div with a unique ID — TradingView.widget needs a real DOM id
    const uid = `tv_${Math.random().toString(36).slice(2, 9)}`;
    const chartDiv = document.createElement('div');
    chartDiv.id = uid;
    chartDiv.style.height = '100%';
    chartDiv.style.width = '100%';
    container.appendChild(chartDiv);

    const createWidget = () => {
      if (!window.TradingView) return;
      new window.TradingView.widget({
        container_id: uid,
        autosize: true,
        symbol,
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#000000',
        enable_publishing: false,
        allow_symbol_change: true,
        hide_side_toolbar: false,
      });
    };

    if (window.TradingView) {
      // tv.js already loaded from a previous render
      createWidget();
    } else {
      // Check if the script tag is already in the document (another instance added it)
      const existing = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
      if (existing) {
        existing.addEventListener('load', createWidget);
      } else {
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = createWidget;
        document.head.appendChild(script);
      }
    }

    return () => {
      container.innerHTML = '';
    };
  }, [symbol]);

  return (
    <div
      ref={containerRef}
      className="w-full border border-[var(--border-color)]"
      style={{ height, width: '100%' }}
    />
  );
}
