// -------------------------------------------------------------------------
// 1. NEW FILE: /src/components/custom/PageTransition.tsx
// This is a new Client Component that will wrap our page content and handle the animations.
// -------------------------------------------------------------------------
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation'; // Use the standard hook here

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname} // The key is crucial for AnimatePresence to detect page changes
        initial="initialState"
        animate="animateState"
        exit="exitState"
        transition={{
          duration: 0.5,
        }}
        variants={{
          initialState: {
            opacity: 0,
          },
          animateState: {
            opacity: 1,
          },
          exitState: {
            opacity: 0,
          },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
