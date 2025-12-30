# Feature Specification: Game Refinement - UI, Learning & Fun

**Feature Branch**: `002-game-refinement`
**Created**: 2025-12-29
**Status**: Draft
**Input**: User description: "We must now refine game details, the UI, and the learning and fun factors"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - First-Time Player Onboarding (Priority: P1)

A new player launches the game for the first time and needs to understand how to play before their first session. They should be able to learn the core rules, understand their ideology choice, and feel confident enough to participate meaningfully without reading external documentation.

**Why this priority**: Without onboarding, new players are confused and frustrated in their first game, leading to abandonment. This is the #1 barrier to adoption and must be addressed first.

**Independent Test**: Can be fully tested by having a player with zero prior knowledge complete the onboarding and then successfully participate in their first game (make at least one meaningful vote and understand why they won/lost).

**Acceptance Scenarios**:

1. **Given** a player launches the game for the first time, **When** they click "How to Play", **Then** they see an interactive guide explaining the core game loop (roll, draw, deliberate, vote, move)
2. **Given** a player is selecting their ideology, **When** they hover/tap on an ideology option, **Then** they see a card explaining that ideology's strengths, typical approaches, and strategic tips
3. **Given** a player completes the onboarding, **When** they join their first game, **Then** contextual hints appear for the first 2 turns explaining what's happening and what they should do

---

### User Story 2 - Political Concept Visibility (Priority: P2)

A player completes a game and wants to understand what political concepts they experienced through gameplay. The game surfaces the educational content that was previously hidden, connecting game mechanics to real political dynamics in a post-game debrief.

**Why this priority**: The game already tracks political concepts internally but never shows them to players. This is the core educational value proposition that's currently invisible. Surfacing it fulfills the "teaching/learning" pillar.

**Independent Test**: Can be fully tested by completing a game session and verifying the debrief screen shows at least 3 political concepts that were demonstrated, with specific examples from that game.

**Acceptance Scenarios**:

1. **Given** a player completes a game (win or lose), **When** they view the post-game debrief, **Then** they see a list of political concepts that were demonstrated during play (e.g., "Coalition Building: You formed a deal with Player B to pass the Infrastructure Bill")
2. **Given** the nation collapsed during a game, **When** viewing the collapse debrief, **Then** players see historical parallels (e.g., "This mirrors the fall of Weimar Republic - polarization and gridlock led to collapse") with lessons
3. **Given** a player voted against their ideology alignment, **When** reviewing their decision history, **Then** they see an explanation of why this demonstrates "Ideological Compromise" in real politics

---

### User Story 3 - Enhanced Visual Feedback & Dramatic Moments (Priority: P3)

A player experiences key game moments (winning, losing, deal-breaking, nation collapse, crisis resolution) with appropriate visual and audio feedback that makes the game feel exciting and consequential rather than sterile.

**Why this priority**: Games need emotional peaks and valleys. Currently, significant moments feel flat. Adding drama increases engagement, memorability, and fun factor.

**Independent Test**: Can be fully tested by triggering each key moment type and verifying appropriate visual effects play, creating an emotional response.

**Acceptance Scenarios**:

1. **Given** a player wins the game, **When** the victory is announced, **Then** celebratory animations play (confetti, fanfare visual) and their achievement is highlighted
2. **Given** a player breaks a deal, **When** the betrayal is detected, **Then** a dramatic visual effect emphasizes the breach (shake effect, trust broken indicator) and consequences are clearly shown
3. **Given** the nation collapses, **When** collapse is triggered, **Then** a dramatic collapse sequence plays showing the gravity of the failure before the educational debrief

---

### User Story 4 - In-Game Help & Context (Priority: P4)

A player in the middle of a game is confused about a mechanic, term, or what action to take. They can access help without leaving the game or disrupting other players.

**Why this priority**: Even after onboarding, players forget rules or encounter unfamiliar situations. In-game help reduces frustration and keeps players engaged rather than giving up.

**Independent Test**: Can be fully tested by having a player access help during each game phase and verifying relevant, contextual information is displayed.

**Acceptance Scenarios**:

1. **Given** a player is in any game phase, **When** they click the help icon, **Then** they see contextual help explaining the current phase, available actions, and strategic tips
2. **Given** a player is viewing a card with unfamiliar terms, **When** they tap/hover on a term (e.g., "Stability", "Influence"), **Then** a tooltip explains what it means and why it matters
3. **Given** a player is confused about the deal system, **When** they access help during deliberation, **Then** they see an explanation of how deals work with visual examples

---

### User Story 5 - Decision Impact Awareness (Priority: P5)

A player makes decisions throughout the game but doesn't understand how their choices affected outcomes. The game provides clearer feedback on decision impact both during play and in post-game analysis.

**Why this priority**: Learning requires understanding cause and effect. If players can't connect their decisions to outcomes, the educational value is lost. This closes the feedback loop.

**Independent Test**: Can be fully tested by completing a game and verifying the player can trace at least 2 key outcomes back to specific decisions they made.

**Acceptance Scenarios**:

1. **Given** a vote passes or fails, **When** viewing turn results, **Then** players see vote-by-vote breakdown showing how each player voted and the margin of victory/defeat
2. **Given** a player reaches the end-game, **When** viewing their decision history, **Then** they see which of their votes had the most impact on the final outcome
3. **Given** a player's ideology alignment affected their movement, **When** the movement is calculated, **Then** clear visual breakdown shows base roll, ideology modifier, and nation state modifier separately

---

### Edge Cases

- What happens if a player skips the onboarding tutorial? (They can access it later via a "How to Play" menu option; no penalty for skipping)
- How does help work during time-sensitive phases like voting? (Help pauses nothing; timer continues; help overlay is semi-transparent to maintain game awareness)
- What if a player wants to hide the contextual hints? (Settings option to disable hints in Lobby before game starts; can be re-enabled in Lobby before next game)
- How does the post-game debrief handle very short games (early collapse)? (Shows concepts demonstrated with note that more concepts emerge in longer games)
- What if the same concept is demonstrated multiple times? (Aggregate into single entry with multiple examples)

---

### User Story 6 - Role-Based Views During Proposal Review (Priority: P6)

A player who is NOT the active proposer waits during the review phase. They should see relevant context about the topic being decided (ideology perspectives, nation impact) without seeing the specific options available to the proposer, maintaining strategic tension.

**Why this priority**: The existing implementation shows all proposal options to all players, removing strategic uncertainty. Role-based views create meaningful information asymmetry that mirrors real political negotiation where not everyone knows all options on the table.

**Independent Test**: Can be fully tested with 2 browser windows in the same room - active player sees full options while observer sees only topic context, ideology comparison, and nation impact preview.

**Acceptance Scenarios**:

1. **Given** a player is the active proposer during review phase, **When** viewing the proposal screen, **Then** they see all available proposal options with full details
2. **Given** a player is NOT the active proposer during review phase, **When** viewing the proposal screen, **Then** they see topic title, description, ideology comparison table, and nation impact preview - but NOT the specific options
3. **Given** a proposal includes personal advancement effects, **When** any player views the proposal before voting, **Then** the advancement effects section displays "Movement effects revealed after vote" placeholder text instead of actual values
4. **Given** voting has concluded, **When** results are displayed, **Then** all players simultaneously see the advancement effects that were previously hidden

## Requirements *(mandatory)*

### Functional Requirements

#### Onboarding & Tutorial
- **FR-001**: System MUST provide an interactive "How to Play" guide accessible from the main menu and lobby
- **FR-002**: The tutorial MUST explain core mechanics: turn structure (roll, draw, deliberate, vote, move), win conditions (reach end with sufficient influence), and lose conditions (nation collapse)
- **FR-003**: Ideology selection screen MUST show expanded cards on hover/tap explaining each ideology's strengths, typical voting patterns, and strategic tips
- **FR-004**: System MUST display contextual first-game hints during the first 2 turns of a player's first game session, explaining current phase and suggested actions
- **FR-005**: Players MUST be able to disable contextual hints in settings; setting persists across sessions

#### Political Concept Education
- **FR-006**: System MUST display a post-game debrief screen showing political concepts demonstrated during the session
- **FR-007**: Each displayed concept MUST include: concept name, 1-2 sentence explanation, and at least one specific example from the game session (e.g., "Coalition Building: You negotiated with Player B to pass Bill X")
- **FR-008**: When nation collapse occurs, debrief MUST show relevant historical parallels from the existing crisis/debrief library with lessons about what led to collapse
- **FR-009**: System MUST track which concepts were demonstrated during gameplay using the existing concepts.ts matching logic
- **FR-010**: Players MUST see a minimum of 3 concepts in the post-game debrief for games lasting 5+ turns. For games <5 turns OR games where fewer than 3 concepts were demonstrated: show all available concepts (even if 0-2) with the message "More political concepts emerge in longer games with more decisions."

#### Visual Feedback & Drama
- **FR-011**: Victory announcement MUST include celebratory visual effects (animated celebration, winner highlight, final standings display)
- **FR-012**: Nation collapse MUST trigger a dramatic sequence before educational debrief (visual deterioration effect showing gravity of failure)
- **FR-013**: Deal breach detection MUST trigger emphasized visual feedback (0.3s screen shake effect, "Trust Broken" indicator text) before showing penalty
- **FR-014**: Crisis resolution MUST show collective contribution visualization and outcome with appropriate success/failure feedback
- **FR-015**: Vote reveal animation MUST build suspense with sequential reveal before showing final tally
- **FR-015a**: All visual effects (FR-011 through FR-015) MUST respect the user's `prefers-reduced-motion` system setting. When reduced motion is preferred, animations are replaced with instant state changes while preserving information content.

#### In-Game Help
- **FR-016**: System MUST provide a persistent help icon accessible during all game phases
- **FR-017**: Help content MUST be contextual to current game phase, showing relevant actions, rules, and tips
- **FR-018**: Game terms (Influence, Stability, Budget, Support Tokens) MUST have tooltip explanations available on hover/tap throughout the UI
- **FR-019**: Deal system MUST have accessible explanation showing how deals work, consequences of breaking, and strategic value

#### Decision Impact Feedback
- **FR-020**: Turn results screen MUST show vote-by-vote breakdown with each player's vote visible (after reveal)
- **FR-021**: Turn results MUST show margin of victory/defeat for votes (e.g., "Passed 3-2" or "Failed 2-3")
- **FR-022**: Movement calculation MUST display visual breakdown showing: base dice roll, ideology modifier (if any), nation state modifier, and final movement
- **FR-023**: Post-game analysis MUST identify which votes had the highest impact on final outcome
- **FR-024**: Post-game analysis MUST show player's ideology alignment percentage (how often they voted with their ideology's typical stance)

#### UI Layout & Navigation
- **FR-025**: Game UI MUST use a tabbed layout with persistent header to eliminate scrolling during gameplay. The layout consists of: (1) Players bar as always-visible header, (2) Three switchable tabs: Action, Deals, History
- **FR-026**: Players bar MUST remain always visible regardless of active tab, showing for each player: name, ideology icon, connection status, active turn indicator, board position (visual progress), influence level (High/Med/Low), and support tokens held
- **FR-026a**: Players bar header MUST include nation status display showing current Budget and Stability values, always visible alongside player information
- **FR-027**: Action tab MUST contain all active gameplay elements (dice rolling, card display, voting, deliberation)
- **FR-028**: Deals tab MUST show active deals, pending deal requests, and deal history for the current game
- **FR-029**: History tab MUST display chronological log of past turns including: proposals made, full vote breakdown (who voted yes/no/abstain for each turn), movement results, and nation state changes
- **FR-030**: Tab switching MUST be instant with no loss of game state or context

#### Role-Based Views
- **FR-031**: During review phase, active player (proposer) MUST see all available proposal options with full details
- **FR-032**: During review phase, non-active players MUST see: (1) topic title, (2) topic description, (3) ideology comparison table showing how each of the 5 ideologies typically approaches the issue, (4) nation impact preview showing potential budget/stability effects
- **FR-033**: Non-active players MUST NOT see the specific proposal options available to the active player until a proposal is made
- **FR-034**: Personal advancement effects (player movement bonuses/penalties) MUST remain hidden from ALL players until after the vote concludes, regardless of role
- **FR-035**: After vote concludes, advancement effects MUST be revealed to all players simultaneously before results processing

### Key Entities

- **Tutorial Step**: A discrete teaching moment with explanation text, optional visual demonstration, and progression trigger
- **Political Concept**: An educational concept (from existing concepts.ts) with name, description, detection criteria, and session-specific examples
- **Game Debrief**: Post-game summary containing demonstrated concepts, decision impact analysis, and player performance metrics
- **Contextual Hint**: A first-game tooltip tied to specific game phases with dismissible UI and settings control
- **Help Entry**: Context-aware help content with phase association, term definitions, and strategic tips
- **Game Tab**: A navigation section (Action, Deals, History) with distinct content; Players bar is persistent header, not a tab
- **Turn History Entry**: A record of a completed turn containing: turn number, active player, proposal details, vote tally, outcome, and resulting state changes
- **Review Phase View**: A role-differentiated display during proposal review. Active player (proposer) sees ProposerView with all options; non-active players see ObserverView with topic context only. Implements information asymmetry per FR-031 through FR-035.

### Assumptions

- Players have basic familiarity with turn-based games but not necessarily political simulation games
- Tutorial and help content will be text-based with visual aids; no voice narration in initial implementation
- Political concept detection uses existing matching logic in concepts.ts without modification
- Historical parallels use existing debrief.ts and crises.ts content
- Visual effects will use existing Framer Motion animation system
- Help system content is static (not AI-generated) for consistency and accuracy

## Clarifications

### Session 2025-12-29

- Q: What tab structure should the game UI use? → A: Players bar as persistent header (always visible) + three switchable tabs (Action, Deals, History)
- Q: What should non-active players see while active player reviews options? → A: Topic title + description + ideology comparison table + nation impact preview (budget/stability); personal advancement hidden until after vote
- Q: Should History tab show how each player voted on past proposals? → A: Yes, full vote breakdown visible for all past turns (who voted yes/no/abstain)
- Q: What information should the always-visible Players bar show? → A: Strategic view - name, ideology icon, connection status, active turn indicator, board position, influence level (High/Med/Low), support tokens held
- Q: Where should nation status (Budget, Stability) be displayed? → A: Always visible in Players bar header area alongside player info

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 90% of new players who complete the tutorial can explain the basic win condition in their own words (measured via post-tutorial quiz)
- **SC-002**: Average time for new players to make their first meaningful vote decreases by 40% compared to pre-implementation baseline
- **SC-003**: In post-game surveys, 80% of players can name at least 2 political concepts they learned or experienced during play
- **SC-004**: Player session completion rate increases by 15% compared to pre-refinement baseline (currently 75% per SC-010 in core spec)
- **SC-005**: 85% of players report the post-game debrief helped them understand political dynamics better
- **SC-006**: Average player rating of "game excitement" increases to 4+ out of 5 (compared to baseline)
- **SC-007**: 90% of players who use in-game help report it answered their question
- **SC-008**: In post-game analysis review, 80% of players can correctly identify which of their decisions had the most impact
- **SC-009**: First-game abandonment rate (players who quit before completing their first game) decreases by 50%
- **SC-010**: Repeat play rate increases by 20% (players who start a second game after completing their first)

### Baseline Measurements (Pre-Implementation)

> **Note**: The following baselines MUST be measured before implementation begins:
> - SC-002 baseline: Current time-to-first-vote for new players
>   - **Measurement method**: Track elapsed time from game start to first vote submission for players with no prior games (localStorage check)
>   - **Sample size**: Minimum 10 new player sessions
>   - **Estimated baseline**: 5-7 minutes (to be validated)
> - SC-006 baseline: Current "game excitement" rating
>   - **Measurement method**: Post-game survey with single question "How exciting was this game session?" on 1-5 scale (1=Not exciting, 5=Very exciting)
>   - **Sample size**: Minimum 10 completed game sessions
>   - **Estimated baseline**: 2.5-3.0 (to be validated before implementation)
> - SC-004 baseline: Current session completion rate (75% per core spec SC-010)
