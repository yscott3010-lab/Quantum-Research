import DuneCharts from '@/app/components/DuneCharts';

export default function OnchainPage() {
  return (
    <div className="container py-16">

      {/* Page Header */}
      <div className="mb-12 pb-10 border-b border-[var(--border-color)]">
        <p className="text-xs font-mono text-[var(--accent-color)] uppercase tracking-widest mb-3">
          Dune Analytics · Query #6647840
        </p>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">On-Chain Data</h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl">
          On-chain signal data tracking BTC price, USDC net inflows, and cumulative liquidity over time.
        </p>
      </div>

      {/* Charts */}
      <DuneCharts />

      {/* Disclaimer */}
      <div className="mt-10 pt-8 border-t border-[var(--border-color)]">
        <p className="text-xs font-mono text-[var(--text-secondary)]">
          On-chain data sourced from Dune Analytics. All data is for informational purposes only and does not constitute financial advice.
        </p>
      </div>

    </div>
  );
}
