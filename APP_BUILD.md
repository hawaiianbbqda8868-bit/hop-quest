# Shipping Hop Quest to the App Store and Google Play

The game is packaging-ready: no remote scripts, works offline, landscape-locked,
**no ads, no tracking, no in-app purchases** — which keeps the store privacy
forms about as simple as they get.

## 1. One-time setup (about 20 minutes)

```bash
cd ~/hop-quest
npm install                       # installs Capacitor
npm run app:web                   # copies the game into www/
npx cap add ios
npx cap add android
npx cap sync
```

## 2. Build

```bash
npm run app:web && npx cap sync   # after every change to the game
npx cap open ios                  # Xcode → Product ▸ Archive → upload
npx cap open android              # Android Studio → Build ▸ Signed App Bundle
```

Or the shortcuts: `npm run app:ios` / `npm run app:android`.

## 3. Store checklist

- Icons: run `npx @capacitor/assets generate` with a 1024×1024 `assets/icon.png`
- Screenshots: run in the simulator, capture 3–5 per required size
- Privacy policy URL (both stores require one even when you collect nothing)
- Data safety / App Privacy: **no data collected**. Progress is saved only on
  the device (localStorage); the only network use is the optional Family Room
  multiplayer, which sends nothing but live positions and emoji while playing
- Content rating: everyone / 4+

## Notes

- `www/` is generated — it is git-ignored, never edit it directly.
- Family Room multiplayer uses the Railway server; keep that deployed or the
  online mode falls back to peer-to-peer only.
- Apple's "minimum functionality" rule rejects thin website wrappers. Hop Quest
  is a full game (23 worlds, Quest/Adventure/Survival/Boss Rush modes, a level
  editor, offline play), so lead the review notes with that.
