'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DecisionCardPayload, PlayerStatePayload } from '@/lib/game/events';
import type { CardOptionId, VoteChoice } from '@/lib/game/types';

interface VotingPanelProps {
  phase: 'voting' | 'revealing';
  currentProposal: CardOptionId;
  card: DecisionCardPayload | null;
  localPlayer: PlayerStatePayload | undefined;
  onVote: (choice: VoteChoice, influenceSpent?: number) => void;
}

export function VotingPanel({
  phase,
  currentProposal,
  card,
  localPlayer,
  onVote,
}: VotingPanelProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<VoteChoice | null>(null);
  const [influenceToSpend, setInfluenceToSpend] = useState(0);

  const proposedOption = card?.options.find(o => o.id === currentProposal);
  const maxInfluence = localPlayer?.influence || 0;

  const handleVote = (choice: VoteChoice) => {
    if (hasVoted || phase !== 'voting') return;

    setSelectedChoice(choice);
    setHasVoted(true);
    onVote(choice, influenceToSpend);
  };

  if (phase === 'revealing') {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-pulse text-lg">Revealing votes...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Vote on: Option {currentProposal} - {proposedOption?.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Voting Buttons */}
        {!hasVoted ? (
          <>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleVote('yes')}
                className="vote-button vote-button-yes"
              >
                <div className="text-2xl">Yes</div>
                <div className="text-xs text-muted-foreground">Approve</div>
              </button>

              <button
                onClick={() => handleVote('no')}
                className="vote-button vote-button-no"
              >
                <div className="text-2xl">No</div>
                <div className="text-xs text-muted-foreground">Reject</div>
              </button>

              <button
                onClick={() => handleVote('abstain')}
                className="vote-button vote-button-abstain"
              >
                <div className="text-2xl">-</div>
                <div className="text-xs text-muted-foreground">Abstain</div>
              </button>
            </div>

            {/* Influence Spending */}
            {maxInfluence > 0 && (
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Spend Influence for extra votes:</span>
                  <span className="text-sm text-muted-foreground">
                    Available: {maxInfluence}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInfluenceToSpend(Math.max(0, influenceToSpend - 1))}
                    disabled={influenceToSpend <= 0}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center text-xl font-bold">
                    {influenceToSpend}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInfluenceToSpend(Math.min(maxInfluence, influenceToSpend + 1))}
                    disabled={influenceToSpend >= maxInfluence}
                  >
                    +
                  </Button>
                </div>
                {influenceToSpend > 0 && (
                  <p className="mt-2 text-center text-sm text-muted-foreground">
                    +{influenceToSpend} vote weight (costs {influenceToSpend} Influence)
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="py-4 text-center">
            <div className="text-lg font-medium">
              Vote cast:{' '}
              <span className={cn(
                selectedChoice === 'yes' && 'text-green-600',
                selectedChoice === 'no' && 'text-red-600',
                selectedChoice === 'abstain' && 'text-gray-500',
              )}>
                {selectedChoice === 'yes' && 'Yes'}
                {selectedChoice === 'no' && 'No'}
                {selectedChoice === 'abstain' && 'Abstain'}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Waiting for other players to vote...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
