# Research: Game Refinement - UI, Learning & Fun

**Feature**: 002-game-refinement
**Date**: 2025-12-29
**Status**: Complete

## Overview

This research document captures design decisions for the game refinement feature. Since this builds on existing technology (Next.js, PartyKit, Framer Motion, Radix UI), research focuses on UI patterns, content structure, and animation approaches rather than technology selection.

---

## 1. Tabbed UI Layout Pattern

### Decision: Persistent Header + Radix UI Tabs

**Rationale**: The existing codebase already includes `@radix-ui/react-tabs` (v1.1.13). Using this maintains consistency and avoids new dependencies. The persistent Players bar is implemented as a separate component outside the tab structure.

**Alternatives Considered**:
| Alternative | Rejected Because |
|-------------|------------------|
| Custom tab implementation | Unnecessary when Radix UI tabs available; accessibility built-in |
| Accordion/collapsible panels | Doesn't eliminate scrolling as effectively; less intuitive navigation |
| Modal-based views | Blocks context; players lose awareness of game state |

### Implementation Pattern

```text
GameLayout
├── PlayersBar (always visible - NOT a tab)
│   ├── NationStatus (Budget, Stability)
│   └── PlayerCards[] (name, ideology, position, influence, tokens)
└── Tabs.Root
    ├── Tabs.List (Action | Deals | History)
    └── Tabs.Content[]
        ├── ActionTab (dice, cards, voting, deliberation)
        ├── DealsTab (active deals, pending, history)
        └── HistoryTab (turn log with vote breakdown)
```

---

## 2. Role-Based View Differentiation

### Decision: Conditional Rendering Based on `activePlayerId`

**Rationale**: The game state already tracks `activePlayerId`. UI components conditionally render based on whether `localPlayerId === activePlayerId`. This is the simplest approach with no server-side changes.

**Alternatives Considered**:
| Alternative | Rejected Because |
|-------------|------------------|
| Server sends different payloads per player | Over-engineering; increases complexity for minimal benefit |
| Separate routes/pages for proposer vs observer | Breaks real-time sync; URL would reveal role |
| CSS-only show/hide | Still sends all data to client; less secure for hidden options |

### View Components

- **ProposerView**: Full card options, selection UI, "Select Proposal" button
- **ObserverView**: Topic title, description, ideology comparison table, nation impact preview (budget/stability effects shown, advancement hidden)

---

## 3. Political Concept Tracking & Debrief

### Decision: Leverage Existing `concepts.ts` with Event-Based Tracking

**Rationale**: The codebase already has `src/lib/game/concepts.ts` with 10 political concepts and matching logic. We add a tracking hook that listens to game events and records which concepts were demonstrated with specific examples.

**Concept Categories** (from existing code):
1. Coalition Building
2. Fiscal Responsibility
3. Political Capital
4. Collective Action Problems
5. Trust & Commitment
6. Crisis Management
7. Ideological Compromise
8. Institutional Stability
9. Zero-Sum vs Positive-Sum
10. Strategic Voting

### Tracking Approach

```typescript
// Events that trigger concept detection
type ConceptTrigger = {
  event: 'deal_made' | 'deal_broken' | 'vote_passed' | 'vote_failed' | 'crisis_resolved' | 'cross_ideology_vote';
  context: { players: string[]; card?: string; outcome?: string };
};

// Store concept instances during game
type ConceptInstance = {
  conceptId: string;
  turnNumber: number;
  description: string; // e.g., "You negotiated with Player B to pass Infrastructure Bill"
};
```

---

## 4. First-Game Detection & Hints

### Decision: LocalStorage Flag + Phase-Based Hint Content

**Rationale**: LocalStorage persists across sessions without requiring accounts. A simple `tutorialCompleted` and `gamesPlayed` counter enables first-game detection.

**Alternatives Considered**:
| Alternative | Rejected Because |
|-------------|------------------|
| Cookie-based | Same functionality, worse developer experience |
| Server-side tracking | Requires accounts; over-engineering for MVP |
| Always show hints | Annoying for experienced players; spec requires opt-out |

### Hint Triggers

| Phase | Hint Content |
|-------|--------------|
| waiting (turn 1-2) | "It's {PlayerName}'s turn. When it's your turn, click 'Roll Dice' to begin." |
| rolling (turn 1-2) | "Click the dice to roll! Your movement depends on the roll plus any bonuses." |
| reviewing (turn 1-2, non-proposer) | "Review the proposal. Check how each ideology typically approaches this issue." |
| deliberating (turn 1-2) | "Negotiate with other players! You can make deals using Support Tokens." |
| voting (turn 1-2) | "Cast your vote: Yes, No, or Abstain. Your vote affects the outcome!" |

---

## 5. Help Content Structure

### Decision: Static JSON with Phase/Term Keys

**Rationale**: Static content ensures consistency and allows easy review. JSON structure enables contextual lookup by current phase or hovered term.

### Content Schema

```typescript
type HelpContent = {
  phases: Record<GamePhase, {
    title: string;
    description: string;
    actions: string[];
    tips: string[];
  }>;
  terms: Record<string, {
    name: string;
    definition: string;
    whyItMatters: string;
  }>;
  deals: {
    overview: string;
    howToMake: string[];
    consequences: string;
    strategy: string;
  };
};
```

### Term Definitions (subset)

| Term | Definition |
|------|------------|
| Influence | Your political capital. Spend it to boost votes or gain advantages. Reach the end with 3+ to win. |
| Stability | The nation's social cohesion. If it drops too low, the nation collapses and everyone loses. |
| Budget | The nation's financial health. Policies cost budget; if depleted, options become limited. |
| Support Tokens | Commitments you make to other players. Breaking a token deal has consequences. |

---

## 6. Animation Patterns

### Decision: Framer Motion Variants with Orchestrated Sequences

**Rationale**: Existing codebase uses Framer Motion 10.16. We extend with new animation components following established patterns.

### Animation Specifications

| Moment | Animation | Duration | Elements |
|--------|-----------|----------|----------|
| Victory | Confetti burst + winner highlight | 3s | Particles, scale pulse on winner card |
| Collapse | Screen shake + desaturation + crack overlay | 2s | Shake, grayscale filter, SVG cracks |
| Deal Breach | Screen flash + shake + "Trust Broken" badge | 1.5s | Red flash, shake, badge fade-in |
| Vote Reveal | Sequential card flips with suspense pause | 2-3s | Staggered reveal, final tally highlight |

### Framer Motion Variants Example

```typescript
const collapseVariants = {
  initial: { filter: 'saturate(1)', x: 0 },
  shake: {
    x: [-10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  },
  desaturate: {
    filter: 'saturate(0)',
    transition: { duration: 1.5 }
  }
};
```

---

## 7. Turn History Data Structure

### Decision: Client-Side Array with Server Event Emission

**Rationale**: Turn history is needed for UI display (History tab) and post-game analysis. Server emits `turnCompleted` events; client maintains array in Zustand store.

### Data Structure

```typescript
type TurnHistoryEntry = {
  turnNumber: number;
  activePlayerId: string;
  activePlayerName: string;
  proposal: {
    cardId: string;
    cardTitle: string;
    optionChosen: string;
  };
  votes: Array<{
    playerId: string;
    playerName: string;
    vote: 'yes' | 'no' | 'abstain';
    influenceSpent: number;
  }>;
  outcome: 'passed' | 'failed';
  margin: string; // e.g., "3-2"
  nationChanges: {
    budgetDelta: number;
    stabilityDelta: number;
  };
  playerMovements: Array<{
    playerId: string;
    playerName: string;
    diceRoll: number;
    ideologyModifier: number;
    nationModifier: number;
    totalMovement: number;
    newPosition: number;
  }>;
};
```

---

## 8. Tutorial Step Structure

### Decision: Linear Step Sequence with Visual Highlights

**Rationale**: Tutorial is accessed from menu/lobby, not during live gameplay. Linear progression with visual demos is clearest for new players.

### Tutorial Steps

| Step | Title | Content | Visual |
|------|-------|---------|--------|
| 1 | Goal | Race to the end of the board with 3+ Influence to win | Board path highlight |
| 2 | Turn Structure | Roll dice → Draw card → Deliberate → Vote → Move | Phase icons sequence |
| 3 | Voting | All players vote on proposals; majority wins | Vote panel mockup |
| 4 | Deals | Make agreements with Support Tokens; breaking has consequences | Deal UI highlight |
| 5 | Nation Health | Budget and Stability must stay positive or nation collapses | Nation meters |
| 6 | Ideologies | Each ideology has strengths; none is "best" | Ideology comparison |
| 7 | Winning | First to reach end with 3+ Influence wins; or highest influence at end wins | Victory condition |

---

## 9. Ideology Card Expansion

### Decision: Hover/Tap Popover with Structured Content

**Rationale**: Existing `IdeologyPicker.tsx` shows basic info. We add expanded cards accessible on hover (desktop) or tap (mobile) with consistent structure.

### Card Content Structure

```typescript
type IdeologyCardContent = {
  id: Ideology;
  name: string;
  icon: string;
  color: string;
  tagline: string; // 1 sentence summary
  strengths: string[]; // 2-3 bullet points
  typicalApproach: string; // How they tend to vote
  strategicTips: string[]; // 2-3 gameplay tips
};
```

### Example: Progressive

```yaml
tagline: "Advocates for social change and collective welfare"
strengths:
  - Strong on social policy and equality measures
  - Builds coalitions across marginalized groups
  - Benefits from high stability environments
typicalApproach: "Tends to vote Yes on social programs, No on deregulation"
strategicTips:
  - Partner with Populists on anti-establishment measures
  - Watch out for budget pressure from welfare expansion
  - Use your coalition strength in tight votes
```

---

## 10. Post-Game Impact Analysis

### Decision: Vote Influence Scoring Algorithm

**Rationale**: To identify "most impactful" votes, we calculate how much each vote affected the final game state using a simple scoring heuristic.

### Impact Scoring

```typescript
function calculateVoteImpact(vote: VoteRecord, outcome: GameOutcome): number {
  let impact = 0;

  // Base impact: was this a close vote?
  const margin = Math.abs(vote.yesCount - vote.noCount);
  if (margin <= 1) impact += 3; // Swing vote potential
  else if (margin <= 2) impact += 2;
  else impact += 1;

  // Did the outcome significantly change nation state?
  if (Math.abs(vote.budgetDelta) >= 3) impact += 2;
  if (Math.abs(vote.stabilityDelta) >= 3) impact += 2;

  // Did this vote affect the winner's position?
  if (vote.affectedWinnerMovement) impact += 2;

  return impact;
}
```

---

## Summary of Decisions

| Area | Decision | Key Rationale |
|------|----------|---------------|
| Tabs | Radix UI Tabs with persistent header | Existing dependency; accessibility built-in |
| Role Views | Client-side conditional rendering | Simplest approach; no server changes |
| Concepts | Event-based tracking with existing logic | Leverages concepts.ts; minimal new code |
| First-Game | LocalStorage flags | No accounts needed; persists across sessions |
| Help | Static JSON by phase/term | Consistent; easy to review and update |
| Animations | Framer Motion variants | Existing pattern; 60fps capable |
| History | Client array with server events | Enables History tab and post-game analysis |
| Tutorial | Linear steps with visuals | Clear for new players; self-contained |
| Ideology Cards | Hover/tap popovers | Progressive disclosure; doesn't clutter picker |
| Impact Analysis | Vote influence scoring | Objective metric for "most impactful" decisions |

---

## Open Items

None. All technical decisions resolved. Ready for Phase 1 design artifacts.
