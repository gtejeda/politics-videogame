<!--
Sync Impact Report
==================
Version change: 1.0.0 → 1.1.0 (MINOR - new principles added)
Modified principles: None
Added sections:
  - XV. Real-Time Multiplayer (new principle)
  - XVI. Coopetition (new principle)
  - XVII. Education as Pillar (new principle)
  - Updated Design Constraints checklist with 3 new verification questions
Removed sections: None
Templates requiring updates:
  - .specify/templates/plan-template.md: ✅ No changes needed (Constitution Check section dynamic)
  - .specify/templates/spec-template.md: ✅ No changes needed (generic template compatible)
  - .specify/templates/tasks-template.md: ✅ No changes needed (generic template compatible)
Follow-up TODOs: None
-->

# Politics Board Game Constitution

## Charter Reference

This constitution derives its authority from the [Design Charter](../../docs/charter.md).
All design decisions MUST adhere as closely as possible to the charter. Divergence from
the charter is permitted ONLY when the deviation results in a **quantifiably better game
or more fun**—such justifications MUST be documented.

> **North Star:** "This game models politics as a system of constrained choices where
> power, ideology, and institutions interact through tradeoffs rather than morality."

## Core Principles

### I. Ideological Neutrality

The game MUST model reality, not "equalize" outcomes.

- Left-leaning and right-leaning policies are both valid strategic paths
- Outcomes are determined by context, timing, and tradeoffs—not moral labeling
- Policies are never marked as "good" or "bad"—only as effective or ineffective under conditions

**Design Rule:** No card, rule, or mechanic may imply moral superiority of an ideology.

### II. Mandatory Tradeoffs

Every decision MUST solve something and create pressure elsewhere.

- Welfare expansion → social stability ↑, budget pressure ↑
- Deregulation → economic growth ↑, inequality risk ↑
- Strong security → stability ↑, civil liberty pressure ↑

**Design Rule:** Any policy without a cost MUST be removed or redesigned.

### III. Systems Over Individuals

Politics is primarily institutional, not heroic.

- Players do not "become" leaders with special powers
- Institutions (legislature, courts, markets, public opinion) shape outcomes
- Individuals matter only through systemic leverage

**Design Rule:** No single card or move may bypass institutional constraints.

### IV. Imperfect Information

Players MUST operate with partial information, but never randomness without logic.

Uncertainty comes from:
- Public opinion volatility
- External shocks
- Delayed consequences

**Design Rule:** If randomness exists, players MUST understand why it exists.

### V. Delayed Consequences

Real policy effects are rarely immediate.

- Short-term gains may trigger long-term instability
- Some benefits only emerge after multiple rounds
- Reversing policy has costs

**Design Rule:** At least 30–40% of policies MUST have delayed effects.

### VI. Mechanics Teach

Players learn politics by playing, not reading.

Rules embody concepts like:
- Checks and balances
- Budget constraints
- Coalition building
- Voter incentives

**Design Rule:** If a rule can teach a concept, flavor text MUST NOT replace it.

### VII. Ideologies as Toolkits

Left and right are collections of policy levers, not personalities.

- Players can mix ideologies
- There is no permanent ideological lock-in
- Pragmatism is allowed—and sometimes rewarded

**Design Rule:** The game MUST allow "impure" ideological strategies.

### VIII. No Utopias

There is no perfect equilibrium state.

- Every society has persistent tension
- Stability ≠ prosperity ≠ freedom
- Optimization always increases risk elsewhere

**Design Rule:** Endgame states MUST always show unresolved tensions.

### IX. Conflict Without Villains

Competition emerges from resource scarcity and institutional friction, not evil actors.

- Players compete for influence, legitimacy, or policy control
- No player is "the bad guy" by design

**Design Rule:** Conflict MUST arise even if all players act rationally.

### X. Multiple Victory Paths

Winning should reflect different political philosophies.

- Economic dominance
- Social cohesion
- Institutional resilience
- Global influence
- Long-term stability

**Design Rule:** No single metric can define victory alone.

### XI. Instructive Failure

Losing should teach why.

Clear post-game debrief indicators:
- Budget collapse
- Legitimacy crisis
- Institutional paralysis
- Overextension

**Design Rule:** Every loss condition MUST be traceable to identifiable choices.

### XII. Minimal Political Model First

Before adding content, define:
1. Core resources (e.g. budget, legitimacy, stability, growth)
2. Core institutions
3. Core feedback loops

Only then add: ideological flavor, events, special rules.

### XIII. Bias-Aware Playtesting

During testing, explicitly ask:
- Does one ideology feel "safer"?
- Are certain policies always dominant?
- Are consequences believable?

**Design Rule:** A mechanic that "feels" biased MUST be justified or removed—even if balanced.

### XIV. Expansion-Ready Design

The base game MUST support:
- New countries
- New eras
- New institutions
- New ideological movements

**Design Rule:** No expansion should invalidate base mechanics.

### XV. Real-Time Multiplayer

The game is designed for synchronous multiplayer interaction.

- All players share the same game clock and world state
- Actions have immediate visibility to other players
- Network latency MUST be accounted for in mechanic design
- Simultaneous decision-making creates natural tension and negotiation pressure

**Design Rule:** No mechanic may assume turn-based or asynchronous play unless explicitly
marked as an offline/solo variant.

### XVI. Coopetition

Players simultaneously cooperate and compete—collaboration and rivalry coexist.

- Shared challenges (crises, external threats, systemic collapse) require coordination
- Individual victory conditions create competing incentives
- Alliances are temporary and strategic, not permanent
- Betrayal is a valid strategy with systemic consequences
- Zero-sum and positive-sum dynamics coexist within the same game

**Design Rule:** Every major system MUST have both cooperative and competitive dimensions.
Pure cooperation or pure competition violates this principle.

### XVII. Education as Pillar

Teaching politics is a primary goal, equal in importance to fun.

- Players MUST learn something about real political systems through play
- Post-game reflection (win or lose) should surface political insights
- Mechanics MUST be grounded in real political science concepts
- Fun and education reinforce each other—neither is sacrificed for the other

**Design Rule:** If a mechanic is fun but teaches nothing, it MUST be redesigned to also
educate. If a mechanic educates but isn't fun, it MUST be redesigned to also entertain.

## Design Constraints

All game elements MUST pass the Charter Compliance Checklist:

| Requirement | Verification Question |
|-------------|----------------------|
| Tradeoff | Does it have a meaningful tradeoff? |
| Neutrality | Is it ideologically neutral in framing? |
| Institutional | Does it work through institutions, not around them? |
| Explainable Randomness | If random, is the randomness explainable? |
| No Correct Answer | Does it avoid implying a "correct" answer? |
| Extensibility | Can it support future expansion? |
| Real-Time Compatible | Does it work with synchronous multiplayer? |
| Coopetition | Does it have both cooperative and competitive aspects? |
| Educational Value | Does it teach something about real politics? |

Any element failing one or more checks MUST be revised or justified with quantifiable
improvement documentation.

## Development Workflow

### Design Review Process

1. **Concept Check**: Verify alignment with North Star before prototyping
2. **Charter Compliance**: Run compliance checklist on all new mechanics
3. **Bias Audit**: Playtest explicitly for ideological bias
4. **Coopetition Balance**: Verify both cooperative and competitive incentives exist
5. **Educational Review**: Confirm political concept being taught
6. **Documentation**: Record any charter deviations with quantifiable justification

### Quality Gates

- No mechanic proceeds to implementation without tradeoff analysis
- No content ships without bias playtesting
- All expansion content must demonstrate base-mechanic compatibility
- All mechanics must pass real-time multiplayer compatibility review
- Educational value must be documented for each major system

## Governance

This constitution supersedes all other design practices for this project.

### Amendment Procedure

1. Propose amendment with rationale
2. Verify alignment with charter (or document quantifiable improvement justification)
3. Update constitution version per semantic versioning
4. Propagate changes to dependent templates
5. Document in Sync Impact Report

### Versioning Policy

- **MAJOR**: Backward-incompatible principle removals or fundamental redefinitions
- **MINOR**: New principles added or materially expanded guidance
- **PATCH**: Clarifications, wording improvements, non-semantic refinements

### Compliance Review

- All design PRs MUST verify compliance with this constitution
- Complexity deviations MUST be justified in the Complexity Tracking table
- Charter deviations MUST include quantifiable improvement metrics

**Version**: 1.1.0 | **Ratified**: 2025-12-27 | **Last Amended**: 2025-12-27
