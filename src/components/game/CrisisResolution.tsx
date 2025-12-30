'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { PlayerStatePayload, CrisisPayload } from '@/lib/game/events';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

interface CrisisContribution {
  playerId: string;
  amount: number;
}

interface CrisisResolutionProps {
  crisis: CrisisPayload;
  contributions: CrisisContribution[];
  players: PlayerStatePayload[];
  outcome: 'success' | 'failure';
  totalContribution: number;
  nationChanges: {
    budgetChange: number;
    stabilityChange: number;
  };
  onComplete?: () => void;
}

/**
 * CrisisResolution - Animation sequence for crisis outcome display
 *
 * Shows crisis threshold vs contribution, player contributions,
 * and outcome with appropriate animations
 */
export function CrisisResolution({
  crisis,
  contributions,
  players,
  outcome,
  totalContribution,
  nationChanges,
  onComplete,
}: CrisisResolutionProps) {
  const [phase, setPhase] = useState<'threshold' | 'contributions' | 'outcome' | 'complete'>('threshold');
  const prefersReducedMotion = useReducedMotion();

  // Reduce timings if user prefers reduced motion (T044c)
  const timings = prefersReducedMotion
    ? { threshold: 300, contributions: 600, complete: 1200 }
    : { threshold: 1500, contributions: 3000, complete: 5000 };

  useEffect(() => {
    // Phase transitions
    const thresholdTimer = setTimeout(() => setPhase('contributions'), timings.threshold);
    const contributionsTimer = setTimeout(() => setPhase('outcome'), timings.contributions);
    const completeTimer = setTimeout(() => {
      setPhase('complete');
      onComplete?.();
    }, timings.complete);

    return () => {
      clearTimeout(thresholdTimer);
      clearTimeout(contributionsTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, timings.threshold, timings.contributions, timings.complete]);

  const progressPercent = Math.min(100, (totalContribution / crisis.contributionThreshold) * 100);
  const isSuccess = outcome === 'success';

  return (
    <AnimatePresence>
      {phase !== 'complete' && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background overlay */}
          <motion.div
            className={cn(
              'absolute inset-0',
              isSuccess ? 'bg-green-900/50' : 'bg-red-900/50'
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          <motion.div
            className="relative w-full max-w-md rounded-xl bg-background/95 p-6 shadow-2xl backdrop-blur-sm"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            {/* Crisis name */}
            <motion.h2
              className="mb-4 text-center text-xl font-bold"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {crisis.name} Resolution
            </motion.h2>

            {/* Threshold vs Contribution bar */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase !== 'threshold' ? 1 : 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="mb-2 flex justify-between text-sm">
                <span>Contribution: {totalContribution}</span>
                <span>Threshold: {crisis.contributionThreshold}</span>
              </div>
              <div className="relative h-6 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className={cn(
                    'absolute inset-y-0 left-0',
                    isSuccess ? 'bg-green-500' : 'bg-red-500'
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
                {/* Threshold marker */}
                <div
                  className="absolute inset-y-0 w-0.5 bg-foreground"
                  style={{ left: '100%', transform: 'translateX(-100%)' }}
                />
              </div>
            </motion.div>

            {/* Player contributions */}
            {phase !== 'threshold' && (
              <motion.div
                className="mb-6 space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-sm font-medium text-muted-foreground">Contributions</h3>
                <div className="space-y-1">
                  {contributions
                    .filter(c => c.amount > 0)
                    .map((contribution, index) => {
                      const player = players.find(p => p.id === contribution.playerId);
                      const ideologyDef = player?.ideology
                        ? IDEOLOGY_DEFINITIONS[player.ideology]
                        : null;

                      return (
                        <motion.div
                          key={contribution.playerId}
                          className="flex items-center justify-between rounded border p-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                        >
                          <div className="flex items-center gap-2">
                            {ideologyDef && (
                              <div
                                className="flex h-6 w-6 items-center justify-center rounded-full text-xs"
                                style={{ backgroundColor: ideologyDef.color }}
                              >
                                {ideologyDef.icon}
                              </div>
                            )}
                            <span className="text-sm">{player?.name || 'Unknown'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-bold">+{contribution.amount}</span>
                            <span className="text-xs">🎫</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  {contributions.filter(c => c.amount > 0).length === 0 && (
                    <div className="text-center text-sm text-muted-foreground">
                      No contributions made
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Outcome announcement */}
            {phase === 'outcome' && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
              >
                {/* Success/Failure banner */}
                <motion.div
                  className={cn(
                    'rounded-lg p-4 text-center text-lg font-bold',
                    isSuccess
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  )}
                  animate={
                    isSuccess
                      ? { scale: [1, 1.05, 1] }
                      : { x: [0, -5, 5, -5, 5, 0] }
                  }
                  transition={{ duration: 0.5 }}
                >
                  {isSuccess ? '✅ Crisis Averted!' : '❌ Crisis Worsened!'}
                </motion.div>

                {/* Nation changes */}
                <div className="grid grid-cols-2 gap-2 text-center text-sm">
                  <div className={cn(
                    'rounded p-2',
                    nationChanges.stabilityChange >= 0 ? 'bg-green-50' : 'bg-red-50'
                  )}>
                    <div className="text-muted-foreground">Stability</div>
                    <div className={cn(
                      'font-bold',
                      nationChanges.stabilityChange >= 0 ? 'text-green-600' : 'text-red-600'
                    )}>
                      {nationChanges.stabilityChange >= 0 ? '+' : ''}{nationChanges.stabilityChange}
                    </div>
                  </div>
                  <div className={cn(
                    'rounded p-2',
                    nationChanges.budgetChange >= 0 ? 'bg-green-50' : 'bg-red-50'
                  )}>
                    <div className="text-muted-foreground">Budget</div>
                    <div className={cn(
                      'font-bold',
                      nationChanges.budgetChange >= 0 ? 'text-green-600' : 'text-red-600'
                    )}>
                      {nationChanges.budgetChange >= 0 ? '+' : ''}{nationChanges.budgetChange}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
