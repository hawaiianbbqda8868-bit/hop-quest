# Creative Play Features — Design

**Date:** 2026-08-10
**Status:** Approved (user picked: springs + checkpoints + Wonder Flowers, moving platforms, hidden gems)

## Goal

Bring the best ideas from modern platformers (Mario Wonder's rule-flipping
Wonder Flowers and Celeste/Sonic staples) into Hop Quest across all 22 levels.

## Approach: auto-placement

All five features are **auto-placed by scanning each level's built grid**, so
every one of the 22 levels gets them with no per-level hand edits. Explicit
`L.*` api calls are also added so future levels can place them by hand.

## Features

### 1. Bounce springs 🟢
- Entity list `springs`; auto-place 2 per level on safe solid ground columns
  near 30% and 65% of level width (skip pits/spikes/boxes).
- Landing on one launches the player (vy ≈ −1150, stronger than a jump),
  with a squash/boing animation and sound. Great for reaching sky routes.

### 2. Mid-level checkpoints 🚩
- One small flag auto-placed at the nearest safe ground column to W/2.
- Touching it activates it (color change + toast). On death, respawn at the
  checkpoint with full hearts; collected coins and defeated enemies persist
  (the world is NOT rebuilt on checkpoint respawn).

### 3. Wonder Flowers 🌸
- One sparkling flower per level, auto-placed above an elevated platform
  near 55% of level width. Touching it triggers a ~9s wonder effect with a
  rainbow screen shimmer; effect chosen by `level % 4`:
  - **Coin rain** — collectible coins fall from the sky (pushed into the
    coins array so the counter stays consistent).
  - **Low gravity** — gravity multiplier 0.45; floaty mega-jumps.
  - **Giant mode** — reuses grow + shield: big, invincible, stomp everything.
  - **Freeze** — all enemies stunned for the duration; free stomps.
- Effect ends cleanly (timers reset, gravity restored).

### 4. Moving platforms
- Entity list `movers`: solid one-way-top rects that patrol horizontally or
  vertically with a fixed range, carrying the player (delta applied while
  standing on one).
- Auto-place 2 per level spanning the two widest ground pits (horizontal
  patrol above the gap) — they make big pits crossable in a new fun way.
- Drawn with the level's platform palette so they fit each theme.

### 5. Hidden gems 💎
- 3 per level, auto-placed in sneaky spots found by grid scan:
  (a) above the highest sky-route platform, (b) low tuck right after the
  widest pit, (c) high above a late-level platform.
- Persistent per level in localStorage (`hopGems`). HUD shows 💎 x/3 for the
  current level; level-picker chips show each level's gem count.

## Verification

- Extend the scratch level-checker to also validate auto-placements (springs
  on solid ground, checkpoint not over a pit, gems in bounds).
- Browser smoke test: bounce a spring, die past a checkpoint and respawn,
  trigger at least two different wonder effects, ride a mover, collect a gem
  and confirm it persists after reload.
