# Data Model: Game Refinement - UI, Learning & Fun

**Feature**: 002-game-refinement
**Date**: 2025-12-29
**Status**: Complete

## Overview

This document defines new data structures and modifications to existing models for the game refinement feature. Most game data remains unchanged; this feature adds UI state, help content, and tracking structures.

---

## New Entities

### 1. TurnHistoryEntry

Records a completed turn for display in History tab and post-game analysis.

```typescript
interface TurnHistoryEntry {
  // Identity
  turnNumber: number;
  timestamp: number; // Unix timestamp

  // Active Player
  activePlayerId: string;
  activePlayerName: string;
  activePlayerIdeology: Ideology;

  // Proposal
  proposal: {
    cardId: string;
    cardTitle: string;
    cardCategory: 'early-term' | 'mid-term' | 'crisis-zone' | 'late-term';
    optionChosen: string;
    nationImpact: {
      budgetEffect: number;
      stabilityEffect: number;
    };
  };

  // Votes
  votes: VoteRecord[];
  outcome: 'passed' | 'failed';
  yesCount: number;
  noCount: number;
  abstainCount: number;
  margin: string; // e.g., "3-2", "4-1"

  // Results
  nationChanges: {
    budgetBefore: number;
    budgetAfter: number;
    budgetDelta: number;
    stabilityBefore: number;
    stabilityAfter: number;
    stabilityDelta: number;
  };

  playerMovements: PlayerMovement[];

  // Concepts demonstrated this turn
  conceptsTriggered: string[]; // concept IDs
}

interface VoteRecord {
  playerId: string;
  playerName: string;
  playerIdeology: Ideology;
  vote: 'yes' | 'no' | 'abstain';
  influenceSpent: number;
  voteWeight: number; // 1 + influenceSpent
  alignedWithIdeology: boolean; // Did they vote as their ideology typically would?
}

interface PlayerMovement {
  playerId: string;
  playerName: string;
  diceRoll: number;
  ideologyModifier: number;
  nationModifier: number;
  influenceBonus: number;
  totalMovement: number;
  positionBefore: number;
  positionAfter: number;
}
```

### 2. ConceptInstance

Tracks when a political concept was demonstrated during gameplay.

```typescript
interface ConceptInstance {
  conceptId: string; // References POLITICAL_CONCEPTS in concepts.ts
  turnNumber: number;
  timestamp: number;

  // Human-readable description of how concept was demonstrated
  description: string;

  // Players involved
  playerIds: string[];
  playerNames: string[];

  // Context
  triggerEvent: ConceptTriggerEvent;
  cardId?: string;
  cardTitle?: string;
}

type ConceptTriggerEvent =
  | 'deal_made'
  | 'deal_broken'
  | 'vote_passed'
  | 'vote_failed'
  | 'crisis_contributed'
  | 'crisis_ignored'
  | 'cross_ideology_vote'
  | 'influence_spent'
  | 'nation_crisis'
  | 'narrow_margin_vote';
```

### 3. GameDebrief

Post-game summary for educational display.

```typescript
interface GameDebrief {
  // Game metadata
  gameId: string;
  duration: number; // minutes
  totalTurns: number;

  // Outcome
  outcome: 'victory' | 'collapse' | 'stalemate';
  winnerId?: string;
  winnerName?: string;
  winnerIdeology?: Ideology;

  // For collapse outcome
  collapseReason?: 'budget' | 'stability';
  collapseParallel?: HistoricalParallel; // From debrief.ts

  // Concepts learned
  conceptsDemo: ConceptSummary[];

  // Per-player analysis
  playerAnalyses: PlayerAnalysis[];

  // Most impactful moments
  keyMoments: KeyMoment[];
}

interface ConceptSummary {
  conceptId: string;
  conceptName: string;
  explanation: string; // 1-2 sentences
  instances: ConceptInstance[]; // All times it was demonstrated
  primaryExample: string; // Best example to show
}

interface PlayerAnalysis {
  playerId: string;
  playerName: string;
  ideology: Ideology;

  // Stats
  finalPosition: number;
  finalInfluence: number;
  votesTotal: number;
  votesWithIdeology: number;
  ideologyAlignmentPercent: number; // 0-100

  // Deals
  dealsMade: number;
  dealsBroken: number;

  // Impact
  mostImpactfulVote?: {
    turnNumber: number;
    cardTitle: string;
    impact: string; // Description of why impactful
  };
}

interface KeyMoment {
  turnNumber: number;
  type: 'swing_vote' | 'deal_breach' | 'crisis_resolution' | 'near_collapse' | 'winning_move';
  description: string;
  playersInvolved: string[];
}

interface HistoricalParallel {
  name: string; // e.g., "Fall of the Weimar Republic"
  period: string; // e.g., "Germany, 1919-1933"
  summary: string;
  lesson: string;
  parallels: string[]; // Specific parallels to game events
}
```

### 4. TutorialStep

Single step in the How to Play tutorial.

```typescript
interface TutorialStep {
  id: string;
  order: number;
  title: string;
  content: string; // Main explanation text
  bullets?: string[]; // Optional bullet points
  visualType: 'none' | 'image' | 'animation' | 'highlight';
  visualRef?: string; // Image path or component name
  highlightSelector?: string; // CSS selector for UI highlight
}
```

### 5. HelpContent

Contextual help entries.

```typescript
interface PhaseHelp {
  phase: GamePhase;
  title: string;
  description: string;
  availableActions: string[];
  tips: string[];
}

interface TermDefinition {
  term: string;
  displayName: string;
  definition: string;
  whyItMatters: string;
  relatedTerms?: string[];
}

interface DealHelp {
  overview: string;
  steps: string[];
  consequences: string;
  strategicValue: string;
}

// Full help content structure
interface HelpContentStore {
  phases: Record<GamePhase, PhaseHelp>;
  terms: Record<string, TermDefinition>;
  deals: DealHelp;
}
```

### 6. PlayerPreferences

Persisted in localStorage.

```typescript
interface PlayerPreferences {
  tutorialCompleted: boolean;
  gamesPlayed: number;
  hintsEnabled: boolean;
  lastPlayedAt?: number; // Unix timestamp
}
```

### 7. UIState

Zustand store for UI-specific state.

```typescript
interface UIState {
  // Tab navigation
  activeTab: 'action' | 'deals' | 'history';
  setActiveTab: (tab: UIState['activeTab']) => void;

  // Help system
  helpOpen: boolean;
  setHelpOpen: (open: boolean) => void;

  // Tutorial
  tutorialOpen: boolean;
  tutorialStep: number;
  setTutorialOpen: (open: boolean) => void;
  setTutorialStep: (step: number) => void;

  // First-game hints
  showingHint: boolean;
  currentHintId: string | null;
  dismissHint: () => void;
}
```

---

## Modified Entities

### GameRoomState (party/game-room.ts)

Add turn history tracking:

```typescript
interface GameRoomState {
  // ... existing fields ...

  // NEW: Turn history for History tab
  turnHistory: TurnHistoryEntry[];

  // NEW: Concept tracking for debrief
  conceptInstances: ConceptInstance[];
}
```

### Player State Extension

No changes to core Player type. Ideology alignment calculated at debrief time.

---

## State Transitions

### Turn Completion Flow

```
Vote Resolved
    ↓
Calculate nation changes
    ↓
Calculate player movements
    ↓
Detect concepts triggered
    ↓
Create TurnHistoryEntry
    ↓
Append to turnHistory[]
    ↓
Emit 'turnCompleted' event
    ↓
Broadcast to all clients
```

### Game End Flow

```
Victory/Collapse Detected
    ↓
Generate GameDebrief
    ├── Aggregate conceptInstances
    ├── Calculate player analyses
    ├── Identify key moments
    └── (If collapse) Match historical parallel
    ↓
Emit 'gameEnded' with debrief
    ↓
Display GameDebrief component
```

---

## Validation Rules

### TurnHistoryEntry

- `turnNumber` must be > 0 and sequential
- `votes` array must contain entry for every connected player
- `yesCount + noCount + abstainCount` must equal total players
- `margin` format must be "X-Y" where X >= Y

### ConceptInstance

- `conceptId` must reference valid concept in POLITICAL_CONCEPTS
- `playerIds` must be non-empty
- `description` must be non-empty string

### PlayerPreferences

- `gamesPlayed` must be >= 0
- `tutorialCompleted` is boolean (no null)
- `hintsEnabled` defaults to true for new players

---

## Indexes & Lookups

### Turn History

- Primary: `turnHistory[turnNumber - 1]` (array index)
- Filter by player: `turnHistory.filter(t => t.votes.some(v => v.playerId === id))`

### Concept Instances

- Group by concept: `groupBy(conceptInstances, 'conceptId')`
- Filter by turn: `conceptInstances.filter(c => c.turnNumber === turn)`

---

## Storage Strategy

| Data | Storage | Lifetime |
|------|---------|----------|
| TurnHistoryEntry[] | PartyKit room state | Game session |
| ConceptInstance[] | PartyKit room state | Game session |
| GameDebrief | Generated at game end | Until room cleanup |
| PlayerPreferences | localStorage | Permanent (per browser) |
| UIState | Zustand (memory) | Page session |
| HelpContent | Static JSON import | App lifetime |
| TutorialSteps | Static JSON import | App lifetime |

---

## Migration Notes

This feature adds new fields to existing structures. No migration needed for:
- Existing games will have empty `turnHistory[]` and `conceptInstances[]`
- New games will populate these arrays from turn 1

For localStorage:
- First access creates default `PlayerPreferences`
- Existing players without preferences get defaults with `tutorialCompleted: false`
