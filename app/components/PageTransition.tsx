'use client';

import { motion } from 'framer-motion';

export function PageTransition({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} // Paradigm-esque smooth easing
            className="w-full flex-grow flex flex-col"
        >
            {children}
        </motion.div>
    );
}
