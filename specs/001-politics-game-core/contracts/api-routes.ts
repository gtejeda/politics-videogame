/**
 * Next.js API Routes Contract
 *
 * Defines REST API endpoints for non-realtime operations.
 * Most game logic uses PartyKit WebSockets; these are for auxiliary functions.
 */

// ============================================
// Room Management (optional, can be PartyKit-only)
// ============================================

/**
 * POST /api/rooms
 * Create a new game room
 *
 * Request: CreateRoomRequest
 * Response: CreateRoomResponse
 */
export interface CreateRoomRequest {
  hostName: string;
  hostId?: string; // Optional: reuse existing player ID
}

export interface CreateRoomResponse {
  roomId: string;
  roomUrl: string;
  qrCodeUrl: string;
  hostId: string;
  partyKitHost: string;
}

/**
 * GET /api/rooms/:roomId
 * Check if room exists and get basic info
 *
 * Response: RoomInfoResponse
 */
export interface RoomInfoResponse {
  exists: boolean;
  roomId: string;
  status: 'lobby' | 'playing' | 'finished' | 'collapsed';
  playerCount: number;
  maxPlayers: number;
  canJoin: boolean;
}

// ============================================
// QR Code Generation
// ============================================

/**
 * GET /api/qr/:roomId
 * Generate QR code image for room join link
 *
 * Response: image/png
 */
// No type needed - returns binary image

// ============================================
// Card Deck Management
// ============================================

/**
 * GET /api/cards/:zone
 * Get all cards for a specific zone (for admin/preview)
 *
 * Response: CardDeckResponse
 */
export interface CardDeckResponse {
  zone: 'earlyTerm' | 'midTerm' | 'crisisZone' | 'lateTerm';
  cards: CardPreview[];
}

export interface CardPreview {
  id: string;
  title: string;
  category: string;
  optionCount: number;
}

// ============================================
// Game History / Analytics (Future)
// ============================================

/**
 * POST /api/games/:roomId/complete
 * Record completed game for analytics
 *
 * Request: GameCompleteRequest
 * Response: { success: boolean }
 */
export interface GameCompleteRequest {
  roomId: string;
  outcome: 'victory' | 'collapse';
  winnerId?: string;
  collapseReason?: 'stability' | 'budget';
  turnCount: number;
  playerCount: number;
  durationSeconds: number;
  ideologyDistribution: Record<string, number>;
}

// ============================================
// Health Check
// ============================================

/**
 * GET /api/health
 * Health check for monitoring
 *
 * Response: HealthResponse
 */
export interface HealthResponse {
  status: 'ok' | 'degraded' | 'down';
  timestamp: number;
  version: string;
  partyKitStatus: 'connected' | 'disconnected';
}

// ============================================
// Error Responses
// ============================================

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export type ApiErrorCode =
  | 'ROOM_NOT_FOUND'
  | 'ROOM_FULL'
  | 'GAME_IN_PROGRESS'
  | 'INVALID_REQUEST'
  | 'INTERNAL_ERROR';
