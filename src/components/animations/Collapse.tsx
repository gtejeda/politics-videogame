'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CollapseProps {
  isActive: boolean;
  reason: 'stability' | 'budget';
  duration?: number;
  onComplete?: () => void;
}

/**
 * Collapse - Dramatic animation for government collapse
 *
 * Shows a screen crack effect followed by fade to red/amber
 */
export function Collapse({
  isActive,
  reason,
  duration = 2500,
  onComplete,
}: CollapseProps) {
  const [phase, setPhase] = useState<'idle' | 'crack' | 'fade' | 'complete'>('idle');

  const collapseColor = reason === 'stability' ? '#DC2626' : '#D97706';
  const collapseIcon = reason === 'stability' ? '⚠️' : '💸';
  const collapseText =
    reason === 'stability' ? 'Government Collapsed!' : 'Financial Crisis!';

  useEffect(() => {
    if (isActive) {
      setPhase('crack');
      const fadeTimer = setTimeout(() => setPhase('fade'), duration * 0.4);
      const completeTimer = setTimeout(() => {
        setPhase('complete');
        onComplete?.();
      }, duration);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(completeTimer);
      };
    } else {
      setPhase('idle');
    }
  }, [isActive, duration, onComplete]);

  return (
    <AnimatePresence>
      {isActive && phase !== 'idle' && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background overlay */}
          <motion.div
            className="absolute inset-0"
            initial={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
            animate={{
              backgroundColor:
                phase === 'fade' || phase === 'complete'
                  ? `${collapseColor}99`
                  : 'rgba(0, 0, 0, 0.5)',
            }}
            transition={{ duration: 0.5 }}
          />

          {/* Crack effect (SVG lines) */}
          {phase === 'crack' && (
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
              <motion.path
                d="M50 0 L48 20 L52 35 L45 50 L55 65 L48 80 L50 100"
                stroke="white"
                strokeWidth="0.5"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
              <motion.path
                d="M0 50 L25 48 L40 52 L50 45 L60 55 L75 48 L100 50"
                stroke="white"
                strokeWidth="0.5"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              />
            </svg>
          )}

          {/* Shake effect */}
          <motion.div
            className="relative flex flex-col items-center gap-4"
            animate={
              phase === 'crack'
                ? {
                    x: [0, -5, 5, -5, 5, 0],
                    y: [0, 2, -2, 2, -2, 0],
                  }
                : {}
            }
            transition={{ duration: 0.5, repeat: phase === 'crack' ? 2 : 0 }}
          >
            {/* Icon */}
            <motion.span
              className="text-6xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.3 }}
            >
              {collapseIcon}
            </motion.span>

            {/* Text */}
            <motion.h2
              className="text-center text-3xl font-bold text-white drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {collapseText}
            </motion.h2>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
