'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

type Post = {
    id: string;
    date: string;
    title: string;
    tags?: string[];
};

export function ResearchContent({ posts }: { posts: Post[] }) {
    return (
        <div className="container py-24">
            <header className="mb-20 border-b border-[var(--border-color)] pb-12">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-5xl font-extrabold tracking-tight mb-4 text-[var(--text-primary)]"
                >
                    Research Archive
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="text-xl text-[var(--text-secondary)] max-w-2xl"
                >
                    Actionable intelligence, quantitative models, and structural analysis on digital assets and institutional equities.
                </motion.p>
            </header>

            <div className="space-y-0">
                {posts.map(({ id, date, title, tags }, index) => (
                    <motion.article
                        key={id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="group border-b border-[var(--border-color)] last:border-0"
                    >
                        <Link href={`/research/${id}`} className="block py-8 hover:pl-4 transition-all duration-300">
                            <div className="flex md:items-center flex-col md:flex-row gap-4 md:gap-12">
                                <time className="text-sm font-mono text-[var(--text-secondary)] min-w-[140px] shrink-0">
                                    {new Date(date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </time>
                                <div className="flex-grow">
                                    <h2 className="text-2xl font-bold mb-2 group-hover:text-[var(--accent-color)] transition-colors duration-300 mt-0">
                                        {title}
                                    </h2>
                                    <div className="flex gap-2">
                                        {tags && tags.map(tag => (
                                            <span key={tag} className="text-xs font-mono text-[var(--text-secondary)] uppercase">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="hidden md:flex items-center gap-2 text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] group-hover:gap-4 transition-all duration-300 shrink-0">
                                    <span className="text-sm font-mono">Read</span>
                                    <span>→</span>
                                </div>
                            </div>
                        </Link>
                    </motion.article>
                ))}

                {posts.length === 0 && (
                    <p className="text-[var(--text-secondary)]">No methodology published yet.</p>
                )}
            </div>
        </div>
    );
}
