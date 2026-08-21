# 汉字 Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Paint 40 Chinese characters onto Hop Quest's existing enemies and present boxes so that defeating one speaks the word aloud and shows its meaning as an emoji, and collecting them fills a sticker book — with zero change to how the game plays.

**Architecture:** One new `// ---------- 汉字 mode ----------` section in `index.html` holds the deck, persistence, a shuffled bag, speech and the draw helper. Words attach to enemies and boxes **lazily** through `ziOf(o)` rather than at spawn time — this covers every spawn path at once (level build, custom levels, survival waves, boss arenas, and the mirrored/remixed copies made by object spread) without touching any of them. The single death choke point `hurtEnemy()` and the single box-pop site drive the learning moment.

**Tech Stack:** Vanilla JS, canvas 2D, Web Speech API (`speechSynthesis`), `localStorage`. No build step, no dependencies.

**Spec:** `docs/superpowers/specs/2026-08-21-chinese-characters-design.md`

---

## Testing note

This repo has no test runner and no build step — it is one static HTML file. The test harness for this feature is a `?zicheck` URL flag that runs assertions and prints to the console. Task 1 writes those assertions **before** the code they test, and every later task re-runs them.

Serve with `npm start` (port 3001) and open `http://localhost:3001/?zicheck`, reading the browser console.

---

### Task 1: Word deck, persistence, shuffled bag, and the `?zicheck` harness

**Files:**
- Modify: `index.html` — insert a new section immediately before `// ---------- levels ----------` (line 256)

- [ ] **Step 1: Write the failing assertions**

Insert this block immediately before the line `// ---------- levels ----------` in `index.html`:

```js
// ---------- 汉字 mode — self-check (open with ?zicheck) ----------
function ziCheck(){
  const fail=[], seenZ={};
  ZI.forEach((z,i)=>{
    if(!z.z||!z.py||!z.em) fail.push('entry '+i+' is missing z/py/em');
    if(seenZ[z.z]) fail.push('duplicate character '+z.z);
    seenZ[z.z]=1;
  });
  if(ZI.length!==40) fail.push('deck has '+ZI.length+' entries, expected 40');

  // the bag must emit every character once before any repeat
  ziBag=[];
  const got={}; let dup=0;
  for(let i=0;i<ZI.length;i++){ const k=ziDraw(); if(got[k]) dup++; got[k]=1; }
  if(dup) fail.push('bag repeated '+dup+' character(s) before exhausting');
  if(Object.keys(got).length!==ZI.length) fail.push('bag missed '+(ZI.length-Object.keys(got).length)+' character(s)');
  ziBag=[];

  // recording a sighting increments the right key and survives a round-trip
  const before=ziSeen['猫']||0;
  ziCollectRecord('猫');
  if((ziSeen['猫']||0)!==before+1) fail.push('sighting did not increment 猫');
  let round=null; try{ round=JSON.parse(localStorage.getItem('hopZi')||'null'); }catch(e){}
  if(!round||!round.seen||round.seen['猫']!==before+1) fail.push('sighting did not persist to localStorage');
  ziSeen['猫']=before; if(!before) delete ziSeen['猫']; saveZi();   // leave the real sticker book untouched

  console.log(fail.length ? '❌ zicheck FAILED:\n  '+fail.join('\n  ')
                          : '✅ zicheck passed — '+ZI.length+' characters, bag + dex OK');
  return fail;
}
try{ if(location.search.indexOf('zicheck')>=0) setTimeout(ziCheck,0); }catch(e){}
```

- [ ] **Step 2: Run it to verify it fails**

Start the server and open the check URL:

```bash
npm start
```

Open `http://localhost:3001/?zicheck` and read the console.

Expected: a red `ReferenceError: ZI is not defined` (or `ziBag is not defined`). Nothing named `ZI`, `ziBag`, `ziDraw`, `ziSeen`, `ziCollectRecord` or `saveZi` exists yet — that is the failure we want.

- [ ] **Step 3: Write the deck, persistence and bag**

Insert this block **immediately above** the `ziCheck` block you just added:

```js
// ---------- 汉字 mode 学中文 ----------
// Characters ride on the enemies and boxes the game already has. Stomp one, hear it, collect it.
// Deck rule: a character earns a slot only if ONE emoji shows its meaning honestly — the player is a
// total beginner who reads no Chinese and no English, so meaning must arrive as picture + sound.
const ZI=[
  {z:'猫',py:'māo',em:'🐱'},  {z:'狗',py:'gǒu',em:'🐶'},  {z:'鱼',py:'yú',em:'🐟'},   {z:'鸟',py:'niǎo',em:'🐦'}, {z:'马',py:'mǎ',em:'🐴'},
  {z:'牛',py:'niú',em:'🐮'},  {z:'羊',py:'yáng',em:'🐑'}, {z:'猪',py:'zhū',em:'🐷'},  {z:'虫',py:'chóng',em:'🐛'},{z:'龟',py:'guī',em:'🐢'},
  {z:'山',py:'shān',em:'⛰️'}, {z:'水',py:'shuǐ',em:'💧'}, {z:'火',py:'huǒ',em:'🔥'},  {z:'日',py:'rì',em:'☀️'},   {z:'月',py:'yuè',em:'🌙'},
  {z:'星',py:'xīng',em:'⭐'}, {z:'雨',py:'yǔ',em:'🌧️'},   {z:'云',py:'yún',em:'☁️'},  {z:'雪',py:'xuě',em:'❄️'},  {z:'花',py:'huā',em:'🌸'},
  {z:'口',py:'kǒu',em:'👄'},  {z:'手',py:'shǒu',em:'✋'},  {z:'目',py:'mù',em:'👁️'},   {z:'耳',py:'ěr',em:'👂'},   {z:'心',py:'xīn',em:'❤️'},
  {z:'牙',py:'yá',em:'🦷'},
  {z:'车',py:'chē',em:'🚗'},  {z:'门',py:'mén',em:'🚪'},  {z:'书',py:'shū',em:'📖'},  {z:'伞',py:'sǎn',em:'☂️'},  {z:'刀',py:'dāo',em:'🔪'},
  {z:'船',py:'chuán',em:'⛵'},{z:'灯',py:'dēng',em:'💡'}, {z:'鞋',py:'xié',em:'👟'},  {z:'球',py:'qiú',em:'⚽'},
  {z:'一',py:'yī',em:'1️⃣'},  {z:'二',py:'èr',em:'2️⃣'},   {z:'三',py:'sān',em:'3️⃣'},  {z:'五',py:'wǔ',em:'5️⃣'},  {z:'十',py:'shí',em:'🔟'}
];
const ZIFONT='"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans SC",sans-serif';

let ziOn=true, ziSeen={};
try{ const zs=JSON.parse(localStorage.getItem('hopZi')||'null'); if(zs){ ziOn=zs.on!==false; ziSeen=zs.seen||{}; } }catch(e){}
function saveZi(){ try{ localStorage.setItem('hopZi', JSON.stringify({on:ziOn, seen:ziSeen})); }catch(e){} }
function ziCount(){ let n=0; for(const k in ziSeen) if(ziSeen[k]>0) n++; return n; }
function ziCollectRecord(zc){ ziSeen[zc]=(ziSeen[zc]||0)+1; saveZi(); }

// shuffled bag — every character shows up once before any repeats, so one level can't
// hand out 猫 nine times and nothing else
let ziBag=[];
function ziDraw(){
  if(!ziBag.length){
    ziBag=ZI.map((_,i)=>i);
    for(let i=ziBag.length-1;i>0;i--){ const j=(Math.random()*(i+1))|0; const t=ziBag[i]; ziBag[i]=ziBag[j]; ziBag[j]=t; }
  }
  return ziBag.pop();
}
// lazy assignment: the first time anything asks for an object's character it gets one.
// This covers every spawn path at once — level build, custom levels, survival waves, boss
// arenas, and the mirrored/remixed copies made by object spread.
function ziOf(o){ if(o.zi==null) o.zi=ziDraw(); return ZI[o.zi]; }
```

- [ ] **Step 4: Run the check to verify it passes**

Reload `http://localhost:3001/?zicheck`.

Expected console output: `✅ zicheck passed — 40 characters, bag + dex OK`

- [ ] **Step 5: Commit**

```bash
git add index.html docs/superpowers/plans/2026-08-21-chinese-characters.md
git commit -m "feat(zi): 40-character deck, shuffled bag and dex persistence"
```

---

### Task 2: Speech

**Files:**
- Modify: `index.html` — append to the 汉字 section from Task 1; change the pointerdown handler at line 1994

- [ ] **Step 1: Add the speech functions**

Append to the end of the `// ---------- 汉字 mode 学中文 ----------` block (immediately before the `ziCheck` block):

```js
// Web Speech API. Three guards: primed on first gesture (iOS refuses otherwise),
// cancel() before each word so chain-stomps don't queue up ten of them, and a silent
// skip when the device has no Chinese voice — the visual pop still happens.
function ziVoice(){
  try{ const vs=speechSynthesis.getVoices()||[]; return {list:vs, v:vs.find(x=>/^zh/i.test(x.lang))||null}; }
  catch(e){ return {list:[], v:null}; }
}
function ziPrime(){
  try{ if(!window.speechSynthesis) return;
    speechSynthesis.getVoices();
    const u=new SpeechSynthesisUtterance(''); u.lang='zh-CN'; u.volume=0; speechSynthesis.speak(u);
  }catch(e){}
}
function ziSay(z){
  if(!sfxOn||!window.speechSynthesis) return;
  try{
    const {list,v}=ziVoice();
    if(list.length && !v) return;            // voices loaded but none is Chinese — stay silent
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(z);
    u.lang='zh-CN'; u.rate=0.8;              // slow enough for a beginner to catch the tone
    if(v) u.voice=v;
    speechSynthesis.speak(u);
  }catch(e){}
}
```

- [ ] **Step 2: Prime speech on the first gesture**

`index.html:1994` currently reads:

```js
addEventListener('pointerdown',()=>runMusic(),true);
```

Replace with:

```js
addEventListener('pointerdown',()=>{ runMusic(); ziPrime(); },true);
```

- [ ] **Step 3: Verify speech works**

Open `http://localhost:3001/`, click once anywhere (this primes it), then in the console run:

```js
ziSay('猫')
```

Expected: you hear "māo". If the device has no Chinese voice, expect silence and **no console error** — that is the correct fallback, not a failure.

Also confirm the guard: run `sfxOn=false; ziSay('狗')` — expected: silence. Then `sfxOn=true`.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(zi): Mandarin speech with iOS priming and silent no-voice fallback"
```

---

### Task 3: Paint the characters onto enemies and boxes

**Files:**
- Modify: `index.html` — append `drawZi` to the 汉字 section; `drawEnemy` (line 2298), `drawBox` (line 2283)

- [ ] **Step 1: Add the draw helper**

Append to the end of the `// ---------- 汉字 mode 学中文 ----------` block:

```js
// White fill + heavy dark outline so the character reads against every body colour —
// walker purple, brute brown, spiker slate, chaser red, flyer pink, box lids.
function drawZi(o, cx, cy, size){
  if(!ziOn) return;
  const z=ziOf(o);
  ctx.save();
  ctx.font='bold '+size+'px '+ZIFONT;
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.lineJoin='round'; ctx.lineWidth=Math.max(3,size*0.24);
  ctx.strokeStyle='rgba(18,10,34,.92)'; ctx.strokeText(z.z,cx,cy);
  ctx.fillStyle='#fff'; ctx.fillText(z.z,cx,cy);
  ctx.restore();
}
```

- [ ] **Step 2: Paint flyers and shooters**

In `drawEnemy` (`index.html:2298`), these two lines currently read:

```js
  if(et==='fly') return drawFlyer(en);
  if(et==='shoot') return drawShooter(en);
```

Replace with:

```js
  if(et==='fly'){ drawFlyer(en); drawZi(en,en.x+en.w/2,en.y+en.h/2+1,16); return; }
  if(et==='shoot'){ drawShooter(en); drawZi(en,en.x+en.w/2,en.y+en.h/2+8,15); return; }   // below the gun barrel
```

- [ ] **Step 3: Paint the ground enemies**

The character goes where the mouth is, so the monster reads as *saying* it. That means the
mouth arc must step aside — but the chaser's angry brows stay, since they are what marks it
as a chaser. `drawEnemy` currently ends (`index.html:2328-2334`):

```js
  if(et==='chase'){ // angry brows + frown
    ctx.strokeStyle='#5a1010'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(cx-10,cy-8); ctx.lineTo(cx-3,cy-5); ctx.moveTo(cx+10,cy-8); ctx.lineTo(cx+3,cy-5); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx,cy+9,3,1.15*Math.PI,1.85*Math.PI); ctx.stroke();
  } else {
    ctx.strokeStyle=et==='jump'?'#1f5c34':'#3a1f5c'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(cx,cy+6,3,0.15*Math.PI,0.85*Math.PI); ctx.stroke();
  }
}
```

Replace those lines with:

```js
  if(et==='chase'){ // angry brows + frown
    ctx.strokeStyle='#5a1010'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(cx-10,cy-8); ctx.lineTo(cx-3,cy-5); ctx.moveTo(cx+10,cy-8); ctx.lineTo(cx+3,cy-5); ctx.stroke();
    if(!ziOn){ ctx.beginPath(); ctx.arc(cx,cy+9,3,1.15*Math.PI,1.85*Math.PI); ctx.stroke(); }
  } else if(!ziOn) {
    ctx.strokeStyle=et==='jump'?'#1f5c34':'#3a1f5c'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(cx,cy+6,3,0.15*Math.PI,0.85*Math.PI); ctx.stroke();
  }
  drawZi(en,cx,cy+8,en.w>34?20:17);   // sits where the mouth was — under the eyes, on the widest part of the body
}
```

- [ ] **Step 4: Paint the present box lids**

In `drawBox` (`index.html:2283`), the unopened branch ends with this line:

```js
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(x+w/2-6,y-2,5,0,7); ctx.arc(x+w/2+6,y-2,5,0,7); ctx.fill();
```

Add immediately after it, still inside the `if(!bx.open){` branch:

```js
    drawZi(bx, x+w/2, y+22, 20);
```

- [ ] **Step 5: Verify visually**

Open `http://localhost:3001/`, press FREE PLAY, and play the first level. Confirm:
- every walker, jumper, chaser, spiker, brute, flyer and shooter wears a character
- the character is legible on all of them (white on dark outline)
- the character sits under the eyes and the mouth arc has stepped aside
- present boxes wear one on the lid
- characters do not cover the enemies' eyes
- nothing else about movement or difficulty changed

Then re-run `http://localhost:3001/?zicheck` — expected: still `✅ zicheck passed`.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat(zi): paint characters on every enemy type and present box lid"
```

---

### Task 4: The learning moment

**Files:**
- Modify: `index.html` — append `ziCollect` to the 汉字 section; `hurtEnemy` (line 418), box pop (line 1697), toast render (line 2217)

- [ ] **Step 1: Add the collect function**

Append to the end of the `// ---------- 汉字 mode 学中文 ----------` block:

```js
// The moment of learning: character flies up off the corpse, emoji beside it, voice says it.
function ziCollect(z, x, y){
  ziCollectRecord(z.z);
  toasts.push({x:x-14, y, ic:z.z, zi:true, t:1.5});
  toasts.push({x:x+22, y:y+2, ic:z.em, t:1.5});
  ziSay(z.z);
}
```

- [ ] **Step 2: Hook enemy death**

`hurtEnemy` (`index.html:418`) ends with this line:

```js
  en.alive=false; addPop(en.x+en.w/2,en.y); sfx('stomp'); dropLoot(en); spawnShell(en); return true;
```

Replace with:

```js
  en.alive=false; addPop(en.x+en.w/2,en.y); sfx('stomp'); dropLoot(en); spawnShell(en);
  if(ziOn) ziCollect(ziOf(en), en.x+en.w/2, en.y-6);   // one hook covers stomps, pounds, blaster, shells
  return true;
```

- [ ] **Step 3: Hook the present box**

At `index.html:1697` the box-pop block reads:

```js
      bx.open=true; if(!pl.pounding) pl.vy=-460; sfx('box'); addPop(bx.x+bx.w/2,bx.y);
```

Replace with:

```js
      bx.open=true; if(!pl.pounding) pl.vy=-460; sfx('box'); addPop(bx.x+bx.w/2,bx.y);
      if(ziOn) ziCollect(ziOf(bx), bx.x+bx.w/2, bx.y-10);   // powerup below is untouched
```

- [ ] **Step 4: Render the character toast large**

`index.html:2217` currently reads:

```js
  for(const t of toasts){ ctx.globalAlpha=Math.max(0,t.t); ctx.fillText(t.ic,t.x,t.y); }
```

Replace with:

```js
  for(const t of toasts){ ctx.globalAlpha=Math.max(0,t.t);
    if(t.zi){ ctx.save();
      ctx.font='bold 34px '+ZIFONT; ctx.textAlign='center';
      ctx.lineJoin='round'; ctx.lineWidth=7; ctx.strokeStyle='rgba(18,10,34,.9)'; ctx.strokeText(t.ic,t.x,t.y);
      ctx.fillStyle='#fff'; ctx.fillText(t.ic,t.x,t.y);
      ctx.restore(); }
    else ctx.fillText(t.ic,t.x,t.y); }
```

- [ ] **Step 5: Verify**

Open `http://localhost:3001/`, play the first level, and stomp an enemy. Confirm:
- the character rises off the corpse, big and white
- its emoji rises beside it
- a Mandarin voice says the word
- stomping four enemies fast plays four words without a growing backlog (each cancels the last)
- popping a present box does the same **and** still drops its powerup

Then open the console and run `ziCount()` — expected: a number greater than 0 that matches how many distinct characters you defeated.

Re-run `http://localhost:3001/?zicheck` — expected: still `✅ zicheck passed`.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat(zi): speak and collect the character on every defeat and box pop"
```

---

### Task 5: The sticker book tab and the on/off toggle

**Files:**
- Modify: `index.html` — tab row (line 144), pane markup (after line 168), `buildMenu` (line 2586), tab handler area (line 2622)

- [ ] **Step 1: Add the tab button**

`index.html:144` reads:

```html
    <button class="chip tab" data-pane="sound">🔊 Sound</button>
```

Add immediately after it:

```html
    <button class="chip tab" data-pane="zi">字 Chinese</button>
```

- [ ] **Step 2: Add the pane**

The sound pane ends at `index.html:168`:

```html
  <div class="card pane hidden" id="pane-sound">
    <div class="row">
      <button class="chip" id="musTog">🎵 Music: ON</button>
      <button class="chip" id="sfxTog">🔊 Sound FX: ON</button>
    </div>
  </div>
```

Add immediately after that closing `</div>`:

```html
  <div class="card pane hidden" id="pane-zi">
    <div class="row"><button class="chip" id="ziTog">汉字 Chinese: ON</button></div>
    <div class="lbl" id="ziCountLbl">0 / 40 collected</div>
    <div class="row" id="ziGrid"></div>
  </div>
```

- [ ] **Step 3: Render the book**

Add this immediately **above** `function buildMenu(){` (`index.html:2586`):

```js
function updZiUI(){
  const tg=document.getElementById('ziTog');
  tg.textContent='汉字 Chinese: '+(ziOn?'ON':'OFF'); tg.classList.toggle('sel',ziOn);
  document.getElementById('ziCountLbl').textContent=ziCount()+' / '+ZI.length+' collected';
  const g=document.getElementById('ziGrid'); g.innerHTML='';
  ZI.forEach(z=>{
    const n=ziSeen[z.z]||0, d=document.createElement('div');
    d.className='chip'+(n?' sel':'');
    d.style.opacity=n?'':'0.4';
    d.style.fontFamily=ZIFONT;
    d.textContent = n ? z.z+' '+z.em+' '+z.py+' ×'+n : '？';
    if(n) d.onclick=()=>ziSay(z.z);
    g.appendChild(d);
  });
}
```

- [ ] **Step 4: Refresh it whenever the menu opens**

Inside `buildMenu`, immediately after this line:

```js
  document.getElementById('bankAmt').textContent=bank;
```

add:

```js
  updZiUI();
```

- [ ] **Step 5: Wire the toggle**

Add immediately after the `.tab` click handler block that ends at `index.html:2625`:

```js
document.getElementById('ziTog').onclick=()=>{ ziOn=!ziOn; saveZi(); updZiUI(); };
```

- [ ] **Step 6: Verify**

Open `http://localhost:3001/`, play a level and defeat a few enemies, then open ≡ Menu → 字 Chinese. Confirm:
- the header counts what you collected, out of 40
- collected cards show character, emoji, pinyin and a ×count; the rest show `？` and are faded
- tapping a collected card says the word again
- pressing `汉字 Chinese: ON` flips it to OFF; starting a level then shows **no** characters on enemies or boxes, no speech, and no character toasts
- flipping it back ON restores them
- reload the page: both the toggle state and the collected counts survive

Re-run `http://localhost:3001/?zicheck` — expected: still `✅ zicheck passed`.

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "feat(zi): 字 sticker book tab with replay-on-tap and an on/off toggle"
```

---

### Task 6: Full play-through and screenshots

**Files:** none modified

- [ ] **Step 1: Play a full level end to end**

Confirm nothing regressed: movement, jumping, the blaster, dash, ground pound, checkpoints, gems, the flag, and level completion all behave exactly as before.

- [ ] **Step 2: Check the other modes build without error**

Visit each from the menu and confirm characters appear and no console errors: 🌈 ADVENTURE, 🗡️ QUEST, 👾 SURVIVAL, 👑 BOSS RUSH, 🎲 DAILY, ⭐ My Level.

- [ ] **Step 3: Screenshot for the user**

Capture the enemies wearing characters, a defeat moment with the character and emoji rising, and the 字 sticker book.

- [ ] **Step 4: Commit anything outstanding**

```bash
git status
```

Expected: clean, apart from the pre-existing unrelated `package.json` / `server.js` port changes, which this work must leave alone.
