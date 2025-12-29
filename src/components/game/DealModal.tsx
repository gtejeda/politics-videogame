'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { PlayerStatePayload } from '@/lib/game/events';
import type { DealCommitment, DealScope } from '@/lib/game/types';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  localPlayer: PlayerStatePayload;
  targetPlayer: PlayerStatePayload;
  onProposeDeal: (terms: {
    initiatorCommitment: DealCommitment;
    responderCommitment: DealCommitment;
    scope: DealScope;
    scopeValue?: number;
  }) => void;
}

type VoteChoice = 'yes' | 'no';
type CommitmentType = 'vote' | 'token';

/**
 * FR-020: Modal for formalizing tracked deals between players.
 */
export function DealModal({
  isOpen,
  onClose,
  localPlayer,
  targetPlayer,
  onProposeDeal,
}: DealModalProps) {
  // My commitment (initiator)
  const [myCommitmentType, setMyCommitmentType] = useState<CommitmentType>('vote');
  const [myVoteChoice, setMyVoteChoice] = useState<VoteChoice>('yes');

  // Their commitment (responder)
  const [theirCommitmentType, setTheirCommitmentType] = useState<CommitmentType>('vote');
  const [theirVoteChoice, setTheirVoteChoice] = useState<VoteChoice>('yes');

  // Scope
  const [scope, setScope] = useState<DealScope>('this_vote');
  const [scopeTurns, setScopeTurns] = useState(3);

  const handleSubmit = () => {
    const initiatorCommitment: DealCommitment =
      myCommitmentType === 'vote'
        ? { type: 'vote', choice: myVoteChoice }
        : { type: 'token', action: 'give' };

    const responderCommitment: DealCommitment =
      theirCommitmentType === 'vote'
        ? { type: 'vote', choice: theirVoteChoice }
        : { type: 'token', action: 'give' };

    onProposeDeal({
      initiatorCommitment,
      responderCommitment,
      scope,
      scopeValue: scope === 'next_n_turns' ? scopeTurns : undefined,
    });

    onClose();
  };

  const localIdeologyDef = localPlayer.ideology
    ? IDEOLOGY_DEFINITIONS[localPlayer.ideology]
    : null;
  const targetIdeologyDef = targetPlayer.ideology
    ? IDEOLOGY_DEFINITIONS[targetPlayer.ideology]
    : null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <span className="text-2xl">🤝</span>
            Propose a Deal
          </AlertDialogTitle>
          <AlertDialogDescription>
            Create a formal agreement with {targetPlayer.name}. Broken deals result in influence penalties.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Players involved */}
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl mx-auto">
                {localIdeologyDef?.icon || localPlayer.name.charAt(0)}
              </div>
              <p className="mt-1 text-sm font-medium">{localPlayer.name}</p>
              <p className="text-xs text-muted-foreground">(You)</p>
            </div>
            <div className="text-2xl">↔️</div>
            <div className="text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-2xl mx-auto">
                {targetIdeologyDef?.icon || targetPlayer.name.charAt(0)}
              </div>
              <p className="mt-1 text-sm font-medium">{targetPlayer.name}</p>
            </div>
          </div>

          {/* My commitment */}
          <Card>
            <CardContent className="pt-4">
              <h4 className="mb-2 font-medium">I will...</h4>
              <div className="flex gap-2 mb-3">
                <Button
                  variant={myCommitmentType === 'vote' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMyCommitmentType('vote')}
                >
                  Vote
                </Button>
                <Button
                  variant={myCommitmentType === 'token' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMyCommitmentType('token')}
                >
                  Give Token
                </Button>
              </div>

              {myCommitmentType === 'vote' && (
                <div className="flex gap-2">
                  <Button
                    variant={myVoteChoice === 'yes' ? 'default' : 'outline'}
                    size="sm"
                    className={myVoteChoice === 'yes' ? 'bg-green-600 hover:bg-green-700' : ''}
                    onClick={() => setMyVoteChoice('yes')}
                  >
                    Vote YES
                  </Button>
                  <Button
                    variant={myVoteChoice === 'no' ? 'default' : 'outline'}
                    size="sm"
                    className={myVoteChoice === 'no' ? 'bg-red-600 hover:bg-red-700' : ''}
                    onClick={() => setMyVoteChoice('no')}
                  >
                    Vote NO
                  </Button>
                </div>
              )}

              {myCommitmentType === 'token' && (
                <p className="text-sm text-muted-foreground">
                  You will give one of your Support Tokens to {targetPlayer.name}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Their commitment */}
          <Card>
            <CardContent className="pt-4">
              <h4 className="mb-2 font-medium">{targetPlayer.name} will...</h4>
              <div className="flex gap-2 mb-3">
                <Button
                  variant={theirCommitmentType === 'vote' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheirCommitmentType('vote')}
                >
                  Vote
                </Button>
                <Button
                  variant={theirCommitmentType === 'token' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheirCommitmentType('token')}
                >
                  Give Token
                </Button>
              </div>

              {theirCommitmentType === 'vote' && (
                <div className="flex gap-2">
                  <Button
                    variant={theirVoteChoice === 'yes' ? 'default' : 'outline'}
                    size="sm"
                    className={theirVoteChoice === 'yes' ? 'bg-green-600 hover:bg-green-700' : ''}
                    onClick={() => setTheirVoteChoice('yes')}
                  >
                    Vote YES
                  </Button>
                  <Button
                    variant={theirVoteChoice === 'no' ? 'default' : 'outline'}
                    size="sm"
                    className={theirVoteChoice === 'no' ? 'bg-red-600 hover:bg-red-700' : ''}
                    onClick={() => setTheirVoteChoice('no')}
                  >
                    Vote NO
                  </Button>
                </div>
              )}

              {theirCommitmentType === 'token' && (
                <p className="text-sm text-muted-foreground">
                  {targetPlayer.name} will give you one of their Support Tokens
                </p>
              )}
            </CardContent>
          </Card>

          {/* Scope */}
          <Card>
            <CardContent className="pt-4">
              <h4 className="mb-2 font-medium">Duration</h4>
              <div className="flex gap-2">
                <Button
                  variant={scope === 'this_vote' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setScope('this_vote')}
                >
                  This vote only
                </Button>
                <Button
                  variant={scope === 'next_n_turns' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setScope('next_n_turns')}
                >
                  Multiple turns
                </Button>
              </div>

              {scope === 'next_n_turns' && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm">For the next</span>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={scopeTurns}
                    onChange={(e) => setScopeTurns(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                    className="w-16 rounded border px-2 py-1 text-center"
                  />
                  <span className="text-sm">turns</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Warning */}
          <div className="rounded-lg bg-amber-100 p-3 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
            <strong>Note:</strong> This deal will be visible to ALL players. If either party breaks the deal,
            they lose 2 Influence and the other party gains 1 Influence.
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>
            Propose Deal
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
