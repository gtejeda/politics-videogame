'use client';

import { useState, useEffect, Children, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SequentialRevealProps {
  children: ReactNode;
  isActive: boolean;
  delayBetween?: number;
  initialDelay?: number;
  onComplete?: () => void;
}

/**
 * SequentialReveal - Reveals children one by one with animation
 *
 * Used for suspenseful vote reveals and turn-by-turn displays
 */
export function SequentialReveal({
  children,
  isActive,
  delayBetween = 300,
  initialDelay = 0,
  onComplete,
}: SequentialRevealProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const childArray = Children.toArray(children);
  const totalChildren = childArray.length;

  useEffect(() => {
    if (!isActive) {
      setRevealedCount(0);
      return;
    }

    // Initial delay before starting
    const startTimer = setTimeout(() => {
      setRevealedCount(1);
    }, initialDelay);

    return () => clearTimeout(startTimer);
  }, [isActive, initialDelay]);

  useEffect(() => {
    if (!isActive || revealedCount === 0) return;

    if (revealedCount < totalChildren) {
      const timer = setTimeout(() => {
        setRevealedCount((prev) => prev + 1);
      }, delayBetween);
      return () => clearTimeout(timer);
    } else if (revealedCount === totalChildren) {
      // All revealed
      const completeTimer = setTimeout(() => {
        onComplete?.();
      }, delayBetween);
      return () => clearTimeout(completeTimer);
    }
  }, [revealedCount, totalChildren, delayBetween, isActive, onComplete]);

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {childArray.slice(0, revealedCount).map((child, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
          >
            {child}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
