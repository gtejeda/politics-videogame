'use client';

import { useCallback, useMemo } from 'react';
import type { TokenStatePayload, PlayerStatePayload, GiveTokenMessage } from '../game/events';

interface UseDealsProps {
  localPlayerId: string | undefined;
  players: PlayerStatePayload[];
  tokens: TokenStatePayload[];
  sendMessage: (message: GiveTokenMessage) => void;
}

interface UseDealsReturn {
  // Token counts
  availableTokenCount: number;
  tokensGivenCount: number;
  tokensHeldCount: number;

  // Token details
  availableTokens: TokenStatePayload[];
  tokensGiven: TokenStatePayload[];
  tokensHeld: TokenStatePayload[];

  // Check if player can give token
  canGiveToken: boolean;

  // Give token action
  giveToken: (targetPlayerId: string) => void;

  // Check deal status between players
  hasDealWith: (otherPlayerId: string) => boolean;
  hasReceivedDealFrom: (otherPlayerId: string) => boolean;

  // Get tokens related to a specific player
  getTokensGivenTo: (playerId: string) => TokenStatePayload[];
  getTokensReceivedFrom: (playerId: string) => TokenStatePayload[];
}

export function useDeals({
  localPlayerId,
  players,
  tokens,
  sendMessage,
}: UseDealsProps): UseDealsReturn {
  // Tokens I own that are still with me
  const availableTokens = useMemo(() => {
    if (!localPlayerId) return [];
    return tokens.filter(
      t => t.ownerId === localPlayerId && t.heldById === localPlayerId && t.status === 'active'
    );
  }, [tokens, localPlayerId]);

  // Tokens I've given to others
  const tokensGiven = useMemo(() => {
    if (!localPlayerId) return [];
    return tokens.filter(
      t => t.ownerId === localPlayerId && t.heldById !== localPlayerId
    );
  }, [tokens, localPlayerId]);

  // Tokens I'm holding from others
  const tokensHeld = useMemo(() => {
    if (!localPlayerId) return [];
    return tokens.filter(
      t => t.heldById === localPlayerId && t.ownerId !== localPlayerId
    );
  }, [tokens, localPlayerId]);

  const canGiveToken = useMemo(() => {
    return availableTokens.length > 0;
  }, [availableTokens]);

  const giveToken = useCallback((targetPlayerId: string) => {
    if (!localPlayerId || !canGiveToken) return;

    sendMessage({
      type: 'giveToken',
      playerId: localPlayerId,
      targetPlayerId,
    });
  }, [localPlayerId, canGiveToken, sendMessage]);

  const hasDealWith = useCallback((otherPlayerId: string) => {
    return tokensGiven.some(t => t.heldById === otherPlayerId && t.status === 'active');
  }, [tokensGiven]);

  const hasReceivedDealFrom = useCallback((otherPlayerId: string) => {
    return tokensHeld.some(t => t.ownerId === otherPlayerId && t.status === 'active');
  }, [tokensHeld]);

  const getTokensGivenTo = useCallback((playerId: string) => {
    return tokensGiven.filter(t => t.heldById === playerId);
  }, [tokensGiven]);

  const getTokensReceivedFrom = useCallback((playerId: string) => {
    return tokensHeld.filter(t => t.ownerId === playerId);
  }, [tokensHeld]);

  return {
    availableTokenCount: availableTokens.length,
    tokensGivenCount: tokensGiven.length,
    tokensHeldCount: tokensHeld.length,
    availableTokens,
    tokensGiven,
    tokensHeld,
    canGiveToken,
    giveToken,
    hasDealWith,
    hasReceivedDealFrom,
    getTokensGivenTo,
    getTokensReceivedFrom,
  };
}
