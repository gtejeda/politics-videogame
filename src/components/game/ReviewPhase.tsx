'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DecisionCardPayload, PlayerStatePayload } from '@/lib/game/events';
import type { Ideology } from '@/lib/game/types';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';
import { MoreInfoPopup } from './MoreInfoPopup';
import { useState } from 'react';

interface ReviewPhaseProps {
  card: DecisionCardPayload;
  localPlayerIdeology: Ideology | null;
  proposerName: string;
  isReady: boolean;
  onMarkReady: () => void;
}

/**
 * ReviewPhase component for non-proposing players (FR-019).
 * Shows informational content only (no vote options) with a "Ready to Negotiate" button.
 */
export function ReviewPhase({
  card,
  localPlayerIdeology,
  proposerName,
  isReady,
  onMarkReady,
}: ReviewPhaseProps) {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const hasIdeologyPerspectives =
    card.ideologyPerspectives && card.ideologyPerspectives.length > 0;

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

        <CardContent className="space-y-4">
          {/* Phase Information */}
          <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-4 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{proposerName}</span> is reviewing the options and will propose one for voting.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Review the decision details above while waiting.
            </p>
          </div>

          {/* Options Preview (read-only) */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Available Options:</h4>
            {card.options.map((option) => {
              const alignedEntry = localPlayerIdeology
                ? option.aligned.find(a => a.ideology === localPlayerIdeology)
                : null;
              const opposedEntry = localPlayerIdeology
                ? option.opposed.find(o => o.ideology === localPlayerIdeology)
                : null;

              return (
                <div
                  key={option.id}
                  className="rounded-lg border p-3 opacity-75"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {option.id}
                    </span>
                    <span className="font-medium">{option.name}</span>
                  </div>

                  {/* Nation Effects */}
                  <div className="mt-2 flex items-center justify-center gap-4 text-sm">
                    <div className={cn(
                      'rounded px-2 py-1',
                      option.budgetChange > 0 && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
                      option.budgetChange < 0 && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
                      option.budgetChange === 0 && 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
                    )}>
                      Budget: {option.budgetChange > 0 ? '+' : ''}{option.budgetChange}
                    </div>
                    <div className={cn(
                      'rounded px-2 py-1',
                      option.stabilityChange > 0 && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
                      option.stabilityChange < 0 && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
                      option.stabilityChange === 0 && 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
                    )}>
                      Stability: {option.stabilityChange > 0 ? '+' : ''}{option.stabilityChange}
                    </div>
                  </div>

                  {/* Personal Impact */}
                  {localPlayerIdeology && (alignedEntry || opposedEntry) && (
                    <div className={cn(
                      'mt-2 rounded p-1 text-center text-xs',
                      alignedEntry && 'bg-green-100/50 text-green-800 dark:bg-green-900/20 dark:text-green-200',
                      opposedEntry && 'bg-red-100/50 text-red-800 dark:bg-red-900/20 dark:text-red-200',
                    )}>
                      {alignedEntry && `Would move you +${alignedEntry.movement}`}
                      {opposedEntry && `Would move you -${opposedEntry.movement}`}
                    </div>
                  )}
                </div>
              );
            })}
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
              <div className="flex items-center justify-center gap-2 rounded-lg bg-green-100 py-3 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="font-medium">Ready to Negotiate</span>
              </div>
            ) : (
              <Button
                onClick={onMarkReady}
                className="w-full"
                size="lg"
              >
                Ready to Negotiate
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
