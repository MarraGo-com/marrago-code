// /src/components/custom/LazyLoadSection.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useInView } from 'framer-motion';

interface LazyLoadSectionProps {
  children: React.ReactNode;
  // We can add a margin to trigger the load a little before it's visible
  rootMargin?: string; 
}

export default function LazyLoadSection({ children}: LazyLoadSectionProps) {
  const ref = useRef(null);
  
  // 1. useInView hook from Framer Motion tracks when the component enters the viewport.
  //    'once: true' ensures we only do this check one time.
  const isInView = useInView(ref, { once: true });

  // 2. We use a local state to "mount" the children only when they are in view.
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    if (isInView) {
      setHasBeenInView(true);
    }
  }, [isInView]);

  return (
    // 3. The ref is attached to this outer div, which is always rendered.
    //    It's a lightweight placeholder that takes up the space of the future content.
    <div ref={ref}>
      {/* 4. The actual, "heavy" children are only rendered into the DOM */}
      {/* after the component has entered the viewport. */}
      {hasBeenInView ? children : null}
    </div>
  );
}
