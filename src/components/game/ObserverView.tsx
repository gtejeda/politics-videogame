'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DecisionCardPayload, NationStatePayload } from '@/lib/game/events';
import type { Ideology } from '@/lib/game/types';
import { IDEOLOGY_DEFINITIONS, getAllIdeologies } from '@/lib/game/ideologies';
import { MoreInfoPopup } from './MoreInfoPopup';
import { useState } from 'react';

interface ObserverViewProps {
  card: DecisionCardPayload;
  localPlayerIdeology: Ideology | null;
  nationState: NationStatePayload;
  activePlayerName: string;
  isReady: boolean;
  onReady: () => void;
}

/**
 * ObserverView component for non-active players during Review Phase (FR-032, FR-033).
 * Shows topic context, ideology comparison table, and nation impact preview
 * but NOT the specific proposal options available to the active player.
 */
export function ObserverView({
  card,
  localPlayerIdeology,
  nationState,
  activePlayerName,
  isReady,
  onReady,
}: ObserverViewProps) {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const hasIdeologyPerspectives =
    card.ideologyPerspectives && card.ideologyPerspectives.length > 0;

  // Calculate potential nation impact ranges from all options (without revealing specific options)
  const budgetRange = {
    min: Math.min(...card.options.map(o => o.budgetChange)),
    max: Math.max(...card.options.map(o => o.budgetChange)),
  };
  const stabilityRange = {
    min: Math.min(...card.options.map(o => o.stabilityChange)),
    max: Math.max(...card.options.map(o => o.stabilityChange)),
  };

  const formatRange = (min: number, max: number): string => {
    if (min === max) {
      return min >= 0 ? `+${min}` : `${min}`;
    }
    const minStr = min >= 0 ? `+${min}` : `${min}`;
    const maxStr = max >= 0 ? `+${max}` : `${max}`;
    return `${minStr} to ${maxStr}`;
  };

  return (
    <>
      {/* More Information Popup (FR-017) */}
      {hasIdeologyPerspectives && (
        <MoreInfoPopup
          isOpen={showMoreInfo}
          onClose={() => setShowMoreInfo(false)}
          cardTitle={card.title}
          cardDescription={card.description}
          perspectives={card.ideologyPerspectives!}
          historicalNote={card.historicalNote}
        />
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription className="mt-1">
                {card.category.charAt(0).toUpperCase() + card.category.slice(1)} Issue
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {hasIdeologyPerspectives && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMoreInfo(true)}
                  className="text-xs"
                >
                  <svg
                    className="mr-1 h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  More Info
                </Button>
              )}
              <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                {card.zone.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>
          </div>
          <p className="mt-2 text-sm">{card.description}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Active Player Indicator */}
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 dark:border-amber-700 dark:bg-amber-900/20">
            <div className="flex items-center gap-2">
              <span className="text-amber-600 dark:text-amber-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  Waiting for {activePlayerName}
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  The active player is reviewing options and will propose one for voting.
                </p>
              </div>
            </div>
          </div>

          {/* Ideology Comparison Table (T065) */}
          {hasIdeologyPerspectives && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                How Different Ideologies View This Issue
              </h4>
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Ideology</th>
                      <th className="px-3 py-2 text-left font-medium">Typical Stance</th>
                      <th className="px-3 py-2 text-center font-medium">Likely Vote</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {card.ideologyPerspectives!.map((perspective) => {
                      const def = IDEOLOGY_DEFINITIONS[perspective.ideology];
                      const isLocalIdeology = perspective.ideology === localPlayerIdeology;
                      return (
                        <tr
                          key={perspective.ideology}
                          className={cn(
                            'transition-colors',
                            isLocalIdeology && 'bg-primary/5'
                          )}
                        >
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <span
                                className="flex h-6 w-6 items-center justify-center rounded-full text-xs"
                                style={{ backgroundColor: def.color + '30' }}
                              >
                                {def.icon}
                              </span>
                              <span className={cn(isLocalIdeology && 'font-medium')}>
                                {def.name}
                                {isLocalIdeology && ' (You)'}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">
                            {perspective.typicalStance}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span
                              className={cn(
                                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                                perspective.likelyVote === 'Yes' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                                perspective.likelyVote === 'No' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                                perspective.likelyVote === 'Split' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              )}
                            >
                              {perspective.likelyVote === 'Yes' && 'Support'}
                              {perspective.likelyVote === 'No' && 'Oppose'}
                              {perspective.likelyVote === 'Split' && 'Split'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {/* Show all ideologies, with placeholder for those without perspectives */}
                    {getAllIdeologies()
                      .filter(ideo => !card.ideologyPerspectives?.some(p => p.ideology === ideo))
                      .map((ideology) => {
                        const def = IDEOLOGY_DEFINITIONS[ideology];
                        const isLocalIdeology = ideology === localPlayerIdeology;
                        return (
                          <tr
                            key={ideology}
                            className={cn(
                              'transition-colors',
                              isLocalIdeology && 'bg-primary/5'
                            )}
                          >
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className="flex h-6 w-6 items-center justify-center rounded-full text-xs"
                                  style={{ backgroundColor: def.color + '30' }}
                                >
                                  {def.icon}
                                </span>
                                <span className={cn(isLocalIdeology && 'font-medium')}>
                                  {def.name}
                                  {isLocalIdeology && ' (You)'}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-muted-foreground italic">
                              No strong opinion
                            </td>
                            <td className="px-3 py-2 text-center">
                              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                Neutral
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Nation Impact Preview (T066) */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Potential Nation Impact
            </h4>
            <p className="text-xs text-muted-foreground">
              Depending on which option is proposed and passed, this decision could affect:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {/* Budget Impact */}
              <div className="rounded-lg border p-3">
                <div className="text-xs text-muted-foreground">Budget</div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm">
                    Current: <span className="font-medium">{nationState.budget}</span>
                  </span>
                  <span
                    className={cn(
                      'rounded px-2 py-0.5 text-sm font-medium',
                      budgetRange.min >= 0 && budgetRange.max >= 0 && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                      budgetRange.min < 0 && budgetRange.max < 0 && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                      budgetRange.min < 0 && budgetRange.max >= 0 && 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    )}
                  >
                    {formatRange(budgetRange.min, budgetRange.max)}
                  </span>
                </div>
              </div>

              {/* Stability Impact */}
              <div className="rounded-lg border p-3">
                <div className="text-xs text-muted-foreground">Stability</div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm">
                    Current: <span className="font-medium">{nationState.stability}</span>
                  </span>
                  <span
                    className={cn(
                      'rounded px-2 py-0.5 text-sm font-medium',
                      stabilityRange.min >= 0 && stabilityRange.max >= 0 && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                      stabilityRange.min < 0 && stabilityRange.max < 0 && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                      stabilityRange.min < 0 && stabilityRange.max >= 0 && 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    )}
                  >
                    {formatRange(stabilityRange.min, stabilityRange.max)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* FR-034: Movement effects hidden message */}
          <div className="rounded-lg border border-dashed p-3 text-center">
            <p className="text-sm text-muted-foreground">
              Movement effects revealed after vote
            </p>
          </div>

          {/* Historical Note */}
          {card.historicalNote && (
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <p className="font-medium text-muted-foreground">Historical Context</p>
              <p className="mt-1">{card.historicalNote}</p>
            </div>
          )}

          {/* Ready Button */}
          <div className="pt-2">
            {isReady ? (
              <div className="rounded-lg border-2 border-green-500 bg-green-50 p-3 text-center dark:bg-green-900/20">
                <p className="font-medium text-green-800 dark:text-green-200">
                  You are ready
                </p>
                <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                  Waiting for the proposer to select an option...
                </p>
              </div>
            ) : (
              <Button
                onClick={onReady}
                className="w-full"
                size="lg"
              >
                Mark as Ready
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
