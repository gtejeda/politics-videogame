/**
 * Card Deck Index
 * Exports all card decks and provides zone-based deck selection
 */

import type { DecisionCard, Zone } from '../types';
import { SAMPLE_EARLY_TERM_CARDS } from './early-term';
import { MID_TERM_CARDS } from './mid-term';
import { CRISIS_ZONE_CARDS } from './crisis-zone';
import { LATE_TERM_CARDS } from './late-term';

// Re-export all card decks
export { SAMPLE_EARLY_TERM_CARDS, MID_TERM_CARDS, CRISIS_ZONE_CARDS, LATE_TERM_CARDS };

// Combined deck mapping
export const CARD_DECKS: Record<Zone, DecisionCard[]> = {
  earlyTerm: SAMPLE_EARLY_TERM_CARDS,
  midTerm: MID_TERM_CARDS,
  crisisZone: CRISIS_ZONE_CARDS,
  lateTerm: LATE_TERM_CARDS,
};

/**
 * Get all available cards for a specific zone
 */
export function getCardsForZone(zone: Zone): DecisionCard[] {
  return CARD_DECKS[zone] || SAMPLE_EARLY_TERM_CARDS;
}

/**
 * Draw a random card from a zone's deck
 */
export function drawCardFromZone(zone: Zone): DecisionCard {
  const cards = getCardsForZone(zone);
  const randomIndex = Math.floor(Math.random() * cards.length);
  return cards[randomIndex];
}

/**
 * Get the total number of cards available across all zones
 */
export function getTotalCardCount(): number {
  return Object.values(CARD_DECKS).reduce((total, deck) => total + deck.length, 0);
}

/**
 * Get card count by zone
 */
export function getCardCountByZone(): Record<Zone, number> {
  return {
    earlyTerm: SAMPLE_EARLY_TERM_CARDS.length,
    midTerm: MID_TERM_CARDS.length,
    crisisZone: CRISIS_ZONE_CARDS.length,
    lateTerm: LATE_TERM_CARDS.length,
  };
}
