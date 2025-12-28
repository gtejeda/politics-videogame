'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import type { DecisionCardPayload, CardOptionPayload } from '@/lib/game/events';
import type { Ideology, CardOptionId, GamePhase } from '@/lib/game/types';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';
import { MoreInfoPopup } from './MoreInfoPopup';

interface DecisionCardProps {
  card: DecisionCardPayload;
  selectedOption: CardOptionId | null;
  canPropose: boolean;
  localPlayerIdeology: Ideology | null;
  onPropose: (optionId: CardOptionId) => void;
  /** Current game phase - More Info button is visible during deliberating and voting */
  gamePhase?: GamePhase;
}

export function DecisionCard({
  card,
  selectedOption,
  canPropose,
  localPlayerIdeology,
  onPropose,
  gamePhase,
}: DecisionCardProps) {
  const [confirmingOption, setConfirmingOption] = useState<CardOptionPayload | null>(null);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  // More Info button is available during deliberation and voting phases (FR-017)
  const canShowMoreInfo =
    gamePhase === 'deliberating' ||
    gamePhase === 'voting' ||
    gamePhase === 'proposing';

  const hasIdeologyPerspectives =
    card.ideologyPerspectives && card.ideologyPerspectives.length > 0;

  const handleConfirmPropose = () => {
    if (confirmingOption) {
      onPropose(confirmingOption.id);
      setConfirmingOption(null);
    }
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

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmingOption} onOpenChange={(open) => !open && setConfirmingOption(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Proposal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to propose <strong>Option {confirmingOption?.id}: {confirmingOption?.name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          {confirmingOption && (
            <div className="my-4 rounded-lg border p-3 text-sm">
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <span className="text-xs text-muted-foreground">Budget</span>
                  <div className={cn(
                    'font-bold',
                    confirmingOption.budgetChange > 0 && 'text-green-600',
                    confirmingOption.budgetChange < 0 && 'text-red-600',
                  )}>
                    {confirmingOption.budgetChange > 0 ? '+' : ''}{confirmingOption.budgetChange}
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-xs text-muted-foreground">Stability</span>
                  <div className={cn(
                    'font-bold',
                    confirmingOption.stabilityChange > 0 && 'text-green-600',
                    confirmingOption.stabilityChange < 0 && 'text-red-600',
                  )}>
                    {confirmingOption.stabilityChange > 0 ? '+' : ''}{confirmingOption.stabilityChange}
                  </div>
                </div>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmPropose}>Propose</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
            {/* More Info Button (FR-017) - visible during deliberation/voting phases */}
            {canShowMoreInfo && hasIdeologyPerspectives && (
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
        {/* Options */}
        <div className="space-y-3">
          {card.options.map((option) => (
            <OptionCard
              key={option.id}
              option={option}
              isSelected={selectedOption === option.id}
              canSelect={canPropose && !selectedOption}
              localPlayerIdeology={localPlayerIdeology}
              onSelect={() => setConfirmingOption(option)}
            />
          ))}
        </div>

        {/* Historical Note */}
        {card.historicalNote && (
          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            <p className="font-medium text-muted-foreground">Historical Context</p>
            <p className="mt-1">{card.historicalNote}</p>
          </div>
        )}
      </CardContent>
    </Card>
    </>
  );
}

interface OptionCardProps {
  option: CardOptionPayload;
  isSelected: boolean;
  canSelect: boolean;
  localPlayerIdeology: Ideology | null;
  onSelect: () => void;
}

function OptionCard({
  option,
  isSelected,
  canSelect,
  localPlayerIdeology,
  onSelect,
}: OptionCardProps) {
  // Check if this option aligns/opposes with local player's ideology
  const alignedEntry = localPlayerIdeology
    ? option.aligned.find(a => a.ideology === localPlayerIdeology)
    : null;
  const opposedEntry = localPlayerIdeology
    ? option.opposed.find(o => o.ideology === localPlayerIdeology)
    : null;

  return (
    <div
      className={cn(
        'rounded-lg border-2 p-4 transition-all',
        isSelected && 'border-primary bg-primary/5',
        canSelect && !isSelected && 'cursor-pointer hover:border-muted-foreground',
        !canSelect && !isSelected && 'opacity-75'
      )}
      onClick={canSelect ? onSelect : undefined}
    >
      {/* Option Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-sm font-medium">
              {option.id}
            </span>
            <span className="font-medium">{option.name}</span>
          </div>
        </div>

        {canSelect && (
          <Button
            size="sm"
            variant={isSelected ? 'default' : 'outline'}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            {isSelected ? 'Selected' : 'Propose'}
          </Button>
        )}

        {isSelected && !canSelect && (
          <span className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">
            Proposed
          </span>
        )}
      </div>

      {/* Effects - Enhanced Tradeoff Display */}
      <div className="mt-3 flex items-center justify-center gap-6 rounded-lg bg-muted/30 py-2">
        {/* Budget Change */}
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase text-muted-foreground">Budget</span>
          <div className={cn(
            'mt-1 flex h-10 w-14 items-center justify-center rounded-lg text-lg font-bold',
            option.budgetChange > 0 && 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
            option.budgetChange < 0 && 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
            option.budgetChange === 0 && 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
          )}>
            {option.budgetChange > 0 ? '+' : ''}{option.budgetChange}
          </div>
        </div>

        {/* Tradeoff Arrow */}
        <div className="text-muted-foreground">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>

        {/* Stability Change */}
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase text-muted-foreground">Stability</span>
          <div className={cn(
            'mt-1 flex h-10 w-14 items-center justify-center rounded-lg text-lg font-bold',
            option.stabilityChange > 0 && 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
            option.stabilityChange < 0 && 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
            option.stabilityChange === 0 && 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
          )}>
            {option.stabilityChange > 0 ? '+' : ''}{option.stabilityChange}
          </div>
        </div>
      </div>

      {/* Ideology Effects */}
      <div className="mt-3 space-y-1">
        {/* Aligned */}
        {option.aligned.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs text-green-600">Favors:</span>
            {option.aligned.map((a) => {
              const def = IDEOLOGY_DEFINITIONS[a.ideology];
              const isLocal = a.ideology === localPlayerIdeology;
              return (
                <span
                  key={a.ideology}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs',
                    isLocal ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-muted'
                  )}
                >
                  {def.icon} +{a.movement}
                  {isLocal && ' (You)'}
                </span>
              );
            })}
          </div>
        )}

        {/* Opposed */}
        {option.opposed.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs text-red-600">Hurts:</span>
            {option.opposed.map((o) => {
              const def = IDEOLOGY_DEFINITIONS[o.ideology];
              const isLocal = o.ideology === localPlayerIdeology;
              return (
                <span
                  key={o.ideology}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs',
                    isLocal ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-muted'
                  )}
                >
                  {def.icon} -{o.movement}
                  {isLocal && ' (You)'}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Personal Impact Summary */}
      {localPlayerIdeology && (alignedEntry || opposedEntry) && (
        <div className={cn(
          'mt-3 rounded p-2 text-center text-sm',
          alignedEntry && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          opposedEntry && 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        )}>
          {alignedEntry && `This option would move you +${alignedEntry.movement} spaces`}
          {opposedEntry && `This option would move you -${opposedEntry.movement} spaces`}
        </div>
      )}
    </div>
  );
}
