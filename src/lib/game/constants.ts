/**
 * Game constants and default settings
 * Derived from specs/001-politics-game-core/data-model.md
 */

import type { GameSettings, Ideology } from './types';

// ============================================
// Default Game Settings
// ============================================

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  minPlayers: 3,
  maxPlayers: 5,
  deliberationSeconds: 180, // 3 minutes
  pathLength: 35,
  startingInfluence: 5,
  startingTokens: 3,
  startingStability: 10,
  startingBudget: 8,
};

// ============================================
// Nation State Thresholds
// ============================================

export const NATION_THRESHOLDS = {
  // Collapse conditions
  STABILITY_COLLAPSE: 0,
  BUDGET_COLLAPSE: -5,

  // Movement modifiers
  STABILITY_HIGH: 12,  // All players +1 movement
  STABILITY_LOW: 3,    // All players -1 movement
  BUDGET_HIGH: 12,     // Active player +1 to roll
  BUDGET_LOW: 2,       // Active player -1 to roll

  // Bounds
  STABILITY_MAX: 15,
  STABILITY_MIN: -5,
  BUDGET_MAX: 15,
  BUDGET_MIN: -5,
} as const;

// ============================================
// Influence Thresholds
// ============================================

export const INFLUENCE_THRESHOLDS = {
  HIGH: 8,  // +1 movement
  LOW: 2,   // -1 movement
  VICTORY_REQUIRED: 3,  // Minimum to win
  MAX: 10,
  MIN: 0,
} as const;

// ============================================
// Influence Costs
// ============================================

export const INFLUENCE_COSTS = {
  EXTRA_MOVEMENT: 2,  // Pay 2 Influence for +1 movement
  NEGATE_BACKWARD: 1, // Pay 1 Influence to cancel -1 movement
  EXTRA_VOTE: 1,      // Pay 1 Influence for +1 vote weight
} as const;

// ============================================
// Timing
// ============================================

export const TIMING = {
  DELIBERATION_SECONDS: 180,
  RECONNECTION_WINDOW_MS: 30000, // 30 seconds
  ROOM_CLEANUP_HOURS: 2,
  STATE_SYNC_TARGET_MS: 2000,
  TURN_RESULTS_TIMEOUT_MS: 30000, // 30 seconds before auto-acknowledge
  AFK_TIMEOUT_MS: 60000, // 60 seconds before marked AFK
} as const;

// ============================================
// AFK Settings
// ============================================

export const AFK_SETTINGS = {
  TIMEOUT_MS: 60000,           // Time before player marked AFK (informational only)
  INFLUENCE_PENALTY: 0,        // No penalty - timers are informational only
  AUTO_CONTINUE_DELAY_MS: 30000, // 30s before auto-continue on Turn Results
} as const;

// ============================================
// Board Zones
// ============================================

export const BOARD_ZONES = {
  EARLY_TERM: { start: 0, end: 8 },
  MID_TERM: { start: 9, end: 20 },
  CRISIS_ZONE: { start: 21, end: 27 },
  LATE_TERM: { start: 28, end: 35 },
} as const;

// ============================================
// Ideology Colors
// ============================================

export const IDEOLOGY_COLORS: Record<Ideology, string> = {
  progressive: '#3B82F6', // blue
  conservative: '#EF4444', // red
  liberal: '#F59E0B', // amber
  nationalist: '#10B981', // green
  populist: '#8B5CF6', // purple
};

// ============================================
// Ideology Icons
// ============================================

export const IDEOLOGY_ICONS: Record<Ideology, string> = {
  progressive: '🔷',
  conservative: '🔶',
  liberal: '🟡',
  nationalist: '🟢',
  populist: '🟣',
};

// ============================================
// All Ideologies
// ============================================

export const ALL_IDEOLOGIES: Ideology[] = [
  'progressive',
  'conservative',
  'liberal',
  'nationalist',
  'populist',
];

// ============================================
// Room Code Generation
// ============================================

export const ROOM_CODE_LENGTH = 6;
export const ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusing chars (0,O,1,I)

export function generateRoomCode(): string {
  let code = '';
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    code += ROOM_CODE_CHARS.charAt(Math.floor(Math.random() * ROOM_CODE_CHARS.length));
  }
  return code;
}

// ============================================
// UUID Generation
// ============================================

/**
 * Generate a UUID v4 with fallback for browsers without crypto.randomUUID
 */
function generateUUID(): string {
  // Use crypto.randomUUID if available (modern browsers)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  // Fallback: generate UUID v4 manually
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generatePlayerId(): string {
  return generateUUID();
}

export function generateTokenId(): string {
  return `token_${generateUUID().slice(0, 8)}`;
}

export function generateCardId(zone: string, index: number): string {
  return `${zone}_${index.toString().padStart(3, '0')}`;
}
