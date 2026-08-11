# Creative Play Batch 2 — Design

**Date:** 2026-08-10
**Status:** Approved (user picked all four)

## Features

### 1. Pet buddy 🐣
A little chick follows the hero with smooth spring-follow and a hover bob.
- Scoops up coins within ~40px of itself (with the coin sfx).
- Guardian save: when the hero would lose a heart, the pet blocks the hit
  instead (toast 🐣, 20s cooldown; pet draws grayed while recharging).
- Always on; created in `resetPlayer`/checkpoint respawn.

### 2. New power-ups (present boxes)
- **Drill ⛏️** — 15s timer. While active, ✦ in mid-air slams down (even
  without the Ground Pound ability) and **breaks platform tiles** (grid
  value 2) you crash through, with pops. Ground tiles still stop you.
- **Bubble blaster 🫧** — +5 bubbles. ✦ fires a floaty bubble (after stars,
  before pound/dash). Hitting a normal enemy traps it: it floats upward,
  harmless, for 8s; touch it to pop it for a 3-coin burst. Bosses just pop
  the bubble.
- Present odds rebalanced: heart .2 / shield .2 / grow .2 / stars .15 /
  drill .12 / bubble .13.

### 3. Warp doors 🚪
- Auto-placed per level (not in boss rush): **door A** stands on safe ground
  near 42% of level width; a **sealed coin vault** is built into unused sky
  rows (0–5) in the far-right corner (columns W−16…W−1, walls + ceiling +
  floor), stuffed with coin rows and containing **door B**.
- Touching door A warps you in (1s re-trigger cooldown) and starts a 6s
  visit timer shown on screen; touching door B or timing out warps you back
  to door A. Vault coins count toward the level total.

### 4. Time attack + hat unlocks
- Level timer (`levelT`) runs in normal play (not rush), shown ⏱ m:ss in
  the HUD. On winning, medal thresholds derive from level width W:
  gold ≤ 0.35·W s, silver ≤ 0.55·W s, bronze ≤ 0.9·W s.
- Best times persist (`hopTimes`); the level picker chip shows the medal;
  the clear screen reports time, medal, and best.
- Three unlockable hats in the hero menu (locked chips show 🔒 + hint):
  - 🧙 Wizard — collect 15 gems total
  - 👨‍🚀 Astronaut — earn 5 gold medals
  - 🏴‍☠️ Pirate — boss rush best ≥ 11

## Verification

Syntax check; browser tests: pet follows/grabs coins/blocks a hit; drill
breaks platforms; bubble traps + pops an enemy; warp in/out of the vault
with timer; win a level and see time/medal saved + picker medal; hat chips
lock/unlock off saved stats.
