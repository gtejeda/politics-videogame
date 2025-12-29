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

---

## Session 2025-12-28: New Feature Research

The following research addresses the new features specified in the 2025-12-28 clarification session.

### 7. Two-Phase Voting Workflow (FR-019)

**Context**: The spec requires a Review Phase → Deliberation Phase workflow with differentiated views for proposing vs. non-proposing players.

**Decision**: State Machine Extension with Nested States

**Rationale**: The existing `state-machine.ts` uses XState 5.0 for game phase management. The new two-phase workflow can be modeled as nested states within the existing deliberation flow.

**Implementation Approach**:
- Add `reviewPhase` and `negotiationPhase` as sub-states of the existing deliberation flow
- Track `readyToNegotiate: Set<playerId>` for non-proposing players
- Track `proposedOption: CardOptionId | null` for the proposing player
- Transition to `negotiationPhase` when all players are ready

**Alternatives Considered**:
1. **Separate top-level phases**: Rejected because it would require significant refactoring of the existing phase transition logic
2. **Client-side only tracking**: Rejected because readiness state must be synchronized across all players

**UI Component Strategy**:
- Create `ReviewPhase.tsx` and `NegotiationPhase.tsx` as sub-components of the existing `VotingPanel.tsx`
- Proposer sees tabbed interface (Info tab + Options tab)
- Non-proposers see info-only view with "Ready to Negotiate" button

---

### 8. Hidden Advancement Reveal (FR-018)

**Context**: Player advancement effects must be hidden during deliberation/voting and revealed collectively after all votes are cast.

**Decision**: Client-Side Conditional Render with Card Flip Animation

**Rationale**: The existing `DecisionCard` type in `types.ts` already has `aligned` and `opposed` arrays. These represent advancement effects that need to be conditionally hidden.

**Implementation Approach**:
- Add `showAdvancement: boolean` flag to the client-side card display state
- Server sends full card data; client conditionally renders advancement based on game phase
- After all votes cast, server broadcasts `advancementReveal` event
- UI animates card flip to reveal back (advancement data)

**Card Flip Animation** (Framer Motion):
```tsx
const flipVariants = {
  front: { rotateY: 0 },
  back: { rotateY: 180 }
};

<motion.div
  animate={showAdvancement ? 'back' : 'front'}
  variants={flipVariants}
  transition={{ duration: 0.6, ease: 'easeInOut' }}
  style={{ transformStyle: 'preserve-3d' }}
>
  {/* Front: Policy info, nation effects */}
  {/* Back: Ideology advancement bonuses/penalties */}
</motion.div>
```

**Alternatives Considered**:
1. **Server withholds advancement data**: Rejected because it would require two card payloads and complicate the event flow
2. **CSS-only hiding**: Rejected because it doesn't support the card-flip animation UX

---

### 9. Deal Tracking System (FR-020)

**Context**: System must support tracked deals with Make Deal button, deal logging, breach detection, and penalties.

**Decision**: New Deal Entity with Server-Side Enforcement

**Rationale**: Deals are contractual agreements that must be enforced by the server to prevent cheating. The existing token system tracks implicit reputation; deals add explicit tracked commitments.

**Data Model**:
```typescript
interface Deal {
  id: string;
  initiatorId: string;
  responderId: string;
  terms: DealTerms;
  scope: 'this_vote' | 'next_n_turns';
  scopeValue?: number;  // Number of turns if scope is 'next_n_turns'
  status: 'pending' | 'active' | 'fulfilled' | 'broken';
  createdAt: number;
  resolvedAt?: number;
}

interface DealTerms {
  initiatorCommitment: DealCommitment;
  responderCommitment: DealCommitment;
}

type DealCommitment =
  | { type: 'vote'; choice: 'yes' | 'no' }
  | { type: 'token'; action: 'give' | 'receive' };
```

**Server Events**:
- `proposeDeal`: Initiator sends deal proposal
- `acceptDeal`: Responder accepts
- `rejectDeal`: Responder declines
- `dealCreated`: Broadcast to all players
- `dealResolved`: Broadcast with fulfilled/broken status

**Breach Detection**:
After voting phase, server runs `resolveDealBreaches()`:
1. For each active deal scoped to this vote
2. Check if parties' votes match their commitments
3. If mismatch: mark deal as `broken`, apply penalties
4. Breaker loses 2 Influence, other party gains 1

**Alternatives Considered**:
1. **Client-side deal tracking**: Rejected because it cannot enforce breach penalties
2. **Informal deals only**: Rejected per user requirement for formal tracking

---

### 10. Non-Punitive Timer System (FR-021)

**Context**: Timers must serve as guidance only, never auto-advancing or penalizing players.

**Decision**: Guidance Timer with Overtime Mode

**Rationale**: The existing `Timer.tsx` component uses a countdown. The change requires adding an "overtime" visual state without triggering any game state transitions.

**Implementation Approach**:
- Remove all `setTimeout`-based auto-advance logic from server
- Timer component shows countdown → at 0, switches to "overtime" mode with visual indicator
- Phase transitions triggered ONLY by player actions (ready, vote, acknowledge)
- Server tracks `timerStartedAt` and `recommendedDuration` for display purposes only

**Visual States**:
1. **Countdown**: Normal display, e.g., "2:45 remaining"
2. **Overtime**: Pulsing border, color change (amber/orange), text "Overtime +0:15"

**Server Changes**:
- Remove: `setTimeout(() => autoAdvancePhase(), duration)`
- Keep: `timerStartedAt: number` for display sync
- Add: `isOvertime: boolean` computed client-side

**Alternatives Considered**:
1. **Hard timer with extensions**: Rejected per user requirement
2. **No timer at all**: Rejected because time awareness is still valuable

---

### 11. Phase Indicators and Player Status (FR-022)

**Context**: Persistent header bar with phase info and player status icons.

**Decision**: New `PhaseHeader.tsx` Component

**Rationale**: A fixed header bar provides constant context without taking screen real estate from the game board.

**Component Structure**:
```tsx
<PhaseHeader>
  <PhaseInfo phase={currentPhase} description={phaseDescription} />
  <GuidanceTimer startedAt={timerStart} duration={recommendedDuration} />
  <PlayerStatusRow players={players} statuses={playerStatuses} />
</PhaseHeader>
```

**Status Icons**:
| Icon | Meaning | When Shown |
|------|---------|------------|
| ✓ (checkmark) | Ready/completed | Player clicked Ready, voted, or acknowledged |
| ⏳ (hourglass) | Waiting | Player has not yet acted |
| … (ellipsis) | Acting | Player is in Deal modal or reviewing tabs |

**Hover Tooltips**:
- "Waiting for [Player] to mark Ready to Negotiate"
- "Waiting for [Player] to select a proposal"
- "Waiting for [Player] to cast vote"
- "Waiting for [Player] to acknowledge results"

**Nudge Visual**:
- When timer enters overtime, waiting players' avatars pulse gently
- Encourages action without forcing it

**Alternatives Considered**:
1. **Sidebar panel**: Rejected because it takes too much horizontal space on mobile
2. **Toast notifications only**: Rejected because it doesn't provide persistent context

---

## Updated Risk Assessment (2025-12-28)

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Deal system complexity | Medium | Medium | Start with vote-only commitments; add token transfers later |
| Timer UX confusion | Low | Low | Clear "Overtime" visual; tooltip explains no auto-advance |
| Two-phase workflow slowing gameplay | Medium | Medium | Review Phase has no timer limit; Deliberation Phase is 3 min |
| Card flip animation on low-end devices | Low | Low | Fallback to instant reveal if `prefers-reduced-motion` |

---

## Summary of New Decisions

| Feature | Decision | Key Rationale |
|---------|----------|---------------|
| Two-Phase Voting | Nested XState states | Minimal refactor, clear state transitions |
| Hidden Advancement | Client-side conditional render | Enables card-flip animation |
| Deal Tracking | Server-enforced Deal entity | Prevents cheating, enables breach detection |
| Non-Punitive Timers | Overtime mode, no auto-advance | Respects player discussions |
| Phase Indicators | Fixed PhaseHeader component | Persistent context, mobile-friendly |
