'use client';

import { motion } from 'framer-motion';

export default function Team() {
    return (
        <div className="container py-24">
            <header className="mb-20 border-b border-[var(--border-color)] pb-12">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-5xl font-extrabold tracking-tight mb-4 text-[var(--text-primary)]"
                >
                    The Firm
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="text-xl text-[var(--text-secondary)] max-w-2xl"
                >
                    The quantitative minds and engineers driving the next generation of decentralized markets.
                </motion.p>
            </header>

            <div className="grid md:grid-cols-2 gap-16 items-center">
                {/* Profile Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="aspect-square bg-[var(--card-bg)] border border-[var(--border-color)] flex items-center justify-center relative overflow-hidden group hover:border-[var(--accent-color)] hover:shadow-[0_0_40px_rgba(74,222,128,0.1)] transition-all duration-500"
                >
                    {/* Neon corner accent */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--accent-color)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--accent-color)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30" />

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/scott.jpg"
                        alt="Scott Yang - Investment Analyst"
                        className="w-full h-full object-cover relative z-20 group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />

                    {/* Overlay gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent-color)] to-transparent opacity-0 group-hover:opacity-[0.05] z-10 transition-opacity duration-500" />
                </motion.div>

                {/* Biography & Specs */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-pulse" />
                        <h3 className="text-[var(--accent-color)] font-mono uppercase tracking-widest text-sm">Investment Analyst</h3>
                    </div>
                    <h2 className="text-4xl font-bold mb-6 text-[var(--text-primary)] tracking-tight">Scott Yang</h2>

                    <div className="space-y-4 text-[var(--text-secondary)] text-lg mb-10 leading-relaxed">
                        <p>
                            Scott Yang is an Investment Analyst specializing in algorithmic trading strategies, structural market analysis, and digital asset infrastructure.
                            By leveraging a data-driven approach, Scott identifies asymmetric opportunities across highly volatile and complex ecosystems.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 border-t border-[var(--border-color)] pt-8">
                        <div className="group/stat">
                            <p className="text-xs font-mono uppercase text-[var(--text-secondary)] mb-2 tracking-widest">Education</p>
                            <p className="text-[var(--text-primary)] font-bold text-xl group-hover/stat:text-[var(--accent-color)] transition-colors duration-300">HKU</p>
                        </div>
                        <div className="group/stat">
                            <p className="text-xs font-mono uppercase text-[var(--text-secondary)] mb-2 tracking-widest">Coverage</p>
                            <p className="text-[var(--text-primary)] font-bold text-xl group-hover/stat:text-[var(--accent-color)] transition-colors duration-300">Crypto, Macro, Equity</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
