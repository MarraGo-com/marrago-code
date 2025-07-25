// /src/components/custom/AnimatedSection.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number; // Optional delay for staggered animations
}

export default function AnimatedSection({ children, delay = 0 }: AnimatedSectionProps) {
  // 1. Create a reference to the main div of the component.
  const ref = useRef(null);

  // 2. useInView hook tracks when the component enters the viewport.
  //    'once: true' ensures the animation only happens one time.
  const isInView = useInView(ref, { once: true });

  // 3. useAnimation allows us to manually control the animation sequence.
  const mainControls = useAnimation();

  // 4. useEffect triggers the animation when the component comes into view.
  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  return (
    // 5. We wrap the content in a motion.div from Framer Motion.
    <motion.div
      ref={ref}
      // Define the animation variants (states)
      variants={{
        hidden: { opacity: 0, y: 75 }, // Start hidden, slightly below
        visible: { opacity: 1, y: 0 },   // Animate to visible, at its original position
      }}
      initial="hidden" // The animation starts in the 'hidden' state
      animate={mainControls} // The animation is controlled by our mainControls
      transition={{ duration: 0.5, delay: delay }} // Define the speed and delay
    >
      {children}
    </motion.div>
  );
}
