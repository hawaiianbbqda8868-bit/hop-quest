# Creative Play Batch 4 — Design

**Date:** 2026-08-10
**Status:** Approved (user picked all four)

## Features

### 1. Coin shop + piggy bank 🛒
- Persistent wallet (`hopBank`): every run's collected coins bank on win or
  loss (including boss rush and daily).
- Shop card on the start screen (`hopShop` persists owned + equipped):
  - 🐶 Puppy pet (300) — wider coin-grab radius (44px vs 26)
  - 🐲 Dragon pet (800) — every 6s spits a star at the nearest enemy
  - ✨ Sparkle trail (200) / 🌈 Rainbow trail (500) — hero trail styles
  - 🟡 Gold color (400) / 🟣 Galaxy color (600) — hero colors
- Owned pets/trails equip on click; owned colors set the hero color.

### 2. Cannon barrels 🛢️
- One auto-placed per level (~62% of W). Walk in → you load into the
  barrel, which sweeps its aim (0.35–2.79 rad). Press jump to launch at
  980px/s along the aim, with a dotted trajectory preview while loaded.
  1.5s cooldown after firing. Player physics suspend while loaded.

### 3. Weather & ambience ❄️
- ~36 wrap-around parallax particles per level, type mapped by level name:
  snow (Frost), embers (Lava, Obsidian), fireflies (Bog, Mushroom, Jungle,
  Haunted), petals (Blossom, Candy, Rainbow), stars (Moonlight, Crystal,
  Golden), rain (Storm, Neon), bubbles (Sunken, Coral). Drawn screen-space
  after the world; boss-rush arenas inherit their level's weather.

### 4. Daily challenge 🎲
- `genDaily()` builds a level def from a date-seeded PRNG (mulberry32):
  W 170–210, theme borrowed from a random world, generated pits/platforms/
  coins/enemies/spikes, standard sky route, 3 boxes, seeded 4hp boss.
- 🎲 DAILY button on the menu (shows today's medal once earned). Daily
  wins bank coins and store best-of-day (`hopDaily`) with a medal from the
  usual W-based thresholds. Daily runs never touch level saves (times,
  gems, ghosts). `buildLevel` gains an optional def override parameter.

## Verification

Syntax check; browser: buy + equip shop items with a fake bank, dragon pet
fires, cannon loads/aims/launches, weather particles render per theme,
daily generates deterministically for today, completes, and stores its
medal; all saves guarded; test storage cleaned.
