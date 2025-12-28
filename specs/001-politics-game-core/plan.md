# Implementation Plan: The Political Path - Core Game

**Branch**: `001-politics-game-core` | **Date**: 2025-12-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification + Game rules from `/docs/rules.md`

## Summary

Build a real-time multiplayer web game implementing "The Political Path" - a semi-cooperative board game where 3-5 players race through a government's term by negotiating political decisions. Players need votes to move, but decisions that pass also advance others whose ideology aligns with the outcome. The game teaches political concepts through mechanics: coalition building, tradeoffs, and the tension between cooperation and competition.

Key technical approach:
- **Next.js 14+** with App Router for the frontend (mobile-first responsive web)
- **PartyKit** for real-time multiplayer state synchronization (edge-deployed, room-based)
- **Framer Motion** for polished animations (card reveals, vote animations, board movement)
- **XState** for game state machine (turn flow, voting phases, win conditions)

## Technical Context

**Language/Version**: TypeScript 5.3+, Node.js 20 LTS
**Primary Dependencies**:
- Frontend: Next.js 14+, React 18, Tailwind CSS, shadcn/ui, Framer Motion
- Real-time: PartyKit (edge-deployed WebSocket rooms)
- State: XState 5 (game state machine), Zustand (client UI state)
- Utilities: qrcode.react (room sharing), @use-gesture/react (mobile swipes)
**Storage**: PartyKit Durable Objects (game state), localStorage (player preferences)
**Testing**: Vitest (unit), Playwright (E2E), @xstate/test (state machine)
**Target Platform**: Web (mobile-first responsive, PWA-capable)
**Project Type**: Web application (frontend + PartyKit server)
**Performance Goals**: 60fps animations, <100ms action latency (same region), <500ms cross-region
**Constraints**: <2s state sync (per spec SC-002), 3-5 players per room, 45-60 min sessions
**Scale/Scope**: Initial: 100 concurrent rooms, 500 concurrent players

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Implementation |
|-----------|--------|----------------|
| I. Ideological Neutrality | ✅ | 5 ideologies (Progressive, Conservative, Liberal, Nationalist, Populist) all equally viable; no "good/bad" labels |
| II. Mandatory Tradeoffs | ✅ | Every Decision Card has Budget/Stability costs AND ideology alignments (✓/✗) |
| III. Systems Over Individuals | ✅ | No hero powers; players influence through voting, negotiation, spending Influence |
| IV. Imperfect Information | ✅ | Players see their own cards; vote intentions hidden until reveal |
| V. Delayed Consequences | ✅ | Movement modifiers from nation state (Stability ≥12/≤3, Budget ≥12/≤2) create delayed feedback |
| VI. Mechanics Teach | ✅ | Coalition building, budget constraints, deal-breaking consequences built into rules |
| VII. Ideologies as Toolkits | ✅ | Players can negotiate across ideology lines; pragmatism rewarded |
| VIII. No Utopias | ✅ | Collapse conditions (Stability ≤0, Budget ≤-5) ensure tension persists |
| IX. Conflict Without Villains | ✅ | Race format + ideology bonuses create natural competition from structure |
| X. Multiple Victory Paths | ✅ | Single victory with ideology-based strategy variations (base); Advanced Mode with 5 distinct victory conditions planned as future expansion |
| XI. Instructive Failure | ✅ | Collapse Debrief Cards explain real-world parallels |
| XII. Minimal Political Model | ✅ | Core: 2 resources (Budget, Stability), 1 player resource (Influence), path-based progress |
| XIII. Bias-Aware Playtesting | ✅ | Success criteria SC-009 requires no ideology >60% optimal |
| XIV. Expansion-Ready | ✅ | Zone decks, scenario cards, country variants in rules design |
| XV. Real-Time Multiplayer | ✅ | PartyKit provides <100ms sync; simultaneous voting with reveals |
| XVI. Coopetition | ✅ | Need votes to move (cooperation) + race to win (competition) + Support Token deals |
| XVII. Education as Pillar | ✅ | Historical Parallel notes on cards; Collapse Debrief; post-game political concept summary |

**Note on Principle III (Systems Over Individuals)**: The base game models institutions implicitly rather than explicitly. Policy effects on Budget represent fiscal/economic institutions; effects on Stability represent social/political institutions; the voting mechanic represents legislative process. This satisfies the principle's intent ("No single card or move may bypass institutional constraints") because all player actions flow through the shared resource system. Explicit institution cards (Legislature, Courts, Markets, Public Opinion) are candidates for future expansion.

**Note on Principle X**: The base game uses a single race-based victory condition (first to End with ≥3 Influence) with ideology-based strategy variations. This satisfies the principle through strategic diversity rather than multiple victory conditions. A planned **Advanced Mode** expansion will add 5 distinct victory paths (Race, Economic, Stability, Influence, Coalition) for players seeking deeper strategic variety. See spec.md "Future Expansions" section for details.

## Project Structure

### Documentation (this feature)

```text
specs/001-politics-game-core/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── game-events.ts   # PartyKit message types
│   └── api-routes.ts    # Next.js API routes
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
app/                          # Next.js App Router
├── (game)/                   # Game routes group
│   ├── page.tsx              # Landing/home
│   ├── create/page.tsx       # Create new game room
│   ├── join/page.tsx         # Join via code/QR
│   └── room/[roomId]/        # Active game room
│       ├── page.tsx          # Game board view
│       ├── lobby.tsx         # Pre-game lobby
│       └── results.tsx       # Post-game summary
├── api/                      # API routes (if needed)
└── layout.tsx                # Root layout with providers

components/
├── ui/                       # shadcn/ui components
├── game/                     # Game-specific components
│   ├── Board.tsx             # Path visualization
│   ├── PlayerTrack.tsx       # Individual player state
│   ├── NationTrack.tsx       # Shared Stability/Budget
│   ├── DecisionCard.tsx      # Policy card display
│   ├── VotingPanel.tsx       # Vote interface + reveal
│   ├── DealTracker.tsx       # Support token visualization
│   ├── Timer.tsx             # 3-min deliberation timer
│   └── QRShare.tsx           # QR code for room joining
└── animations/               # Framer Motion components
    ├── CardReveal.tsx
    ├── VoteReveal.tsx
    └── BoardMovement.tsx

lib/
├── game/                     # Core game logic (shared)
│   ├── state-machine.ts      # XState game definition
│   ├── rules.ts              # Rule calculations
│   ├── ideologies.ts         # Ideology definitions
│   └── cards/                # Decision card data
│       ├── early-term.ts
│       ├── mid-term.ts
│       ├── crisis-zone.ts
│       └── late-term.ts
├── party/                    # PartyKit server
│   └── game-room.ts          # Room state + message handling
└── hooks/                    # React hooks
    ├── useGameState.ts       # Subscribe to game state
    ├── useVoting.ts          # Vote submission/reveal
    └── useDeals.ts           # Support token management

party/                        # PartyKit server entry
└── index.ts                  # Main PartyKit server

tests/
├── unit/                     # Unit tests (Vitest)
│   ├── state-machine.test.ts
│   └── rules.test.ts
├── integration/              # Integration tests
│   └── game-flow.test.ts
└── e2e/                      # Playwright E2E
    └── full-game.spec.ts

public/
├── cards/                    # Card artwork (if any)
└── icons/                    # Ideology icons
```

**Structure Decision**: Web application structure with Next.js App Router and PartyKit server.
PartyKit runs as a separate edge-deployed service but shares TypeScript types with frontend.

## Docker Development Setup

```yaml
# docker-compose.yml (for local development)
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - PARTYKIT_HOST=party:1999
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev

  party:
    build:
      context: .
      dockerfile: Dockerfile.party
    ports:
      - "1999:1999"
    volumes:
      - ./party:/app/party
      - ./lib/game:/app/lib/game
    command: npx partykit dev
```

## Complexity Tracking

| Deviation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| XState for game state | Turn flow + voting phases + win conditions require complex state transitions | Simple useState would lead to inconsistent state and race conditions |
| PartyKit (not Supabase) | Purpose-built for multiplayer games, edge-deployed, handles room state elegantly | Supabase has higher latency and isn't optimized for game state sync |
| Separate party/ folder | PartyKit requires isolated server entry point | Inline server would break Next.js build |
