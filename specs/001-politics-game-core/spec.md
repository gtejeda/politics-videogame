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

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support real-time multiplayer sessions with 2-6 simultaneous players sharing the same game world state
- **FR-002**: System MUST synchronize game state across all connected players with maximum 2-second latency for visible actions
- **FR-003**: Every policy option MUST present at least one benefit and one cost (tradeoff)
- **FR-004**: System MUST implement delayed consequences where at least 30% of policy effects manifest after 2+ game cycles
- **FR-005**: System MUST generate shared crisis events that require coordinated player response to resolve
- **FR-006**: Players MUST have individual victory conditions that can conflict with other players' conditions
- **FR-007**: System MUST track and display political concepts demonstrated during gameplay
- **FR-008**: System MUST provide post-game summary linking player decisions to political concepts
- **FR-009**: System MUST support a primary victory condition (first to reach End with sufficient Influence) with multiple viable strategic approaches based on ideology alignment and resource management; Advanced Mode MAY implement 5 distinct victory conditions (see Future Expansions)
- **FR-010**: All policy effects and game mechanics MUST be ideologically neutral (no moral labeling of political positions)
- **FR-011**: Players MUST operate with partial information—not all game state is visible to all players
- **FR-012**: System MUST track alliance formation, betrayal, and associated reputation consequences
- **FR-013**: Loss conditions MUST be traceable to specific player decisions with clear debrief information
- **FR-014**: Game mechanics MUST work through institutional systems (legislature, courts, markets, public opinion) rather than bypassing them

### Key Entities

- **Player**: A participant in the game session; has unique identity, current resources, political position, victory progress, and reputation
- **Game Session**: A shared game instance with world state, connected players, game clock, and crisis queue
- **Policy**: An available political action with defined benefits, costs, immediate effects, and delayed effects; ideologically neutral framing
- **Institution**: A systemic entity (legislature, court, market, public opinion) through which policies are enacted and effects flow
- **Resource**: A measurable game value (budget, legitimacy, stability, growth) that policies and events modify
- **Crisis**: A shared challenge event requiring coordinated player response with collective success/failure outcomes
- **Alliance**: A temporary agreement between players with negotiated terms and reputation stakes
- **Victory Condition**: A measurable goal that, when achieved, results in player victory; multiple types exist

### Assumptions

- Players have stable internet connections suitable for real-time multiplayer gaming
- Games have a defined start and end (not infinite sandbox)
- The target audience is interested in learning about politics (educational intent is welcomed, not hidden)
- Player count of 2-6 is suitable for meaningful coopetition dynamics
- Session duration targets 30-90 minutes per complete game

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can join and begin playing within 60 seconds of launching the game
- **SC-002**: 95% of player actions are visible to all other players within 2 seconds
- **SC-003**: 100% of policies in the game have documented tradeoffs (verified by design review)
- **SC-004**: At least 30% of policy effects are delayed by 2+ game cycles (verified by mechanics audit)
- **SC-005**: In post-game surveys, 80% of players can correctly identify at least 2 political concepts they experienced during play
- **SC-006**: Each of the 5 ideologies has achieved victory in playtesting by at least 3 different player groups, demonstrating no single ideology is dominant
- **SC-007**: 90% of game sessions with 3+ players include at least one cooperative action and at least one competitive action
- **SC-008**: When players lose, 85% can identify at least one specific decision that contributed to their loss
- **SC-009**: In bias audits, no ideology is selected as "optimal" more than 60% of the time across all playtests
- **SC-010**: Player session completion rate exceeds 75% (players finish games they start)

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
