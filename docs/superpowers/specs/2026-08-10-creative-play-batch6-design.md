# Creative Play Batch 6 — Rules Shakeup

**Date:** 2026-08-10
**Status:** Approved (user picked all four; motivation: "so boring already" —
the goal is changing moment-to-moment feel, not adding more stuff)

## 1. Chaos mode 🎲
"🎲 Chaos" toggle (persisted). Each normal/remix level start rolls one
mutator, shown in the HUD and as a toast:
tiny hero · giant enemies · bouncy floor (auto-boing on landing) · ice
world (12% friction) · runaway coins (flee within 110px; magnet disabled)
· turbo (game clock ×1.35) · one heart · coin rain · moon world (gravity
½, restored after wonder effects via `chaosG`) · darkness (radial light
around the hero) · mega magnet (420px pull).
Off in rush/daily/custom.

## 2. Water zones 🌊
Grid value 3 = water (non-solid; `solidAt` now checks 1|2 explicitly).
- Swim physics: gravity ×0.25, |vy| ≤ 140, unlimited jump-strokes
  (vy −260), double-jump refreshed. Rendered translucent blue with a
  surface line.
- Coral Cove and Sunken Ship convert their pits into swimmable pools
  (solid bottom, coins inside). `floorRow` treats water as empty;
  `airOK` keeps springs/cannons out of pools.
- Editor brush 🌊.

## 3. Gravity flip 🙃
Flip pads toggle the player's gravity when crossing the pad's column
(1.2s cooldown): inverted gravity, jumps, glide, pound, and
ceiling-landing (moveY reports up-hits via `moveYHitUp`). Hero draws
upside down. Auto-placed ×2 in ceiling levels (Crystal Cavern, Sunken
Ship); editor brush 🙃. Safety: flying off the top unflips.

## 4. Smarter bosses 👹
Attack picker every ~4s by boss size: hp≥4 adds **charge** (0.55s red
telegraph, then 400px/s rush), hp≥5 adds **slam** (leap + landing
shockwaves that slide along the ground and must be jumped), hp≥6 adds
**summon** (up to 2 walker minions). Hops pause during attacks.

## Verification
Syntax; browser: each chaos mutator applies, swimming in a Coral Cove
pool, flip pad round-trip on the Crystal Cavern ceiling, boss charge/
slam/summon observed on suitable bosses; editor brushes parse; storage
cleaned.
