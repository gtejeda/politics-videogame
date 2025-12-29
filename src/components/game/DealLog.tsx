'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { DealPayload, PlayerStatePayload } from '@/lib/game/events';
import type { DealStatus } from '@/lib/game/types';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';

interface DealLogProps {
  deals: DealPayload[];
  players: PlayerStatePayload[];
  localPlayerId: string | null;
}

const STATUS_STYLES: Record<DealStatus, { bg: string; text: string; icon: string; label: string }> = {
  pending: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-300',
    icon: '⏳',
    label: 'Pending',
  },
  active: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    icon: '🤝',
    label: 'Active',
  },
  fulfilled: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
    icon: '✅',
    label: 'Fulfilled',
  },
  broken: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
    icon: '💔',
    label: 'Broken',
  },
};

/**
 * FR-020: DealLog component showing all deals (active, fulfilled, broken).
 * Visible to ALL players for transparency.
 */
export function DealLog({ deals, players, localPlayerId }: DealLogProps) {
  const getPlayerById = (id: string) => players.find(p => p.id === id);

  const formatCommitment = (
    commitment: DealPayload['terms']['initiatorCommitment'],
    playerName: string
  ): string => {
    if (commitment.type === 'vote') {
      return `${playerName} votes ${commitment.choice.toUpperCase()}`;
    }
    return `${playerName} gives a token`;
  };

  const formatScope = (deal: DealPayload): string => {
    if (deal.scope === 'this_vote') {
      return 'This vote';
    }
    return `Next ${deal.scopeValue || 1} turn${(deal.scopeValue || 1) > 1 ? 's' : ''}`;
  };

  // Sort deals: active first, then pending, then by creation time
  const sortedDeals = [...deals].sort((a, b) => {
    const statusOrder: Record<DealStatus, number> = {
      active: 0,
      pending: 1,
      fulfilled: 2,
      broken: 3,
    };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return b.createdAt - a.createdAt;
  });

  if (sortedDeals.length === 0) {
    return (
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <span>📋</span>
            Deal Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground py-4">
            No deals have been made yet.
          </p>
          <p className="text-center text-xs text-muted-foreground">
            Propose deals during the Negotiation phase!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span>📋</span>
            Deal Log
          </div>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-normal">
            {sortedDeals.length} deal{sortedDeals.length !== 1 ? 's' : ''}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-64 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {sortedDeals.map((deal) => {
            const initiator = getPlayerById(deal.initiatorId);
            const responder = getPlayerById(deal.responderId);
            const statusStyle = STATUS_STYLES[deal.status];
            const isLocalInvolved =
              deal.initiatorId === localPlayerId || deal.responderId === localPlayerId;

            const initiatorIdeology = initiator?.ideology
              ? IDEOLOGY_DEFINITIONS[initiator.ideology]
              : null;
            const responderIdeology = responder?.ideology
              ? IDEOLOGY_DEFINITIONS[responder.ideology]
              : null;

            return (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={cn(
                  'rounded-lg border p-3',
                  isLocalInvolved && 'ring-2 ring-primary/50',
                  statusStyle.bg
                )}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{statusStyle.icon}</span>
                    <span className={cn('text-xs font-medium', statusStyle.text)}>
                      {statusStyle.label}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatScope(deal)}
                  </span>
                </div>

                {/* Parties */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex items-center gap-1">
                    {initiatorIdeology?.icon || '👤'}
                    <span className={deal.initiatorId === localPlayerId ? 'font-bold' : ''}>
                      {initiator?.name || 'Unknown'}
                    </span>
                  </span>
                  <span className="text-muted-foreground">↔</span>
                  <span className="flex items-center gap-1">
                    {responderIdeology?.icon || '👤'}
                    <span className={deal.responderId === localPlayerId ? 'font-bold' : ''}>
                      {responder?.name || 'Unknown'}
                    </span>
                  </span>
                </div>

                {/* Terms */}
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span>•</span>
                    <span>
                      {formatCommitment(deal.terms.initiatorCommitment, initiator?.name || 'Unknown')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>•</span>
                    <span>
                      {formatCommitment(deal.terms.responderCommitment, responder?.name || 'Unknown')}
                    </span>
                  </div>
                </div>

                {/* Broken deal warning */}
                {deal.status === 'broken' && (
                  <div className="mt-2 rounded bg-red-200 px-2 py-1 text-xs text-red-800 dark:bg-red-900/50 dark:text-red-200">
                    Breaker: -2 Influence | Victim: +1 Influence
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
