# Creative Play Batch 3 — Design

**Date:** 2026-08-10
**Status:** Approved (user picked all four)

## Features

### 1. Frog mount 🐸
- One frog auto-placed per level (~18% of W) on safe ground; idles with
  little hops. Touch it to ride.
- While riding: jump boost ×1.28 (stacks with grow), and every ~0.7s a pink
  tongue slurps the nearest coin within 110px.
- Taking a hit while riding dismounts instead of hurting: the frog flees
  (hops away, despawns). Protection order: shield → frog → pet → grow →
  heart. Not in boss rush arenas.

### 2. Race your ghost 👻
- During normal (non-remix, non-rush) play, positions record at 10Hz
  (capped ~5min). When a run sets a new best time, its recording is saved
  (`hopGhosts`) and replays on later runs as a translucent hero synced to
  the level clock. Beat the ghost → it gets replaced by your new best.

### 3. Remix mode 🔀
- A "🔀 Remix" toggle chip in the level card (persisted with the hero).
- Remix flips the built level horizontally (grid + coins/enemies/spikes/
  boxes) before auto-placement runs, so all auto features adapt. Start and
  flag positions are re-derived by floor scan (explicit per-level overrides
  ignored); the boss keeps its right-side arena.
- Spice: walkers 60→80, chasers 140→170, flyers 80→104 px/s.
- Remix runs don't save times, ghosts, or gems (no leaderboard pollution).

### 4. Hat powers 🎩
Every hat now grants a perk (shown on its menu chip):
- 🧢 Cap — start each level with 3 ⭐
- 👑 Crown — start with a 5s shield
- 🎉 Party — pet buddy recharges twice as fast
- 🦄 Horn — springs launch 20% higher
- 🧙 Wizard — star shots pierce through enemies
- 🚀 Astronaut — 8% lower gravity ("moon boots")
- 🏴‍☠️ Pirate — defeated enemies drop a bonus coin

## Verification

Syntax check; browser tests: mount/ride/tongue/dismount-on-hit; ghost
records and replays after a best-time win; remix mirrors a level, re-derives
start/flag on an island level (Sky Islands), and skips saves; each hat perk
observable (stars granted, shield timer, spring height, pierce, gravity,
loot coin). Clean test storage afterward.
