'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TokenStatePayload, PlayerStatePayload } from '@/lib/game/events';
import type { Deal } from '@/lib/game/types';

interface DealsTabProps {
  localPlayerId: string | null;
  players: PlayerStatePayload[];
  tokens: TokenStatePayload[];
  activeDeals?: Deal[];
  dealHistory?: Deal[];
}

// Get player name by ID
function getPlayerName(players: PlayerStatePayload[], playerId: string): string {
  return players.find((p) => p.id === playerId)?.name || 'Unknown';
}

// Token status badge
function TokenStatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        status === 'active' && 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
        status === 'honored' && 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
        status === 'broken' && 'border-red-500 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
      )}
    >
      {status === 'active' && '🎫 Active'}
      {status === 'honored' && '✅ Honored'}
      {status === 'broken' && '💔 Broken'}
    </Badge>
  );
}

// Token card component
function TokenCard({
  token,
  players,
  localPlayerId,
  perspective,
}: {
  token: TokenStatePayload;
  players: PlayerStatePayload[];
  localPlayerId: string | null;
  perspective: 'given' | 'held' | 'other';
}) {
  const ownerName = getPlayerName(players, token.ownerId);
  const holderName = getPlayerName(players, token.heldById);
  const isOwner = token.ownerId === localPlayerId;
  const isHolder = token.heldById === localPlayerId;

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg border p-3',
        token.status === 'active' && 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/30',
        token.status === 'honored' && 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/30',
        token.status === 'broken' && 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/30'
      )}
    >
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {perspective === 'given' && (
            <>
              Given to <strong>{holderName}</strong>
            </>
          )}
          {perspective === 'held' && (
            <>
              From <strong>{ownerName}</strong>
            </>
          )}
          {perspective === 'other' && (
            <>
              <strong>{ownerName}</strong> → <strong>{holderName}</strong>
            </>
          )}
        </span>
        {token.status === 'active' && perspective === 'held' && (
          <span className="text-xs text-muted-foreground">
            They trust you - voting No on their proposals loses influence
          </span>
        )}
        {token.status === 'active' && perspective === 'given' && (
          <span className="text-xs text-muted-foreground">
            If they vote No on your proposal, they lose influence
          </span>
        )}
      </div>
      <TokenStatusBadge status={token.status} />
    </div>
  );
}

/**
 * DealsTab - Shows all deal/token information
 *
 * FR-028: Display active deals, pending requests, and deal history
 */
export function DealsTab({
  localPlayerId,
  players,
  tokens,
  activeDeals = [],
  dealHistory = [],
}: DealsTabProps) {
  // Categorize tokens
  const myGivenTokens = localPlayerId
    ? tokens.filter((t) => t.ownerId === localPlayerId && t.heldById !== localPlayerId)
    : [];

  const myHeldTokens = localPlayerId
    ? tokens.filter((t) => t.heldById === localPlayerId && t.ownerId !== localPlayerId)
    : [];

  const otherDeals = tokens.filter(
    (t) =>
      t.ownerId !== localPlayerId &&
      t.heldById !== localPlayerId &&
      t.ownerId !== t.heldById
  );

  const activeTokenCount = myGivenTokens.filter((t) => t.status === 'active').length +
    myHeldTokens.filter((t) => t.status === 'active').length;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Summary Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Support Token Deals</h2>
        {activeTokenCount > 0 && (
          <Badge variant="secondary">
            {activeTokenCount} Active {activeTokenCount === 1 ? 'Deal' : 'Deals'}
          </Badge>
        )}
      </div>

      {/* How Deals Work - Collapsible info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">How Deals Work</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            <li>Give tokens to signal support for another player</li>
            <li>
              If you hold someone&apos;s token and vote <strong>No</strong> on their proposal:
              <ul className="ml-4 mt-1 list-inside list-disc">
                <li className="text-red-600 dark:text-red-400">You lose 1 Influence</li>
                <li className="text-green-600 dark:text-green-400">They gain 1 Influence</li>
              </ul>
            </li>
            <li>Build trust through consistent behavior</li>
          </ul>
        </CardContent>
      </Card>

      {/* Tokens I've Given */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <span>📤</span>
            Tokens Given
          </CardTitle>
        </CardHeader>
        <CardContent>
          {myGivenTokens.length > 0 ? (
            <div className="space-y-2">
              {myGivenTokens.map((token) => (
                <TokenCard
                  key={token.id}
                  token={token}
                  players={players}
                  localPlayerId={localPlayerId}
                  perspective="given"
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              You haven&apos;t given any tokens yet. Give tokens during negotiation to signal support.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Tokens I'm Holding */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <span>📥</span>
            Tokens Held
          </CardTitle>
        </CardHeader>
        <CardContent>
          {myHeldTokens.length > 0 ? (
            <div className="space-y-2">
              {myHeldTokens.map((token) => (
                <TokenCard
                  key={token.id}
                  token={token}
                  players={players}
                  localPlayerId={localPlayerId}
                  perspective="held"
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No one has given you their tokens yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Other Players' Deals */}
      {otherDeals.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <span>👀</span>
              Other Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {otherDeals.map((token) => (
                <TokenCard
                  key={token.id}
                  token={token}
                  players={players}
                  localPlayerId={localPlayerId}
                  perspective="other"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deal History Summary */}
      {(myGivenTokens.some((t) => t.status !== 'active') ||
        myHeldTokens.some((t) => t.status !== 'active')) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <span>📜</span>
              Deal History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Resolved tokens involving local player */}
              {[...myGivenTokens, ...myHeldTokens]
                .filter((t) => t.status !== 'active')
                .map((token) => {
                  const isOwner = token.ownerId === localPlayerId;
                  return (
                    <div
                      key={token.id}
                      className={cn(
                        'flex items-center justify-between rounded-lg border p-2 text-sm',
                        token.status === 'honored' && 'bg-green-50/30 dark:bg-green-950/20',
                        token.status === 'broken' && 'bg-red-50/30 dark:bg-red-950/20'
                      )}
                    >
                      <span>
                        {isOwner ? (
                          <>
                            Your token to{' '}
                            <strong>{getPlayerName(players, token.heldById)}</strong>
                          </>
                        ) : (
                          <>
                            Token from{' '}
                            <strong>{getPlayerName(players, token.ownerId)}</strong>
                          </>
                        )}
                      </span>
                      <TokenStatusBadge status={token.status} />
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {myGivenTokens.length === 0 && myHeldTokens.length === 0 && otherDeals.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-lg">🤝</p>
            <p className="mt-2 font-medium">No deals yet</p>
            <p className="text-sm text-muted-foreground">
              Give support tokens during the Negotiation Phase to form alliances
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
