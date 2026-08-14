# Quest Mode — RPG Progression — Design

**Date:** 2026-08-13
**Status:** Approved (user idea: the game should accumulate skill/power for
the dopamine hit of levelling up; asked for a new mode to test it)

## Why
Every existing mode is flat — the hero is identical in level 1 and level 23.
Quest mode adds the missing growth curve: permanent levels, permanent
upgrades, and an endless floor counter to chase.

## The loop
🗡️ QUEST → endless generated floors. Kill things and grab things → XP orbs
fly into you → the XP bar fills → **LEVEL UP!** → choose 1 of 3 upgrades →
you are permanently stronger → deeper floors → death ends the *run* but
never the *progress* → next run starts easier because you're stronger.

## Progression (persisted in `hopQuest`)
- `lv`, `xp`, `pts`, `upg{}`, `deepest`.
- XP need: `60 + (lv-1)*40` — first level in well under a minute.
- XP sources: coin 2 (silent), enemy 8 (orb), gem 25, floor clear 30+10×floor,
  boss 60+15×floor.
- Level up grants a skill point, spent immediately on a 3-card choice
  (cards drawn from non-maxed upgrades; queued points show repeat screens).

## Upgrades (stackable, max 5 unless noted)
❤️ Vitality +1 max heart · 🦵 Spring Legs +7% jump · ⚡ Swift +7% run ·
⭐ Arsenal +5 starting stars · 🧲 Magnetism +60% pickup range ·
🍀 Fortune +20% XP · 🛡️ Guardian +3s starting shield ·
💥 Might +1 boss damage (max 2)

## Floors
`genQuestFloor(n)` — seeded generator (mulberry32) borrowing a random world
theme. Width 100→180 growing with depth; pits, platform runs with coin
lines, spikes, a sky route, present boxes. Enemy density and type pool grow
with depth (walk → jump → fly → chase → shoot); every 5th floor is a boss
floor with hp `3 + floor/5`. Floors set `noLap` so `buildLevel` skips the
two-lap doubling — floors stay tight (~60–90s) to keep the loop fast.

## Feel
XP orbs pop out of kills, then home in and stream into the hero. Floating
"+N XP" numbers. Gold XP bar + LV + floor in the HUD. Level-up overlay with
a fanfare. Quest runs ignore remix/chaos/rival and never touch level
records.

## Verification
Floors generate and are playable; orbs award XP; level up fires and cards
apply (measure maxHearts/jump/run/stars/shield); floor clear advances;
boss floor at 5; death reports and keeps progression; test data cleaned.
