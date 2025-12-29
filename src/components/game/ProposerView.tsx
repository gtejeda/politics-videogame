'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import type { Ideology, CardOptionId } from '@/lib/game/types';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';
import { MoreInfoPopup } from './MoreInfoPopup';

interface ProposerViewProps {
  card: DecisionCardPayload;
  localPlayerIdeology: Ideology | null;
  selectedOption: CardOptionId | null;
  onPropose: (optionId: CardOptionId) => void;
  readyPlayerCount: number;
  totalPlayerCount: number;
}

/**
 * ProposerView component for the active player during Review Phase (FR-019).
 * Shows a tabbed interface: Tab 1 = informational content, Tab 2 = vote proposal options.
 */
export function ProposerView({
  card,
  localPlayerIdeology,
  selectedOption,
  onPropose,
  readyPlayerCount,
  totalPlayerCount,
}: ProposerViewProps) {
  const [confirmingOption, setConfirmingOption] = useState<CardOptionPayload | null>(null);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const hasIdeologyPerspectives =
    card.ideologyPerspectives && card.ideologyPerspectives.length > 0;

  const handleConfirmPropose = () => {
    if (confirmingOption) {
      onPropose(confirmingOption.id);
      setConfirmingOption(null);
    }
  };

  const allPlayersReady = readyPlayerCount >= totalPlayerCount - 1; // -1 for proposer
  const waitingCount = totalPlayerCount - 1 - readyPlayerCount;

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
          {!allPlayersReady && (
            <div className="rounded-lg bg-amber-100 p-3 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
              <strong>Note:</strong> {waitingCount} player{waitingCount !== 1 ? 's are' : ' is'} still reviewing.
              You can propose now, but negotiations won&apos;t begin until everyone is ready.
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

        <CardContent>
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">Information</TabsTrigger>
              <TabsTrigger value="options">Propose Option</TabsTrigger>
            </TabsList>

            {/* Tab 1: Information */}
            <TabsContent value="info" className="space-y-4">
              {/* Player Readiness Status */}
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Players Ready</span>
                  <span className={cn(
                    'text-sm font-bold',
                    allPlayersReady ? 'text-green-600' : 'text-amber-600',
                  )}>
                    {readyPlayerCount}/{totalPlayerCount - 1}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      'h-full transition-all',
                      allPlayersReady ? 'bg-green-500' : 'bg-amber-500',
                    )}
                    style={{ width: `${(readyPlayerCount / Math.max(1, totalPlayerCount - 1)) * 100}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {allPlayersReady
                    ? 'All players are ready! Select an option to begin negotiations.'
                    : `Waiting for ${waitingCount} player${waitingCount !== 1 ? 's' : ''} to finish reviewing.`}
                </p>
              </div>

              {/* Options Overview (read-only) */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Options Overview:</h4>
                {card.options.map((option) => {
                  const alignedEntry = localPlayerIdeology
                    ? option.aligned.find(a => a.ideology === localPlayerIdeology)
                    : null;
                  const opposedEntry = localPlayerIdeology
                    ? option.opposed.find(o => o.ideology === localPlayerIdeology)
                    : null;

                  return (
                    <div key={option.id} className="rounded-lg border p-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-sm font-medium">
                          {option.id}
                        </span>
                        <span className="font-medium">{option.name}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-center gap-4 text-sm">
                        <span className={cn(
                          'rounded px-2 py-1',
                          option.budgetChange > 0 && 'bg-green-100 text-green-700',
                          option.budgetChange < 0 && 'bg-red-100 text-red-700',
                          option.budgetChange === 0 && 'bg-gray-100 text-gray-500',
                        )}>
                          Budget: {option.budgetChange > 0 ? '+' : ''}{option.budgetChange}
                        </span>
                        <span className={cn(
                          'rounded px-2 py-1',
                          option.stabilityChange > 0 && 'bg-green-100 text-green-700',
                          option.stabilityChange < 0 && 'bg-red-100 text-red-700',
                          option.stabilityChange === 0 && 'bg-gray-100 text-gray-500',
                        )}>
                          Stability: {option.stabilityChange > 0 ? '+' : ''}{option.stabilityChange}
                        </span>
                      </div>
                      {localPlayerIdeology && (alignedEntry || opposedEntry) && (
                        <div className={cn(
                          'mt-2 rounded p-1 text-center text-xs',
                          alignedEntry && 'bg-green-100/50 text-green-800',
                          opposedEntry && 'bg-red-100/50 text-red-800',
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
            </TabsContent>

            {/* Tab 2: Propose Option */}
            <TabsContent value="options" className="space-y-3">
              {selectedOption ? (
                <div className="rounded-lg border-2 border-green-500 bg-green-50 p-4 text-center dark:bg-green-900/20">
                  <p className="font-medium text-green-800 dark:text-green-200">
                    You proposed Option {selectedOption}
                  </p>
                  <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                    Waiting for all players to be ready to begin negotiations.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Select an option to propose for voting:
                  </p>
                  {card.options.map((option) => (
                    <OptionCard
                      key={option.id}
                      option={option}
                      localPlayerIdeology={localPlayerIdeology}
                      onSelect={() => setConfirmingOption(option)}
                    />
                  ))}
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}

interface OptionCardProps {
  option: CardOptionPayload;
  localPlayerIdeology: Ideology | null;
  onSelect: () => void;
}

function OptionCard({
  option,
  localPlayerIdeology,
  onSelect,
}: OptionCardProps) {
  const alignedEntry = localPlayerIdeology
    ? option.aligned.find(a => a.ideology === localPlayerIdeology)
    : null;
  const opposedEntry = localPlayerIdeology
    ? option.opposed.find(o => o.ideology === localPlayerIdeology)
    : null;

  return (
    <div
      className="cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-primary"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-sm font-medium">
            {option.id}
          </span>
          <span className="font-medium">{option.name}</span>
        </div>
        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onSelect(); }}>
          Propose
        </Button>
      </div>

      {/* Effects */}
      <div className="mt-3 flex items-center justify-center gap-6 rounded-lg bg-muted/30 py-2">
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase text-muted-foreground">Budget</span>
          <div className={cn(
            'mt-1 flex h-10 w-14 items-center justify-center rounded-lg text-lg font-bold',
            option.budgetChange > 0 && 'bg-green-100 text-green-700',
            option.budgetChange < 0 && 'bg-red-100 text-red-700',
            option.budgetChange === 0 && 'bg-gray-100 text-gray-500',
          )}>
            {option.budgetChange > 0 ? '+' : ''}{option.budgetChange}
          </div>
        </div>
        <div className="text-muted-foreground">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase text-muted-foreground">Stability</span>
          <div className={cn(
            'mt-1 flex h-10 w-14 items-center justify-center rounded-lg text-lg font-bold',
            option.stabilityChange > 0 && 'bg-green-100 text-green-700',
            option.stabilityChange < 0 && 'bg-red-100 text-red-700',
            option.stabilityChange === 0 && 'bg-gray-100 text-gray-500',
          )}>
            {option.stabilityChange > 0 ? '+' : ''}{option.stabilityChange}
          </div>
        </div>
      </div>

      {/* Ideology Effects */}
      <div className="mt-3 space-y-1">
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
                    isLocal ? 'bg-green-100 text-green-800' : 'bg-muted'
                  )}
                >
                  {def.icon} +{a.movement}
                  {isLocal && ' (You)'}
                </span>
              );
            })}
          </div>
        )}
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
                    isLocal ? 'bg-red-100 text-red-800' : 'bg-muted'
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
          alignedEntry && 'bg-green-100 text-green-800',
          opposedEntry && 'bg-red-100 text-red-800',
        )}>
          {alignedEntry && `This option would move you +${alignedEntry.movement} spaces`}
          {opposedEntry && `This option would move you -${opposedEntry.movement} spaces`}
        </div>
      )}
    </div>
  );
}
