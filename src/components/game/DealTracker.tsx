'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
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
import type { TokenStatePayload, PlayerStatePayload } from '@/lib/game/events';

interface DealTrackerProps {
  localPlayerId: string | undefined;
  players: PlayerStatePayload[];
  tokens: TokenStatePayload[];
  canGiveToken: boolean;
  onGiveToken: (targetPlayerId: string) => void;
}

// Draggable token component with animation
function DraggableToken({
  tokenId,
  onDragEnd,
  disabled,
}: {
  tokenId: string;
  onDragEnd: (info: PanInfo) => void;
  disabled: boolean;
}) {
  return (
    <motion.div
      drag={!disabled}
      dragSnapToOrigin
      dragElastic={0.3}
      onDragEnd={(_, info) => onDragEnd(info)}
      whileDrag={{ scale: 1.2, zIndex: 100 }}
      whileHover={!disabled ? { scale: 1.1 } : undefined}
      className={cn(
        'w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-sm cursor-grab active:cursor-grabbing select-none',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      title={disabled ? 'Cannot give tokens now' : 'Drag to a player to give token'}
      layoutId={`token-${tokenId}`}
    >
      🎫
    </motion.div>
  );
}

// Player drop target component
function PlayerDropTarget({
  player,
  isActive,
  onDrop,
}: {
  player: PlayerStatePayload;
  isActive: boolean;
  onDrop: () => void;
}) {
  return (
    <motion.div
      data-player-id={player.id}
      className={cn(
        'px-3 py-2 rounded-lg border-2 border-dashed transition-colors duration-200',
        isActive
          ? 'border-primary bg-primary/10'
          : 'border-muted-foreground/30 bg-muted/30'
      )}
      animate={isActive ? { scale: 1.05 } : { scale: 1 }}
    >
      <span className="text-sm font-medium">{player.name}</span>
    </motion.div>
  );
}

export function DealTracker({
  localPlayerId,
  players,
  tokens,
  canGiveToken,
  onGiveToken,
}: DealTrackerProps) {
  const [confirmingTarget, setConfirmingTarget] = useState<PlayerStatePayload | null>(null);
  const [dragOverPlayer, setDragOverPlayer] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!localPlayerId) return null;

  const localPlayer = players.find(p => p.id === localPlayerId);
  if (!localPlayer) return null;

  // Tokens I own that are still with me
  const myAvailableTokens = tokens.filter(
    t => t.ownerId === localPlayerId && t.heldById === localPlayerId && t.status === 'active'
  );

  // Tokens I've given to others
  const tokensGivenAway = tokens.filter(
    t => t.ownerId === localPlayerId && t.heldById !== localPlayerId
  );

  // Tokens I'm holding from others
  const tokensHeld = tokens.filter(
    t => t.heldById === localPlayerId && t.ownerId !== localPlayerId
  );

  // Other players I can give tokens to
  const otherPlayers = players.filter(p => p.id !== localPlayerId);

  const handleConfirmGive = () => {
    if (confirmingTarget) {
      onGiveToken(confirmingTarget.id);
      setConfirmingTarget(null);
    }
  };

  const getPlayerName = (playerId: string) => {
    return players.find(p => p.id === playerId)?.name || 'Unknown';
  };

  // Handle drag end - detect which player the token was dropped on
  const handleTokenDragEnd = (info: PanInfo) => {
    if (!containerRef.current) return;

    // Find the element at the drop position
    const dropX = info.point.x;
    const dropY = info.point.y;

    // Find player targets
    const playerTargets = containerRef.current.querySelectorAll('[data-player-id]');

    for (const target of playerTargets) {
      const rect = target.getBoundingClientRect();
      if (
        dropX >= rect.left &&
        dropX <= rect.right &&
        dropY >= rect.top &&
        dropY <= rect.bottom
      ) {
        const playerId = target.getAttribute('data-player-id');
        const player = otherPlayers.find(p => p.id === playerId);
        if (player) {
          setConfirmingTarget(player);
        }
        break;
      }
    }

    setDragOverPlayer(null);
  };

  return (
    <>
      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmingTarget} onOpenChange={(open) => !open && setConfirmingTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Give Support Token</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to give a Support Token to <strong>{confirmingTarget?.name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 rounded-lg border p-4 text-sm">
            <p className="mb-2"><strong>What this means:</strong></p>
            <ul className="list-disc pl-4 space-y-1">
              <li>You signal support for this player</li>
              <li>If you vote against their proposals, you <span className="text-red-600">lose 1 Influence</span></li>
              <li>If they break trust with you, they <span className="text-red-600">lose 1 Influence</span> and you <span className="text-green-600">gain 1 Influence</span></li>
            </ul>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmGive}>Give Token</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-xl">🤝</span>
            Support Tokens
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" ref={containerRef}>
          {/* My Available Tokens - Draggable */}
          <div>
            <div className="text-sm text-muted-foreground mb-2">
              Your Tokens {canGiveToken && myAvailableTokens.length > 0 && <span className="text-xs">(drag to give)</span>}
            </div>
            <div className="flex gap-2">
              <AnimatePresence mode="popLayout">
                {myAvailableTokens.length > 0 ? (
                  myAvailableTokens.map((token) => (
                    <DraggableToken
                      key={token.id}
                      tokenId={token.id}
                      onDragEnd={handleTokenDragEnd}
                      disabled={!canGiveToken}
                    />
                  ))
                ) : (
                  <motion.span
                    className="text-sm text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    No tokens available
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Drop Targets - Other Players */}
          {canGiveToken && myAvailableTokens.length > 0 && (
            <div>
              <div className="text-sm text-muted-foreground mb-2">Drop on player to give token</div>
              <div className="flex flex-wrap gap-2">
                {otherPlayers.map((player) => (
                  <PlayerDropTarget
                    key={player.id}
                    player={player}
                    isActive={dragOverPlayer === player.id}
                    onDrop={() => setConfirmingTarget(player)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Fallback Buttons for non-drag interaction */}
          {canGiveToken && myAvailableTokens.length > 0 && (
            <div>
              <div className="text-sm text-muted-foreground mb-2">Or tap to give</div>
              <div className="flex flex-wrap gap-2">
                {otherPlayers.map((player) => (
                  <Button
                    key={player.id}
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmingTarget(player)}
                    className="flex items-center gap-1"
                  >
                    <span>🎫</span>
                    <span>{player.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Tokens Given Away */}
          {tokensGivenAway.length > 0 && (
            <div>
              <div className="text-sm text-muted-foreground mb-2">Tokens Given</div>
              <div className="space-y-1">
                <AnimatePresence mode="popLayout">
                  {tokensGivenAway.map((token) => (
                    <motion.div
                      key={token.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className={cn(
                        'flex items-center gap-2 text-sm p-2 rounded',
                        token.status === 'active' && 'bg-blue-50 dark:bg-blue-900/20',
                        token.status === 'honored' && 'bg-green-50 dark:bg-green-900/20',
                        token.status === 'broken' && 'bg-red-50 dark:bg-red-900/20',
                      )}
                    >
                      <motion.span
                        key={`${token.id}-status`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      >
                        {token.status === 'active' && '🎫'}
                        {token.status === 'honored' && '✅'}
                        {token.status === 'broken' && '💔'}
                      </motion.span>
                      <span>
                        To <strong>{getPlayerName(token.heldById)}</strong>
                      </span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={cn(
                          'text-xs px-1.5 py-0.5 rounded',
                          token.status === 'active' && 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
                          token.status === 'honored' && 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
                          token.status === 'broken' && 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
                        )}
                      >
                        {token.status}
                      </motion.span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Tokens Held From Others */}
          {tokensHeld.length > 0 && (
            <div>
              <div className="text-sm text-muted-foreground mb-2">Tokens Held</div>
              <div className="space-y-1">
                <AnimatePresence mode="popLayout">
                  {tokensHeld.map((token) => (
                    <motion.div
                      key={token.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className={cn(
                        'flex items-center gap-2 text-sm p-2 rounded',
                        token.status === 'active' && 'bg-amber-50 dark:bg-amber-900/20',
                        token.status === 'honored' && 'bg-green-50 dark:bg-green-900/20',
                        token.status === 'broken' && 'bg-red-50 dark:bg-red-900/20',
                      )}
                    >
                      <motion.span
                        key={`${token.id}-held-status`}
                        initial={{ rotate: -180, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      >
                        {token.status === 'active' && '🎫'}
                        {token.status === 'honored' && '✅'}
                        {token.status === 'broken' && '💔'}
                      </motion.span>
                      <span>
                        From <strong>{getPlayerName(token.ownerId)}</strong>
                      </span>
                      {token.status === 'active' && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-muted-foreground"
                        >
                          (They trust you)
                        </motion.span>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Empty State */}
          {tokensGivenAway.length === 0 && tokensHeld.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No deals made yet. Give tokens to signal support for other players.
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
