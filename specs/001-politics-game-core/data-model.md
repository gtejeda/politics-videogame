# Data Model: The Political Path

**Feature**: 001-politics-game-core
**Date**: 2025-12-27

## Entity Relationship Overview

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  GameRoom   │───1:N─│   Player    │───1:N─│ SupportToken│
└─────────────┘       └─────────────┘       └─────────────┘
       │                     │
       │1                    │N
       │                     │
       ▼                     ▼
┌─────────────┐       ┌─────────────┐
│ NationState │       │    Vote     │
└─────────────┘       └─────────────┘
       │
       │1:N
       ▼
┌─────────────┐
│DecisionCard │
└─────────────┘
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
| diceRoll | number \| null | Active player's roll | 1-6 or null |
| timerEndAt | timestamp \| null | When deliberation ends | null outside deliberation |

**RoomStatus enum**: `lobby` | `playing` | `collapsed` | `finished`

**GamePhase enum**: `waiting` | `rolling` | `drawing` | `deliberating` | `proposing` | `voting` | `revealing` | `resolving`

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

### Turn Lifecycle

```
waiting → rolling → drawing → deliberating → proposing → voting → revealing → resolving
    ↑                                                                              │
    └──────────────────────────────────────────────────────────────────────────────┘
```

### Deliberation Timer

```
deliberating (180s countdown) ──[timeout]──→ proposing (force proposal or skip)
```

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
| Vote | Can only vote during voting phase | "Not in voting phase" |
| Vote | influenceSpent <= player.influence | "Insufficient influence" |
| SupportToken | Can only give own tokens | "Not your token" |
| Movement | position >= 0 | Floor at 0 |
| NationState | stability/budget within bounds | Collapse or cap |
