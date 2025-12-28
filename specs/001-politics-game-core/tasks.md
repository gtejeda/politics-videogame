# Tasks: The Political Path - Core Game

**Input**: Design documents from `/specs/001-politics-game-core/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/, research.md

**Tests**: Not explicitly requested in spec. Test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md structure:
- `app/` - Next.js App Router pages
- `components/` - React components (ui/, game/, animations/)
- `lib/` - Shared logic (game/, party/, hooks/)
- `party/` - PartyKit server entry

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize Next.js 14+ project with TypeScript in repository root
- [X] T002 [P] Configure Tailwind CSS with custom ideology color tokens in tailwind.config.ts
- [X] T003 [P] Initialize shadcn/ui and add base components (Button, Card, Dialog, Tabs, Toast, Tooltip) in components/ui/
- [X] T004 [P] Configure Framer Motion and create motion provider in app/layout.tsx
- [X] T005 [P] Setup PartyKit project configuration in partykit.json and party/index.ts
- [X] T006 [P] Configure Vitest for unit testing in vitest.config.ts
- [X] T007 [P] Create docker-compose.yml for local development (Next.js + PartyKit services)
- [X] T008 [P] Create .env.local.example with NEXT_PUBLIC_PARTYKIT_HOST variable

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Shared Types & Contracts

- [X] T009 Create shared types from contracts in lib/game/types.ts (Ideology, RoomStatus, GamePhase, VoteChoice, etc.)
- [X] T010 [P] Create game settings constants in lib/game/constants.ts (defaults from data-model.md)
- [X] T011 [P] Copy and adapt contract types from specs/001-politics-game-core/contracts/game-events.ts to lib/game/events.ts

### Core Game Logic (Shared between client and server)

- [X] T012 Create ideology definitions with colors, icons, core concerns in lib/game/ideologies.ts
- [X] T013 [P] Implement movement calculation rules in lib/game/rules.ts (dice roll, ideology bonuses, nation modifiers)
- [X] T014 [P] Implement vote weight calculation in lib/game/rules.ts
- [X] T015 [P] Implement collapse check logic in lib/game/rules.ts
- [X] T016 [P] Implement victory check logic in lib/game/rules.ts

### XState Game State Machine

- [X] T017 Create XState game machine definition with all phases in lib/game/state-machine.ts
- [X] T018 Add guards for phase transitions (canRoll, canPropose, canVote, etc.) in lib/game/state-machine.ts
- [X] T019 Add actions for state changes (updateNation, movePlayer, resolveVotes) in lib/game/state-machine.ts

### PartyKit Server Foundation

- [X] T020 Implement base PartyKit room class with connection handling in lib/party/game-room.ts
- [X] T021 Add room state initialization (create room, join room) in lib/party/game-room.ts
- [X] T022 Implement message routing for all ClientMessage types in party/index.ts
- [X] T023 Add broadcast helpers for ServerMessage types in lib/party/game-room.ts

### React Hooks Foundation

- [X] T024 Create useGameState hook with PartySocket subscription in lib/hooks/useGameState.ts
- [X] T025 [P] Create useLocalPlayer hook for localStorage player ID/preferences in lib/hooks/useLocalPlayer.ts

### Base UI Components

- [X] T026 Create app layout with providers (Framer, game state) in app/layout.tsx
- [X] T027 [P] Create landing page skeleton in app/(game)/page.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Join and Play a Game Session (Priority: P1) 🎯 MVP

**Goal**: Players can create rooms, join via code/QR, see synchronized state, and complete a basic turn cycle.

**Independent Test**: Have 3 players in separate browser tabs connect to same room, verify state syncs within 2 seconds, complete one turn (roll → draw → vote → resolve).

### Room Creation & Joining

- [X] T028 [US1] Implement create room page with host name input in app/(game)/create/page.tsx
- [X] T029 [US1] Implement room code generation (6-char alphanumeric) in lib/party/game-room.ts
- [X] T030 [US1] Implement join room page with code input in app/(game)/join/page.tsx
- [X] T031 [US1] Create QRShare component for room code sharing in components/game/QRShare.tsx
- [X] T032 [US1] Handle join message and player addition in party server in lib/party/game-room.ts

### Lobby Phase

- [X] T033 [US1] Create lobby component showing connected players in app/(game)/room/[roomId]/lobby.tsx
- [X] T034 [US1] Implement ideology selection UI with all 5 options in components/game/IdeologyPicker.tsx
- [X] T035 [US1] Handle selectIdeology message in party server in lib/party/game-room.ts
- [X] T036 [US1] Add start game button (host only, 3-5 players required) in lobby.tsx
- [X] T036a [US1] Add player count validation: prevent game start with <3 players, reject joins when room has 5 players with error message, in lib/party/game-room.ts
- [X] T037 [US1] Handle startGame message and transition to playing state in lib/party/game-room.ts

### Game Board View

- [X] T038 [US1] Create main game page that routes to lobby or board based on status in app/(game)/room/[roomId]/page.tsx
- [X] T039 [US1] Create Board component showing linear path with player positions in components/game/Board.tsx
- [X] T040 [US1] Create PlayerTrack component showing individual player state in components/game/PlayerTrack.tsx
- [X] T041 [US1] Create NationTrack component showing Stability/Budget in components/game/NationTrack.tsx

### Turn Flow - Rolling & Drawing

- [X] T042 [US1] Implement dice roll UI with animation in components/game/DiceRoll.tsx
- [X] T043 [US1] Handle rollDice message in party server in lib/party/game-room.ts
- [X] T044 [US1] Create 5 sample Decision Cards for Early Term zone in lib/game/cards/early-term.ts
- [X] T045 [US1] Implement card drawing logic in party server in lib/party/game-room.ts
- [N/A] T045a [US1] ~~Implement hidden hand mechanics~~ - Removed: game uses shared card model, not per-player hands
- [N/A] T045b [US1] ~~Add hand visibility rules~~ - Removed: FR-011 satisfied by hidden votes and influence ranges instead
- [X] T046 [US1] Create DecisionCard component showing options with tradeoffs in components/game/DecisionCard.tsx

### Turn Flow - Deliberation & Proposing

- [X] T047 [US1] Create Timer component with 3-minute countdown in components/game/Timer.tsx
- [X] T048 [US1] Implement deliberation timer in party server (auto-advance on timeout) in lib/party/game-room.ts
- [X] T049 [US1] Add option proposal UI for active player in components/game/DecisionCard.tsx
- [X] T050 [US1] Handle proposeOption message in party server in lib/party/game-room.ts

### Turn Flow - Voting & Resolution

- [X] T051 [US1] Create VotingPanel component with Yes/No/Abstain buttons in components/game/VotingPanel.tsx
- [X] T052 [US1] Implement useVoting hook for vote submission in lib/hooks/useVoting.ts
- [X] T053 [US1] Handle castVote message in party server in lib/party/game-room.ts
- [X] T054 [US1] Implement vote reveal logic (after all votes) in party server in lib/party/game-room.ts
- [X] T055 [US1] Create VoteReveal animation component in components/animations/VoteReveal.tsx
- [X] T056 [US1] Implement turn resolution (nation changes, movements) in party server in lib/party/game-room.ts
- [X] T057 [US1] Create BoardMovement animation component in components/animations/BoardMovement.tsx

### Turn Results Screen (FR-015)

- [X] T056a [US1] Create blocking TurnResults full-screen modal in components/game/TurnResults.tsx
- [X] T056b [US1] Add acknowledgment tracking (pendingAcks set) in party server state in lib/party/game-room.ts
- [X] T056c [US1] Handle acknowledgeTurnResults message and advance only when all acknowledged in party/index.ts
- [X] T056d [US1] Add 30-second timeout with auto-acknowledge for AFK players in lib/party/game-room.ts
- [X] T056e [US1] Display acknowledgment checkmarks showing which players have continued in TurnResults component

### Connection Handling

- [X] T058 [US1] Implement reconnection handling (30s window) in lib/party/game-room.ts
- [X] T059 [US1] Add connection status indicator in PlayerTrack component

### AFK Handling

- [X] T059a [US1] Add configurable AFK timeout setting (default 60 seconds) in lib/game/constants.ts
- [X] T059b [US1] Implement AFK detection timer per player in party server in lib/party/game-room.ts
- [X] T059c [US1] Apply AFK penalty (-1 influence per timeout) without eliminating player in lib/party/game-room.ts
- [X] T059d [US1] Broadcast playerAfk message and show AFK indicator in PlayerTrack component
- [X] T059e [US1] Auto-skip AFK player's turn if they are active player in party server

**Checkpoint**: User Story 1 complete - players can create, join, and play through turns

---

## Phase 4: User Story 2 - Make Policy Decisions with Tradeoffs (Priority: P2)

**Goal**: Full Decision Card system with all zones, tradeoff display, and visible consequences.

**Independent Test**: Play through Early, Mid, Crisis, and Late Term cards, verify each shows clear tradeoffs, observe Budget/Stability changes and delayed movement effects.

### Complete Card Decks

- [X] T060 [P] [US2] Create 15 Decision Cards for Mid-Term zone in lib/game/cards/mid-term.ts
- [X] T061 [P] [US2] Create 10 Decision Cards for Crisis Zone in lib/game/cards/crisis-zone.ts
- [X] T062 [P] [US2] Create 10 Decision Cards for Late Term zone in lib/game/cards/late-term.ts
- [X] T063 [US2] Implement zone-based deck selection in party server (based on player positions) in lib/party/game-room.ts

### Tradeoff Visualization

- [X] T064 [US2] Enhance DecisionCard to show Budget/Stability changes prominently in components/game/DecisionCard.tsx
- [X] T065 [US2] Add ideology alignment indicators (✓/✗) per option in DecisionCard
- [X] T066 [US2] Create card draw animation with CardReveal component in components/animations/CardReveal.tsx

### Delayed Consequences

- [X] T067 [US2] Implement nation state modifiers effect on movement in lib/game/rules.ts
- [X] T068 [US2] Add visual indicators for nation state thresholds (stable/crisis) in NationTrack
- [X] T069 [US2] Implement influence gain/loss on ideology alignment in lib/game/state-machine.ts and lib/game/rules.ts
- [X] T069a [US2] Implement partial influence visibility - show exact values only for self, ranges for others (Low/Med/High) in components/game/PlayerTrack.tsx

### Collapse Handling

- [X] T070 [US2] Implement collapse detection and game end in party server in lib/party/game-room.ts
- [X] T071 [US2] Create collapse screen with debrief in components/game/Results.tsx
- [X] T072 [US2] Add historical parallels to collapse debrief data structure in lib/game/debrief.ts

### More Information Popup (FR-017)

- [X] T072a [US2] Define IdeologyPerspective type in lib/game/types.ts (ideology, typicalStance, likelyVote fields)
- [X] T072b [P] [US2] Add ideologyPerspectives array to DecisionCard type in lib/game/types.ts
- [X] T072c [US2] Create MoreInfoPopup component with comparison table in components/game/MoreInfoPopup.tsx
- [X] T072d [US2] Add "More Info" button trigger to DecisionCard component (visible during deliberation/voting phases)
- [X] T072e [P] [US2] Add ideology perspectives data to Early Term cards in lib/game/cards/early-term.ts
- [X] T072f [P] [US2] Add ideology perspectives data to Mid-Term cards in lib/game/cards/mid-term.ts
- [X] T072g [P] [US2] Add ideology perspectives data to Crisis Zone cards in lib/game/cards/crisis-zone.ts
- [X] T072h [P] [US2] Add ideology perspectives data to Late Term cards in lib/game/cards/late-term.ts

**Checkpoint**: User Story 2 complete - full tradeoff mechanics working with educational context

---

## Phase 5: User Story 3 - Cooperate and Compete Simultaneously (Priority: P3)

**Goal**: Support Token deal system with visible consequences for breaking deals.

**Independent Test**: Give a Support Token to another player, verify the token appears in their "held" section, then have the original owner vote against their proposal and verify influence changes.

### Support Token System

- [X] T073 [US3] Create DealTracker component showing tokens given/received in components/game/DealTracker.tsx
- [X] T074 [US3] Implement useDeals hook for token management in lib/hooks/useDeals.ts
- [X] T075 [US3] Handle giveToken message in party server in lib/party/game-room.ts
- [X] T076 [US3] Add token transfer animation (drag gesture) in DealTracker component
- [X] T077 [US3] Implement deal resolution logic (honored/broken) on vote in lib/party/game-room.ts
- [X] T078 [US3] Add influence change effects for broken deals (+1 holder, -1 breaker) in lib/party/game-room.ts

### Influence Spending

- [X] T079 [US3] Add influence spending UI in VotingPanel (buy extra votes) in components/game/VotingPanel.tsx
- [X] T080 [US3] Implement influence spending for extra movement in lib/game/rules.ts
- [X] T081 [US3] Add influence spending to negate backward movement in VotingPanel

### Negotiation Support

- [X] T082 [US3] Add simple chat/negotiation message system in party server in lib/party/game-room.ts
- [X] T083 [US3] Create chat message display component in components/game/ChatPanel.tsx

### Crisis Event System

- [X] T084 [US3] Define crisis event data structure (type, severity, contribution threshold, consequences) in lib/game/crises.ts
- [X] T085 [P] [US3] Create 5 sample crisis events (economic crash, social unrest, external threat, institutional breakdown, resource shortage) in lib/game/crises.ts
- [X] T086 [US3] Implement crisis trigger logic based on nation state thresholds in lib/party/game-room.ts
- [X] T087 [US3] Create CrisisPanel component showing active crisis and contribution options in components/game/CrisisPanel.tsx
- [X] T088 [US3] Handle contributeToCrisis message in party server (resource contribution) in lib/party/game-room.ts
- [X] T089 [US3] Implement crisis resolution (success/failure based on total contributions) in lib/party/game-room.ts

**Checkpoint**: User Story 3 complete - coopetition mechanics working

---

## Phase 6: User Story 4 - Learn Political Concepts Through Play (Priority: P4)

**Goal**: Post-game summary showing political concepts demonstrated during play.

**Independent Test**: Complete a full game (win or collapse), view summary, verify at least 3 political concepts are explained with examples from the game.

### Concept Tracking

- [X] T090 [US4] Define political concepts list (coalition building, budget constraints, etc.) in lib/game/concepts.ts
- [X] T091 [US4] Implement concept tracking during game (which concepts were demonstrated) in lib/party/game-room.ts
- [X] T092 [US4] Store turn history for post-game debrief in party server state

### Post-Game Summary

- [X] T093 [US4] Create results page with victory/collapse outcome in app/(game)/room/[roomId]/results.tsx
- [X] T094 [US4] Display political concepts with examples from the game in results page
- [X] T095 [US4] Add historical parallel notes to card display (when available) in DecisionCard
- [X] T096 [US4] Create collapse debrief explaining what went wrong and real-world parallels

**Checkpoint**: User Story 4 complete - educational pillar functional

---

## Phase 7: User Story 5 - Multiple Paths to Victory (Priority: P5)

**Goal**: Victory conditions with influence requirement, tiebreaker handling.

**Independent Test**: Win a game by reaching the end with ≥3 Influence, try to win with <3 Influence and verify being stopped one space before.

### Victory Mechanics

- [X] T097 [US5] Implement victory check on each resolution (position + influence) in lib/party/game-room.ts
- [X] T098 [US5] Add "waiting" state for players at end with <3 Influence in lib/game/rules.ts
- [X] T099 [US5] Implement tiebreaker (highest influence if same turn) in lib/party/game-room.ts

### Victory Screen

- [X] T100 [US5] Create victory screen showing winner and final positions in results.tsx
- [X] T101 [US5] Add ideology-based strategy summary (how winner's ideology helped) in results page

**Checkpoint**: User Story 5 complete - full game loop working

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Animations & UX

- [X] T102 [P] Add reduced motion preference support in app/layout.tsx
- [X] T103 [P] Implement mobile swipe gestures for voting in VotingPanel
- [X] T104 [P] Add loading states for all async operations
- [X] T105 [P] Implement toast notifications for game events (player joined, deal broken, etc.)

### Performance & Reliability

- [X] T106 [P] Add optimistic UI updates for common actions (vote, roll)
- [X] T107 [P] Implement room auto-cleanup after 2 hours inactivity in party server
- [X] T108 [P] Add error boundary and fallback UI in app/layout.tsx

### Documentation & Validation

- [X] T109 Run quickstart.md validation - verify all steps work
- [X] T110 Add 5 more Decision Cards per zone (polish content)
- [X] T111 Verify all cards have historical notes for educational value

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 must complete before US2-5 (provides base game flow)
  - US2-5 can proceed in parallel after US1 (if staffed)
  - Or sequentially: US1 → US2 → US3 → US4 → US5
- **Polish (Phase 8)**: Depends on US1-US3 minimum being complete

### User Story Dependencies

- **User Story 1 (P1)**: Foundation only - No dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 (game board, card display)
- **User Story 3 (P3)**: Depends on US1 (voting system); can parallel with US2
- **User Story 4 (P4)**: Depends on US1, US2 (game completion flow)
- **User Story 5 (P5)**: Depends on US1 (board movement); can parallel with US2-4

### Within Each User Story

- Models/Types before services
- Server handlers before client components
- Core functionality before animations
- Basic flow before edge cases

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel
- Once US1 complete: US2, US3, US5 can proceed in parallel
- All card deck tasks (T060-T062) can run in parallel
- All ideology perspectives tasks (T072e-T072h) can run in parallel
- All Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 2

```bash
# Launch all card deck creation in parallel:
Task: "Create 15 Decision Cards for Mid-Term zone in lib/game/cards/mid-term.ts"
Task: "Create 10 Decision Cards for Crisis Zone in lib/game/cards/crisis-zone.ts"
Task: "Create 10 Decision Cards for Late Term zone in lib/game/cards/late-term.ts"

# Launch all ideology perspectives content in parallel (after T072a-d complete):
Task: "Add ideology perspectives data to Early Term cards in lib/game/cards/early-term.ts"
Task: "Add ideology perspectives data to Mid-Term cards in lib/game/cards/mid-term.ts"
Task: "Add ideology perspectives data to Crisis Zone cards in lib/game/cards/crisis-zone.ts"
Task: "Add ideology perspectives data to Late Term cards in lib/game/cards/late-term.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T008)
2. Complete Phase 2: Foundational (T009-T027)
3. Complete Phase 3: User Story 1 (T028-T059)
4. **STOP and VALIDATE**: Test with 3 players, complete one full turn
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready (27 tasks)
2. + User Story 1 → Playable MVP (34 tasks)
3. + User Story 2 → Full card system (14 tasks)
4. + User Story 3 → Coopetition mechanics (17 tasks)
5. + User Story 4 → Educational features (7 tasks)
6. + User Story 5 → Complete victory conditions (5 tasks)
7. + Polish → Production ready (10 tasks)

### Suggested MVP Scope

Complete **Phase 1 + Phase 2 + Phase 3 (US1)** for minimal playable game:
- 61 tasks total for MVP
- Players can: create room, join, pick ideology, play turns, see vote results, move on board

---

## Task Summary

| Phase | User Story | Task Count | Parallelizable |
|-------|------------|------------|----------------|
| 1 | Setup | 8 | 7 |
| 2 | Foundational | 19 | 10 |
| 3 | US1 (Join & Play) | 42 | 0 (sequential flow) |
| 4 | US2 (Tradeoffs) | 22 | 7 |
| 5 | US3 (Coopetition) | 17 | 1 |
| 6 | US4 (Education) | 7 | 0 |
| 7 | US5 (Victory) | 5 | 0 |
| 8 | Polish | 10 | 6 |
| **Total** | | **130** | **31** |

*Note: T045a and T045b marked N/A (removed from scope). T056a-e and T059a-e added for Turn Results and AFK handling. T072a-h added for FR-017 More Information popup.*

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable after US1
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Decision Card content (T044, T060-T062, T110) can be expanded iteratively
