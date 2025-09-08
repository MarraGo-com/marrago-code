// -------------------------------------------------------------------------
// 1. NEW FILE: /src/themes/adventure/ui/AnimatedMenuIcon.tsx
// This is a dedicated client component for the animated hamburger icon.
// -------------------------------------------------------------------------
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedMenuIconProps {
  isOpen: boolean;
  onClick: () => void;
  color?: string;
}

export default function AnimatedMenuIcon({ isOpen, onClick, color = 'currentColor' }: AnimatedMenuIconProps) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 relative focus:outline-none"
      aria-label="Toggle Menu"
    >
      <motion.div
        className="w-full h-0.5 absolute"
        style={{ backgroundColor: color, top: '25%', left: 0, right: 0, borderRadius: '2px' }}
        variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 8 } }}
        animate={isOpen ? 'open' : 'closed'}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="w-full h-0.5 absolute"
        style={{ backgroundColor: color, top: '50%', left: 0, right: 0, borderRadius: '2px' }}
        variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
        animate={isOpen ? 'open' : 'closed'}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        className="w-full h-0.5 absolute"
        style={{ backgroundColor: color, top: '75%', left: 0, right: 0, borderRadius: '2px' }}
        variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -8 } }}
        animate={isOpen ? 'open' : 'closed'}
        transition={{ duration: 0.3 }}
      />
    </button>
  );
}
