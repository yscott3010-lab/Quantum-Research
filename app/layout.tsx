import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import { PageTransition } from './components/PageTransition';

export const metadata: Metadata = {
  title: 'Quantum Research | Institutional Intelligence',
  description: 'Data-driven crypto and equity research signals.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {/* Navigation Bar */}
          <header className="border-b border-[var(--border-color)] sticky top-0 bg-[var(--bg-color)] z-50">
            <div className="container py-4 flex justify-between items-center">
              <Link href="/" className="text-xl font-bold tracking-tighter flex items-baseline">
                Quantum<span className="text-[var(--accent-color)]">Q<span className="text-[0.5em]">_</span></span>
              </Link>
              <nav className="space-x-8 text-sm font-medium text-[var(--text-secondary)]">
                <Link href="/research" className="hover:text-[var(--text-primary)] transition-colors">
                  RESEARCH
                </Link>
                <Link href="/trading-signals" className="hover:text-[var(--text-primary)] transition-colors">
                  SIGNALS
                </Link>
<Link href="/onchain" className="hover:text-[var(--text-primary)] transition-colors">
                  ON-CHAIN
                </Link>
                <Link href="/team" className="hover:text-[var(--text-primary)] transition-colors">
                  TEAM
                </Link>
              </nav>
              <ThemeToggle />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-grow flex flex-col">
            <PageTransition>
              {children}
            </PageTransition>
          </main>

          {/* Footer */}
          <footer className="border-t border-[var(--border-color)] py-12 mt-20">
            <div className="container flex justify-between items-start text-[var(--text-secondary)] text-sm">
              <div>
                <p className="font-bold tracking-wider text-[var(--text-primary)] mb-4">QUANTUM RESEARCH</p>
                <p>© 2026 Quantum Technologies.</p>
                <p>All rights reserved.</p>
              </div>
              <div className="space-y-2 text-right">
                <p><Link href="/research" className="hover:text-[var(--accent-color)]">Research Hub</Link></p>
                <p><a href="https://x.com/eth_kim33" target="_blank" className="hover:text-[var(--accent-color)]">Twitter / X</a></p>
                <p><a href="https://github.com/yscott3010-lab/Quantum-Research" target="_blank" className="hover:text-[var(--accent-color)]">GitHub</a></p>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
