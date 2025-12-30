# Quickstart: Game Refinement - UI, Learning & Fun

**Feature**: 002-game-refinement
**Date**: 2025-12-29

## Prerequisites

- Node.js 20 LTS
- Existing `001-politics-game-core` implementation complete
- Dependencies installed (`npm install`)

## Development Setup

```bash
# Start Next.js dev server
npm run dev

# In separate terminal, start PartyKit dev server
npm run party:dev
```

## Feature Areas

This refinement touches 5 main areas. Here's how to work on each:

### 1. Tabbed UI Layout

**Files to modify:**
- `src/components/game/Board.tsx` - Restructure for tabbed layout
- `src/components/game/GameLayout.tsx` - NEW: Main container

**Key components to create:**
- `PlayersBar.tsx` - Always-visible header with players + nation status
- `ActionTab.tsx` - Move gameplay elements here
- `DealsTab.tsx` - Deal management (similar to existing DealTracker)
- `HistoryTab.tsx` - Turn history display

**Test:**
```bash
# Navigate to game room
open http://localhost:3000/room/test-room

# Verify:
# - Players bar visible at all times
# - Three tabs: Action, Deals, History
# - Tab switching is instant
# - No scrolling needed
```

### 2. Role-Based Views

**Files to modify:**
- `src/components/game/ReviewPhase.tsx` - Add role detection
- `party/index.ts` - Emit role-specific messages

**Key components to create:**
- `ProposerView.tsx` - Shows all options for active player
- `ObserverView.tsx` - Shows topic + ideology comparison only

**Test:**
```bash
# Open two browser windows to same room
# Start game, observe review phase
# Active player should see options
# Other player should see topic + ideology table only
```

### 3. Political Concept Debrief

**Files to modify:**
- `src/lib/game/concepts.ts` - Already has concept definitions
- `party/index.ts` - Add concept tracking during turns
- `src/components/game/Results.tsx` - Integrate debrief

**Key components to create:**
- `GameDebrief.tsx` - Post-game concept summary
- `CollapseDebrief.tsx` - Historical parallel for collapses
- `ConceptCard.tsx` - Single concept display

**Key logic to create:**
- `src/lib/hooks/useConceptTracking.ts` - Track concepts during game

**Test:**
```bash
# Complete a full game
# Verify debrief shows:
# - At least 3 concepts for 5+ turn games
# - Specific examples from gameplay
# - Historical parallel if nation collapsed
```

### 4. Onboarding & Help

**Files to modify:**
- `src/components/game/Lobby.tsx` - Add "How to Play" button
- `src/components/game/IdeologyPicker.tsx` - Add expanded cards

**Key components to create:**
- `Tutorial.tsx` - How to Play guide
- `IdeologyCard.tsx` - Expanded ideology explanation
- `HelpOverlay.tsx` - Contextual help panel
- `HelpIcon.tsx` - Persistent help button
- `TermTooltip.tsx` - Game term explanations
- `FirstGameHints.tsx` - Contextual hints

**Key data to create:**
- `src/lib/game/help-content.ts` - Help text by phase/term
- `src/lib/game/tutorial-steps.ts` - Tutorial step definitions

**Test:**
```bash
# Clear localStorage to simulate new player
localStorage.clear()

# Join game, verify:
# - "How to Play" accessible from lobby
# - Ideology cards expand on hover/tap
# - First-game hints appear turns 1-2
# - Help icon visible during all phases
# - Terms show tooltips on hover
```

### 5. Visual Feedback & Animations

**Files to modify:**
- `src/components/game/TurnResults.tsx` - Add movement breakdown
- `src/components/game/VotingPanel.tsx` - Add sequential reveal

**Key components to create:**
- `VictoryCelebration.tsx` - Victory confetti
- `CollapseSequence.tsx` - Dramatic collapse effect
- `DealBreachEffect.tsx` - Trust broken shake
- `MovementBreakdown.tsx` - Dice + modifiers visualization
- `VoteBreakdown.tsx` - Vote-by-vote display
- `SequentialReveal.tsx` - Suspenseful vote reveal

**Animation files:**
- `src/components/animations/Confetti.tsx`
- `src/components/animations/Collapse.tsx`
- `src/components/animations/TrustBroken.tsx`

**Test:**
```bash
# Trigger each animation:
# - Victory: First player reaches end with 3+ influence
# - Collapse: Drive stability or budget below threshold
# - Deal breach: Make a deal then vote against it
# - Vote reveal: Any vote during game
```

## Key Patterns

### Using Radix UI Tabs

```tsx
import * as Tabs from '@radix-ui/react-tabs';

<Tabs.Root defaultValue="action">
  <Tabs.List>
    <Tabs.Trigger value="action">Action</Tabs.Trigger>
    <Tabs.Trigger value="deals">Deals</Tabs.Trigger>
    <Tabs.Trigger value="history">History</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="action">
    <ActionTab />
  </Tabs.Content>
  {/* ... */}
</Tabs.Root>
```

### LocalStorage Preferences

```tsx
// src/lib/hooks/usePlayerPrefs.ts
export function usePlayerPrefs() {
  const [prefs, setPrefs] = useState<PlayerPreferences>(() => {
    const stored = localStorage.getItem('playerPrefs');
    return stored ? JSON.parse(stored) : {
      tutorialCompleted: false,
      gamesPlayed: 0,
      hintsEnabled: true,
    };
  });

  const updatePrefs = (updates: Partial<PlayerPreferences>) => {
    const newPrefs = { ...prefs, ...updates };
    localStorage.setItem('playerPrefs', JSON.stringify(newPrefs));
    setPrefs(newPrefs);
  };

  return { prefs, updatePrefs };
}
```

### Framer Motion Animations

```tsx
// src/components/animations/Confetti.tsx
import { motion } from 'framer-motion';

export function Confetti() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 pointer-events-none"
    >
      {/* Particle elements */}
    </motion.div>
  );
}
```

### Concept Tracking Hook

```tsx
// src/lib/hooks/useConceptTracking.ts
export function useConceptTracking(gameState: GameState) {
  const [instances, setInstances] = useState<ConceptInstance[]>([]);

  useEffect(() => {
    // Listen for concept trigger events
    // Add to instances array
  }, [gameState]);

  return instances;
}
```

## Testing Commands

```bash
# Run all tests
npm test

# Run specific test file
npm test -- concept-tracking

# Run with watch mode
npm run test:watch
```

## Common Issues

### Tabs not switching
- Ensure Radix UI tabs are imported correctly
- Check that `value` prop matches `Tabs.Trigger` and `Tabs.Content`

### Help overlay not appearing
- Check UI store state (`helpOpen`)
- Verify help icon click handler

### Hints showing for returning players
- Check localStorage has correct `tutorialCompleted` flag
- Clear localStorage to reset: `localStorage.clear()`

### Animations not playing
- Verify Framer Motion `AnimatePresence` wraps conditional renders
- Check animation variants are defined
- Ensure `initial`, `animate`, `exit` props are set

## File Organization

```text
src/components/game/
├── layout/           # Tab structure
│   ├── GameLayout.tsx
│   ├── PlayersBar.tsx
│   ├── ActionTab.tsx
│   ├── DealsTab.tsx
│   └── HistoryTab.tsx
├── help/             # Help system
│   ├── HelpOverlay.tsx
│   ├── HelpIcon.tsx
│   ├── TermTooltip.tsx
│   └── Tutorial.tsx
├── debrief/          # Post-game
│   ├── GameDebrief.tsx
│   ├── CollapseDebrief.tsx
│   ├── ConceptCard.tsx
│   └── ImpactAnalysis.tsx
├── feedback/         # Visual feedback
│   ├── MovementBreakdown.tsx
│   ├── VoteBreakdown.tsx
│   ├── VictoryCelebration.tsx
│   ├── CollapseSequence.tsx
│   └── DealBreachEffect.tsx
└── views/            # Role-based
    ├── ProposerView.tsx
    └── ObserverView.tsx
```

## Next Steps

After implementation:
1. Run `/speckit.tasks` to generate task breakdown
2. Implement in priority order (P1 onboarding first)
3. Test each feature area independently
4. Playtest with real users for educational effectiveness
