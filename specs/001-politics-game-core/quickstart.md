# Quickstart: The Political Path

**Feature**: 001-politics-game-core
**Time to first game**: ~15 minutes

## Prerequisites

- Node.js 20 LTS or later
- npm 10+ or pnpm 8+
- Docker (optional, for containerized development)

## Option 1: Local Development

### 1. Clone and Install

```bash
git clone <repo-url>
cd politics-videogame
npm install
```

### 2. Start PartyKit Dev Server

In one terminal:

```bash
npx partykit dev
```

This starts the PartyKit server on `http://localhost:1999`.

### 3. Start Next.js Dev Server

In another terminal:

```bash
npm run dev
```

This starts the Next.js app on `http://localhost:3000`.

### 4. Open the Game

1. Open `http://localhost:3000` in your browser
2. Click "Create Game"
3. Share the room code with 2-4 other players (or open in multiple browser tabs)
4. Select ideologies and start playing!

## Option 2: Docker Development

### 1. Start All Services

```bash
docker-compose up
```

This starts:
- Next.js app on `http://localhost:3000`
- PartyKit server on `http://localhost:1999`

### 2. Open the Game

Navigate to `http://localhost:3000` and follow the same steps as above.

## Testing the Game Flow

### Minimum Viable Test (3 players, same machine)

1. Open 3 browser windows/tabs to `http://localhost:3000`
2. In window 1: Create a game room → note the room code
3. In windows 2 & 3: Join with the room code
4. Each player: Select a different ideology
5. Host: Click "Start Game"
6. Play through one full turn:
   - Active player rolls dice
   - Card is drawn
   - Deliberate for up to 3 minutes
   - Active player proposes an option
   - All players vote
   - Watch the vote reveal animation
   - Observe movement and state changes

### Verify Core Mechanics

| Mechanic | How to Verify |
|----------|---------------|
| Real-time sync | Take an action → see it reflected in other windows immediately |
| Tradeoffs | Check that every card option affects both Budget/Stability AND ideology alignments |
| Movement | After vote resolves, aligned players move forward, opposed move backward |
| Timer | Deliberation timer counts down from 3:00 |
| Support tokens | Give a token to another player, see it appear in their "held" section |
| Collapse | Intentionally drive Stability to 0 → game ends with collapse screen |
| Victory | Race one player to the end with ≥3 Influence → victory screen |

## Project Structure Overview

```
politics-videogame/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Landing page
│   │   ├── create/             # Create room flow
│   │   ├── join/               # Join room flow
│   │   └── room/[roomId]/      # Active game
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── game/               # Game-specific components
│   │   └── animations/         # Framer Motion components
│   └── lib/
│       ├── game/               # Shared game logic
│       │   ├── state-machine.ts
│       │   ├── rules.ts
│       │   └── cards/          # Decision card data
│       ├── party/              # PartyKit server logic
│       └── hooks/              # React hooks
├── party/
│   └── index.ts                # PartyKit entry point
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

## Key Files to Understand

| File | Purpose |
|------|---------|
| `src/lib/game/state-machine.ts` | XState definition of game flow |
| `src/lib/game/rules.ts` | Movement, voting, collapse calculations |
| `party/index.ts` | PartyKit WebSocket message handling |
| `src/lib/game/cards/*.ts` | Decision card content |
| `src/components/game/Board.tsx` | Path visualization |
| `src/components/game/VotingPanel.tsx` | Vote casting UI |

## Running Tests

```bash
# Unit tests (fast, isolated)
npm run test:unit

# Watch mode for development
npm run test:watch

# All tests
npm test
```

> **Note**: Integration and E2E tests will be added in future iterations.

## Common Development Tasks

### Add a New Decision Card

1. Open `src/lib/game/cards/<zone>.ts`
2. Add a new card object following the `DecisionCard` type
3. Ensure tradeoffs: every option has Budget/Stability cost AND ideology alignments
4. Add historical note for educational value

### Modify Game Rules

1. Rules logic lives in `src/lib/game/rules.ts`
2. State transitions in `src/lib/game/state-machine.ts`
3. Run unit tests after changes: `npm run test:unit`

### Add a New Animation

1. Create component in `src/components/animations/`
2. Use Framer Motion's `motion.div`, `AnimatePresence`
3. Import and use in game components

### Debug State Machine

1. XState has a visualizer: `npx xstate viz src/lib/game/state-machine.ts`
2. Console logs in PartyKit: check terminal running `npx partykit dev`
3. React DevTools: XState state is visible in React state

## Environment Variables

Create `.env.local` for local development:

```env
# PartyKit host (default for local dev)
NEXT_PUBLIC_PARTYKIT_HOST=localhost:1999

# Optional: analytics, monitoring
# ANALYTICS_KEY=...
```

## Deployment

### Vercel + PartyKit

1. Deploy PartyKit: `npx partykit deploy`
2. Note the PartyKit URL (e.g., `your-project.partykit.dev`)
3. Deploy to Vercel: `vercel`
4. Set `NEXT_PUBLIC_PARTYKIT_HOST` in Vercel environment

### Docker Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| WebSocket connection failed | Check PartyKit server is running on port 1999 |
| State not syncing | Refresh all browser windows; check console for errors |
| Animations janky | Enable "Reduced motion" in settings; check browser GPU acceleration |
| Can't join room | Verify room code; check room hasn't started yet |
| Tests failing | Run `npm install` to ensure deps; check Node version |

## Next Steps

After verifying the quickstart works:

1. Review the full game rules in `docs/rules.md`
2. Run `/speckit.tasks` to generate implementation tasks
3. Start with User Story 1 (P1): Join and Play a Game Session
