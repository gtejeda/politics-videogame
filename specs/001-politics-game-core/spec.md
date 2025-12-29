# Feature Specification: Politics Game Core

**Feature Branch**: `001-politics-game-core`
**Created**: 2025-12-27
**Status**: Draft
**Input**: User description: "I want to build a real-time multiplayer game, it is meant to be fun of course, but also a pillar is the teaching/learning of politics in a cooperative and competitive way at the same time"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Join and Play a Game Session (Priority: P1)

A player launches the game, joins an active game session with other players, and participates in real-time political decision-making within a shared world state. Players see each other's public actions immediately and must respond to evolving political situations together.

**Why this priority**: Without the ability to join and participate in a real-time multiplayer session, no other game features can be experienced. This is the foundational interaction that enables all gameplay.

**Independent Test**: Can be fully tested by having 2-4 players connect to a shared session, observe synchronized world state, and confirm that actions taken by one player are visible to others within acceptable latency.

**Acceptance Scenarios**:

1. **Given** a player has launched the game, **When** they select "Join Game" and enter a session code, **Then** they are connected to the shared game world and see the current state
2. **Given** multiple players are in a session, **When** one player takes a public action, **Then** all other players see that action reflected in their view within 2 seconds
3. **Given** a player loses connection, **When** they reconnect within 30 seconds, **Then** they rejoin the same session with their progress intact

---

### User Story 2 - Make Policy Decisions with Tradeoffs (Priority: P2)

A player evaluates available policy options, each presenting meaningful tradeoffs between competing values (e.g., economic growth vs. social stability, security vs. liberty). The player selects a policy and observes both immediate and delayed consequences that affect the shared political system.

**Why this priority**: Policy decisions with tradeoffs are the core mechanic that teaches political concepts. Without this, the game cannot fulfill its educational pillar.

**Independent Test**: Can be fully tested by presenting a player with at least 3 policy choices, each with documented tradeoffs, and verifying that selecting one produces the expected immediate effect plus at least one delayed effect after multiple game cycles.

**Acceptance Scenarios**:

1. **Given** a player has access to policy options, **When** they review a policy, **Then** they see clearly stated benefits and costs (tradeoffs) for that policy
2. **Given** a player selects a policy, **When** the policy is enacted, **Then** at least one immediate effect is visible AND at least one effect is delayed by 2+ game cycles
3. **Given** a policy was enacted 3 game cycles ago, **When** the delayed effect triggers, **Then** the player can trace the consequence back to their original decision

---

### User Story 3 - Cooperate and Compete Simultaneously (Priority: P3)

Players face shared challenges (crises, external threats) that require coordination to address, while simultaneously pursuing individual victory conditions that may conflict. Players form temporary alliances, negotiate, and sometimes betray each other—all with systemic consequences.

**Why this priority**: Coopetition is essential to modeling real politics where actors must cooperate on some issues while competing on others. This story delivers the unique "cooperative-competitive" dynamic.

**Independent Test**: Can be fully tested by triggering a shared crisis that cannot be solved by one player alone, observing players coordinate to address it, then verifying that individual victory progress continues to differentiate players.

**Acceptance Scenarios**:

1. **Given** a shared crisis event occurs, **When** players choose whether to contribute resources, **Then** the crisis outcome depends on total contributions from all players
2. **Given** players have different victory conditions, **When** they negotiate an alliance, **Then** the alliance can be formed, providing benefits to both parties
3. **Given** an alliance exists, **When** a player breaks the alliance, **Then** there are visible systemic consequences (reputation loss, trust penalties) that affect future negotiations

---

### User Story 4 - Learn Political Concepts Through Play (Priority: P4)

As players engage with game mechanics, they naturally learn political concepts (checks and balances, budget constraints, coalition building, voter incentives) without explicit instruction. Post-game, players can access a summary showing what political concepts were demonstrated and how their decisions illustrated real-world political dynamics.

**Why this priority**: The educational pillar is co-equal with fun. This story ensures learning outcomes are measurable and players gain genuine political insight.

**Independent Test**: Can be fully tested by having a new player complete one full game session, then surveying them on political concepts—expecting demonstrable improvement in understanding of at least 2 concepts.

**Acceptance Scenarios**:

1. **Given** a player completes a game session, **When** they view the post-game summary, **Then** they see a list of political concepts that were active during play (e.g., "You experienced budget constraints when...")
2. **Given** a player made a decision involving coalition building, **When** reviewing post-game, **Then** the summary explains how their experience mirrors real coalition dynamics
3. **Given** a player loses the game, **When** they view the loss debrief, **Then** they can identify the specific decisions and systemic factors that led to failure

---

### User Story 5 - Multiple Strategies to Victory (Priority: P5)

Players race to reach the End of the political path first while maintaining sufficient Influence (≥3). Different ideologies provide different strategic advantages—some excel at coalition building, others at resource efficiency, others at weathering crises. No single ideology is objectively "correct"; the viability of each depends on context, other players' actions, and the decisions that arise.

**Why this priority**: Multiple viable strategies prevent ideological bias in game design and encourage replay value while teaching that politics rewards different approaches in different contexts.

**Independent Test**: Can be fully tested by running 5 game sessions where players with different ideologies win, verifying no ideology is dominant.

**Acceptance Scenarios**:

1. **Given** a player reaches the End space, **When** they have ≥3 Influence, **Then** they win the game
2. **Given** a player reaches the End space, **When** they have <3 Influence, **Then** they must wait (cannot win) until they gain sufficient Influence or another player wins
3. **Given** multiple players reach the End on the same turn with ≥3 Influence, **When** determining the winner, **Then** the player with highest Influence wins (tiebreaker)

---

### Edge Cases

- What happens when all players disconnect simultaneously? (Game state is preserved; session resumes when any player reconnects)
- How does the system handle a player who goes AFK (away from keyboard)? (After configurable timeout, player's influence is reduced but not eliminated; they can rejoin)
- What happens when a policy has no remaining tradeoff due to game state? (Policy is disabled until conditions change; alternatives are highlighted)
- How does the game handle conflicting simultaneous actions from multiple players? (Deterministic resolution order based on game clock; no player has inherent priority)
- What happens if a player doesn't acknowledge the Turn Results screen? (After 30 seconds timeout, unacknowledged players are auto-continued and marked as "missed results"; game advances)
- What happens when fewer than 3 players try to start a game? (Game cannot start; host sees "Need at least 3 players to begin" message; lobby remains open for more players)
- What happens when a 6th player tries to join a full room? (Join is rejected with "Room is full (max 5 players)" message; player is returned to join screen)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support real-time multiplayer sessions with 3-5 simultaneous players sharing the same game world state
- **FR-002**: System MUST synchronize game state across all connected players with maximum 2-second latency for visible actions
- **FR-003**: Every policy option MUST present at least one benefit and one cost (tradeoff)
- **FR-004**: System MUST implement delayed consequences where at least 30% of policy effects manifest after 2+ game cycles
- **FR-005**: System MUST generate shared crisis events that require coordinated player response to resolve
  - *Crisis Triggers*: A crisis event is drawn when ANY of the following occur: (a) Nation Stability drops to ≤5; (b) Nation Budget drops to ≤3; (c) Any player enters the Crisis Zone (board positions 12-17); (d) Random chance: 15% per turn after turn 5 (server-side seeded RNG using room ID + turn number for deterministic replay)
  - *Crisis Resolution*: Players collectively contribute Influence; crisis resolves when contribution threshold met or 2 turns pass
- **FR-006**: Players MUST have individual victory conditions that can conflict with other players' conditions
- **FR-007**: System MUST track and display political concepts demonstrated during gameplay
- **FR-008**: System MUST provide post-game summary linking player decisions to political concepts
- **FR-009**: System MUST support a primary victory condition (first to reach End with sufficient Influence) with multiple viable strategic approaches based on ideology alignment and resource management; Advanced Mode MAY implement 5 distinct victory conditions (see Future Expansions)
- **FR-010**: All policy effects and game mechanics MUST be ideologically neutral (no moral labeling of political positions)
- **FR-011**: Players MUST operate with partial information—not all game state is visible to all players
  - *Implementation*: (a) Vote intentions are hidden until simultaneous reveal; (b) Other players' exact Influence values are hidden—only ranges (Low 1-3, Medium 4-6, High 7+) are shown; (c) Upcoming crisis triggers are not visible until they occur
- **FR-012**: System MUST track alliance formation, betrayal, and associated reputation consequences
  - *Implementation*: Reputation is tracked through Support Tokens. When a player breaks a deal (votes against someone holding their token), the token holder gains +1 Influence and the breaker loses -1 Influence. Token holdings are visible to all players, creating social reputation through transparency.
- **FR-013**: Loss conditions MUST be traceable to specific player decisions with clear debrief information
- **FR-014**: Game mechanics MUST work through institutional systems (legislature, courts, markets, public opinion) rather than bypassing them
  - *Implementation Note*: In the base game, institutions are modeled implicitly through resource effects. Budget changes represent fiscal/economic institutional outcomes; Stability changes represent social/political institutional outcomes. Vote mechanics represent legislative processes. Future expansions may add explicit institution cards.
- **FR-015**: After each vote resolves, system MUST display a full-screen Turn Results screen showing: (1) vote outcome (passed/failed with vote tally), (2) nation state changes (budget/stability delta with new values), (3) per-player full breakdown including movement components (dice roll, ideology bonus/penalty, nation modifier), influence change with reason (e.g., "aligned with passed policy"), and any token effects; each player MUST click "Continue" to acknowledge, screen displays checkmarks showing which players have acknowledged, and game advances only when ALL players have acknowledged
- **FR-016**: When a vote fails (majority votes No), system MUST apply consequences: (1) Nation stability decreases by 1 (representing political gridlock), (2) Active player loses 1 Influence (failed to build consensus); these penalties are shown on the Turn Results screen with explanation
- **FR-017**: Each proposed policy/event MUST have a "More Information" popup accessible to all players showing: (1) a brief comparison of how each of the 5 ideologies typically approaches this type of decision, (2) historical context or real-world parallels where applicable; this popup is optional—players can vote without viewing it
  - *Availability*: Popup is accessible during the deliberation phase (3-minute timer) AND during the voting phase; not available during other game phases
  - *Content Format*: 5-row comparison table with columns: Ideology, Typical Stance (1-2 sentences), Likely Vote (Yes/No/Split); historical context appears below the table when available
- **FR-018**: Player advancement effects on policy/event cards MUST be hidden (displayed on card back) during deliberation and voting phases; advancement is revealed collectively to all players only AFTER all votes have been cast and before results processing begins
  - *Purpose*: Forces players to prioritize nation benefit and role-play their ideology rather than optimizing personal advancement
  - *Card Display*: Front shows policy name, nation effects, tradeoffs; back shows per-ideology advancement bonuses/penalties
- **FR-019**: Voting workflow MUST follow a two-phase structure with differentiated player views:
  - *Phase 1 - Review Phase*:
    - **Non-proposing players** see: Informational context, historical data, and ideology comparison table (educational content only, no vote options visible)
    - **Proposing player** sees: Tabbed interface with Tab 1 containing same informational content, Tab 2 containing vote proposal options
    - Non-proposing players mark "Ready to Negotiate" button when they understand the issue
    - Proposing player selects their vote proposal (automatically marks them as ready)
  - *Phase 2 - Deliberation Phase*:
    - Begins ONLY when ALL players are ready (all non-proposers marked ready + proposer has selected proposal)
    - Full-screen 3-minute countdown timer displayed to all players
    - VOTE button (Yes/No/Abstain) available to all players
    - Players negotiate verbally during this phase
  - *Transition*: Phase 1 has no time limit; Phase 2 timer is guidance only (see FR-021)
- **FR-020**: System MUST support tracked deals during Deliberation Phase:
  - *Make Deal Button*: Available during Phase 2 (Deliberation); opens modal for two players to formalize an agreement
  - *Deal Structure*: Each deal specifies: (1) parties involved, (2) agreed terms (e.g., "Player A votes Yes, Player B transfers 1 Support Token"), (3) turn scope (this vote only, or extended duration)
  - *Visibility*: Active deals are visible to ALL players (transparency creates social accountability)
  - *Deal Breach Detection*: System automatically detects when a player's vote contradicts their deal commitment
  - *Breach Penalty*: Player who breaks a deal loses 2 Influence; other party gains 1 Influence; breach is publicly announced
  - *Deal Log*: All deals (active, fulfilled, broken) are recorded in game history for post-game review
- **FR-021**: Timers MUST serve as guidance only and NEVER auto-advance or penalize players:
  - *Countdown Phase*: Timer displays recommended time (e.g., 3 minutes for Deliberation)
  - *Overtime Phase*: When timer reaches 0, it transitions to "overtime" mode with visual indicator (flashing/pulsing border, color change)
  - *No Auto-Advance*: Turn/phase NEVER advances automatically due to timer expiration
  - *Player-Driven Progression*: Phase advances ONLY when all players explicitly indicate readiness (click "Ready", cast vote, or acknowledge results)
  - *Purpose*: Respects player discussions and negotiations while providing time awareness
- **FR-022**: System MUST display persistent phase indicators and player readiness status:
  - *Phase Header Bar*: Always-visible top bar showing: (1) Current phase name (e.g., "Review Phase", "Deliberation Phase", "Voting"), (2) Brief phase description/instruction, (3) Timer with countdown and overtime indicator
  - *Player Status Row*: Player avatars/icons displayed with real-time status indicators:
    - Checkmark icon: Player is ready/has completed their action
    - Hourglass icon: Player is waiting (has not yet acted)
    - Ellipsis icon: Player is currently acting (e.g., in Deal modal, reviewing tabs)
  - *Hover Tooltips*: Hovering over a waiting player shows contextual message (e.g., "Waiting for [Player] to mark Ready to Negotiate", "Waiting for [Player] to cast vote")
  - *Nudge Support*: Visual emphasis on players who haven't acted when timer enters overtime (gentle pulse on their avatar)
- **FR-023**: System MUST automatically cleanup inactive game rooms after 2 hours of no player activity to prevent resource exhaustion; cleanup removes all room state and disconnects any remaining connections

### Key Entities

- **Player**: A participant in the game session; has unique identity, ideology, current Influence, board position, and Support Tokens (reputation is implicit through token relationships)
- **Game Session**: A shared game instance with world state, connected players, game clock, and crisis queue
- **Policy**: An available political action with defined benefits, costs, immediate effects, and delayed effects; ideologically neutral framing
- **Institution**: A systemic entity (legislature, court, market, public opinion) through which policies are enacted and effects flow
- **Resource**: A measurable game value (Budget, Stability, Influence) that policies and events modify; future expansions may add Growth, Legitimacy, or other resource types
- **Crisis**: A shared challenge event requiring coordinated player response with collective success/failure outcomes
- **Alliance**: A temporary agreement between players with negotiated terms and reputation stakes
- **Deal**: A formalized, tracked agreement between two players made during Deliberation Phase; has defined terms, turn scope, and automatic breach detection with penalties. Deals are session-scoped: if a player disconnects and reconnects within the 30-second window, their active deals remain intact; if they fail to reconnect, their deals are voided without penalty.
- **Victory Condition**: A measurable goal that, when achieved, results in player victory; multiple types exist

### Assumptions

- Players have stable internet connections (minimum 1 Mbps bandwidth, <300ms round-trip latency) suitable for real-time multiplayer gaming
- Games have a defined start and end (not infinite sandbox)
- The target audience is interested in learning about politics (educational intent is welcomed, not hidden)
- Player count of 3-5 is suitable for meaningful coopetition dynamics (minimum 3 for coalition formation, maximum 5 for manageable deliberation)
- Session duration targets 30-90 minutes per complete game

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can join and begin playing within 60 seconds of launching the game
- **SC-002**: 95% of player actions are visible to all other players within 2 seconds (measured via client-side timestamp comparison: action send time vs. broadcast receive time, logged during playtesting sessions)
- **SC-003**: 100% of policies in the game have documented tradeoffs (verified by design review)
- **SC-004**: At least 30% of policy effects are delayed by 2+ game cycles (verified by mechanics audit)
- **SC-005**: In post-game surveys, 80% of players can correctly identify at least 2 political concepts they experienced during play
- **SC-006**: Each of the 5 ideologies has achieved victory in playtesting by at least 3 different player groups, demonstrating no single ideology is dominant
- **SC-007**: 90% of game sessions with 3+ players include at least one cooperative action and at least one competitive action
- **SC-008**: When players lose, 85% can identify at least one specific decision that contributed to their loss
- **SC-009**: In bias audits, no ideology is selected as "optimal" more than 60% of the time across all playtests
- **SC-010**: Player session completion rate exceeds 75% (players finish games they start)

## Clarifications

### Session 2025-12-28

- Q: When should player advancement (on card backs) be revealed after voting? → A: Collective reveal after ALL players have voted, before results processing
- Q: How should the voting workflow differentiate proposing vs. non-proposing players? → A: Two-phase workflow: (1) Review Phase - non-proposing players see informational/historical context + ideology comparison only, proposing player sees same info in Tab 1 + vote options in Tab 2; non-proposers mark "Ready to Negotiate" when understood, proposer selects proposal to become ready; (2) Deliberation Phase begins when ALL ready
- Q: How should deals be tracked during deliberation? → A: Tracked deals - "Make Deal" button opens modal where 2 players agree to terms; deal is logged and visible to all; breaking deal triggers penalty
- Q: How should timers behave to avoid interrupting player discussions? → A: Grace period - Timer counts down as guidance, then flashes/pulses as "overtime" indicator; turn advances ONLY when all players click "Ready" or cast vote (never auto-advances)
- Q: How should phase indicators and player readiness be displayed? → A: Header bar + player status - Persistent top bar with phase name/description/timer PLUS player avatars with status icons (checkmark=ready, hourglass=waiting, ellipsis=acting); hover shows "Waiting for [Player] to..."

### Session 2025-12-27

- Q: After a vote resolves, how should the turn result be presented to players? → A: Full-screen results screen - Blocking screen showing vote outcome, nation changes, and player effects; all players must acknowledge before proceeding
- Q: What player-specific effects should be displayed on the Turn Results screen? → A: Full breakdown - Movement (with components: dice, ideology bonus/penalty, nation modifier), Influence change (with reason), and any token effects
- Q: When a vote fails (majority votes No), what consequences should occur? → A: Nation + active player penalty - Nation takes stability hit AND active player loses influence for failing to build consensus
- Q: How should player acknowledgment of the Turn Results screen work? → A: All must acknowledge - Each player clicks "Continue"; screen shows checkmarks for who has acknowledged; advances when all ready
- Q: What happens if a player doesn't acknowledge the Turn Results screen (AFK/disconnected)? → A: Timeout with auto-continue - After 30 seconds of waiting, unacknowledged players are auto-continued and marked as "missed results"
- Q: What content should the "More Information" popup show for a proposed policy/event? → A: All ideologies compared - Brief comparison of how each of the 5 ideologies typically approaches this type of decision
- Q: When should players be able to access the "More Information" popup? → A: Deliberation + voting - Available during the 3-minute deliberation timer AND during voting phase
- Q: How should the ideology comparison content be structured in the popup? → A: Comparison table - 5-row table with columns: Ideology, Typical Stance (1-2 sentences), Likely Vote (Yes/No/Split)

## Future Expansions

### Advanced Mode: Multiple Victory Conditions

A future game mode that expands the single race-based victory into 5 distinct victory paths, teaching that politics can have fundamentally different definitions of "success."

**Victory Conditions (Advanced Mode)**:

1. **Race Victory**: First player to reach the End with ≥3 Influence wins (base game behavior)
2. **Economic Victory**: Accumulate Budget ≥15 while at board position ≥15
3. **Stability Victory**: Maintain Nation Stability ≥15 for 3 consecutive turns while at position ≥10
4. **Influence Victory**: Accumulate 10+ Influence at any board position
5. **Coalition Victory**: Hold Support Tokens from majority of other players for 2 consecutive turns

**Educational Value**: Advanced Mode teaches that different political actors define success differently—some prioritize economic growth, others stability, others coalition-building. This mirrors real-world political diversity where "winning" is contested.

**Implementation Notes**:
- Players may optionally declare a victory focus at game start (visible to others)
- Victory progress indicators show proximity to each condition
- When multiple victories trigger on the same turn, priority order: Coalition > Influence > Stability > Economic > Race
- Advanced Mode requires minimum 4 players for balanced Coalition Victory

**Success Criteria (Advanced Mode)**:
- **SC-ADV-001**: Each of the 5 victory conditions has been achieved in playtesting by at least 3 different player groups
- **SC-ADV-002**: No single victory condition is achieved more than 40% of the time across all Advanced Mode playtests
