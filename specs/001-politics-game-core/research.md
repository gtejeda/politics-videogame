# Research: The Political Path - Core Game

**Feature**: 001-politics-game-core
**Date**: 2025-12-27

## Technology Decisions

### 1. Real-Time Multiplayer: PartyKit vs Supabase Realtime

**Decision**: PartyKit

**Rationale**:
- Purpose-built for multiplayer games with room-based architecture
- Edge-deployed (Cloudflare Workers) = lower latency globally
- Durable Objects handle room state elegantly (persists across reconnects)
- Simple API: `usePartySocket` hook integrates naturally with React
- Built-in support for broadcast, presence, and room state
- Better fit for synchronous game state (simultaneous voting, timed phases)

**Alternatives Considered**:
- **Supabase Realtime**: Good for database-driven realtime (chat, notifications), but adds 50-100ms latency for game state sync. Would require custom room management. Better if we needed persistent game history.
- **Socket.io / raw WebSockets**: More control but requires self-hosting, scaling complexity, and room management from scratch.
- **Liveblocks**: Excellent for collaborative documents, overkill for game state.

**Trade-offs**:
- Smaller community than Supabase
- No built-in database (we use PartyKit storage + client localStorage)
- Newer technology (less battle-tested at massive scale)

---

### 2. State Management: XState for Game Logic

**Decision**: XState 5 for game state machine

**Rationale**:
- Turn-based game with clear phases: Roll → Draw → Deliberate → Vote → Resolve → Check Collapse
- XState models this naturally with states, transitions, guards, and actions
- `@xstate/test` enables model-based testing of all game paths
- Visualizer helps debug complex state transitions
- Shared between client and PartyKit server (single source of truth)

**Alternatives Considered**:
- **Zustand + custom reducer**: Simpler for UI state, but game phases need explicit modeling
- **Redux Toolkit**: More boilerplate, less natural for state machines
- **Custom state machine**: More work, fewer testing tools

**Implementation Notes**:
- XState machine runs on PartyKit server (authoritative)
- Clients receive state snapshots, not raw events
- Guards enforce rules (e.g., "canVote" only in voting phase)

---

### 3. Animation Library: Framer Motion

**Decision**: Framer Motion

**Rationale**:
- Best-in-class for React declarative animations
- `AnimatePresence` perfect for card enters/exits, vote reveals
- `layout` prop handles board movement smoothly
- Spring physics for natural "feel"
- Gesture support for mobile swipes (via `@use-gesture/react` integration)

**Key Animation Needs**:
| Element | Animation Type | Framer Feature |
|---------|---------------|----------------|
| Card draw | Slide up from deck | `initial`, `animate` |
| Vote reveal | Flip + expand | `AnimatePresence` + `variants` |
| Board movement | Path-following | `layout` + `motion.div` |
| Timer | Countdown pulse | `useSpring` |
| Deal tokens | Hand-off gesture | `drag` + `onDragEnd` |

---

### 4. UI Component Library: shadcn/ui

**Decision**: shadcn/ui + Tailwind CSS

**Rationale**:
- Copy-paste components (not npm dependency) = full control
- Built on Radix UI primitives (accessibility, keyboard nav)
- Tailwind integration = consistent theming
- Dark mode support out of box
- Components we'll use: Button, Card, Dialog, Tabs, Toast, Tooltip

**Customization Needed**:
- Ideology color tokens (5 distinct colors)
- Game-specific card variants
- Mobile-first responsive breakpoints

---

### 5. Mobile Gesture Handling

**Decision**: @use-gesture/react

**Rationale**:
- Works with Framer Motion seamlessly
- Swipe gestures for voting (swipe left = No, right = Yes)
- Drag gestures for support token transfers
- Pinch/zoom for board overview (nice-to-have)

---

### 6. Docker Development Environment

**Decision**: Docker Compose with separate Next.js and PartyKit services

**Rationale**:
- PartyKit dev server runs separately from Next.js
- Shared volume for `/lib/game` ensures consistent game logic
- Easy to spin up for new contributors
- Mirrors production architecture

**Configuration**:
```yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_PARTYKIT_HOST=localhost:1999
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev

  party:
    build:
      context: .
      dockerfile: Dockerfile.party
    ports: ["1999:1999"]
    volumes:
      - ./party:/app/party
      - ./lib/game:/app/lib/game
    command: npx partykit dev --port 1999
```

---

## Open Design Questions (Resolved)

### Q1: Board shape - Linear or Circular?

**Decision**: Linear path (per rules.md)

The rules specify a one-term race from [START: Coalition Formation] to [END: End of Government]. Linear creates clear progress visualization and natural catchup dynamics.

### Q2: Dice type - d6, 2d6, or custom?

**Decision**: Standard d6

The rules reference "rolls 6" suggesting a single d6. Simple, familiar, fast. Digital implementation can use animated dice roll.

### Q3: Path length - How many spaces?

**Decision**: 30-40 spaces (tunable)

Target 45-60 minute games with ~10-15 turns per player. At ~3-4 average roll with movement modifiers, 35 spaces is reasonable. Will tune in playtesting.

### Q4: Deal tracking - Formal or informal?

**Decision**: Support Tokens (formal, visible)

The rules clearly define Support Tokens with explicit rules:
- 3 tokens per player at start
- Given as binding promise
- Breaking deals has consequences (-1 Influence, token kept)
- Visible to all (transparency)

---

## Best Practices Applied

### PartyKit Multiplayer Patterns

1. **Server-authoritative state**: All game logic runs on PartyKit; clients are dumb views
2. **Optimistic updates with reconciliation**: Show actions immediately, reconcile with server state
3. **Broadcast for public state, message for private**: Votes are private until reveal phase
4. **Room lifecycle**: Auto-cleanup after 2 hours of inactivity
5. **Reconnection handling**: Player ID in localStorage; rejoin same room within 30s window

### XState Game State Machine Patterns

1. **Hierarchical states**: `game.playing.turn.deliberation`
2. **Parallel states**: Timer + negotiation happen simultaneously
3. **Delayed transitions**: Auto-advance after 3-minute timer
4. **Guards for rule enforcement**: "canPropose" checks player is active
5. **Actions for side effects**: "broadcastVoteReveal" on vote resolve

### Mobile-First UI Patterns

1. **Touch targets ≥44px**: All interactive elements
2. **Bottom sheet for actions**: Voting panel slides up from bottom
3. **Swipe gestures**: Natural for Yes/No voting
4. **Portrait-first layout**: Board vertical, player info horizontal scroll
5. **Progressive disclosure**: Expand card details on tap

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| PartyKit scaling limits | Low | High | Start with 100 rooms; monitor; fallback to self-hosted solution |
| XState complexity | Medium | Medium | Extensive unit testing; visualizer for debugging |
| Animation performance on low-end mobile | Medium | Medium | Reduce motion option; use `will-change` sparingly |
| 3-5 player minimum hard to achieve | High | High | Add bot players for testing; solo mode with AI opponents (future) |
| Cross-browser WebSocket issues | Low | Medium | PartyKit handles fallbacks; test on Safari iOS |

---

## Dependencies Summary

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "partysocket": "^1.0.0",
    "xstate": "^5.0.0",
    "@xstate/react": "^4.0.0",
    "zustand": "^4.4.0",
    "framer-motion": "^10.16.0",
    "@use-gesture/react": "^10.3.0",
    "tailwindcss": "^3.3.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "qrcode.react": "^3.1.0"
  },
  "devDependencies": {
    "partykit": "^0.0.0",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0",
    "@xstate/test": "^1.0.0",
    "playwright": "^1.40.0",
    "@types/react": "^18.2.0"
  }
}
```
