'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

type Post = {
    id: string;
    date: string;
    title: string;
    tags?: string[];
};

export function HomeContent({ recentPosts }: { recentPosts: Post[] }) {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="py-24 lg:py-36 border-b border-[var(--border-color)] relative overflow-hidden bg-grid">
                {/* Ambient DWF-style Glow */}
                <div className="absolute inset-0 glow-bg" />

                <div className="container relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="text-5xl md:text-7xl font-extrabold tracking-tighter max-w-4xl mb-6"
                    >
                        Pioneering the Next Era of Decentralized Networks.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl mb-10 leading-relaxed"
                    >
                        Leading quantitative research firm specializing in algorithmic trading, crypto infrastructure, and institutional equity signaling.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="flex gap-4"
                    >
                        <Link
                            href="/research"
                            className="px-8 py-4 bg-[var(--text-primary)] text-[var(--bg-color)] font-bold text-sm tracking-widest uppercase hover:bg-[var(--accent-color)] hover:shadow-[0_0_30px_rgba(74,222,128,0.3)] transition-all duration-300"
                        >
                            Read Research
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Ethos / About Snippet */}
            <section className="py-20 border-b border-[var(--border-color)] bg-[var(--card-bg)] relative overflow-hidden">
                <div className="container grid md:grid-cols-3 gap-12 relative z-10">
                    {[
                        { title: "Trade", desc: "Executing complex algorithmic strategies across global digital asset and traditional equity markets with high-frequency precision." },
                        { title: "Build", desc: "Contributing core infrastructure to open-source protocols and empowering the next generation of resilient blockchain systems." },
                        { title: "Invest", desc: "Partnering with visionary founders to scale early-stage Web3 primitives into industry-defining mainnets." }
                    ].map((item, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            key={item.title}
                        >
                            <h3 className="text-sm font-bold tracking-widest uppercase text-[var(--accent-color)] mb-4">{item.title}</h3>
                            <p className="text-[var(--text-secondary)]">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Recent Insights Section */}
            <section className="py-24">
                <div className="container">
                    <div className="flex justify-between items-end mb-12">
                        <h2 className="text-3xl font-bold tracking-tight m-0">Latest Insights</h2>
                        <Link href="/research" className="text-[var(--accent-color)] hover:text-[var(--text-primary)] transition-colors text-sm font-bold uppercase tracking-widest">
                            View All ↗
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {recentPosts.length > 0 ? (
                            recentPosts.map(({ id, date, title, tags }, index) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    key={id}
                                    className="h-full"
                                >
                                    <Link href={`/research/${id}`} className="group block h-full">
                                        <article className="border border-[var(--border-color)] p-8 h-full bg-[var(--card-bg)] hover:border-[var(--accent-color)] hover:shadow-[0_0_20px_rgba(74,222,128,0.1)] transition-all duration-300 flex flex-col relative overflow-hidden">
                                            {/* Subdued hover glow effect inside the card */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-color)] to-transparent opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300" />
                                            <div className="flex gap-2 mb-4">
                                                {tags && tags.map(tag => (
                                                    <span key={tag} className="text-xs font-mono text-[var(--text-secondary)] uppercase bg-[var(--card-hover)] px-2 py-1 rounded">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <h3 className="text-xl font-bold mb-4 group-hover:text-[var(--accent-color)] transition-colors line-clamp-3 flex-grow">
                                                {title}
                                            </h3>
                                            <time className="text-sm text-[var(--text-secondary)] font-mono">
                                                {new Date(date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </time>
                                        </article>
                                    </Link>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-3 text-[var(--text-secondary)] py-12 text-center border border-dashed border-[var(--border-color)]">
                                No research reports published yet.
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
