# Friend Multiplayer — Design

**Date:** 2026-08-11
**Status:** Approved (user: single-player gets tiring; kids play Roblox for
the networking. Chose races + buddy mode.)

## Architecture
WebRTC peer-to-peer via PeerJS (CDN script + its free public broker for the
handshake only; gameplay data flows browser↔browser). No game server.
Room codes: host registers peer id `hopquest-<4 chars>`, displays the 4-char
code; joiner connects to that id. Code-only connections, emoji-only
communication — kid-safe by construction.

## Modes
- **🏁 Race**: host picks level + START; both play the same level in their
  own simulation, seeing each other's hero live (20Hz position stream:
  x, y, face, big, gflip). First `finish` message wins; the clear screen
  declares the result; a "friend finished!" toast pressures the laggard.
- **🤝 Buddy**: same presence, no race result — just play together.
- Emote bar (😂 ❤️ 🚀 🐢) while connected: shows above your hero locally
  and above your hero on the friend's screen.

## UI
- "🌐 FRIEND" mode button → mpScreen overlay: CREATE ROOM (shows big code),
  JOIN with 4-char input, status line; host-only row: Race/Buddy chips +
  START (uses host's selected level). Connection survives returning to the
  menu; host can START rematches; joiner auto-launches on `start`.
- Remote hero: translucent hero in the friend's color with a FRIEND tag.

## Sync model (honest limits)
Each player simulates their own world — enemies/coins are not shared; the
friend is a live presence, not a physics object. Race fairness = same level,
same start, first flag wins. Multiplayer runs force remix/chaos/rival off.

## Verification
Two browser tabs: create + join a real room over the public broker, host
starts a race, both tabs enter the level, position packets flow and the
remote hero renders, emotes deliver, finish message decides the race,
disconnect shows the friend-left status.
