# Boss Rush Mode — Design

**Date:** 2026-08-10
**Status:** Approved (user requested from the proposed features list)

## Goal

A new mode: fight all 22 bosses back-to-back, launched from a **👑 BOSS RUSH**
button on the start screen.

## Rules

- Each fight happens in a compact themed arena (44 tiles, solid floor, a few
  platforms varying by fight, one present box) using that level's palette and
  boss config. The boss is active immediately; the `boss` music plays.
- Beat a boss → its coin ring drops, a 👑 toast shows, ~1.8s later the next
  arena builds. You heal **+1 heart** between fights and keep power-ups
  (grow, shield, stars) and coins.
- Death ends the run: the game-over screen reports "X of 22 bosses" and the
  best streak is saved to localStorage (`hopRushBest`), shown on the menu
  button ("Best 12/22"). The replay button restarts the rush.
- Beating all 22 shows the victory screen with a boss-rush message.

## Implementation notes

- Globals: `rushMode, rushIdx, rushT, rushAdv`. `startGame()`/`toMenu()`
  clear `rushMode`.
- `buildRushArena(i)` sets the same level globals as `buildLevel` (empty
  feature arrays, no checkpoint/wonder/gems), places the boss on the right,
  and parks the flag off-map so the normal win check can't fire.
- Advance check lives in `update()`: rush + dead boss → countdown → next
  arena or completion.
- HUD shows "Boss Rush i/22 — BOSS NAME" via `curName`.

## Verification

- Syntax check of the script block; browser test: start rush, defeat two
  bosses (via `bossHit()`), confirm arena advance + heal, die and confirm
  the report + saved best, confirm menu button shows the best streak.
