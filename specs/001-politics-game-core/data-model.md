# Data Model: The Political Path

**Feature**: 001-politics-game-core
**Date**: 2025-12-27
**Updated**: 2025-12-28 (Added Deal entity, Phase tracking, Timer modes)

## Entity Relationship Overview

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  GameRoom   │───1:N─│   Player    │───1:N─│ SupportToken│
└─────────────┘       └─────────────┘       └─────────────┘
       │                     │
       │1                    │N
       │                     │
       ▼                     ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│ NationState │       │    Vote     │       │    Deal     │
└─────────────┘       └─────────────┘       └─────────────┘
       │                                          │
       │1:N                                       │2 (parties)
       ▼                                          ▼
┌─────────────┐                            ┌─────────────┐
│DecisionCard │                            │   Player    │
└─────────────┘                            └─────────────┘
```

---

## Core Entities

### GameRoom

The root entity representing a single game session.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | Unique room identifier (6 char code) | `/^[A-Z0-9]{6}$/` |
| status | RoomStatus | Current room state | enum |
| createdAt | timestamp | Room creation time | auto |
| hostPlayerId | string | Player who created the room | required |
| settings | GameSettings | Configurable game options | default values |
| currentTurn | number | Turn counter (1-based) | ≥1 |
| activePlayerId | string \| null | Player whose turn it is | null in lobby |
| currentCard | DecisionCard \| null | Active decision being voted on | null between turns |
| pendingVotes | Map<PlayerId, Vote> | Votes before reveal | cleared after resolve |
| currentProposal | CardOption \| null | Selected option for voting | A, B, or C |
| phase | GamePhase | Current turn phase | enum |
| subPhase | SubPhase \| null | Sub-phase for two-phase voting (FR-019) | enum |
| diceRoll | number \| null | Active player's roll | 1-6 or null |
| timerStartedAt | timestamp \| null | When current phase timer started | null outside timed phases |
| recommendedDuration | number \| null | Recommended time in seconds (FR-021) | null outside timed phases |
| readyToNegotiate | Set\<PlayerId\> | Players who marked ready in Review Phase | cleared after voting |
| activeDeals | Deal[] | Currently active deals (FR-020) | cleared after scope expires |
| dealHistory | Deal[] | All deals (for post-game review) | append-only |
| showAdvancement | boolean | Whether card advancement is revealed (FR-018) | false until all votes cast |

**RoomStatus enum**: `lobby` | `playing` | `collapsed` | `finished`

**GamePhase enum**: `waiting` | `rolling` | `drawing` | `reviewing` | `deliberating` | `voting` | `revealing` | `resolving` | `showingResults`

**SubPhase enum** (for FR-019 two-phase voting):
- `reviewPhase`: Non-proposers reviewing info, proposer selecting option
- `negotiationPhase`: All ready, 3-min timer, deal-making enabled

**GameSettings**:
| Field | Type | Default |
|-------|------|---------|
| minPlayers | number | 3 |
| maxPlayers | number | 5 |
| deliberationSeconds | number | 180 (3 min) |
| pathLength | number | 35 |
| startingInfluence | number | 5 |
| startingTokens | number | 3 |
| startingStability | number | 10 |
| startingBudget | number | 8 |

---

### Player

A participant in a game room.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | Unique player ID (UUID) | auto |
| name | string | Display name | 1-20 chars |
| ideology | Ideology | Chosen political ideology | required after lobby |
| position | number | Current space on path (0 = start) | 0 to pathLength |
| influence | number | Political capital resource | 0-10 |
| ownTokens | number | Support tokens player owns (in hand) | 0-3 |
| isConnected | boolean | WebSocket connection status | auto |
| lastSeen | timestamp | Last activity timestamp | auto |

**Ideology enum**: `progressive` | `conservative` | `liberal` | `nationalist` | `populist`

**Ideology Metadata** (static, not stored per player):
| Ideology | Color | Icon | Core Concern |
|----------|-------|------|--------------|
| progressive | #3B82F6 (blue) | 🔷 | Social reform, equality |
| conservative | #EF4444 (red) | 🔶 | Stability, tradition |
| liberal | #F59E0B (amber) | 🟡 | Markets, liberty |
| nationalist | #10B981 (green) | 🟢 | Sovereignty, security |
| populist | #8B5CF6 (purple) | 🟣 | Anti-establishment |

---

### SupportToken

Tracks deal-making promises between players.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | Unique token ID | auto |
| ownerId | string | Player who originally owned token | required |
| heldById | string | Player currently holding token | required |
| givenAt | timestamp | When token was transferred | auto |
| status | TokenStatus | Whether token has been used/broken | enum |

**TokenStatus enum**: `active` | `honored` | `broken`

**Rules**:
- When `heldById !== ownerId`, holder expects owner to vote Yes on their next proposal
- If owner votes No while holder has their token: token becomes `broken`, holder keeps it, owner loses 1 Influence, holder gains 1 Influence
- If owner votes Yes: token becomes `honored`, returned to owner

---

### NationState

Shared game state representing the nation's health.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| stability | number | Political/social stability | -5 to 15 |
| budget | number | Fiscal resources | -5 to 15 |

**Collapse Conditions**:
- `stability <= 0`: All players lose
- `budget <= -5`: All players lose

**Movement Modifiers** (derived, not stored):
| Condition | Effect |
|-----------|--------|
| stability >= 12 | All players +1 movement |
| stability <= 3 | All players -1 movement |
| budget >= 12 | Active player +1 to roll |
| budget <= 2 | Active player -1 to roll |

---

### DecisionCard

A political decision presented to players.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | Unique card ID | required |
| zone | Zone | Which game phase this card belongs to | enum |
| category | Category | Type of political issue | enum |
| title | string | Card headline | 1-50 chars |
| description | string | Situation description | 1-200 chars |
| options | CardOption[] | 2-3 choices | length 2-3 |
| historicalNote | string \| null | Educational context | optional |

**Zone enum**: `earlyTerm` | `midTerm` | `crisisZone` | `lateTerm`

**Category enum**: `economic` | `social` | `security` | `institutional` | `crisis`

**CardOption**:
| Field | Type | Description |
|-------|------|-------------|
| id | 'A' \| 'B' \| 'C' | Option identifier |
| name | string | Option title |
| budgetChange | number | Effect on nation budget |
| stabilityChange | number | Effect on nation stability |
| aligned | IdeologyBonus[] | Ideologies that benefit |
| opposed | IdeologyPenalty[] | Ideologies that suffer |

**IdeologyBonus**: `{ ideology: Ideology, movement: number }` (movement: 1-3)
**IdeologyPenalty**: `{ ideology: Ideology, movement: number }` (movement: 1-2)

---

### Vote

A player's vote on a decision.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| playerId | string | Who cast this vote | required |
| choice | VoteChoice | Yes, No, or Abstain | enum |
| influenceSpent | number | Extra vote weight purchased | 0-current influence |
| timestamp | timestamp | When vote was cast | auto |

**VoteChoice enum**: `yes` | `no` | `abstain`

**Vote Weight Calculation**:
- Base: 1 vote
- + `influenceSpent` (1 Influence = +1 vote)
- Majority: `totalYes > totalNo`

---

### Deal (FR-020)

A formalized, tracked agreement between two players made during Deliberation Phase.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | Unique deal ID | auto (UUID) |
| initiatorId | string | Player who proposed the deal | required |
| responderId | string | Player who was offered the deal | required |
| terms | DealTerms | What each party commits to | required |
| scope | DealScope | When the deal applies | enum |
| scopeValue | number \| null | Number of turns if scope is 'next_n_turns' | 1-5 |
| status | DealStatus | Current deal state | enum |
| createdAt | timestamp | When deal was created | auto |
| resolvedAt | timestamp \| null | When deal was fulfilled/broken | auto |

**DealScope enum**: `this_vote` | `next_n_turns`

**DealStatus enum**: `pending` | `active` | `fulfilled` | `broken`

**DealTerms**:
| Field | Type | Description |
|-------|------|-------------|
| initiatorCommitment | DealCommitment | What initiator promises |
| responderCommitment | DealCommitment | What responder promises |

**DealCommitment**:
```typescript
type DealCommitment =
  | { type: 'vote'; choice: 'yes' | 'no' }
  | { type: 'token'; action: 'give' | 'receive' };
```

**Breach Detection Rules**:
- After voting phase, system checks active deals scoped to `this_vote`
- If a player's vote contradicts their commitment: deal is `broken`
- Breach penalty: Breaker loses 2 Influence, other party gains 1 Influence
- Breach is publicly announced to all players

---

### PlayerStatus (FR-022)

Tracks individual player's readiness within a phase.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| playerId | string | Which player | required |
| phase | GamePhase | Which phase this status applies to | current phase |
| status | StatusType | Current activity state | enum |
| updatedAt | timestamp | Last status change | auto |

**StatusType enum**:
- `ready`: Player has completed their action for this phase
- `waiting`: Player has not yet acted
- `acting`: Player is actively engaged (e.g., in Deal modal, reviewing tabs)

**UI Representation**:
| Status | Icon | Color |
|--------|------|-------|
| ready | ✓ checkmark | green |
| waiting | ⏳ hourglass | gray |
| acting | … ellipsis | amber |

---

## Derived/Computed State

### PlayerMovement (computed per turn resolution)

| Source | Condition | Movement |
|--------|-----------|----------|
| Active player turn | Majority vote passes | +diceRoll |
| Ideology aligned (✓) | Decision favors your ideology | +aligned.movement |
| Ideology opposed (✗) | Decision hurts your ideology | -opposed.movement |
| High Influence | influence >= 8 | +1 |
| Low Influence | influence <= 2 | -1 |
| Nation stable | stability >= 12 | +1 |
| Nation in crisis | stability <= 3 | -1 |
| Spend Influence | Pay 2 Influence | +1 |
| Negate penalty | Pay 1 Influence when opposed | cancel -1 |

### VictoryCheck (computed after each resolution)

```typescript
function checkVictory(player: Player, settings: GameSettings): VictoryResult {
  if (player.position >= settings.pathLength) {
    if (player.influence >= 3) {
      return { type: 'win', player: player.id };
    } else {
      // Stop one space before end, must wait
      player.position = settings.pathLength - 1;
      return { type: 'waiting' };
    }
  }
  return { type: 'ongoing' };
}
```

### CollapseCheck (computed after each resolution)

```typescript
function checkCollapse(nation: NationState): CollapseResult {
  if (nation.stability <= 0) {
    return { collapsed: true, reason: 'stability' };
  }
  if (nation.budget <= -5) {
    return { collapsed: true, reason: 'budget' };
  }
  return { collapsed: false };
}
```

---

## State Transitions

### Game Lifecycle

```
lobby → playing → finished
           ↓
       collapsed
```

### Turn Lifecycle (Updated for FR-019 Two-Phase Voting)

```
waiting → rolling → drawing → reviewing ─────────────────┐
    ↑                            │                       │
    │                    [proposer selects option]       │
    │                    [non-proposers mark ready]      │
    │                            │                       │
    │                            ▼                       │
    │                      deliberating ◄────────────────┘
    │                            │           [all ready]
    │                    [3-min guidance timer]
    │                    [deals can be made]
    │                            │
    │                            ▼
    │                        voting
    │                            │
    │                    [all votes cast]
    │                            │
    │                            ▼
    │                       revealing ──→ [show advancement - FR-018]
    │                            │
    │                            ▼
    │                       resolving ──→ [check deal breaches - FR-020]
    │                            │
    │                            ▼
    │                    showingResults
    │                            │
    │                    [all players acknowledge]
    │                            │
    └────────────────────────────┘
```

### Timer Behavior (FR-021)

```
                    ┌─────────────────────────────────────────────────┐
                    │              GUIDANCE TIMER                     │
                    │                                                 │
                    │  [Countdown Phase]                              │
                    │  "2:45 remaining"                               │
                    │  Normal display                                 │
                    │                                                 │
                    │         │ timer reaches 0                       │
                    │         ▼                                       │
                    │                                                 │
                    │  [Overtime Phase]                               │
                    │  "Overtime +0:15"                               │
                    │  Pulsing border, amber color                    │
                    │  Waiting players' avatars pulse                 │
                    │                                                 │
                    │  ─── NO AUTO-ADVANCE ───                        │
                    │  Phase advances ONLY when all players ready     │
                    │                                                 │
                    └─────────────────────────────────────────────────┘
```

### Phase Sub-States (FR-019)

**Review Phase (reviewPhase)**:
- Entry: Card drawn after dice roll
- Proposer: Sees tabbed UI (Info tab + Options tab)
- Non-proposers: See info-only view + "Ready to Negotiate" button
- Exit: All players ready (proposer selected option, non-proposers marked ready)

**Negotiation Phase (negotiationPhase)**:
- Entry: All players ready from Review Phase
- All players: See Deal button, Vote button (Yes/No/Abstain)
- Timer: 3-minute guidance timer starts
- Exit: All players have cast votes

---

## Data Storage Strategy

### PartyKit Room State (Server)

```typescript
interface RoomState {
  room: GameRoom;
  players: Map<string, Player>;
  tokens: SupportToken[];
  nation: NationState;
  cardDeck: {
    earlyTerm: DecisionCard[];
    midTerm: DecisionCard[];
    crisisZone: DecisionCard[];
    lateTerm: DecisionCard[];
  };
  history: TurnHistory[]; // For post-game summary

  // New fields for FR-018, FR-019, FR-020, FR-021, FR-022
  subPhase: SubPhase | null;
  readyToNegotiate: Set<string>;      // FR-019: Players ready in Review Phase
  activeDeals: Deal[];                 // FR-020: Currently active deals
  dealHistory: Deal[];                 // FR-020: All deals for post-game
  showAdvancement: boolean;            // FR-018: Card advancement revealed
  timerStartedAt: number | null;       // FR-021: Guidance timer start
  recommendedDuration: number | null;  // FR-021: Recommended seconds
  playerStatuses: Map<string, PlayerStatus>; // FR-022: Phase readiness
}
```

### Client Local Storage

```typescript
interface LocalPlayerState {
  playerId: string;          // Persistent player ID
  displayName: string;       // Last used name
  lastRoomId: string | null; // For reconnection
  preferences: {
    reducedMotion: boolean;
    soundEnabled: boolean;
  };
}
```

---

## Validation Rules Summary

| Entity | Rule | Error |
|--------|------|-------|
| GameRoom | 3-5 players to start | "Need 3-5 players" |
| Player | Unique ideology per room | "Ideology already taken" |
| Vote | Can only vote during deliberating phase (negotiationPhase) | "Not in voting phase" |
| Vote | influenceSpent <= player.influence | "Insufficient influence" |
| SupportToken | Can only give own tokens | "Not your token" |
| Movement | position >= 0 | Floor at 0 |
| NationState | stability/budget within bounds | Collapse or cap |
| Deal | Can only propose during negotiationPhase | "Not in deliberation phase" |
| Deal | Both parties must be in same room | "Player not found" |
| Deal | Cannot make deal with self | "Cannot make deal with yourself" |
| Deal | Max 1 active deal per player pair per vote | "Deal already exists" |
| ReadyToNegotiate | Can only mark ready during reviewPhase | "Not in review phase" |
| ReadyToNegotiate | Non-proposer only | "Proposer uses option selection" |
| ProposeOption | Can only propose during reviewPhase | "Not in review phase" |
| ProposeOption | Active player only | "Not your turn" |
