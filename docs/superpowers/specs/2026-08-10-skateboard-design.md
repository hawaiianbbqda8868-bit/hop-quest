# Skateboard — Design

**Date:** 2026-08-10
**Status:** Approved (user chose: found in levels, like the frog mount)

## Behavior

- One 🛹 auto-placed per level on safe ground near 8% of level width (right
  near the start), rocking gently. Touch it to ride. Not in boss rush.
- While riding:
  - Ground top speed 250 → 340 px/s, and only 30% of normal ground
    friction with no input — you coast like a real board.
  - Jumping does a **kickflip** (board spins under you, 0.45s).
  - **Speed ram**: on the ground above 240 px/s, running into an enemy
    squashes it (with pirate loot support) and costs a little speed,
    instead of hurting you.
- Taking a real hit while riding **breaks the board** (absorbs the hit,
  board is gone for the level). Protection order: shield → frog → skate →
  pet → grow → heart.
- Checkpoint respawn: a board being ridden at death is gone.
- Drawn as a deck + wheels under the hero, tilting with speed; kickflip
  rotation mid-air; HUD shows 🛹 while riding.

## Verification

Syntax check; browser: mount, top speed & coasting measured, kickflip
timer, ram kill at speed, board breaks on hit and absorbs it, auto-placed
across all 22 levels.
