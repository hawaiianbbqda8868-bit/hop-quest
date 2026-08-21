# 汉字 Mode — Chinese Characters in Hop Quest

**Date:** 2026-08-21
**Status:** Approved, ready for implementation

## Goal

Teach a six-year-old total beginner to recognize ~40 Chinese characters by
playing Hop Quest, without changing how Hop Quest plays.

The learner speaks no Mandarin and reads no Chinese *or* English fluently.
Meaning therefore has to arrive as picture + sound, never as English text.

## Non-goals

- No quizzes, no wrong answers, no scoring the learning.
- No pausing gameplay for a teaching moment.
- No change to enemy AI, hitboxes, spawn density, or level difficulty.
- No writing/stroke-order practice. Recognition only.

## Design

### 1. The word deck

A single module-level array, `ZI`, of ~40 entries:

```js
const ZI = [
  {z:'猫', py:'māo', em:'🐱'},
  {z:'山', py:'shān', em:'⛰️'},
  ...
];
```

- `z` — the character (simplified)
- `py` — pinyin with tone marks (shown in the sticker book; the child never
  has to read it, it is there for the parent and for later)
- `em` — one emoji that shows the meaning unambiguously

Membership rule: a character qualifies only if a single emoji shows its
meaning honestly. This is what makes zero-English teaching possible, and it
is the constraint that sets the deck size.

Contents (40):

| Group | Characters |
|---|---|
| Animals (10) | 猫 狗 鱼 鸟 马 牛 羊 猪 虫 龟 |
| Nature (10)  | 山 水 火 日 月 星 雨 云 雪 花 |
| Body (6)     | 口 手 目 耳 心 牙 |
| Things (9)   | 车 门 书 伞 刀 船 灯 鞋 球 |
| Numbers (5)  | 一 二 三 五 十 |

Adding a future deck means appending to this array. No game code changes.

### 2. Attaching words to the world

At level-build time every enemy and every present box receives a `.zi`
index into `ZI`.

Words are drawn from a **shuffled bag** rather than sampled independently,
so a single level cannot hand out 猫 nine times and nothing else. The bag
refills and reshuffles when exhausted.

Rendering:

- **Enemies** — the character is painted on the body inside `drawEnemy`,
  bold white with a dark outline so it reads against every body color
  (walker purple, brute brown, spiker slate, chaser red). ~20px on the
  30px bodies. The separate `drawFlyer` and `drawShooter` paths get the
  same treatment.
- **Present boxes** — the character sits on the lid inside `drawBox`. The
  ribbon and existing box art stay.

This is a paint pass only. No gameplay values change.

### 3. The moment of learning

`hurtEnemy()` is the single place any enemy dies, so it is the only hook
needed — it covers stomps, ground pounds, blaster shots, thrown shells and
boss-adjacent kills alike.

On death (and on popping a present box):

1. The character rises off the corpse at ~32px and fades.
2. Its emoji appears beside it.
3. A Mandarin voice speaks the word.
4. The character's count in the sticker book increments.

Present boxes still drop their normal powerup. Nothing is removed from the
existing reward.

**Speech** uses the Web Speech API:

- `lang: 'zh-CN'`, `rate: 0.8` — slow enough for a beginner to catch tones.
- Primed with a silent utterance on the first user gesture, because iOS
  will not speak otherwise.
- `speechSynthesis.cancel()` before each word, so a chain of fast stomps
  does not build a ten-word backlog.
- If the device has no Chinese voice, speech is skipped silently and the
  visual pop still happens. Never an error, never a blocked frame.
- Respects the existing 🔊 Sound FX toggle.

### 4. The sticker book

A new `字` tab in the menu, alongside 🗺️ Levels / 🎨 Hero / 🛒 Shop /
🔊 Sound. The tab and pane machinery already exists (`data-pane`), so this
is one button plus one pane.

The pane contains:

- A header: `23 / 40 collected`
- A grid of 40 cards. A collected card shows the character large, its emoji
  beneath, and a small count (`×12`). An uncollected card is a grey
  silhouette with `?`.
- Tapping a collected card replays its sound.
- The 汉字 on/off chip (see below).

Collecting is the motivator; the count is the evidence of repetition.

### 5. Toggle and persistence

`localStorage['hopZi']` stores:

```json
{ "on": true, "seen": { "猫": 12, "山": 3 } }
```

This matches the existing `hopHero` / `hopQuest` / `hopShop` convention in
the file, including the try/catch-wrapped read and write helpers.

A `汉字 Chinese: ON` chip at the top of the 字 pane disables the whole
feature: characters vanish from enemies and boxes, no speech, and the game
is byte-for-byte the experience it is today. Useful when a friend plays or
for a pure speed run.

**Multiplayer:** each device assigns its own words. They are cosmetic and
feed only the local sticker book, so there is nothing to synchronize and no
desync risk.

### 6. Verification

The repository has no test framework, no build step and no test script —
it is one HTML file served statically. Rather than introduce tooling, the
testable logic is kept pure and small and checked by a debug flag:

- `?zicheck` runs assertions in the console and renders a pass/fail line:
  - every `ZI` entry has a non-empty `z`, `py` and `em`
  - no duplicate characters
  - the shuffled bag emits every character once before repeating
  - recording a sighting increments the right key and persists
- Everything visual — legibility of the character on each enemy type, the
  feel of the pop, sticker book layout — is verified by running the game,
  playing a level, and screenshotting.

If a real test runner is wanted later it can be added independently; it is
not required by this change.

## Risks

| Risk | Mitigation |
|---|---|
| Character unreadable on dark enemy bodies | White fill + dark outline, verified visually on all six enemy types |
| Speech backlog on fast stomp chains | `cancel()` before each utterance |
| No Chinese voice installed | Silent fallback, visual pop unaffected |
| Clutter on 30px sprites | Character replaces nothing; sized and positioned against the body, checked in play |
