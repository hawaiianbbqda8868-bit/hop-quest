# Shipping Hop Quest to the App Store and Google Play

The game is already packaged-ready: no remote scripts, works offline, landscape,
and rewarded ads are wired with an AdMob adapter waiting for your ad unit ids.

## 1. One-time setup (about 20 minutes)

```bash
cd ~/hop-quest
npm install                       # installs Capacitor + the AdMob plugin
npm run app:web                   # copies the game into www/
npx cap add ios
npx cap add android
npx cap sync
```

## 2. Your AdMob ad units

In the AdMob console create **one Rewarded ad unit per platform** (iOS + Android),
then paste the ids into `index.html` — search for `AD_UNITS`:

```js
const AD_UNITS={
  ios:     'ca-app-pub-XXXXXXXX/XXXXXXXX',
  android: 'ca-app-pub-XXXXXXXX/XXXXXXXX',
};
```

Also add your AdMob **App ID** to the native projects:

- **iOS** — `ios/App/App/Info.plist`:
  ```xml
  <key>GADApplicationIdentifier</key>
  <string>ca-app-pub-XXXXXXXX~XXXXXXXX</string>
  ```
- **Android** — `android/app/src/main/AndroidManifest.xml`, inside `<application>`:
  ```xml
  <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID"
             android:value="ca-app-pub-XXXXXXXX~XXXXXXXX"/>
  ```

Until those exist the game runs its practice reward flow, so nothing breaks.

⚠️ **Because this is a children's game**, mark it child-directed in AdMob and in
both store listings. That forces non-personalized ads (required by COPPA/GDPR-K).
Keep to rewarded video only — no banners or forced interstitials, which both
stores restrict for kids' apps.

## 3. Build

```bash
npm run app:web && npx cap sync   # after every change to the game
npx cap open ios                  # Xcode → Product ▸ Archive → upload
npx cap open android              # Android Studio → Build ▸ Signed App Bundle
```

## 4. Store checklist

- Icons: run `npx @capacitor/assets generate` with a 1024×1024 `assets/icon.png`
- Screenshots: run the game in the simulator, capture 3–5 per required size
- Privacy policy URL (required by both stores, even collecting nothing)
- Data safety / App Privacy: the game stores progress **only on the device**;
  the only network use is the optional Family Room and the ad SDK
- Content rating questionnaire: everyone / 4+

## Notes

- `www/` is generated — it is git-ignored, never edit it directly.
- The Family Room multiplayer talks to the Railway server; keep that deployed or
  the online mode falls back to peer-to-peer only.
