# Implementation Plan: Politics Game Core

**Branch**: `001-politics-game-core` | **Date**: 2025-12-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-politics-game-core/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Real-time multiplayer political board game where 3-5 players compete and cooperate through policy decisions, voting, deal-making, and crisis management. The game teaches political concepts (tradeoffs, coalition building, institutional dynamics) through gameplay mechanics. Key technical approach: Next.js 14 frontend with PartyKit WebSocket server for real-time state synchronization, XState for client-side state machines, and Zustand for local UI state.

## Technical Context

**Language/Version**: TypeScript 5.3+, Node.js 20 LTS
**Primary Dependencies**: Next.js 14.2, PartyKit 0.0.108, React 18.2, XState 5.0, Zustand 4.4, Framer Motion 10.16, Radix UI, Tailwind CSS 3.4
**Storage**: In-memory (PartyKit server state); no persistent database for MVP
**Testing**: Vitest 3.2 with jsdom for unit/integration tests
**Target Platform**: Web browser (desktop/mobile responsive), PartyKit edge runtime
**Project Type**: Web application (frontend + real-time backend)
**Performance Goals**: <2 second latency for state sync (FR-002), 60 fps UI animations, 3-5 concurrent players per session
**Constraints**: Session duration 30-90 minutes, room auto-cleanup after 2 hours, 30-second AFK timeout
**Scale/Scope**: MVP targets single game sessions, no persistent accounts, no matchmaking

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Compliance Verification

| Principle | Status | Evidence/Notes |
|-----------|--------|----------------|
| I. Ideological Neutrality | PASS | FR-010 mandates ideologically neutral framing; 5 balanced ideologies with contextual advantages |
| II. Mandatory Tradeoffs | PASS | FR-003 requires every policy to have benefit AND cost; FR-004 requires 30%+ delayed effects |
| III. Systems Over Individuals | PASS | FR-014 requires mechanics work through institutions; no special leader powers |
| IV. Imperfect Information | PASS | FR-011 specifies hidden vote intentions, influence ranges, crisis triggers |
| V. Delayed Consequences | PASS | FR-004 mandates 30%+ delayed effects across 2+ game cycles |
| VI. Mechanics Teach | PASS | FR-007/FR-008 track and display political concepts; post-game summaries link decisions to concepts |
| VII. Ideologies as Toolkits | PASS | User Story 5 confirms multiple viable strategies; FR-009 supports mixed approaches |
| VIII. No Utopias | PASS | Victory requires tradeoffs (position + influence); crises create persistent tension |
| IX. Conflict Without Villains | PASS | FR-006 creates competing victory conditions; FR-005 crises require coordination |
| X. Multiple Victory Paths | PASS | FR-009 base game + Future Expansions define 5 distinct victory conditions |
| XI. Instructive Failure | PASS | FR-013 requires loss conditions traceable to decisions; SC-008 targets 85% identification |
| XII. Minimal Political Model | PASS | Core resources (Budget, Stability, Influence) + institutions defined before expansion |
| XIII. Bias-Aware Playtesting | PASS | SC-006/SC-009 define measurable bias audit criteria |
| XIV. Expansion-Ready Design | PASS | Future Expansions section defines Advanced Mode extensibility |
| XV. Real-Time Multiplayer | PASS | FR-001/FR-002 specify synchronous 3-5 player sessions with <2s latency |
| XVI. Coopetition | PASS | FR-005 (crises require coordination) + FR-006 (conflicting victory conditions) |
| XVII. Education as Pillar | PASS | FR-007/FR-008 + SC-005 (80% concept identification) |

### Design Constraints Checklist

| Requirement | Verification | Status |
|-------------|--------------|--------|
| Tradeoff | Every policy has benefit + cost (FR-003) | PASS |
| Neutrality | No moral labeling of positions (FR-010) | PASS |
| Institutional | Mechanics work through legislature/courts/markets (FR-014) | PASS |
| Explainable Randomness | Dice rolls visible, crisis triggers documented (FR-005) | PASS |
| No Correct Answer | Multiple viable ideologies, no dominant strategy (SC-006, SC-009) | PASS |
| Extensibility | Advanced Mode defined, new countries/eras supported | PASS |
| Real-Time Compatible | PartyKit WebSocket sync, <2s latency target | PASS |
| Coopetition | Crises (cooperative) + victory race (competitive) | PASS |
| Educational Value | Concept tracking, post-game summaries (FR-007/FR-008) | PASS |

**GATE STATUS: PASSED** - All constitution principles verified. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-politics-game-core/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── api-routes.ts    # HTTP API contracts (existing)
│   └── game-events.ts   # WebSocket event contracts (existing)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── app/                      # Next.js App Router pages
│   ├── page.tsx              # Home/landing page
│   ├── layout.tsx            # Root layout with providers
│   ├── error.tsx             # Error boundary
│   ├── create/page.tsx       # Create game session
│   ├── join/page.tsx         # Join existing session
│   └── room/[roomId]/page.tsx # Game room (main gameplay)
├── components/
│   ├── ui/                   # Radix UI primitives (button, card, input, etc.)
│   ├── game/                 # Game-specific components
│   │   ├── Board.tsx         # Main game board
│   │   ├── BoardPath.tsx     # Board path visualization
│   │   ├── PlayerTrack.tsx   # Player position tracking
│   │   ├── NationTrack.tsx   # Nation state visualization
│   │   ├── Lobby.tsx         # Pre-game lobby
│   │   ├── IdeologyPicker.tsx # Ideology selection
│   │   ├── DiceRoll.tsx      # Dice rolling UI
│   │   ├── Timer.tsx         # Phase timer display
│   │   ├── DecisionCard.tsx  # Policy/event card display
│   │   ├── VotingPanel.tsx   # Voting interface
│   │   ├── TurnResults.tsx   # Turn results display (FR-015)
│   │   ├── DealTracker.tsx   # Deal tracking UI (FR-020)
│   │   ├── CrisisPanel.tsx   # Crisis management (FR-005)
│   │   ├── ChatPanel.tsx     # In-game chat
│   │   ├── MoreInfoPopup.tsx # Ideology comparison popup (FR-017)
│   │   ├── QRShare.tsx       # Room sharing via QR code
│   │   └── Results.tsx       # Post-game results/debrief
│   └── animations/           # Framer Motion animations
│       ├── VoteReveal.tsx    # Vote reveal animation
│       ├── BoardMovement.tsx # Player movement animation
│       ├── CardReveal.tsx    # Card flip animation
│       └── index.ts          # Animation exports
├── lib/
│   ├── game/                 # Core game logic (shared client/server)
│   │   ├── types.ts          # TypeScript type definitions
│   │   ├── events.ts         # WebSocket event type definitions
│   │   ├── ideologies.ts     # Ideology definitions and bonuses
│   │   ├── rules.ts          # Game rules and calculations
│   │   ├── constants.ts      # Game constants (timing, limits, etc.)
│   │   ├── crises.ts         # Crisis event logic
│   │   ├── concepts.ts       # Political concept tracking
│   │   ├── debrief.ts        # Post-game debrief generation
│   │   ├── state-machine.ts  # XState game state machine
│   │   └── cards/            # Decision card definitions
│   │       ├── index.ts      # Card deck management
│   │       ├── early-term.ts # Early game cards
│   │       ├── mid-term.ts   # Mid game cards
│   │       ├── crisis-zone.ts # Crisis zone cards
│   │       └── late-term.ts  # Late game cards
│   ├── party/                # PartyKit server logic
│   │   └── game-room.ts      # Room state management
│   ├── hooks/                # React hooks
│   │   ├── useGameState.ts   # Game state subscription
│   │   ├── useLocalPlayer.ts # Local player management
│   │   ├── useVoting.ts      # Voting actions
│   │   ├── useDeals.ts       # Deal management
│   │   └── useGameToasts.ts  # Toast notifications
│   └── utils.ts              # Utility functions

party/
└── index.ts                  # PartyKit server entry point

tests/                        # Test directory (to be created)
├── unit/                     # Unit tests
├── integration/              # Integration tests
└── contract/                 # Contract tests
```

**Structure Decision**: Web application with unified Next.js frontend and PartyKit real-time backend. The `src/lib/game/` directory contains shared game logic used by both client and server. The `party/` directory contains the PartyKit server entry point which imports from `src/lib/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. All constitution principles are satisfied by the current design.
