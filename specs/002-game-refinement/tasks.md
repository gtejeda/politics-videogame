# Tasks: Game Refinement - UI, Learning & Fun

**Input**: Design documents from `/specs/002-game-refinement/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Optional - unit tests included in Polish phase based on plan.md test structure.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create foundational data structures, stores, and hooks shared across all user stories

- [X] T001 Create UI state store for tabs and help state in src/lib/stores/ui-store.ts
- [X] T002 Create player preferences hook with localStorage in src/lib/hooks/usePlayerPrefs.ts
- [X] T003 [P] Create turn history types and utilities in src/lib/game/turn-history.ts
- [X] T004 [P] Create help content data structure in src/lib/game/help-content.ts
- [X] T005 [P] Create tutorial step definitions in src/lib/game/tutorial-steps.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Tabbed UI layout that MUST be complete before user stories can be implemented

**⚠️ CRITICAL**: The tabbed layout restructures the entire game UI. All user stories depend on this.

- [X] T006 Create GameLayout component with Radix UI Tabs wrapper in src/components/game/GameLayout.tsx
- [X] T007 Create PlayersBar component with nation status header in src/components/game/PlayersBar.tsx
- [X] T008 Create ActionTab component (extract from Board.tsx) in src/components/game/ActionTab.tsx
- [X] T009 [P] Create DealsTab component (FR-028) in src/components/game/DealsTab.tsx displaying: (1) active deals with participants and terms, (2) pending deal requests with accept/reject actions, (3) deal history for current game showing honored/broken status
- [X] T010 [P] Create HistoryTab component (FR-029) in src/components/game/HistoryTab.tsx with chronological turn list container; individual turn content rendered by TurnHistoryEntry (T013)
- [X] T011 Modify Board.tsx to use new GameLayout structure in src/components/game/Board.tsx
- [X] T012 Modify room page to integrate GameLayout in src/app/room/[roomId]/page.tsx
- [X] T013 Create TurnHistoryEntry component for History tab in src/components/game/TurnHistoryEntry.tsx
- [X] T013a [US5] Integrate VoteBreakdown into TurnHistoryEntry for History tab vote display in src/components/game/TurnHistoryEntry.tsx (depends on T054)
- [X] T014 Add turn history event emission in party/index.ts
- [X] T015 Create useTurnHistory hook for accessing history in src/lib/hooks/useTurnHistory.ts

**Checkpoint**: Tabbed layout functional - Players bar visible, all three tabs accessible, history records turns (vote breakdown in History deferred to Phase 7 T013a)

---

## Phase 3: User Story 1 - First-Time Player Onboarding (Priority: P1) 🎯 MVP

**Goal**: New players can learn the game through tutorial, expanded ideology cards, and contextual hints

**Independent Test**: Clear localStorage, join game, verify "How to Play" accessible, ideology cards expand on hover, first-game hints appear during turns 1-2

### Implementation for User Story 1

- [X] T016 [P] [US1] Create Tutorial component with step navigation in src/components/game/Tutorial.tsx
- [X] T017 [P] [US1] Create IdeologyCard expanded view component in src/components/game/IdeologyCard.tsx
- [X] T018 [P] [US1] Create FirstGameHints component for contextual tips in src/components/game/FirstGameHints.tsx
- [X] T019 [US1] Create useFirstGame hook for first-game detection in src/lib/hooks/useFirstGame.ts
- [X] T020 [US1] Modify IdeologyPicker to show expanded cards on hover/tap in src/components/game/IdeologyPicker.tsx
- [X] T021 [US1] Add "How to Play" button to Lobby component in src/components/game/Lobby.tsx
- [X] T022 [US1] Integrate FirstGameHints into ActionTab for phase-specific hints in src/components/game/ActionTab.tsx
- [X] T023 [US1] Add settings section to Lobby with hint toggle (usePlayerPrefs) in src/components/game/Lobby.tsx; toggle MUST support both disable and re-enable; toggle only visible/functional in Lobby before game starts per edge case requirement

**Checkpoint**: User Story 1 complete - New players can access tutorial, see expanded ideology info, receive first-game hints

---

## Phase 4: User Story 2 - Political Concept Visibility (Priority: P2)

**Goal**: Post-game debrief shows political concepts demonstrated during gameplay with specific examples

**Independent Test**: Complete a 5+ turn game, verify debrief shows at least 3 concepts with game-specific examples; trigger collapse, verify historical parallel appears

### Implementation for User Story 2

- [X] T024 [P] [US2] Create ConceptCard component for displaying single concept in src/components/game/ConceptCard.tsx
- [X] T025 [P] [US2] Create GameDebrief component for post-game summary in src/components/game/GameDebrief.tsx
- [X] T026 [P] [US2] Create CollapseDebrief component with historical parallels in src/components/game/CollapseDebrief.tsx
- [X] T027 [P] [US2] Create ImpactAnalysis component for decision impact in src/components/game/ImpactAnalysis.tsx
- [X] T028 [US2] Create useConceptTracking hook for game event monitoring in src/lib/hooks/useConceptTracking.ts
- [X] T029 [US2] Add concept demonstration event emission in party/index.ts
- [X] T030 [US2] Generate GameDebrief data on game end in party/index.ts, including: (1) collect demonstrated concepts from game events, (2) for games 5+ turns: ensure minimum 3 concepts shown, (3) for games <5 turns: show available concepts with message "More concepts emerge in longer games"
- [X] T031 [US2] Modify Results.tsx to integrate GameDebrief display in src/components/game/Results.tsx
- [X] T032 [US2] Calculate ideology alignment percentage in debrief generation in party/index.ts
- [X] T033 [US2] Calculate vote impact scores for "most impactful" identification in party/index.ts

**Checkpoint**: User Story 2 complete - Post-game debrief shows concepts, collapse shows historical parallel, impact analysis works

---

## Phase 5: User Story 3 - Enhanced Visual Feedback (Priority: P3)

**Goal**: Key game moments (victory, collapse, deal breach, vote reveal) have dramatic visual effects

**Independent Test**: Trigger victory (celebratory animation), trigger collapse (dramatic sequence), break a deal (shake effect), observe vote (sequential reveal)

### Implementation for User Story 3

- [X] T034 [P] [US3] Create Confetti animation component in src/components/animations/Confetti.tsx
- [X] T035 [P] [US3] Create Collapse animation component in src/components/animations/Collapse.tsx
- [X] T036 [P] [US3] Create TrustBroken animation component in src/components/animations/TrustBroken.tsx
- [X] T037 [P] [US3] Create SequentialReveal animation component in src/components/animations/SequentialReveal.tsx
- [X] T038 [US3] Create VictoryCelebration component using Confetti in src/components/game/VictoryCelebration.tsx
- [X] T039 [US3] Create CollapseSequence component using Collapse animation in src/components/game/CollapseSequence.tsx
- [X] T040 [US3] Create DealBreachEffect component using TrustBroken in src/components/game/DealBreachEffect.tsx
- [X] T041 [US3] Integrate VictoryCelebration into Results.tsx in src/components/game/Results.tsx
- [X] T042 [US3] Integrate CollapseSequence before CollapseDebrief in src/components/game/Results.tsx
- [X] T043 [US3] Integrate DealBreachEffect into Board.tsx deal breach handling: (1) Import DealBreachEffect component, (2) Add state for breachingPlayer and breachedDeal, (3) In gameRoom.subscribe handler for 'deal-broken' event, set breach state to trigger effect, (4) Render DealBreachEffect when breach state is active, (5) Clear breach state after animation completes (0.3s per FR-013)
- [X] T044 [US3] Create VoteReveal component using SequentialReveal for suspenseful vote display in src/components/animations/VoteReveal.tsx, then integrate into voting result flow in ActionTab.tsx
- [X] T044a [P] [US3] Create CrisisResolution component (FR-014) in src/components/game/CrisisResolution.tsx showing: (1) crisis threshold vs current contribution, (2) each player's support token contribution with visual representation, (3) success/failure outcome with appropriate animation (green pulse for success, red fade for failure)
- [X] T044b [US3] Integrate CrisisResolution (FR-014) into Board.tsx crisis outcome flow, displaying between crisis resolution and turn advancement
- [X] T044c [P] [US3] Add prefers-reduced-motion support (FR-015a) to all animation components in src/components/animations/*.tsx: (1) Confetti.tsx - replace particle animation with static celebration icon, (2) Collapse.tsx - replace deterioration sequence with instant dark overlay, (3) TrustBroken.tsx - replace shake with red border highlight, (4) SequentialReveal.tsx - replace staggered reveal with instant display. Use Framer Motion useReducedMotion() hook or CSS media query

**Checkpoint**: User Story 3 complete - All key moments have appropriate dramatic visual feedback

---

## Phase 6: User Story 4 - In-Game Help & Context (Priority: P4)

**Goal**: Players can access contextual help during any game phase; game terms have tooltip explanations

**Independent Test**: During each game phase, click help icon and verify phase-specific content; hover over terms (Influence, Stability) and verify tooltip appears

### Implementation for User Story 4

- [X] T045 [P] [US4] Create HelpIcon component (persistent button) in src/components/game/HelpIcon.tsx
- [X] T046 [P] [US4] Create HelpOverlay component for contextual help panel in src/components/game/HelpOverlay.tsx
- [X] T047 [P] [US4] Create TermTooltip component for game term explanations in src/components/game/TermTooltip.tsx
- [X] T048 [US4] Populate help-content.ts in src/lib/game/help-content.ts with: (a) phase-specific help content for all game phases, (b) term definitions for Influence, Stability, Budget, Support Tokens, (c) deal system explanation with examples and consequences

<!-- Note: T049-T050 reserved for future help system expansion -->
- [X] T051 [US4] Integrate HelpIcon into GameLayout (visible in all tabs) in src/components/game/GameLayout.tsx
- [X] T052 [US4] Add TermTooltip wrappers to game terms in ActionTab in src/components/game/ActionTab.tsx
- [X] T053 [US4] Add TermTooltip wrappers to PlayersBar metrics in src/components/game/PlayersBar.tsx

**Checkpoint**: User Story 4 complete - Help icon accessible everywhere, contextual content displays, terms have tooltips

---

## Phase 7: User Story 5 - Decision Impact Awareness (Priority: P5)

**Goal**: Players see clear feedback on vote outcomes, movement calculations, and decision impact

**Independent Test**: After any vote, verify vote-by-vote breakdown visible; after movement, verify dice+modifiers breakdown; in debrief, verify "most impactful" votes identified

### Implementation for User Story 5

- [X] T054 [P] [US5] Create VoteBreakdown component for vote-by-vote display in src/components/game/VoteBreakdown.tsx
- [X] T055 [P] [US5] Create MovementBreakdown component for dice+modifiers in src/components/game/MovementBreakdown.tsx
- [X] T056 [US5] Modify TurnResults to integrate VoteBreakdown in src/components/game/TurnResults.tsx
- [X] T057 [US5] Modify TurnResults to integrate MovementBreakdown in src/components/game/TurnResults.tsx
- [X] T058 [US5] Add margin display ("Passed 3-2") to VoteBreakdown in src/components/game/VoteBreakdown.tsx
- [X] T059 [US5] Integrate "most impactful votes" into ImpactAnalysis display in src/components/game/ImpactAnalysis.tsx
- [X] T060 [US5] Integrate ideology alignment percentage into ImpactAnalysis in src/components/game/ImpactAnalysis.tsx

**Checkpoint**: User Story 5 complete - Vote breakdown, movement breakdown, and impact analysis all functional

---

## Phase 8: User Story 6 - Role-Based Views (Priority: P6)

**Goal**: Active player (proposer) sees full options; non-active players see topic + ideology comparison only

**Independent Test**: With 2 browser windows in same room, verify active player sees all options while other player sees only topic title, description, ideology table, and nation impact preview

### Implementation for User Story 6

- [X] T061 [P] [US6] Create ProposerView component for active player option display in src/components/game/ProposerView.tsx
- [X] T062 [P] [US6] Create ObserverView component for non-active player display in src/components/game/ObserverView.tsx
- [X] T063 [US6] Modify ReviewPhase to detect player role and render appropriate view in src/components/game/ReviewPhase.tsx
- [X] T064 [US6] Emit role-specific messages from server (proposer vs observer) in party/index.ts
- [X] T065 [US6] Add ideology comparison table to ObserverView in src/components/game/ObserverView.tsx
- [X] T066 [US6] Add nation impact preview (budget/stability ranges) to ObserverView in src/components/game/ObserverView.tsx
- [X] T067 [US6] Add advancement reveal after vote in party/index.ts
- [X] T068 [US6] Display advancement effects post-vote in TurnResults in src/components/game/TurnResults.tsx; before vote shows "Movement effects revealed after vote" placeholder per FR-034

**Checkpoint**: User Story 6 complete - Role-based views working, advancement hidden until after vote

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Testing, cleanup, and integration verification

- [X] T069 [P] Create concept-tracking unit tests in tests/unit/concept-tracking.test.ts
- [X] T070 [P] Create help-content coverage tests in tests/unit/help-content.test.ts
- [X] T071 [P] Create turn-history tracking tests in tests/unit/turn-history.test.ts
- [X] T072 [P] Create tabbed-layout integration tests in tests/integration/tabbed-layout.test.ts
- [X] T073 Verify all tabs work on mobile viewport sizes
- [X] T074 Verify help overlay is semi-transparent (game visible behind)
- [ ] T075 Run full playthrough test with all features enabled
- [ ] T076 Verify quickstart.md scenarios work as documented
- [X] T076a Verify tab switching performance meets <50ms target (FR-030) using browser DevTools Performance tab

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - can start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 - BLOCKS all user stories
- **Phase 3-8 (User Stories)**: All depend on Phase 2 completion
  - User stories can proceed in parallel OR sequentially in priority order
- **Phase 9 (Polish)**: Depends on all desired user stories being complete

### User Story Dependencies

| Story | Priority | Can Start After | Dependencies on Other Stories |
|-------|----------|-----------------|-------------------------------|
| US1 - Onboarding | P1 | Phase 2 | None - fully independent |
| US2 - Concepts | P2 | Phase 2 | None - fully independent |
| US3 - Visual Feedback | P3 | Phase 2 | None - fully independent |
| US4 - Help System | P4 | Phase 2 | None - fully independent |
| US5 - Decision Impact | P5 | Phase 2 | None - fully independent |
| US6 - Role-Based Views | P6 | Phase 2 | None - fully independent |

All stories are independently implementable and testable after Phase 2 completes.

### Within Each User Story

1. Components marked [P] can be created in parallel
2. Integration tasks depend on component creation
3. Server-side tasks (party/index.ts) should be completed before client integration

---

## Parallel Example: User Story 3 (Visual Feedback)

```bash
# Launch all animation components in parallel (T034-T037):
Task: "Create Confetti animation component in src/components/animations/Confetti.tsx"
Task: "Create Collapse animation component in src/components/animations/Collapse.tsx"
Task: "Create TrustBroken animation component in src/components/animations/TrustBroken.tsx"
Task: "Create SequentialReveal animation component in src/components/animations/SequentialReveal.tsx"

# Then launch game components that use them (T038-T040):
Task: "Create VictoryCelebration component using Confetti in src/components/game/VictoryCelebration.tsx"
Task: "Create CollapseSequence component using Collapse animation in src/components/game/CollapseSequence.tsx"
Task: "Create DealBreachEffect component using TrustBroken in src/components/game/DealBreachEffect.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational tabbed layout (T006-T015)
3. Complete Phase 3: User Story 1 - Onboarding (T016-T023)
4. **STOP and VALIDATE**: Test onboarding independently
5. Deploy/demo if ready - new players can now learn the game

### Incremental Delivery

1. Setup + Foundational → Tabbed UI ready
2. Add US1 (Onboarding) → Deploy (players can learn game)
3. Add US2 (Concepts) → Deploy (post-game debrief works)
4. Add US3 (Visual Feedback) → Deploy (game feels exciting)
5. Add US4 (Help) → Deploy (players can get help anytime)
6. Add US5 (Decision Impact) → Deploy (feedback loop closed)
7. Add US6 (Role-Based Views) → Deploy (full feature set)
8. Polish → Final release

### Parallel Team Strategy

With 3 developers after Phase 2:
- Developer A: US1 (Onboarding) + US4 (Help)
- Developer B: US2 (Concepts) + US5 (Decision Impact)
- Developer C: US3 (Visual Feedback) + US6 (Role-Based Views)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All components use existing Radix UI and Framer Motion - no new dependencies
