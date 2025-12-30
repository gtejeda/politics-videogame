# Implementation Plan: Game Refinement - UI, Learning & Fun

**Branch**: `002-game-refinement` | **Date**: 2025-12-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-game-refinement/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Refinement of the existing politics game to enhance user experience, surface hidden educational content, and add dramatic visual feedback. Key changes: (1) Tabbed UI layout eliminating scrolling (Players bar + Action/Deals/History tabs), (2) Role-based views differentiating active player from observers, (3) Post-game debrief surfacing political concepts, (4) First-time player onboarding and contextual help, (5) Enhanced visual feedback for key moments (victory, collapse, deal breach). Builds entirely on existing Next.js/PartyKit/Framer Motion stack.

## Technical Context

**Language/Version**: TypeScript 5.3+, Node.js 20 LTS (existing)
**Primary Dependencies**: Next.js 14.2, PartyKit 0.0.115, React 18.2, XState 5.0, Zustand 4.4, Framer Motion 10.16, Radix UI (including @radix-ui/react-tabs 1.1.13), Tailwind CSS 3.4 (all existing)
**Storage**: In-memory (PartyKit server state) + localStorage for player preferences (hints disabled, tutorial completed)
**Testing**: Vitest 3.2 with jsdom (existing)
**Target Platform**: Web browser (desktop/mobile responsive), PartyKit edge runtime (existing)
**Project Type**: Web application enhancement (frontend-focused refinement)
**Performance Goals**: Tab switching <50ms, animation 60fps, help overlay <100ms render
**Constraints**: No new external dependencies; leverage existing animation system; content is static (not AI-generated)
**Scale/Scope**: Enhancement to existing game; no new persistent storage; no new API routes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Compliance Verification

| Principle | Status | Evidence/Notes |
|-----------|--------|----------------|
| I. Ideological Neutrality | PASS | FR-003 shows all 5 ideologies equally; no ideology favored in tutorial |
| II. Mandatory Tradeoffs | PASS | Existing tradeoff system unchanged; debrief surfaces tradeoff lessons |
| III. Systems Over Individuals | PASS | Tutorial teaches institutional mechanics, not hero powers |
| IV. Imperfect Information | PASS | FR-033/FR-034 maintain hidden info (options hidden from non-active, advancement hidden until after vote) |
| V. Delayed Consequences | PASS | History tab shows delayed effects chain; debrief connects past decisions to outcomes |
| VI. Mechanics Teach | PASS | FR-006-010 surface political concepts through debrief; FR-002 teaches via tutorial |
| VII. Ideologies as Toolkits | PASS | FR-003/FR-032 show ideology comparison without favoring any |
| VIII. No Utopias | PASS | Post-game debrief shows unresolved tensions (FR-008 collapse parallels) |
| IX. Conflict Without Villains | PASS | Deal breach feedback (FR-013) shows consequences without moral judgment |
| X. Multiple Victory Paths | PASS | Tutorial explains multiple strategies; no single path emphasized |
| XI. Instructive Failure | PASS | FR-008 collapse debrief with historical parallels; FR-023 impact analysis |
| XII. Minimal Political Model | PASS | Uses existing core resources (Budget, Stability, Influence) |
| XIII. Bias-Aware Playtesting | PASS | FR-024 ideology alignment percentage helps detect bias |
| XIV. Expansion-Ready Design | PASS | Tabbed UI easily extensible; help content modular |
| XV. Real-Time Multiplayer | PASS | All features work with existing PartyKit sync; no blocking operations |
| XVI. Coopetition | PASS | Deals tab emphasizes cooperative dimension; History shows competitive outcomes |
| XVII. Education as Pillar | PASS | Core focus: FR-001-010 onboarding/concepts; SC-003/SC-005 measure learning |

### Design Constraints Checklist

| Requirement | Verification | Status |
|-------------|--------------|--------|
| Tradeoff | Tutorial teaches tradeoffs; debrief surfaces them | PASS |
| Neutrality | All ideologies presented equally in FR-003/FR-032 | PASS |
| Institutional | Help explains institutional mechanics, not bypasses | PASS |
| Explainable Randomness | FR-022 shows movement breakdown with clear modifiers | PASS |
| No Correct Answer | Ideology comparison shows typical stances without "best" | PASS |
| Extensibility | Tabbed UI, modular help entries support expansion | PASS |
| Real-Time Compatible | All UI changes client-side; no server blocking | PASS |
| Coopetition | Deals tab + History tab show both dimensions | PASS |
| Educational Value | Onboarding (FR-001-005), Concepts (FR-006-010), Help (FR-016-019) | PASS |

**GATE STATUS: PASSED** - All constitution principles verified. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/002-game-refinement/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── game-events.ts   # New/modified WebSocket event types
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── room/[roomId]/page.tsx    # Modified: integrate tabbed layout
├── components/
│   ├── ui/
│   │   └── tabs.tsx              # Already exists (Radix UI tabs)
│   ├── game/
│   │   ├── Board.tsx             # Modified: restructure for tabbed layout
│   │   ├── GameLayout.tsx        # NEW: Main tabbed container
│   │   ├── PlayersBar.tsx        # NEW: Always-visible players + nation status
│   │   ├── ActionTab.tsx         # NEW: Active gameplay (was in Board.tsx)
│   │   ├── DealsTab.tsx          # NEW: Deal management view
│   │   ├── HistoryTab.tsx        # NEW: Turn history with vote breakdown
│   │   ├── TurnHistoryEntry.tsx  # NEW: Single turn record component
│   │   ├── HelpOverlay.tsx       # NEW: Contextual help system
│   │   ├── HelpIcon.tsx          # NEW: Persistent help button
│   │   ├── TermTooltip.tsx       # NEW: Game term explanations
│   │   ├── Tutorial.tsx          # NEW: How to Play guide
│   │   ├── IdeologyCard.tsx      # NEW: Expanded ideology explanation
│   │   ├── FirstGameHints.tsx    # NEW: Contextual first-game hints
│   │   ├── GameDebrief.tsx       # NEW: Post-game concept summary
│   │   ├── CollapseDebrief.tsx   # NEW: Nation collapse educational screen
│   │   ├── ConceptCard.tsx       # NEW: Single concept display
│   │   ├── VictoryCelebration.tsx # NEW: Victory animation
│   │   ├── CollapseSequence.tsx  # NEW: Dramatic collapse animation
│   │   ├── DealBreachEffect.tsx  # NEW: Trust broken visual effect
│   │   ├── ReviewPhase.tsx       # Modified: role-based views
│   │   ├── ProposerView.tsx      # NEW: Active player option selection
│   │   ├── ObserverView.tsx      # NEW: Non-active player info view
│   │   ├── MovementBreakdown.tsx # NEW: Dice + modifiers visualization
│   │   ├── VoteBreakdown.tsx     # NEW: Vote-by-vote display
│   │   ├── ImpactAnalysis.tsx    # NEW: Post-game decision impact
│   │   └── Results.tsx           # Modified: integrate debrief
│   └── animations/
│       ├── Confetti.tsx          # NEW: Victory confetti
│       ├── Collapse.tsx          # NEW: Nation collapse effect
│       ├── TrustBroken.tsx       # NEW: Deal breach shake effect
│       └── SequentialReveal.tsx  # NEW: Suspenseful vote reveal
├── lib/
│   ├── game/
│   │   ├── concepts.ts           # Existing: concept matching logic
│   │   ├── debrief.ts            # Existing: historical parallels
│   │   ├── help-content.ts       # NEW: Help text by phase/term
│   │   ├── tutorial-steps.ts     # NEW: Tutorial step definitions
│   │   └── turn-history.ts       # NEW: Turn history tracking
│   ├── hooks/
│   │   ├── useConceptTracking.ts # NEW: Track concepts during game
│   │   ├── useFirstGame.ts       # NEW: First-game detection/hints
│   │   ├── usePlayerPrefs.ts     # NEW: LocalStorage preferences
│   │   └── useTurnHistory.ts     # NEW: Access turn history
│   └── stores/
│       └── ui-store.ts           # NEW: Active tab, help open state

party/
└── index.ts                      # Modified: track turn history events

tests/
├── unit/
│   ├── concept-tracking.test.ts  # NEW: Concept detection tests
│   ├── help-content.test.ts      # NEW: Help content coverage
│   └── turn-history.test.ts      # NEW: History tracking tests
└── integration/
    └── tabbed-layout.test.ts     # NEW: Tab navigation tests
```

**Structure Decision**: Frontend-focused enhancement to existing web application. New components organized by feature area (UI layout, help system, debrief, animations). Minimal server-side changes (turn history event emission). Uses existing Radix UI tabs component.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. All constitution principles are satisfied by the current design.
