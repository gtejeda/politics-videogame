'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

interface TrustBrokenProps {
  isActive: boolean;
  breakerName?: string;
  victimName?: string;
  duration?: number;
  onComplete?: () => void;
}

/**
 * TrustBroken - Animation for deal breach events
 *
 * Shows a shake effect with broken handshake visual
 * T044c: Respects prefers-reduced-motion
 */
export function TrustBroken({
  isActive,
  breakerName,
  victimName,
  duration = 2000,
  onComplete,
}: TrustBrokenProps) {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Reduce duration if user prefers reduced motion
  const effectiveDuration = prefersReducedMotion ? Math.min(duration, 500) : duration;

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, effectiveDuration);
      return () => clearTimeout(timer);
    }
  }, [isActive, effectiveDuration, onComplete]);

  // Simplified animations for reduced motion
  const shakeAnimation = prefersReducedMotion
    ? { scale: 1 }
    : {
        scale: 1,
        x: [0, -10, 10, -10, 10, -5, 5, 0],
      };

  const rotateAnimation = prefersReducedMotion
    ? { rotate: 0 }
    : { rotate: [0, -5, 5, -5, 5, 0] };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-red-900/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Content */}
          <motion.div
            className="relative flex flex-col items-center gap-4"
            initial={{ scale: prefersReducedMotion ? 1 : 0.8 }}
            animate={shakeAnimation}
            transition={
              prefersReducedMotion
                ? { duration: 0.1 }
                : {
                    scale: { duration: 0.2 },
                    x: { duration: 0.5, delay: 0.2 },
                  }
            }
          >
            {/* Broken handshake icon */}
            <motion.div
              className="relative"
              initial={{ rotate: 0 }}
              animate={rotateAnimation}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.2 }}
            >
              <span className="text-7xl">🤝</span>
              {/* Crack overlay */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: prefersReducedMotion ? 1 : 0, scale: prefersReducedMotion ? 1 : 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={prefersReducedMotion ? { duration: 0.1 } : { delay: 0.4, type: 'spring' }}
              >
                <span className="text-5xl">💔</span>
              </motion.div>
            </motion.div>

            {/* Text */}
            <motion.div
              className="text-center"
              initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: prefersReducedMotion ? 0 : 0.5 }}
            >
              <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                Deal Broken!
              </h3>
              {breakerName && victimName && (
                <p className="mt-2 text-lg text-red-200">
                  {breakerName} broke their deal with {victimName}
                </p>
              )}
            </motion.div>

            {/* Influence change indicator */}
            <motion.div
              className="flex gap-4"
              initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: prefersReducedMotion ? 0 : 0.7 }}
            >
              <div className="rounded-lg bg-red-500/30 px-4 py-2 text-center">
                <p className="text-xs text-red-200">Breaker</p>
                <p className="text-lg font-bold text-red-400">-2 Influence</p>
              </div>
              <div className="rounded-lg bg-green-500/30 px-4 py-2 text-center">
                <p className="text-xs text-green-200">Victim</p>
                <p className="text-lg font-bold text-green-400">+1 Influence</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
