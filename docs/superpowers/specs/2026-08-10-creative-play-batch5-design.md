# Creative Play Batch 5 — Design

**Date:** 2026-08-10
**Status:** Approved (user picked jetpack, rival race, level editor)

## 1. Jetpack 🚀 (present power-up)
- New gift type `jet`: 8s of fuel. While fueled, holding jump thrusts
  upward (accelerate to −430 px/s cap); fuel burns only while thrusting.
- HUD shows 🚀 with remaining fuel; hero draws a backpack + flame while
  thrusting. Present odds rebalanced to fit 7 gift types.

## 2. Rival race 🏁
- "🏁 Rival" toggle chip in the Levels pane (persisted with the hero).
  When on (normal + remix levels, not rush/daily/custom), an AI hero
  spawns beside you and runs for the flag at 205 px/s.
- AI: runs right; jumps when a pit (no floor within 4 rows one tile
  ahead) or a wall blocks it. Intangible to enemies and hazards. Falling
  off the map sky-drops it back in two tiles ahead.
- Reaching the flag first shows a 🏁 taunt; if the player wins the level
  before the rival finishes, +25 bonus coins bank and the clear screen
  says so.

## 3. Level editor 🛠️
- One custom level slot (`hopCustom`), W=120, 13 editable rows stored as
  char rows: `#` ground, `=` platform, `c` coin, `e/f/j/s/h` enemies
  (walk/fly/jump/shoot/chase), `^` spike, `S` spring, `b` present box,
  `.` air. Template: flat ground.
- "🛠️ Editor" chip opens edit mode: the real renderer draws the level
  with a free camera; a floating bar holds brush chips, pan ◀ ▶, ▶ TEST,
  and 💾 Menu. Tap/drag on the canvas paints the selected brush;
  every edit saves and rebuilds live.
- Start (cols 0–4) and flag (last 7 cols) ground is enforced at build.
  Custom plays with no boss and no auto-placed extras; "⭐ My Level ▶"
  chip appears in the Levels pane once a level is saved. Custom wins bank
  coins but never touch level records.

## Verification
Syntax check; browser: jetpack flight gain + fuel drain, rival jumps a
pit and finishes, beat-the-rival bonus, editor paints/saves/rebuilds,
TEST plays the painted level, custom win screen; storage cleaned.
