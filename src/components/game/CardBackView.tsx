'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { DecisionCardPayload, CardOptionPayload } from '@/lib/game/events';
import type { Ideology, CardOptionId } from '@/lib/game/types';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';

interface CardBackViewProps {
  card: DecisionCardPayload;
  selectedOption: CardOptionId | null;
  showAdvancement: boolean;
  onRevealComplete?: () => void;
}

/**
 * FR-018: Card-back view showing per-ideology advancement bonuses.
 * Hidden during deliberation/voting, revealed after all votes are cast.
 */
export function CardBackView({
  card,
  selectedOption,
  showAdvancement,
  onRevealComplete,
}: CardBackViewProps) {
  const selectedOptionData = selectedOption
    ? card.options.find(o => o.id === selectedOption)
    : null;

  return (
    <AnimatePresence mode="wait">
      {!showAdvancement ? (
        // Hidden view - shows card back pattern
        <motion.div
          key="hidden"
          initial={{ opacity: 0, rotateY: 180 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0, rotateY: -90 }}
          className="perspective-1000"
        >
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-gray-700 to-gray-900 pb-4 pt-4">
              <CardTitle className="text-center text-white">
                <span className="text-lg">Advancement Effects</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                {/* Card back pattern */}
                <div className="relative">
                  <div className="grid grid-cols-2 gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700"
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl opacity-50">🔒</span>
                  </div>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  Advancement effects are hidden until voting completes
                </p>
                <p className="text-center text-xs text-muted-foreground/70">
                  Different ideologies may advance differently based on this option
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        // Revealed view - shows advancement bonuses
        <motion.div
          key="revealed"
          initial={{ opacity: 0, rotateY: 90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.5 }}
          onAnimationComplete={onRevealComplete}
          className="perspective-1000"
        >
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-amber-500 to-orange-600 pb-4 pt-4">
              <CardTitle className="flex items-center justify-center gap-2 text-white">
                <span className="text-2xl">✨</span>
                <span className="text-lg">Advancement Effects Revealed!</span>
                <span className="text-2xl">✨</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {selectedOptionData ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-sm text-muted-foreground">Selected Option:</span>
                    <p className="font-bold">{selectedOptionData.name}</p>
                  </div>

                  {/* Aligned ideologies (positive movement) */}
                  {selectedOptionData.aligned.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30"
                    >
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-green-800 dark:text-green-200">
                        <span>📈</span>
                        <span>Advancement Bonus</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedOptionData.aligned.map((alignment) => {
                          const ideologyDef = IDEOLOGY_DEFINITIONS[alignment.ideology];
                          return (
                            <motion.div
                              key={alignment.ideology}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3 }}
                              className="flex items-center gap-1 rounded-full bg-white/50 px-3 py-1 dark:bg-black/20"
                            >
                              <span>{ideologyDef.icon}</span>
                              <span className="text-sm font-medium">{ideologyDef.name}</span>
                              <span className="ml-1 font-bold text-green-700 dark:text-green-300">
                                +{alignment.movement}
                              </span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Opposed ideologies (negative movement) */}
                  {selectedOptionData.opposed.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="rounded-lg bg-red-100 p-3 dark:bg-red-900/30"
                    >
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-red-800 dark:text-red-200">
                        <span>📉</span>
                        <span>Advancement Penalty</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedOptionData.opposed.map((opposition) => {
                          const ideologyDef = IDEOLOGY_DEFINITIONS[opposition.ideology];
                          return (
                            <motion.div
                              key={opposition.ideology}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.5 }}
                              className="flex items-center gap-1 rounded-full bg-white/50 px-3 py-1 dark:bg-black/20"
                            >
                              <span>{ideologyDef.icon}</span>
                              <span className="text-sm font-medium">{ideologyDef.name}</span>
                              <span className="ml-1 font-bold text-red-700 dark:text-red-300">
                                -{opposition.movement}
                              </span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Neutral ideologies */}
                  {(() => {
                    const allIdeologies = Object.keys(IDEOLOGY_DEFINITIONS) as Ideology[];
                    const alignedIds = selectedOptionData.aligned.map(a => a.ideology);
                    const opposedIds = selectedOptionData.opposed.map(o => o.ideology);
                    const neutralIds = allIdeologies.filter(
                      id => !alignedIds.includes(id) && !opposedIds.includes(id)
                    );

                    if (neutralIds.length === 0) return null;

                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800/30"
                      >
                        <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                          <span>➡️</span>
                          <span>No Effect</span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {neutralIds.map((ideology) => {
                            const ideologyDef = IDEOLOGY_DEFINITIONS[ideology];
                            return (
                              <div
                                key={ideology}
                                className="flex items-center gap-1 rounded-full bg-white/50 px-3 py-1 text-sm opacity-60 dark:bg-black/20"
                              >
                                <span>{ideologyDef.icon}</span>
                                <span>{ideologyDef.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  })()}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No option selected
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
