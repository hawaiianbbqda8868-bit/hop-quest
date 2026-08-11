# Ten New Levels — Design

**Date:** 2026-08-10
**Status:** Approved (placement confirmed by user: insert before Rainbow Summit)

## Goal

Grow Hop Quest from 12 to 22 levels. The 10 new worlds slot in as levels 12–21
(0-indexed 11–20), keeping **Rainbow Summit** as the grand finale (level 22).

## Constraints

- Reuse the existing level format: `{ name, W, music, boss, theme, build(L) }`
  entries in the `LEVELS` array in `index.html`. No new mechanics, enemy types,
  music tracks, or engine changes.
- Every level follows the established house style: themed palette, ground pits,
  platform runs, coin lines, a mix of enemy types, spikes, 3 present boxes, a
  high-coin sky route, and a themed mini-boss guarding the flag.
- Difficulty ramps across the ten (boss hp 3 → 5, denser hazards later).
- Victory screen, level picker, and next-level flow all read `LEVELS.length`
  dynamically, so no other code changes are needed.

## The ten worlds (in order)

| # | Name | Theme / palette | Music | Boss | Flavor |
|---|------|-----------------|-------|------|--------|
| 12 | Sandy Dunes | warm desert golds | cheery | SAND SULTAN (3hp) | wide dune runs, jumper enemies |
| 13 | Coral Cove | beach blues/sand | breezy | REEF RULER (3hp) | island hopping over water pits (cloudy style) |
| 14 | Blossom Garden | pink cherry-blossom | cheery | PETAL PRINCE (3hp) | gentle breather, coin-rich |
| 15 | Jungle Temple | deep greens/stone | cave | VINE VIPER (4hp) | dense canopy, chasers + shooters |
| 16 | Candy Canyon | pastel candy | icy | GUMMY GOLIATH (4hp) | bouncy jumper-heavy layout |
| 17 | Sunken Ship | deep-blue wreck | cave | KRAKEN CAPTAIN (4hp, ceiling) | tight caves like Crystal Cavern |
| 18 | Haunted Hollow | purple/black spooky | danger | GHOST GOURD (4hp) | flyer swarms, hazard pits |
| 19 | Neon City | night cyberpunk | cave | CIRCUIT CZAR (5hp) | shooter gauntlets |
| 20 | Moonlight Craters | grey/star space | breezy | LUNAR LOOMER (5hp, floating islands) | Sky Islands-style hopper |
| 21 | Golden Citadel | royal gold | finale | GILDED GENERAL (5hp) | pre-finale gauntlet, every enemy type |

## Verification

- A scratch node script extracts the `LEVELS` array, runs every `build()`
  against a stub API, and asserts: start tile and flag tile stand on solid
  ground, and all placements are within level bounds.
- Manual smoke test in Chrome: load the game, start several new levels, check
  the console for errors, reach and beat at least one new mini-boss.
