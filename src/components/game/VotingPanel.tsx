'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import type { DecisionCardPayload, PlayerStatePayload } from '@/lib/game/events';
import type { CardOptionId, VoteChoice } from '@/lib/game/types';

// Swipe threshold for triggering vote selection
const SWIPE_THRESHOLD = 100;

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
  const [confirmingChoice, setConfirmingChoice] = useState<VoteChoice | null>(null);
  const [swipeIndicator, setSwipeIndicator] = useState<'yes' | 'no' | null>(null);
  const constraintsRef = useRef(null);

  // Motion values for swipe gesture
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
    ['rgba(239, 68, 68, 0.3)', 'rgba(0, 0, 0, 0)', 'rgba(34, 197, 94, 0.3)']
  );
  const leftOpacity = useTransform(x, [-SWIPE_THRESHOLD, -30, 0], [1, 0.5, 0]);
  const rightOpacity = useTransform(x, [0, 30, SWIPE_THRESHOLD], [0, 0.5, 1]);

  const proposedOption = card?.options.find(o => o.id === currentProposal);
  const maxInfluence = localPlayer?.influence || 0;

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (hasVoted || phase !== 'voting') return;

    if (info.offset.x > SWIPE_THRESHOLD) {
      handleVoteClick('yes');
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      handleVoteClick('no');
    }
    setSwipeIndicator(null);
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (hasVoted) return;

    if (info.offset.x > SWIPE_THRESHOLD * 0.5) {
      setSwipeIndicator('yes');
    } else if (info.offset.x < -SWIPE_THRESHOLD * 0.5) {
      setSwipeIndicator('no');
    } else {
      setSwipeIndicator(null);
    }
  };

  const handleVoteClick = (choice: VoteChoice) => {
    if (hasVoted || phase !== 'voting') return;
    setConfirmingChoice(choice);
  };

  const handleConfirmVote = () => {
    if (!confirmingChoice || hasVoted) return;

    setSelectedChoice(confirmingChoice);
    setHasVoted(true);
    onVote(confirmingChoice, influenceToSpend);
    setConfirmingChoice(null);
  };

  const getVoteLabel = (choice: VoteChoice) => {
    switch (choice) {
      case 'yes': return 'Yes (Approve)';
      case 'no': return 'No (Reject)';
      case 'abstain': return 'Abstain';
    }
  };

  const getVoteDescription = (choice: VoteChoice) => {
    switch (choice) {
      case 'yes': return 'Vote in favor of implementing this policy.';
      case 'no': return 'Vote against implementing this policy.';
      case 'abstain': return 'Neither approve nor reject - your vote won\'t count toward the result.';
    }
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
    <>
      {/* Vote Confirmation Dialog */}
      <AlertDialog open={!!confirmingChoice} onOpenChange={(open) => !open && setConfirmingChoice(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmingChoice && getVoteDescription(confirmingChoice)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 rounded-lg border p-4">
            <div className="text-center">
              <span className={cn(
                'text-2xl font-bold',
                confirmingChoice === 'yes' && 'text-green-600',
                confirmingChoice === 'no' && 'text-red-600',
                confirmingChoice === 'abstain' && 'text-gray-500',
              )}>
                {confirmingChoice && getVoteLabel(confirmingChoice)}
              </span>
              {influenceToSpend > 0 && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Spending {influenceToSpend} Influence for +{influenceToSpend} vote weight
                </p>
              )}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmVote}>
              Confirm Vote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Vote on: Option {currentProposal} - {proposedOption?.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Voting with Swipe Gesture */}
          {!hasVoted ? (
            <>
              {/* Swipe instruction */}
              <div className="text-center text-sm text-muted-foreground mb-2 md:hidden">
                Swipe right for Yes, left for No
              </div>

              {/* Swipeable Vote Card (mobile) */}
              <div ref={constraintsRef} className="relative overflow-hidden rounded-lg md:hidden">
                {/* Background indicators */}
                <motion.div
                  style={{ opacity: leftOpacity }}
                  className="absolute inset-y-0 left-0 w-1/3 flex items-center justify-center bg-red-500/20"
                >
                  <span className="text-2xl font-bold text-red-600">NO</span>
                </motion.div>
                <motion.div
                  style={{ opacity: rightOpacity }}
                  className="absolute inset-y-0 right-0 w-1/3 flex items-center justify-center bg-green-500/20"
                >
                  <span className="text-2xl font-bold text-green-600">YES</span>
                </motion.div>

                {/* Draggable card */}
                <motion.div
                  drag="x"
                  dragConstraints={{ left: -150, right: 150 }}
                  dragElastic={0.2}
                  onDrag={handleDrag}
                  onDragEnd={handleDragEnd}
                  style={{ x, background }}
                  className={cn(
                    'relative z-10 rounded-lg border-2 bg-card p-6 cursor-grab active:cursor-grabbing',
                    swipeIndicator === 'yes' && 'border-green-500',
                    swipeIndicator === 'no' && 'border-red-500',
                    !swipeIndicator && 'border-border'
                  )}
                >
                  <div className="text-center space-y-2">
                    <div className="text-xl font-semibold">
                      {swipeIndicator === 'yes' && <span className="text-green-600">Vote YES</span>}
                      {swipeIndicator === 'no' && <span className="text-red-600">Vote NO</span>}
                      {!swipeIndicator && 'Swipe to Vote'}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {proposedOption?.name || 'Current Proposal'}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Standard Voting Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleVoteClick('yes')}
                  className="vote-button vote-button-yes"
                >
                  <div className="text-2xl">Yes</div>
                  <div className="text-xs text-muted-foreground">Approve</div>
                </button>

                <button
                  onClick={() => handleVoteClick('no')}
                  className="vote-button vote-button-no"
                >
                  <div className="text-2xl">No</div>
                  <div className="text-xs text-muted-foreground">Reject</div>
                </button>

                <button
                  onClick={() => handleVoteClick('abstain')}
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
    </>
  );
}
