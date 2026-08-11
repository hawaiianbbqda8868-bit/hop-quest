# Adventure Mode + Survival Arena — Design

**Date:** 2026-08-11
**Status:** Approved (user picked both from the design discussion)

## Adventure mode 🌈
The game's missing journey. A new **🌈 ADVENTURE** button opens a world-map
overlay: all 23 levels as path nodes.

- **Stars** (max 3 per level, derived from existing saves + a new
  `hopClears` store): ⭐ cleared · ⭐ all 3 gems · ⭐ any time medal.
- **Unlocking**: level i needs level i−1 cleared, plus star gates at
  checkpoints — {5th: 6⭐, 9th: 14⭐, 13th: 24⭐, 17th: 34⭐, 21st: 44⭐,
  finale: 52⭐} (69 possible).
- **Story**: "The Rainbow King stole the colors!" Map header carries the
  quest; each adventure clear says the level's color returned; clearing
  the finale in adventure declares all colors returned.
- Adventure runs are pure: remix/chaos/rival forced off; times, gems and
  ghosts save normally. Free-play PLAY stays fully unlocked.
- `startGame(idx, adv)` gains the adventure flag; NEXT continues the
  adventure; the map is reachable from the clear screen.

## Survival arena 👾
**🌊 SURVIVAL** button: one boss-rush-style arena (random world theme),
endless waves.

- Wave n spawns 2+n enemies dropping from the sky; type pool grows with
  waves (walkers → +jumpers → +flyers → +chasers → +shooters); every 5th
  wave is a giant wave (1.4× enemies).
- Clearing a wave heals +1 heart after a 1.6s breather; a present box
  drops every 2nd wave.
- Death reports "survived N waves"; best saved (`hopSurv`) and shown on
  the menu button. Coins collected bank as usual.

## Verification
Syntax; browser: map renders stars/locks/gates correctly from fabricated
saves, locked nodes refuse, adventure clear marks progress and NEXT
unlocks, survival waves spawn/clear/heal/escalate, death saves best;
storage cleaned.
