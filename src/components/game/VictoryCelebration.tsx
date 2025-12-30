'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Confetti } from '@/components/animations/Confetti';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';
import type { Ideology } from '@/lib/game/types';

interface VictoryCelebrationProps {
  winnerName: string;
  winnerIdeology?: Ideology;
  isLocalWinner: boolean;
  onComplete?: () => void;
}

/**
 * VictoryCelebration - Celebratory animation sequence for game victory
 *
 * Shows confetti, winner announcement, and ideology-themed celebration
 */
export function VictoryCelebration({
  winnerName,
  winnerIdeology,
  isLocalWinner,
  onComplete,
}: VictoryCelebrationProps) {
  const [phase, setPhase] = useState<'confetti' | 'announce' | 'complete'>('confetti');
  const [showContent, setShowContent] = useState(false);

  const ideologyDef = winnerIdeology ? IDEOLOGY_DEFINITIONS[winnerIdeology] : null;

  useEffect(() => {
    // Start showing content after a brief delay
    const contentTimer = setTimeout(() => setShowContent(true), 300);
    // Transition to announce phase
    const announceTimer = setTimeout(() => setPhase('announce'), 1500);
    // Complete after full animation
    const completeTimer = setTimeout(() => {
      setPhase('complete');
      onComplete?.();
    }, 4000);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(announceTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <>
      {/* Confetti animation */}
      <Confetti
        isActive={phase === 'confetti' || phase === 'announce'}
        duration={4000}
        pieceCount={150}
        colors={ideologyDef ? [ideologyDef.color, '#FFD700', '#FFFFFF'] : undefined}
      />

      <AnimatePresence>
        {showContent && phase !== 'complete' && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Background glow */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: ideologyDef
                  ? `radial-gradient(circle at center, ${ideologyDef.color}40 0%, transparent 70%)`
                  : 'radial-gradient(circle at center, rgba(255, 215, 0, 0.3) 0%, transparent 70%)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />

            {/* Winner announcement */}
            <motion.div
              className="relative flex flex-col items-center gap-4 rounded-2xl bg-background/90 p-8 shadow-2xl backdrop-blur-sm"
              initial={{ scale: 0.5, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', delay: 0.3, stiffness: 200, damping: 20 }}
            >
              {/* Trophy or ideology icon */}
              <motion.div
                className="text-6xl"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
              >
                {isLocalWinner ? '🏆' : (ideologyDef?.icon || '🎉')}
              </motion.div>

              {/* Winner text */}
              <motion.div className="text-center">
                <motion.h2
                  className="text-3xl font-bold"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {isLocalWinner ? 'You Win!' : `${winnerName} Wins!`}
                </motion.h2>
                {ideologyDef && (
                  <motion.p
                    className="mt-2 text-lg"
                    style={{ color: ideologyDef.color }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    {ideologyDef.name} Victory
                  </motion.p>
                )}
              </motion.div>

              {/* Celebration message */}
              <motion.p
                className="max-w-xs text-center text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                {isLocalWinner
                  ? 'Your political strategy prevailed!'
                  : 'A worthy opponent has reached the goal!'}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
