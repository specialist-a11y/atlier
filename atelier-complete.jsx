import React, { useState, useRef, useMemo, useEffect, useCallback } from "react";

/* ============================================================
   ATELIER — AI Interior Design Studio
   Single-file React artifact. Real AI via Anthropic API.
   ============================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Karla:wght@400;500;600;700&display=swap');

:root{
  --bg:#F6F5F0; --card:#FFFFFF; --ink:#22261F; --muted:#6F7369; --line:#E4E2D8;
  --accent:#5F7161; --accent-soft:#EAEFEA; --accent-ink:#F5F7F4;
  --brass:#9C8248; --paper:#FBFAF6; --plan:#2B2F29; --danger:#A34B3C;
  --shadow:0 1px 2px rgba(30,32,26,.05), 0 10px 30px -12px rgba(30,32,26,.14);
}
[data-theme="dark"]{
  --bg:#15171A; --card:#1E2124; --ink:#EBECE6; --muted:#9BA093; --line:#31352E;
  --accent:#7E937D; --accent-soft:#26302A; --accent-ink:#101510;
  --brass:#C2A868; --paper:#1A1D1B; --plan:#D6D9CF; --danger:#D07A67;
  --shadow:0 1px 2px rgba(0,0,0,.4), 0 12px 32px -14px rgba(0,0,0,.6);
}
*{box-sizing:border-box}
html,body{overflow-x:hidden;max-width:100%}
.atl{min-height:100vh;background:var(--bg);color:var(--ink);font-family:'Karla',sans-serif;font-size:15px;line-height:1.5;-webkit-font-smoothing:antialiased;transition:background .3s,color .3s;overflow-x:hidden}
.atl h1,.atl h2,.atl h3{font-family:'Fraunces',serif;font-weight:500;margin:0}
.atl-top{display:flex;align-items:center;gap:14px;padding:14px 22px;border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--bg);z-index:20}
.atl-logo{font-family:'Fraunces',serif;font-size:20px;letter-spacing:.02em}
.atl-logo em{font-style:italic;color:var(--accent)}
.atl-roomname{font-size:13px;color:var(--muted);border-left:1px solid var(--line);padding-left:14px}
.atl-tabs{display:flex;gap:2px;padding:10px 16px 0;overflow-x:auto;scrollbar-width:none}
.atl-tabs::-webkit-scrollbar{display:none}
.atl-tab{border:none;background:none;color:var(--muted);font:600 13px 'Karla';padding:9px 13px;border-radius:10px 10px 0 0;cursor:pointer;white-space:nowrap;border-bottom:2px solid transparent}
.atl-tab.on{color:var(--ink);border-bottom-color:var(--accent)}
.atl-tab:hover{color:var(--ink)}
.atl-main{max-width:1200px;margin:0 auto;padding:22px 18px 80px;display:grid;gap:18px}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow);padding:20px}
.card h2{font-size:19px;margin-bottom:4px}
.card .sub{color:var(--muted);font-size:13px;margin:0 0 14px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
@media(max-width:760px){.grid2,.grid3{grid-template-columns:1fr}.atl-main{padding:14px 10px 90px}}
@media(max-width:480px){
  .atl-top{padding:10px 14px;gap:10px}
  .atl-roomname{display:none}
  .atl-logo{font-size:18px}
  .atl-tabs{padding:8px 10px 0}
  .atl-tab{padding:9px 11px;font-size:12.5px}
  .card{padding:16px}
  .btn{padding:10px 14px}
  .chip{padding:9px 14px}
}
.fld{display:flex;flex-direction:column;gap:5px}
.fld label{font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--muted)}
.fld input,.fld select,.fld textarea{background:var(--paper);border:1px solid var(--line);border-radius:10px;padding:9px 11px;font:500 14px 'Karla';color:var(--ink);outline:none;transition:border .15s}
.fld input:focus,.fld select:focus,.fld textarea:focus{border-color:var(--accent)}
.btn{border:1px solid var(--line);background:var(--card);color:var(--ink);font:700 13px 'Karla';padding:9px 15px;border-radius:10px;cursor:pointer;transition:all .15s;display:inline-flex;align-items:center;gap:7px}
.btn:hover{border-color:var(--accent);transform:translateY(-1px)}
.btn.primary{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.btn.primary:hover{filter:brightness(1.07)}
.btn.ghost{background:none;border-color:transparent;color:var(--muted)}
.btn.ghost:hover{color:var(--ink);border-color:var(--line)}
.btn:disabled{opacity:.5;cursor:default;transform:none}
.chip{display:inline-flex;align-items:center;padding:7px 13px;border-radius:999px;border:1px solid var(--line);background:var(--paper);font:600 13px 'Karla';cursor:pointer;transition:all .15s;color:var(--ink)}
.chip.on{background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.tag{font:700 10px 'Karla';letter-spacing:.08em;text-transform:uppercase;color:var(--brass)}
.notice{background:var(--accent-soft);border:1px solid var(--line);border-radius:12px;padding:11px 14px;font-size:13px}
.notice.warn{color:var(--danger)}
.spin{width:15px;height:15px;border:2px solid currentColor;border-top-color:transparent;border-radius:50%;animation:atlspin .7s linear infinite}
@keyframes atlspin{to{transform:rotate(360deg)}}
.bar{height:8px;border-radius:99px;background:var(--line);overflow:hidden}
.bar>i{display:block;height:100%;background:var(--accent);border-radius:99px;transition:width .6s ease}
.swatch{border-radius:14px;height:96px;display:flex;align-items:flex-end;padding:10px;color:#fff;font:700 12px 'Karla';text-shadow:0 1px 3px rgba(0,0,0,.35);border:1px solid var(--line)}
.msg{max-width:82%;padding:10px 14px;border-radius:14px;font-size:14px;white-space:pre-wrap}
.msg.u{align-self:flex-end;background:var(--accent);color:var(--accent-ink);border-bottom-right-radius:4px}
.msg.a{align-self:flex-start;background:var(--paper);border:1px solid var(--line);border-bottom-left-radius:4px}
.tbl{width:100%;border-collapse:collapse;font-size:14px}
.tbl th{text-align:left;font:700 11px 'Karla';letter-spacing:.06em;text-transform:uppercase;color:var(--muted);padding:8px 10px;border-bottom:1px solid var(--line)}
.tbl td{padding:9px 10px;border-bottom:1px solid var(--line)}
.tbl tr:last-child td{border-bottom:none}
.planwrap{background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:10px;overflow:auto}
.fitem{cursor:grab}
.fitem:active{cursor:grabbing}
.fade{animation:atlfade .35s ease}
@keyframes atlfade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.atl *{animation:none!important;transition:none!important}}

/* ---- landing ---- */
.ld-hero{max-width:1140px;margin:0 auto;padding:64px 24px 40px;display:grid;grid-template-columns:1.05fr 1fr;gap:52px;align-items:center}
.ld-hero h1{font-size:clamp(36px,5vw,58px);margin:12px 0 16px;line-height:1.12}
.ld-hero h1 em,.ld em{font-style:italic;color:var(--accent)}
.ld-lede{font-size:17px;color:var(--muted);max-width:46ch;margin-bottom:26px}
.ld-note{font-size:13px;color:var(--muted);margin-top:12px}
.planframe{background:var(--paper);border:1px solid var(--line);border-radius:20px;box-shadow:var(--shadow);padding:16px}
.planframe svg{width:100%;display:block}
.draw{stroke-dasharray:1600;stroke-dashoffset:1600;animation:atldraw 2s .3s ease forwards}
@keyframes atldraw{to{stroke-dashoffset:0}}
.pop{opacity:0;animation:atlpop .5s ease forwards}
@keyframes atlpop{from{opacity:0;transform:scale(.88)}to{opacity:1;transform:scale(1)}}
.ld-strip{border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:18px 24px;display:flex;gap:12px 40px;justify-content:center;flex-wrap:wrap;font:600 13px 'Karla';color:var(--muted)}
.ld-strip b{color:var(--accent);font-family:'Fraunces',serif;font-size:16px;font-weight:500}
.ld-sec{max-width:1140px;margin:0 auto;padding:70px 24px}
.ld-h{max-width:620px;margin:0 auto 44px;text-align:center}
.ld-h h2{font-size:clamp(26px,3.4vw,38px);margin:10px 0}
.ld-h p{color:var(--muted)}
.featgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.feat{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:24px;box-shadow:var(--shadow);transition:transform .25s}
.feat:hover{transform:translateY(-4px)}
.feat .ico{width:44px;height:44px;border-radius:12px;background:var(--accent-soft);display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:14px}
.feat h3{font-size:18px;margin-bottom:6px}
.feat p{font-size:14px;color:var(--muted)}
.pricegrid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:stretch}
.price{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:28px 24px;box-shadow:var(--shadow);display:flex;flex-direction:column;position:relative}
.price.hot{background:#48584B;color:#F2F4EF;border-color:#48584B;transform:scale(1.03)}
.price.hot .pdesc,.price.hot li{color:#C9D2C6}
.pbadge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--brass);color:#fff;font:700 10.5px 'Karla';letter-spacing:.1em;text-transform:uppercase;padding:5px 13px;border-radius:99px;white-space:nowrap}
.pname{font-family:'Fraunces',serif;font-size:20px;margin-bottom:4px}
.pdesc{font-size:13px;color:var(--muted);margin-bottom:14px;min-height:38px}
.pamount{font-family:'Fraunces',serif;font-size:40px;line-height:1;margin-bottom:18px}
.pamount small{font:600 12.5px 'Karla';color:var(--muted)}
.price.hot .pamount small{color:#C9D2C6}
.price ul{list-style:none;display:grid;gap:8px;margin:0 0 22px;padding:0;font-size:13.5px;color:var(--muted)}
.price li::before{content:'✓  ';color:var(--brass);font-weight:700}
.price li.no{opacity:.5}.price li.no::before{content:'—  '}
.price .btn{margin-top:auto;justify-content:center}
.price.hot .btn{background:#CBB878;border-color:#CBB878;color:#2B2F29}
.ld-cta{text-align:center;background:var(--card);border:1px solid var(--line);border-radius:24px;padding:60px 28px;box-shadow:var(--shadow)}
.ld-foot{max-width:1140px;margin:0 auto;border-top:1px solid var(--line);padding:28px 24px 40px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;color:var(--muted);font-size:13px}
@media(max-width:900px){.ld-hero{grid-template-columns:1fr;padding-top:44px}.featgrid{grid-template-columns:1fr 1fr}.pricegrid{grid-template-columns:1fr}.price.hot{transform:none}}
@media(max-width:600px){.featgrid{grid-template-columns:1fr}}

/* ---- modal & checkout ---- */
.ovl{position:fixed;inset:0;background:rgba(20,22,18,.55);display:flex;align-items:center;justify-content:center;z-index:100;padding:18px;backdrop-filter:blur(3px)}
.modal{background:var(--card);border:1px solid var(--line);border-radius:20px;box-shadow:var(--shadow);max-width:440px;width:100%;padding:28px;animation:atlfade .3s ease}
.modal h2{font-size:22px;margin-bottom:8px}
.modal p{color:var(--muted);font-size:14px;margin:0 0 18px}
.co-wrap{max-width:520px;margin:0 auto;padding:44px 20px 80px}
.co-demo{background:var(--accent-soft);border:1px dashed var(--brass);border-radius:12px;padding:10px 14px;font-size:12.5px;color:var(--muted);margin-bottom:16px}
.projbar{display:flex;gap:8px;align-items:center;padding:10px 16px;border-bottom:1px solid var(--line);overflow-x:auto;scrollbar-width:none}
.projbar::-webkit-scrollbar{display:none}
.pill{border:1px solid var(--line);background:var(--paper);color:var(--ink);font:600 12.5px 'Karla';padding:7px 13px;border-radius:999px;cursor:pointer;white-space:nowrap}
.pill.on{background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}
.planbadge{font:700 10.5px 'Karla';letter-spacing:.08em;text-transform:uppercase;padding:5px 11px;border-radius:99px;background:var(--accent-soft);color:var(--accent);white-space:nowrap}
.planbadge.gold{background:#F3ECDC;color:var(--brass)}
.lockrow{display:flex;align-items:center;gap:10px;background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:12px 14px;font-size:13.5px;color:var(--muted)}
`;

/* ---------------- constants ---------------- */
const ROOM_TYPES = ["Bedroom","Living Room","Kitchen","Bathroom","Dining Room","Home Office","Nursery","Outdoor Patio","Custom Room"];
const STYLES = ["Modern","Minimalist","Scandinavian","Industrial","Japandi","Contemporary","Coastal","Luxury","Bohemian","Traditional","Farmhouse"];
const CEILINGS = ["Flat","Tray","Vaulted","Coffered","Sloped","Exposed beams"];

const CATALOG = [
  {name:"Queen Bed", w:1.6, h:2.0, cat:"bed", price:850},
  {name:"King Bed", w:1.93, h:2.03, cat:"bed", price:1200},
  {name:"Crib", w:0.75, h:1.35, cat:"bed", price:400},
  {name:"Nightstand", w:0.5, h:0.4, cat:"storage", price:120},
  {name:"Wardrobe", w:1.8, h:0.6, cat:"storage", price:700},
  {name:"Dresser", w:1.2, h:0.5, cat:"storage", price:450},
  {name:"Bookshelf", w:0.9, h:0.3, cat:"storage", price:220},
  {name:"3-Seat Sofa", w:2.2, h:0.95, cat:"seating", price:1100},
  {name:"Loveseat", w:1.6, h:0.9, cat:"seating", price:750},
  {name:"Armchair", w:0.85, h:0.85, cat:"seating", price:380},
  {name:"Bench", w:1.2, h:0.4, cat:"seating", price:200},
  {name:"Coffee Table", w:1.2, h:0.6, cat:"table", price:280},
  {name:"Dining Table (6)", w:1.8, h:0.9, cat:"table", price:650},
  {name:"Dining Chair", w:0.45, h:0.45, cat:"seating", price:90},
  {name:"Desk", w:1.4, h:0.7, cat:"table", price:400},
  {name:"Office Chair", w:0.6, h:0.6, cat:"seating", price:250},
  {name:"TV Console", w:1.6, h:0.42, cat:"storage", price:350},
  {name:"Kitchen Island", w:2.0, h:1.0, cat:"table", price:1500},
  {name:"Area Rug (L)", w:2.4, h:1.6, cat:"rug", price:320},
  {name:"Area Rug (M)", w:1.8, h:1.2, cat:"rug", price:190},
  {name:"Plant", w:0.4, h:0.4, cat:"plant", price:60},
  {name:"Floor Lamp", w:0.35, h:0.35, cat:"light", price:140},
];

const CAT_FILL = {
  bed:"#8FA3B8", seating:"#5F7161", table:"#A98B62", storage:"#9C8248",
  rug:"#C9C4B4", plant:"#6E8F5E", light:"#C7A94F", other:"#8B8F85"
};

const uid = () => Math.random().toString(36).slice(2, 9);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const r1 = v => Math.round(v * 10) / 10;
const shopSearchUrl = (query) => `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(query)}`;

/* ---------------- AI helpers ---------------- */
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchWithGemini(endpoint, options, retries = 3) {
  for (let attempt = 0; ; attempt++) {
    let res;
    try {
      res = await fetch(`/api/gemini` + endpoint, options);
    } catch (err) {
      throw new Error("Couldn't reach the /api/gemini proxy — check your network connection or that the server is running.");
    }
    if (res.status === 404) {
      throw new Error("Gemini proxy not found at /api/gemini — make sure api/gemini/[...path].js is deployed on this Vercel project.");
    }
    // Google's model is momentarily overloaded/rate-limited — back off and retry
    // automatically instead of surfacing a transient blip as a hard failure.
    if ((res.status === 503 || res.status === 429) && attempt < retries) {
      await sleep(800 * Math.pow(2, attempt));
      continue;
    }
    return res;
  }
}

async function askClaude(messages) {
  const apiKey = localStorage.getItem("atelier_gemini_key") || "";
  
  // Format messages array to Gemini contents structure
  const contents = messages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }));

  const res = await fetchWithGemini(`/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `AI request failed (${res.status})`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

async function askGeminiVision(prompt, imageBase64, mimeType, apiKey) {
  const res = await fetchWithGemini(`/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey || ""}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }, { inlineData: { mimeType, data: imageBase64 } }] }],
    }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `AI request failed (${res.status})`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

async function urlToBase64(url) {
  if (url.startsWith("data:")) {
    const match = /^data:(.+?);base64,(.+)$/.exec(url);
    if (!match) throw new Error("Unsupported image format for analysis");
    return { mimeType: match[1], data: match[2] };
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Couldn't load image for analysis (${res.status})`);
  const blob = await res.blob();
  const mimeType = blob.type || "image/jpeg";
  const data = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.onerror = () => reject(new Error("Couldn't read image data"));
    reader.readAsDataURL(blob);
  });
  return { mimeType, data };
}

function parseJson(text) {
  const clean = text.replace(/```json|```/g, "").trim();
  const s = Math.min(...["{", "["].map(c => { const i = clean.indexOf(c); return i === -1 ? Infinity : i; }));
  const e = Math.max(clean.lastIndexOf("}"), clean.lastIndexOf("]"));
  if (s === Infinity || e === -1) throw new Error("No JSON found");
  return JSON.parse(clean.slice(s, e + 1));
}

function roomBrief(room, prefs) {
  return `ROOM: ${room.type}${room.name ? ` ("${room.name}")` : ""}, ${room.length}m long x ${room.width}m wide x ${room.height}m high. Ceiling: ${room.ceiling}. Windows: ${room.windows || "not specified"}. Doors: ${room.doors || "not specified"}. Built-ins: ${room.builtIns || "none"}.
CLIENT: style=${prefs.style}; palette preference="${prefs.palette || "designer's choice"}"; total budget=$${prefs.budget}; occupants=${prefs.occupants}; storage needs=${prefs.storage}; accessibility="${prefs.accessibility || "none"}"; pets=${prefs.pets ? "yes" : "no"}; children=${prefs.children ? "yes" : "no"}; favourite brands="${prefs.brands || "none"}".`;
}

function furnitureBrief(furniture) {
  if (!furniture.length) return "The room is currently empty.";
  return "Current furniture (x,y = top-left in meters from the room's top-left corner):\n" +
    furniture.map(f => `- ${f.name}${f.keep ? " [KEEP — do not move]" : ""}: ${f.w}x${f.h}m at (${r1(f.x)}, ${r1(f.y)})`).join("\n");
}

/* ---------------- small UI primitives ---------------- */
const Fld = ({ label, children }) => (
  <div className="fld"><label>{label}</label>{children}</div>
);

const Spinner = () => <span className="spin" aria-hidden="true" />;

/* ---------------- floor plan canvas ---------------- */
function PlanCanvas({ room, prefs, furniture, setFurniture, selId, setSelId, svgRef }) {
  const L = Math.max(1, +room.length || 4), W = Math.max(1, +room.width || 3);
  const scale = Math.min(680 / L, 440 / W);
  const pad = 34;
  const vw = L * scale + pad * 2, vh = W * scale + pad * 2;
  const drag = useRef(null);

  const toRoom = (e) => {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: (p.x - pad) / scale, y: (p.y - pad) / scale };
  };

  const down = (e, f) => {
    e.preventDefault();
    setSelId(f.id);
    const p = toRoom(e);
    drag.current = { id: f.id, dx: p.x - f.x, dy: p.y - f.y };
    e.target.setPointerCapture?.(e.pointerId);
  };
  const move = (e) => {
    if (!drag.current) return;
    const p = toRoom(e);
    setFurniture(fs => fs.map(f => f.id === drag.current.id
      ? { ...f, x: clamp(p.x - drag.current.dx, 0, L - f.w), y: clamp(p.y - drag.current.dy, 0, W - f.h) }
      : f));
  };
  const up = () => { drag.current = null; };

  const gridLines = [];
  for (let x = 0; x <= L + 0.001; x += 0.5) {
    const major = Math.abs(x % 1) < 0.01 || Math.abs(x % 1) > 0.99;
    gridLines.push(<line key={"vx"+x} x1={pad+x*scale} y1={pad} x2={pad+x*scale} y2={pad+W*scale} stroke="var(--plan)" strokeOpacity={major?0.14:0.06} strokeWidth={0.7}/>);
    if (major && x > 0 && x < L) gridLines.push(<text key={"tx"+x} x={pad+x*scale} y={pad-8} textAnchor="middle" fontSize="9" fill="var(--muted)" fontFamily="Karla">{Math.round(x)}m</text>);
  }
  for (let y = 0; y <= W + 0.001; y += 0.5) {
    const major = Math.abs(y % 1) < 0.01 || Math.abs(y % 1) > 0.99;
    gridLines.push(<line key={"hy"+y} x1={pad} y1={pad+y*scale} x2={pad+L*scale} y2={pad+y*scale} stroke="var(--plan)" strokeOpacity={major?0.14:0.06} strokeWidth={0.7}/>);
    if (major && y > 0 && y < W) gridLines.push(<text key={"ty"+y} x={pad-9} y={pad+y*scale+3} textAnchor="end" fontSize="9" fill="var(--muted)" fontFamily="Karla">{Math.round(y)}m</text>);
  }

  const sorted = [...furniture].sort((a, b) => (a.cat === "rug" ? -1 : 0) - (b.cat === "rug" ? -1 : 0));

  return (
    <div className="planwrap">
      <svg ref={svgRef} viewBox={`0 0 ${vw} ${vh}`} style={{width:"100%",display:"block",touchAction:"none",minWidth:420}}
           onPointerMove={move} onPointerUp={up} onPointerLeave={up}
           onPointerDown={(e)=>{ if(e.target===e.currentTarget || e.target.dataset.bg) setSelId(null); }}>
        <rect x={0} y={0} width={vw} height={vh} fill="var(--paper)" data-bg="1"/>
        {gridLines}
        <rect x={pad} y={pad} width={L*scale} height={W*scale} fill="none" stroke="var(--plan)" strokeWidth={2.5}/>
        {/* dimension labels */}
        <text x={pad+L*scale/2} y={pad+W*scale+20} textAnchor="middle" fontSize="11" fill="var(--muted)" fontFamily="Karla" fontWeight="700">{L} m</text>
        <text x={pad+L*scale+18} y={pad+W*scale/2} textAnchor="middle" fontSize="11" fill="var(--muted)" fontFamily="Karla" fontWeight="700" transform={`rotate(90 ${pad+L*scale+18} ${pad+W*scale/2})`}>{W} m</text>
        {sorted.map(f => {
          const sel = f.id === selId;
          const fill = CAT_FILL[f.cat] || CAT_FILL.other;
          const bx = pad+(f.x+f.w)*scale-8, by = pad+f.y*scale+8;
          return (
            <g key={f.id} className="fitem" onPointerDown={(e)=>down(e,f)}>
              <rect x={pad+f.x*scale} y={pad+f.y*scale} width={f.w*scale} height={f.h*scale} rx={f.cat==="plant"?f.w*scale/2:5}
                    fill={fill} fillOpacity={f.cat==="rug"?0.45:0.78}
                    stroke={sel?"var(--brass)":"var(--plan)"} strokeWidth={sel?2.5:1.2} strokeOpacity={sel?1:0.55}/>
              {f.keep && <circle cx={pad+f.x*scale+7} cy={pad+f.y*scale+7} r={3.5} fill="var(--brass)"/>}
              <text x={pad+(f.x+f.w/2)*scale} y={pad+(f.y+f.h/2)*scale+3} textAnchor="middle"
                    fontSize={Math.max(7.5, Math.min(11, f.w*scale/8))} fill="#fff" fontFamily="Karla" fontWeight="700"
                    style={{pointerEvents:"none",textShadow:"0 1px 2px rgba(0,0,0,.45)"}}>{f.name}</text>
              <a href={shopSearchUrl(`${f.name} ${prefs?.style||""}`.trim())} target="_blank" rel="noreferrer"
                 onPointerDown={e=>e.stopPropagation()}>
                <title>Shop for {f.name}</title>
                <circle cx={bx} cy={by} r={7} fill="#fff" stroke="var(--plan)" strokeWidth={1} strokeOpacity={0.6}/>
                <text x={bx} y={by+3} textAnchor="middle" fontSize="9" fill="var(--brass)" fontWeight="700" style={{pointerEvents:"none"}}>$</text>
              </a>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ---------------- scoring ---------------- */
function computeScores(room, prefs, furniture) {
  const L = +room.length || 4, W = +room.width || 3, area = L * W;
  const foot = furniture.filter(f=>f.cat!=="rug").reduce((s,f)=>s+f.w*f.h,0);
  const density = area ? foot/area : 0;
  const traffic = clamp(Math.round(100 - Math.max(0, density-0.30)*220), 15, 98);
  const storageN = furniture.filter(f=>f.cat==="storage").length;
  const storage = clamp(35 + storageN*18 + (room.builtIns ? 12 : 0), 10, 96);
  const need = { "Bedroom":["bed"], "Living Room":["seating","table"], "Dining Room":["table","seating"], "Home Office":["table","seating"], "Nursery":["bed"], "Kitchen":["table"], "Outdoor Patio":["seating"] }[room.type] || [];
  const have = new Set(furniture.map(f=>f.cat));
  const fn = need.length ? Math.round((need.filter(c=>have.has(c)).length/need.length)*70)+ (furniture.length?25:0) : (furniture.length?80:30);
  const functionality = clamp(fn,10,97);
  const lighting = clamp(45 + (room.windows?22:0) + furniture.filter(f=>f.cat==="light").length*14, 20, 95);
  const comfort = clamp(40 + (have.has("rug")?18:0) + (have.has("seating")?18:0) + (have.has("plant")?10:0) + (density<0.42?10:0), 15, 96);
  const budgetUsed = furniture.reduce((s,f)=>s+(f.price||0),0);
  const be = prefs.budget>0 ? clamp(Math.round(100 - Math.max(0,(budgetUsed/prefs.budget - 0.85))*180), 20, 98) : 70;
  return { Functionality:functionality, Storage:storage, Lighting:lighting, Comfort:comfort, "Traffic flow":traffic, "Budget efficiency":be, _density:density, _spend:budgetUsed };
}

/* ---------------- panels ---------------- */
function BriefPanel({ room, setRoom, prefs, setPrefs, photo, setPhoto, go }) {
  const set = k => e => setRoom(r => ({ ...r, [k]: e.target.value }));
  const setP = k => e => setPrefs(p => ({ ...p, [k]: e.target.value }));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const onFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setErr("");
    const reader = new FileReader();
    reader.onload = () => {
      // Downscale/compress client-side — raw phone photos are several MB and
      // would blow the localStorage quota once saved with the rest of the project.
      const img = new Image();
      img.onload = () => {
        const maxDim = 1280;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        setPhoto({ dataUrl: canvas.toDataURL("image/jpeg", 0.82), tips: null });
      };
      img.onerror = () => setErr("Couldn't read that image — try a different file.");
      img.src = reader.result;
    };
    reader.onerror = () => setErr("Couldn't read that image — try a different file.");
    reader.readAsDataURL(file);
  };

  const analyzePhoto = async () => {
    if (!photo?.dataUrl) return;
    setBusy(true); setErr("");
    try {
      const match = /^data:(.+?);base64,(.+)$/.exec(photo.dataUrl);
      if (!match) throw new Error("Unsupported image format");
      const [, mimeType, data] = match;
      const prompt = `You are a professional interior designer. Here is a photo of the client's CURRENT room, as it looks today.\n${roomBrief(room, prefs)}\n\nLooking at what's actually in the photo, give exactly 6 specific, prioritized recommendations to optimize this real room for the client's stated style, budget and household — cover things like clutter, furniture placement, traffic flow, lighting, colour/style mismatches, and storage. Reference what you can actually see. Respond with plain text, one recommendation per line, no numbering or markdown headers.`;
      const text = await askGeminiVision(prompt, data, mimeType, localStorage.getItem("atelier_gemini_key") || "");
      setPhoto(p => ({ ...p, tips: text.trim() }));
    } catch (e) {
      setErr("Couldn't analyze this photo — try again. (" + e.message + ")");
    }
    setBusy(false);
  };

  return (
    <div className="fade" style={{display:"grid",gap:18}}>
      <div className="card">
        <span className="tag">Step 1 — The room</span>
        <h2>Tell me about the space</h2>
        <p className="sub">Dimensions in meters. Describe window and door positions in plain words — the AI reads them when planning the layout.</p>
        <div className="grid3">
          <Fld label="Room type">
            <select value={room.type} onChange={set("type")}>{ROOM_TYPES.map(t=><option key={t}>{t}</option>)}</select>
          </Fld>
          <Fld label="Room name (optional)"><input value={room.name} onChange={set("name")} placeholder="e.g. Master bedroom"/></Fld>
          <Fld label="Ceiling type"><select value={room.ceiling} onChange={set("ceiling")}>{CEILINGS.map(c=><option key={c}>{c}</option>)}</select></Fld>
          <Fld label="Length (m)"><input type="number" min="1" step="0.1" value={room.length} onChange={set("length")}/></Fld>
          <Fld label="Width (m)"><input type="number" min="1" step="0.1" value={room.width} onChange={set("width")}/></Fld>
          <Fld label="Height (m)"><input type="number" min="2" step="0.1" value={room.height} onChange={set("height")}/></Fld>
        </div>
        <div className="grid3" style={{marginTop:14}}>
          <Fld label="Windows"><input value={room.windows} onChange={set("windows")} placeholder="e.g. large window on north wall"/></Fld>
          <Fld label="Doors"><input value={room.doors} onChange={set("doors")} placeholder="e.g. door in SE corner, opens inward"/></Fld>
          <Fld label="Built-in features"><input value={room.builtIns} onChange={set("builtIns")} placeholder="e.g. closet, fireplace"/></Fld>
        </div>
      </div>

      <div className="card">
        <span className="tag">Step 2 — Your taste</span>
        <h2>Design preferences</h2>
        <p className="sub">This brief shapes every AI suggestion — layout, mood board, shopping list and chat.</p>
        <Fld label="Style">
          <div className="chips">{STYLES.map(s=>
            <button key={s} className={"chip"+(prefs.style===s?" on":"")} onClick={()=>setPrefs(p=>({...p,style:s}))}>{s}</button>)}
          </div>
        </Fld>
        <div className="grid3" style={{marginTop:14}}>
          <Fld label="Colour palette"><input value={prefs.palette} onChange={setP("palette")} placeholder="e.g. warm neutrals, sage, brass"/></Fld>
          <Fld label="Total budget (USD)"><input type="number" min="0" value={prefs.budget} onChange={setP("budget")}/></Fld>
          <Fld label="Occupants"><input type="number" min="1" value={prefs.occupants} onChange={setP("occupants")}/></Fld>
          <Fld label="Storage requirements">
            <select value={prefs.storage} onChange={setP("storage")}><option>Minimal</option><option>Moderate</option><option>Maximum</option></select>
          </Fld>
          <Fld label="Accessibility needs"><input value={prefs.accessibility} onChange={setP("accessibility")} placeholder="e.g. wheelchair clearance"/></Fld>
          <Fld label="Favourite brands (optional)"><input value={prefs.brands} onChange={setP("brands")} placeholder="e.g. IKEA, West Elm"/></Fld>
        </div>
        <div style={{display:"flex",gap:10,marginTop:14,flexWrap:"wrap"}}>
          <button className={"chip"+(prefs.pets?" on":"")} onClick={()=>setPrefs(p=>({...p,pets:!p.pets}))}>🐾 Pets{prefs.pets?" — yes":""}</button>
          <button className={"chip"+(prefs.children?" on":"")} onClick={()=>setPrefs(p=>({...p,children:!p.children}))}>🧒 Children{prefs.children?" — yes":""}</button>
        </div>
      </div>

      <div className="card">
        <span className="tag">Step 3 — Optional</span>
        <h2>Your current room</h2>
        <p className="sub">Upload a photo of the room as it looks today and the AI will point out specific ways to optimize it — clutter, layout, lighting, storage and style.</p>
        <div style={{display:"flex",gap:16,flexWrap:"wrap",alignItems:"flex-start"}}>
          {photo?.dataUrl && (
            <img src={photo.dataUrl} alt="Your current room" style={{width:"100%",maxWidth:260,borderRadius:12,border:"1px solid var(--line)",display:"block"}}/>
          )}
          <div style={{display:"grid",gap:10,flex:1,minWidth:220}}>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <label className="btn" style={{cursor:"pointer"}}>
                📷 {photo?.dataUrl?"Change photo":"Upload a photo"}
                <input type="file" accept="image/*" onChange={onFile} style={{display:"none"}}/>
              </label>
              {photo?.dataUrl && (
                <button className="btn primary" onClick={analyzePhoto} disabled={busy}>{busy?<><Spinner/> Analysing…</>:"✦ Analyze my room"}</button>
              )}
              {photo?.dataUrl && (
                <button className="btn ghost" style={{color:"var(--danger)"}} onClick={()=>setPhoto(null)}>Remove</button>
              )}
            </div>
            {err && <div className="notice warn">{err}</div>}
            {photo?.tips && <div className="notice" style={{whiteSpace:"pre-wrap"}}>{photo.tips}</div>}
          </div>
        </div>
        <div style={{marginTop:18}}>
          <button className="btn primary" onClick={go}>Continue to floor plan →</button>
        </div>
      </div>
    </div>
  );
}

function PlanPanel({ room, prefs, furniture, setFurniture, photo, svgRef }) {
  const [selId, setSelId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [tips, setTips] = useState([]);
  const [err, setErr] = useState("");
  const [pick, setPick] = useState(CATALOG[0].name);
  const sel = furniture.find(f=>f.id===selId);
  const L=+room.length||4, W=+room.width||3;
  const density = furniture.filter(f=>f.cat!=="rug").reduce((s,f)=>s+f.w*f.h,0)/(L*W);

  const add = () => {
    const c = CATALOG.find(c=>c.name===pick);
    setFurniture(fs=>[...fs,{...c, id:uid(), x:clamp(0.3,0,L-c.w), y:clamp(0.3,0,W-c.h), keep:false}]);
  };
  const rotate = () => setFurniture(fs=>fs.map(f=>f.id===selId?{...f, w:f.h, h:f.w, x:clamp(f.x,0,L-f.h), y:clamp(f.y,0,W-f.w)}:f));
  const remove = () => { setFurniture(fs=>fs.filter(f=>f.id!==selId)); setSelId(null); };
  const toggleKeep = () => setFurniture(fs=>fs.map(f=>f.id===selId?{...f,keep:!f.keep}:f));

  const aiLayout = async () => {
    setBusy(true); setErr(""); setTips([]);
    try {
      const kept = furniture.filter(f=>f.keep);
      const prompt = `You are a professional interior designer planning furniture placement.
${roomBrief(room, prefs)}
${furnitureBrief(furniture)}
${photo?.tips ? `\nNOTES FROM THE CLIENT'S CURRENT ROOM PHOTO:\n${photo.tips}\n` : ""}
Design an optimal furniture layout for this ${room.type}. Follow interior design best practice: keep walkways of at least 0.75m, don't block the doors/windows described, respect any [KEEP] items exactly as placed, favour natural light, avoid overcrowding, and suit the client's style and household (pets/children/accessibility). Choose furniture pieces from this catalog only (name, width x depth in meters): ${CATALOG.map(c=>`${c.name} ${c.w}x${c.h}`).join("; ")}. You may include a rug and plants where appropriate.

Respond with ONLY valid JSON, no markdown, in this exact shape:
{"furniture":[{"name":"Queen Bed","x":0.0,"y":0.0,"w":1.6,"h":2.0}],"tips":["short tip 1","short tip 2","short tip 3"]}
Rules: x,y are the TOP-LEFT corner in meters (x along the ${L}m side, y along the ${W}m side). Every item must fit fully inside the room: x+w<=${L}, y+h<=${W}. Swap w/h to rotate a piece. Max 12 items. Include the kept items with their exact original positions.`;
      const text = await askClaude([{ role:"user", content: prompt }]);
      const data = parseJson(text);
      const items = (data.furniture||[]).map(it=>{
        const cat = CATALOG.find(c=>c.name===it.name);
        const w = clamp(+it.w||cat?.w||0.5, 0.2, L), h = clamp(+it.h||cat?.h||0.5, 0.2, W);
        return { id:uid(), name:it.name, w, h, cat:cat?.cat||"other", price:cat?.price||0,
                 x:clamp(+it.x||0,0,L-w), y:clamp(+it.y||0,0,W-h),
                 keep: kept.some(k=>k.name===it.name) };
      });
      if (!items.length) throw new Error("Empty layout");
      setFurniture(items);
      setTips(data.tips||[]);
    } catch(e) { setErr("Layout generation failed — try again. ("+e.message+")"); }
    setBusy(false);
  };

  return (
    <div className="fade" style={{display:"grid",gap:18}}>
      <div className="card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
          <div><span className="tag">Floor plan</span><h2>{room.name || room.type} · {L}m × {W}m</h2>
          <p className="sub">Drag pieces to move them. Select a piece to rotate, keep or remove it. Gold dot = kept in AI re-plans.</p></div>
          <button className="btn primary" onClick={aiLayout} disabled={busy}>{busy?<><Spinner/> Designing…</>:"✦ AI layout"}</button>
        </div>
        <PlanCanvas room={room} prefs={prefs} furniture={furniture} setFurniture={setFurniture} selId={selId} setSelId={setSelId} svgRef={svgRef}/>
        <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap",alignItems:"center"}}>
          <select value={pick} onChange={e=>setPick(e.target.value)} style={{background:"var(--paper)",border:"1px solid var(--line)",borderRadius:10,padding:"8px 10px",color:"var(--ink)",font:"600 13px Karla"}}>
            {CATALOG.map(c=><option key={c.name}>{c.name}</option>)}
          </select>
          <button className="btn" onClick={add}>+ Add piece</button>
          {sel && <>
            <span style={{fontSize:13,color:"var(--muted)"}}>Selected: <b style={{color:"var(--ink)"}}>{sel.name}</b></span>
            <button className="btn ghost" onClick={rotate}>⟳ Rotate</button>
            <button className="btn ghost" onClick={toggleKeep}>{sel.keep?"Unpin":"📌 Keep"}</button>
            <button className="btn ghost" style={{color:"var(--danger)"}} onClick={remove}>Remove</button>
          </>}
        </div>
        {density>0.45 && <div className="notice warn" style={{marginTop:12}}>⚠ Overcrowding detected — furniture covers {Math.round(density*100)}% of the floor. Aim for under 40% to keep walkways clear.</div>}
        {err && <div className="notice warn" style={{marginTop:12}}>{err}</div>}
        {tips.length>0 && <div className="notice" style={{marginTop:12}}><b>Designer's notes:</b><ul style={{margin:"6px 0 0 18px",padding:0}}>{tips.map((t,i)=><li key={i}>{t}</li>)}</ul></div>}
      </div>
    </div>
  );
}

function ChatPanel({ room, prefs, furniture }) {
  const [msgs, setMsgs] = useState([{ role:"assistant", content:"Hi — I'm your design assistant. Ask me anything about this room: layouts, colours, what fits, how to make it feel larger…" }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  const send = async (q) => {
    const question = (q ?? input).trim();
    if (!question || busy) return;
    setInput("");
    const next = [...msgs, { role:"user", content:question }];
    setMsgs(next); setBusy(true);
    try {
      const ctx = `You are a friendly professional interior designer chatting with a client inside a design app. Be concise (under 150 words), specific and practical. Use the room data to give concrete answers with real measurements.\n${roomBrief(room,prefs)}\n${furnitureBrief(furniture)}\n\n`;
      const history = next.slice(-10).map((m,i)=> i===0 && m.role==="assistant" ? null : m).filter(Boolean);
      const apiMsgs = history.map((m,i)=> i===history.length-1 && m.role==="user" ? { role:"user", content: ctx + "Client question: " + m.content } : m);
      const text = await askClaude(apiMsgs);
      setMsgs(ms=>[...ms,{role:"assistant",content:text||"(no reply)"}]);
    } catch(e) {
      setMsgs(ms=>[...ms,{role:"assistant",content:"Sorry — I couldn't reach the design brain just now. Try again in a moment."}]);
    }
    setBusy(false);
  };

  const starters = ["How can I make this room feel larger?","Can I fit a king-size bed?","What colour curtains match this room?","Show me three alternative layouts."];
  return (
    <div className="card fade" style={{display:"flex",flexDirection:"column",height:"62vh",minHeight:420}}>
      <span className="tag">AI chat designer</span>
      <h2 style={{marginBottom:10}}>Ask the designer</h2>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:10,padding:"6px 2px"}}>
        {msgs.map((m,i)=><div key={i} className={"msg "+(m.role==="user"?"u":"a")}>{m.content}</div>)}
        {busy && <div className="msg a"><Spinner/></div>}
        <div ref={endRef}/>
      </div>
      <div className="chips" style={{margin:"10px 0"}}>
        {starters.map(s=><button key={s} className="chip" onClick={()=>send(s)}>{s}</button>)}
      </div>
      <div style={{display:"flex",gap:8}}>
        <input style={{flex:1,background:"var(--paper)",border:"1px solid var(--line)",borderRadius:10,padding:"10px 12px",color:"var(--ink)",font:"500 14px Karla",outline:"none"}}
               value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
               placeholder="e.g. Where should I place my desk?"/>
        <button className="btn primary" onClick={()=>send()} disabled={busy}>Send</button>
      </div>
    </div>
  );
}

function MoodPanel({ room, prefs, mood, setMood }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const gen = async () => {
    setBusy(true); setErr("");
    try {
      const prompt = `You are an interior designer creating a mood board.\n${roomBrief(room,prefs)}\n\nRespond with ONLY valid JSON, no markdown:\n{"concept":"2-sentence design concept","palette":[{"name":"Warm Plaster","hex":"#EDE6DA","use":"walls"}],"materials":["material — where to use it"],"fabrics":["fabric — where"],"lighting":["idea"],"decor":["idea"]}\nInclude exactly 5 palette colours (real hex values suited to the style), 4 materials, 3 fabrics, 3 lighting ideas, 4 decor ideas.`;
      const data = parseJson(await askClaude([{role:"user",content:prompt}]));
      setMood(data);
    } catch(e){ setErr("Couldn't generate the mood board — try again."); }
    setBusy(false);
  };
  return (
    <div className="card fade">
      <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10,alignItems:"flex-start"}}>
        <div><span className="tag">Mood board</span><h2>{prefs.style} · {room.type}</h2>
        <p className="sub">A palette, materials and inspiration generated from your brief.</p></div>
        <button className="btn primary" onClick={gen} disabled={busy}>{busy?<><Spinner/> Curating…</>:mood?"↻ Regenerate":"✦ Generate mood board"}</button>
      </div>
      {err && <div className="notice warn">{err}</div>}
      {mood && <div className="fade" style={{display:"grid",gap:16}}>
        <p style={{fontFamily:"Fraunces",fontSize:17,fontStyle:"italic",margin:"4px 0"}}>&ldquo;{mood.concept}&rdquo;</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10}}>
          {(mood.palette||[]).map((c,i)=>(
            <div key={i} className="swatch" style={{background:c.hex}}>
              <div>{c.name}<br/><span style={{opacity:.85,fontWeight:500}}>{c.hex} · {c.use}</span></div>
            </div>))}
        </div>
        <div className="grid2">
          <div><h3 style={{fontSize:15,marginBottom:6}}>Materials</h3><ul style={{margin:0,paddingLeft:18,color:"var(--muted)",fontSize:14}}>{(mood.materials||[]).map((m,i)=><li key={i}>{m}</li>)}</ul></div>
          <div><h3 style={{fontSize:15,marginBottom:6}}>Fabrics</h3><ul style={{margin:0,paddingLeft:18,color:"var(--muted)",fontSize:14}}>{(mood.fabrics||[]).map((m,i)=><li key={i}>{m}</li>)}</ul></div>
          <div><h3 style={{fontSize:15,marginBottom:6}}>Lighting inspiration</h3><ul style={{margin:0,paddingLeft:18,color:"var(--muted)",fontSize:14}}>{(mood.lighting||[]).map((m,i)=><li key={i}>{m}</li>)}</ul></div>
          <div><h3 style={{fontSize:15,marginBottom:6}}>Decor inspiration</h3><ul style={{margin:0,paddingLeft:18,color:"var(--muted)",fontSize:14}}>{(mood.decor||[]).map((m,i)=><li key={i}>{m}</li>)}</ul></div>
        </div>
      </div>}
    </div>
  );
}

function ShopPanel({ room, prefs, shop, setShop }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [cat, setCat] = useState("All");
  const [maxP, setMaxP] = useState("");
  const gen = async () => {
    setBusy(true); setErr("");
    try {
      const prompt = `You are an interior design shopping assistant.\n${roomBrief(room,prefs)}\n\nBuild a shopping list for this room within the total budget. Cover: furniture, lighting, rug, curtains, decor, paint, wall art, plants, storage. Prefer the client's favourite brands where given; otherwise use realistic widely-available brands. Respond with ONLY valid JSON, no markdown:\n{"items":[{"category":"Furniture","name":"item + brand","price":450,"colour":"oak","material":"wood","sustainable":true,"note":"why it suits"}]}\nExactly 12 items, realistic USD prices, total under $${prefs.budget||3000}.`;
      const data = parseJson(await askClaude([{role:"user",content:prompt}]));
      setShop(data.items||[]);
    } catch(e){ setErr("Couldn't build the shopping list — try again."); }
    setBusy(false);
  };
  const cats = ["All",...new Set((shop||[]).map(i=>i.category))];
  const rows = (shop||[]).filter(i=>(cat==="All"||i.category===cat)&&(!maxP||i.price<=+maxP));
  const total = rows.reduce((s,i)=>s+(+i.price||0),0);
  return (
    <div className="card fade">
      <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10,alignItems:"flex-start"}}>
        <div><span className="tag">Shopping assistant</span><h2>Curated for your brief</h2>
        <p className="sub">Filter by category or price. Sustainable picks are marked ♻.</p></div>
        <button className="btn primary" onClick={gen} disabled={busy}>{busy?<><Spinner/> Sourcing…</>:shop?"↻ Refresh list":"✦ Build shopping list"}</button>
      </div>
      {err && <div className="notice warn">{err}</div>}
      {shop && <>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",margin:"8px 0 12px",alignItems:"center"}}>
          {cats.map(c=><button key={c} className={"chip"+(cat===c?" on":"")} onClick={()=>setCat(c)}>{c}</button>)}
          <input type="number" placeholder="Max $" value={maxP} onChange={e=>setMaxP(e.target.value)}
                 style={{width:90,background:"var(--paper)",border:"1px solid var(--line)",borderRadius:10,padding:"7px 10px",color:"var(--ink)",font:"600 13px Karla"}}/>
        </div>
        <div style={{overflowX:"auto"}}>
        <table className="tbl"><thead><tr><th>Category</th><th>Item</th><th>Colour / material</th><th>Note</th><th style={{textAlign:"right"}}>Price</th><th></th></tr></thead>
          <tbody>{rows.map((i,k)=>(
            <tr key={k}><td>{i.category}</td><td style={{fontWeight:700}}>{i.sustainable?"♻ ":""}{i.name}</td>
            <td style={{color:"var(--muted)"}}>{[i.colour,i.material].filter(Boolean).join(" · ")}</td>
            <td style={{color:"var(--muted)",fontSize:13}}>{i.note}</td>
            <td style={{textAlign:"right",fontWeight:700}}>${(+i.price||0).toLocaleString()}</td>
            <td style={{textAlign:"right"}}>
              <a className="btn ghost" style={{padding:"5px 10px",fontSize:12,textDecoration:"none"}}
                 href={shopSearchUrl([i.name,i.colour,i.material].filter(Boolean).join(" "))}
                 target="_blank" rel="noreferrer">View ↗</a>
            </td></tr>))}
          </tbody></table>
        </div>
        <div style={{textAlign:"right",marginTop:10,fontFamily:"Fraunces",fontSize:18}}>Total: ${total.toLocaleString()}</div>
      </>}
    </div>
  );
}

function BudgetScorePanel({ room, prefs, furniture, shop, aiTips, setAiTips }) {
  const [busy,setBusy]=useState(false);
  const scores = useMemo(()=>computeScores(room,prefs,furniture),[room,prefs,furniture]);
  const L=+room.length||4, W=+room.width||3, H=+room.height||2.7;
  const wallArea = 2*(L+W)*H, floorArea = L*W;
  const shopTotal = (shop||[]).reduce((s,i)=>s+(+i.price||0),0);
  const furnTotal = shopTotal || furniture.reduce((s,f)=>s+(f.price||0),0);
  const decorTotal = (shop||[]).filter(i=>/decor|art|plant|curtain/i.test(i.category||"")).reduce((s,i)=>s+(+i.price||0),0);
  const paint = Math.round(wallArea*4.5), floor = Math.round(floorArea*48), install = Math.round(furnTotal*0.12);
  const grand = furnTotal+paint+floor+install;
  const over = prefs.budget>0 && grand > +prefs.budget;
  const entries = Object.entries(scores).filter(([k])=>!k.startsWith("_"));
  const avg = Math.round(entries.reduce((s,[,v])=>s+v,0)/entries.length);

  const improve = async ()=>{
    setBusy(true);
    try{
      const prompt = `You are an interior designer reviewing a room plan.\n${roomBrief(room,prefs)}\n${furnitureBrief(furniture)}\nCurrent scores (0-100): ${entries.map(([k,v])=>`${k} ${v}`).join(", ")}. Estimated total cost $${grand} vs budget $${prefs.budget}.\nGive exactly 5 short, specific recommendations (one line each, no numbering headers) to raise the weakest scores and, if over budget, suggest lower-cost alternatives. Plain text list with dashes.`;
      setAiTips(await askClaude([{role:"user",content:prompt}]));
    }catch(e){ setAiTips("Couldn't fetch recommendations — try again."); }
    setBusy(false);
  };

  return (
    <div className="fade" style={{display:"grid",gap:18}}>
      <div className="grid2">
        <div className="card">
          <span className="tag">Space optimisation</span>
          <h2 style={{display:"flex",alignItems:"baseline",gap:10}}>Score <span style={{fontFamily:"Fraunces",fontSize:34,color:"var(--accent)"}}>{avg}</span><span style={{fontSize:13,color:"var(--muted)"}}>/100</span></h2>
          <div style={{display:"grid",gap:12,marginTop:12}}>
            {entries.map(([k,v])=>(
              <div key={k}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span style={{fontWeight:700}}>{k}</span><span style={{color:"var(--muted)"}}>{v}</span></div>
                <div className="bar"><i style={{width:v+"%"}}/></div>
              </div>))}
          </div>
          <button className="btn primary" style={{marginTop:16}} onClick={improve} disabled={busy}>{busy?<><Spinner/> Reviewing…</>:"✦ How do I improve this?"}</button>
          {aiTips && <div className="notice" style={{marginTop:12,whiteSpace:"pre-wrap"}}>{aiTips}</div>}
        </div>
        <div className="card">
          <span className="tag">Budget calculator</span>
          <h2>Estimated room cost</h2>
          <p className="sub">Furniture uses your shopping list when generated; paint and flooring are estimated from room dimensions.</p>
          <table className="tbl"><tbody>
            <tr><td>Furniture &amp; fittings</td><td style={{textAlign:"right",fontWeight:700}}>${furnTotal.toLocaleString()}</td></tr>
            <tr><td>Decor, art, textiles</td><td style={{textAlign:"right",fontWeight:700}}>${decorTotal.toLocaleString()}</td></tr>
            <tr><td>Paint ({Math.round(wallArea)} m² walls)</td><td style={{textAlign:"right",fontWeight:700}}>${paint.toLocaleString()}</td></tr>
            <tr><td>Flooring ({Math.round(floorArea)} m²)</td><td style={{textAlign:"right",fontWeight:700}}>${floor.toLocaleString()}</td></tr>
            <tr><td>Installation (est. 12%)</td><td style={{textAlign:"right",fontWeight:700}}>${install.toLocaleString()}</td></tr>
            <tr><td style={{fontFamily:"Fraunces",fontSize:17}}>Total</td><td style={{textAlign:"right",fontFamily:"Fraunces",fontSize:19,color:over?"var(--danger)":"var(--accent)"}}>${grand.toLocaleString()}</td></tr>
          </tbody></table>
          {over && <div className="notice warn" style={{marginTop:10}}>Over your ${(+prefs.budget).toLocaleString()} budget — ask for improvements above to get lower-cost alternatives.</div>}
        </div>
      </div>
    </div>
  );
}

function ExportPanel({ room, prefs, furniture, mood, shop, svgRef, locked, onUpgrade }) {
  const [copied,setCopied]=useState(false);
  const dl = (name, content, type) => {
    const url = URL.createObjectURL(new Blob([content],{type}));
    const a = document.createElement("a"); a.href=url; a.download=name; a.click();
    URL.revokeObjectURL(url);
  };
  const report = () => {
    const scores = computeScores(room,prefs,furniture);
    const md = `# Design Report — ${room.name||room.type}\n\n## Brief\n${roomBrief(room,prefs)}\n\n## Furniture plan\n${furnitureBrief(furniture)}\n\n## Mood board\n${mood?`Concept: ${mood.concept}\nPalette: ${(mood.palette||[]).map(c=>`${c.name} ${c.hex} (${c.use})`).join(", ")}\nMaterials: ${(mood.materials||[]).join("; ")}`:"Not generated yet."}\n\n## Shopping list\n${shop?shop.map(i=>`- ${i.category}: ${i.name} — $${i.price}`).join("\n"):"Not generated yet."}\n\n## Scores\n${Object.entries(scores).filter(([k])=>!k.startsWith("_")).map(([k,v])=>`- ${k}: ${v}/100`).join("\n")}\n\n_Generated with Atelier.ai._`;
    dl("design-report.md", md, "text/markdown");
  };
  const csv = () => {
    if(!shop) return;
    dl("shopping-list.csv", "Category,Item,Colour,Material,Price,Note\n"+shop.map(i=>[i.category,i.name,i.colour,i.material,i.price,(i.note||"").replace(/,/g,";")].map(v=>`"${v??""}"`).join(",")).join("\n"), "text/csv");
  };
  const svg = () => {
    if(!svgRef.current) return;
    dl("floor-plan.svg", new XMLSerializer().serializeToString(svgRef.current), "image/svg+xml");
  };
  const renderPrompt = () => {
    const pal = mood ? (mood.palette||[]).map(c=>c.name).join(", ") : (prefs.palette||"warm neutrals");
    const items = furniture.slice(0,8).map(f=>f.name.toLowerCase()).join(", ") || "designer-selected furniture";
    const p = `Photorealistic interior design photograph of a ${prefs.style} ${room.type.toLowerCase()}, ${room.length}m x ${room.width}m with ${room.height}m ceilings${room.windows?`, ${room.windows}`:""}. Furnishings: ${items}. Colour palette: ${pal}. Editorial interior photography, medium format camera, soft natural light, 8k detail.`;
    navigator.clipboard?.writeText(p).catch(()=>{});
    setCopied(true); setTimeout(()=>setCopied(false),2500);
  };
  return (
    <div className="card fade">
      <span className="tag">Export</span>
      <h2>Take your design with you</h2>
      <p className="sub">Downloads are generated from your current plan, mood board and shopping list.</p>
      {locked ? (
        <div className="lockrow">
          <span style={{fontSize:18}}>🔒</span>
          <span>Exports are part of the paid studio. Your design is safe — unlock <b style={{color:"var(--ink)"}}>Whole Home</b> or a <b style={{color:"var(--ink)"}}>Room Pass</b> to download it.</span>
          <button className="btn primary" style={{marginLeft:"auto",whiteSpace:"nowrap"}} onClick={onUpgrade}>Unlock exports</button>
        </div>
      ) : (
        <>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <button className="btn primary" onClick={report}>📄 Design report (.md)</button>
            <button className="btn" onClick={csv} disabled={!shop}>🛒 Shopping list (.csv)</button>
            <button className="btn" onClick={svg}>📐 Floor plan (.svg)</button>
            <button className="btn" onClick={renderPrompt}>{copied?"✓ Copied!":"✨ Copy AI render prompt"}</button>
          </div>
          <p className="sub" style={{marginTop:12}}>The render prompt is ready to paste into any AI image tool (e.g. Higgsfield) for a photoreal visual of this exact design.{!shop && " Generate a shopping list to enable the CSV."}</p>
        </>
      )}
    </div>
  );
}

/* ================= persistence ================= */
const SKEY = "atelier:v1";
const newProject = (n=1) => ({
  id: uid(), name: "Room "+n, createdAt: Date.now(),
  room: {type:"Living Room",name:"",length:5,width:4,height:2.7,ceiling:"Flat",windows:"",doors:"",builtIns:""},
  prefs: {style:"Japandi",palette:"",budget:5000,occupants:2,storage:"Moderate",accessibility:"",brands:"",pets:false,children:false},
  furniture: [], mood: null, shop: null, photo: null,
});

const storage = window.storage || {
  get: async (key) => {
    const val = localStorage.getItem(key);
    return val ? { value: val } : null;
  },
  set: async (key, val) => {
    localStorage.setItem(key, val);
  }
};

async function loadState(){
  try{ const r = await storage.get(SKEY); return r ? JSON.parse(r.value) : null; }
  catch(e){ return null; }
}
async function saveState(s){
  try{ await storage.set(SKEY, JSON.stringify(s)); }catch(e){}
}

/* ================= landing page ================= */
function HeroPlanArt(){
  return (
    <svg viewBox="0 0 460 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AI-designed floor plan">
      <g stroke="var(--plan)" strokeOpacity=".07">
        {[105,170,235,300,365].map(x=><line key={x} x1={x} y1={40} x2={x} y2={290}/>)}
        {[105,170,235].map(y=><line key={y} x1={40} y1={y} x2={430} y2={y}/>)}
      </g>
      <rect className="draw" x="40" y="40" width="390" height="250" fill="none" stroke="var(--plan)" strokeWidth="3"/>
      <line className="pop" style={{animationDelay:"2s"}} x1="150" y1="40" x2="290" y2="40" stroke="var(--brass)" strokeWidth="6" strokeLinecap="round"/>
      <g fontFamily="Karla" fontWeight="700" fill="#fff" textAnchor="middle">
        <g className="pop" style={{animationDelay:"2.2s"}}><rect x="130" y="58" width="180" height="52" rx="7" fill="#5F7161"/><text x="220" y="89" fontSize="13">SOFA</text></g>
        <g className="pop" style={{animationDelay:"2.4s"}}><rect x="175" y="164" width="90" height="40" rx="7" fill="#A98B62"/><text x="220" y="189" fontSize="11">COFFEE</text></g>
        <g className="pop" style={{animationDelay:"2.55s"}}><rect x="64" y="118" width="52" height="52" rx="7" fill="#5F7161"/><text x="90" y="149" fontSize="9.5">CHAIR</text></g>
        <g className="pop" style={{animationDelay:"2.7s"}}><rect x="150" y="244" width="150" height="32" rx="7" fill="#9C8248"/><text x="225" y="265" fontSize="10.5">TV CONSOLE</text></g>
        <g className="pop" style={{animationDelay:"2.85s"}}><circle cx="398" cy="72" r="15" fill="#6E8F5E"/><text x="398" y="76" fontSize="8.5">PLANT</text></g>
      </g>
      <g className="pop" style={{animationDelay:"3.05s"}}>
        <rect x="304" y="116" width="104" height="30" rx="15" fill="var(--plan)"/>
        <text x="356" y="135" textAnchor="middle" fontFamily="Karla" fontSize="11" fontWeight="700" fill="var(--paper)">✦ AI placed</text>
      </g>
      <g className="pop" style={{animationDelay:"3.2s"}} fontFamily="Karla" fontSize="11" fontWeight="700" fill="var(--muted)">
        <text x="235" y="315" textAnchor="middle">5.0 m</text>
      </g>
    </svg>
  );
}

const PLANS = {
  free: { label:"First Room · Free" },
  pass: { label:"Room Pass", price:9, blurb:"One more room, one-time" },
  home: { label:"Whole Home", price:19, blurb:"Unlimited rooms, monthly" },
};

function Pricing({ onPick, plan }){
  return (
    <div className="ld-sec" id="pricing" style={{paddingTop:0}}>
      <div className="ld-h">
        <span className="tag">Pricing</span>
        <h2>Your first room is on the house</h2>
        <p>Design one complete room free — no card required. Then unlock the rest of your home.</p>
      </div>
      <div className="pricegrid">
        <div className="price">
          <div className="pname">First Room</div>
          <p className="pdesc">Try the full studio on one room, start to finish.</p>
          <div className="pamount">Free <small>· one design, forever yours</small></div>
          <ul>
            <li>1 complete room design</li>
            <li>AI floor plan & designer chat</li>
            <li>Mood board & shopping list</li>
            <li>Optimisation scores</li>
            <li className="no">Exports (report, plan, CSV)</li>
            <li className="no">AI render prompts</li>
          </ul>
          <button className="btn" onClick={()=>onPick("free")}>{plan==="free"?"Design my free room":"Included in your plan"}</button>
        </div>
        <div className="price hot">
          <span className="pbadge">Most popular</span>
          <div className="pname">Whole Home</div>
          <p className="pdesc">Every room, every tool, unlimited redesigns.</p>
          <div className="pamount">$19 <small>/ month · cancel anytime</small></div>
          <ul>
            <li>Unlimited rooms & redesigns</li>
            <li>Everything in First Room</li>
            <li>All exports — report, plan, CSV</li>
            <li>AI render prompts</li>
            <li>Saved projects & revisions</li>
          </ul>
          <button className="btn primary" onClick={()=>onPick("home")} disabled={plan==="home"}>{plan==="home"?"✓ Your current plan":"Unlock my home"}</button>
        </div>
        <div className="price">
          <div className="pname">Single Room Pass</div>
          <p className="pdesc">Just one more room, done properly. No subscription.</p>
          <div className="pamount">$9 <small>· per room, one-time</small></div>
          <ul>
            <li>1 additional room design</li>
            <li>All exports unlocked</li>
            <li>AI render prompts</li>
            <li className="no">Unlimited rooms</li>
          </ul>
          <button className="btn" onClick={()=>onPick("pass")}>Buy a room pass</button>
        </div>
      </div>
      <p className="sub" style={{textAlign:"center",marginTop:20}}>Prices in USD. Your free room never expires — take your time with it.</p>
    </div>
  );
}

function Landing({ onStart, onBuy, plan }){
  const pick = (p)=> p==="free" ? onStart() : onBuy(p);
  return (
    <div className="fade">
      <div className="ld-hero">
        <div>
          <span className="tag">AI Interior Design Studio</span>
          <h1>Every room deserves <em>a designer.</em></h1>
          <p className="ld-lede">Atelier.ai turns your room's measurements into a professional design — an intelligent floor plan, a curated mood board, a shopping list that respects your budget, and a designer you can talk to.</p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <button className="btn primary" onClick={onStart}>Design my room — free</button>
            <button className="btn" onClick={()=>document.getElementById("pricing")?.scrollIntoView({behavior:"smooth"})}>See pricing</button>
          </div>
          <p className="ld-note">First room free · No account needed · 11 design styles</p>
        </div>
        <div className="planframe"><HeroPlanArt/></div>
      </div>
      <div className="ld-strip">
        <span><b>11</b>&nbsp; design styles</span>
        <span><b>0.75 m</b>&nbsp; walkways, always respected</span>
        <span><b>6</b>&nbsp; optimisation scores</span>
        <span><b>4</b>&nbsp; export formats</span>
      </div>
      <div className="ld-sec">
        <div className="ld-h">
          <span className="tag">What's inside</span>
          <h2>A full design studio, not just a chatbot</h2>
          <p>Every tool reads your room's real dimensions and your brief — so advice is specific, measured and buildable.</p>
        </div>
        <div className="featgrid">
          <div className="feat"><div className="ico">📐</div><h3>Intelligent floor plans</h3><p>AI places furniture to scale on an architect-style plan — walkways clear, doors respected, reasoning explained. Drag anything to make it yours.</p></div>
          <div className="feat"><div className="ico">💬</div><h3>Chat with your designer</h3><p>"Can I fit a king-size bed?" Ask anything — the designer knows your exact room and answers with real measurements.</p></div>
          <div className="feat"><div className="ico">🎨</div><h3>Instant mood boards</h3><p>A design concept, five paint-accurate swatches, materials, fabrics and lighting inspiration in seconds.</p></div>
          <div className="feat"><div className="ico">🛒</div><h3>Budget-aware shopping</h3><p>A curated list that fits your budget, with brands you love, filterable by category and price.</p></div>
          <div className="feat"><div className="ico">📊</div><h3>Optimisation scores</h3><p>Six live scores with AI recommendations to raise the weakest ones — clearances, light, storage, flow.</p></div>
          <div className="feat"><div className="ico">📄</div><h3>Export everything</h3><p>A design report, shopping list, to-scale plan file and a ready-made AI render prompt.</p></div>
        </div>
      </div>
      <Pricing onPick={pick} plan={plan}/>
      <div className="ld-sec" style={{paddingTop:0}}>
        <div className="ld-cta">
          <span className="tag">Ready when you are</span>
          <h2 className="ld">Stop guessing. <em>Start designing.</em></h2>
          <p className="sub" style={{maxWidth:"52ch",margin:"10px auto 24px"}}>Your first room is free — describe it, and have a complete design before your coffee goes cold.</p>
          <button className="btn primary" onClick={onStart}>Design my free room</button>
        </div>
      </div>
      <div className="ld-foot">
        <span>© 2026 Atelier.ai — an AI interior design studio.</span>
        <span>Crafted in Barbados 🌴 by ZDMINC</span>
      </div>
    </div>
  );
}

/* ================= paywall & checkout ================= */
function PaywallModal({ reason, onClose, onCheckout }){
  return (
    <div className="ovl" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <span className="tag">Unlock the studio</span>
        <h2>{reason==="project" ? "Your free room is in use" : "Exports are a paid feature"}</h2>
        <p>{reason==="project"
          ? "The First Room plan includes one saved design. Add another room with a one-time Room Pass, or go unlimited with Whole Home."
          : "Your design is safe and stays editable. Unlock downloads — report, plan and shopping list — with a Room Pass or Whole Home."}</p>
        <div style={{display:"grid",gap:10}}>
          <button className="btn primary" style={{justifyContent:"space-between"}} onClick={()=>onCheckout("home")}>
            <span>Whole Home — unlimited</span><b>$19/mo</b>
          </button>
          <button className="btn" style={{justifyContent:"space-between"}} onClick={()=>onCheckout("pass")}>
            <span>Single Room Pass</span><b>$9</b>
          </button>
          <button className="btn ghost" onClick={onClose}>Not now</button>
        </div>
      </div>
    </div>
  );
}

function Checkout({ planKey, onDone, onCancel }){
  const p = PLANS[planKey];
  const [card,setCard]=useState(""); const [name,setName]=useState(""); const [exp,setExp]=useState(""); const [cvc,setCvc]=useState("");
  const [busy,setBusy]=useState(false);
  const ok = card.replace(/\s/g,"").length>=12 && name && exp && cvc.length>=3;
  const pay = ()=>{ setBusy(true); setTimeout(()=>onDone(planKey), 900); };
  return (
    <div className="co-wrap fade">
      <button className="btn ghost" onClick={onCancel}>← Back</button>
      <div className="card" style={{marginTop:14}}>
        <span className="tag">Checkout</span>
        <h2>{p.label}</h2>
        <p className="sub">{p.blurb} · <b style={{color:"var(--ink)"}}>${p.price}{planKey==="home"?"/month":""}</b></p>
        <div className="co-demo">🧪 <b>Demo checkout.</b> No real payment is taken — any card details work. In production this form is replaced by Stripe Checkout.</div>
        <div style={{display:"grid",gap:12}}>
          <Fld label="Name on card"><input value={name} onChange={e=>setName(e.target.value)} placeholder="K. Designer"/></Fld>
          <Fld label="Card number"><input inputMode="numeric" value={card} onChange={e=>setCard(e.target.value)} placeholder="4242 4242 4242 4242"/></Fld>
          <div className="grid2">
            <Fld label="Expiry"><input value={exp} onChange={e=>setExp(e.target.value)} placeholder="12/28"/></Fld>
            <Fld label="CVC"><input inputMode="numeric" value={cvc} onChange={e=>setCvc(e.target.value)} placeholder="123"/></Fld>
          </div>
          <button className="btn primary" style={{justifyContent:"center"}} disabled={!ok||busy} onClick={pay}>
            {busy?<><Spinner/> Processing…</>:`Pay $${p.price}${planKey==="home"?"/mo":""}`}
          </button>
          <p className="sub" style={{textAlign:"center",margin:0}}>Secured · Cancel anytime · Instant unlock</p>
        </div>
      </div>
    </div>
  );
}

/* ================= visualisation ================= */
function VisualisePanel({ room, prefs, furniture, mood, shop }) {
  const [renders, setRenders] = useState([]); // Array of { seed, url, loading, error, errorMessage }
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [detections, setDetections] = useState({}); // idx -> { status: "loading"|"done"|"error", items?, error? }
  
  // Persistence settings
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem("atelier_render_mode");
    if (saved === "ai" || saved === "picsum" || !saved) {
      return "unsplash";
    }
    return saved;
  });
  const [webhookUrl, setWebhookUrl] = useState(() => localStorage.getItem("atelier_webhook_url") || "");
  const [webhookAuth, setWebhookAuth] = useState(() => localStorage.getItem("atelier_webhook_auth") || "");
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem("atelier_gemini_key") || "");
  const [geminiModel, setGeminiModel] = useState(() => {
    const saved = localStorage.getItem("atelier_gemini_model");
    if (!saved || saved === "gemini-2.5-flash-image" || saved === "imagen-3.0-generate-002") {
      return "imagen-4.0-generate-001";
    }
    return saved;
  });
  const renderCount = 3;
  const isFileProtocol = typeof window !== "undefined" && window.location.protocol === "file:";

  // Connection testing states
  const [geminiStatus, setGeminiStatus] = useState(""); // "", "testing", "success", "error"
  const [geminiError, setGeminiError] = useState("");
  const [webhookStatus, setWebhookStatus] = useState(""); // "", "testing", "success", "error"
  const [webhookError, setWebhookError] = useState("");

  const testGeminiKey = async () => {
    setGeminiStatus("testing");
    setGeminiError("");
    try {
      const res = await fetchWithGemini(`/v1beta/models/${geminiModel}:predict?key=${geminiApiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt: "A small succulent plant in a ceramic pot on a clean wooden desk, high quality photograph" }],
          parameters: { sampleCount: 1, aspectRatio: "1:1", outputOptions: { mimeType: "image/jpeg" } }
        })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `API returned ${res.status}`);
      }
      const data = await res.json();
      const imageBytes = data.predictions?.[0]?.bytesBase64Encoded;
      if (!imageBytes) throw new Error("No image data returned from Gemini API");
      setGeminiStatus("success");
    } catch (e) {
      setGeminiStatus("error");
      setGeminiError(e.message);
    }
  };

  const testWebhook = async () => {
    if (!webhookUrl) {
      alert("Please enter a Webhook URL first.");
      return;
    }
    setWebhookStatus("testing");
    setWebhookError("");
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(webhookAuth ? { "Authorization": `Bearer ${webhookAuth}` } : {})
        },
        body: JSON.stringify({
          prompt: "Test image rendering connection, small succulent plant on desk",
          seed: 12345,
          index: 1,
          room: { type: "Office", length: 3, width: 3, height: 2.7 },
          style: "Modern",
          palette: "neutral"
        })
      });
      if (!res.ok) throw new Error("Webhook returned " + res.status);
      const data = await res.json();
      if (!data.url) throw new Error("No 'url' found in webhook response");
      setWebhookStatus("success");
    } catch (e) {
      setWebhookStatus("error");
      setWebhookError(e.message);
    }
  };

  const defaultPrompt = useMemo(() => {
    const style = prefs.style || "Japandi";
    const windowsStr = room.windows ? `, ${room.windows}` : ", large windows with soft morning light";
    const roomDesc = `${style} style ${room.type.toLowerCase()}, ${room.length}m x ${room.width}m with ${room.height}m ceilings${windowsStr}.`;

    // Prefer the shopping list (the actual pieces being bought) over the raw floor-plan catalog names
    const items = shop && shop.length
      ? shop.map(i => `${i.name}${i.colour ? ` (${i.colour})` : ""}`).join(", ")
      : furniture.filter(f => f.cat !== "rug").map(f => f.name.toLowerCase()).join(", ");

    // Prefer the mood board's designer palette/materials over the raw brief preference
    const pal = mood?.palette?.length
      ? mood.palette.map(c => `${c.name} (${c.hex})`).join(", ")
      : (prefs.palette || "warm neutrals, natural oak, light linen");
    const concept = mood?.concept ? `${mood.concept} ` : "";
    const extras = [
      mood?.materials?.length && `Materials: ${mood.materials.join(", ")}.`,
      mood?.fabrics?.length && `Fabrics: ${mood.fabrics.join(", ")}.`,
      mood?.lighting?.length && `Lighting: ${mood.lighting.join(", ")}.`,
    ].filter(Boolean).join(" ");

    // Reflect the room's budget tier as a styling cue
    const spend = (shop||[]).reduce((s,i)=>s+(+i.price||0),0) || furniture.reduce((s,f)=>s+(f.price||0),0);
    const budgetTier = prefs.budget > 0 && spend > prefs.budget
      ? "cost-conscious styling, smart affordable finishes"
      : "premium, considered high-end finishes";

    return `Photorealistic interior design photograph of a ${roomDesc} ${concept}Furnished with: ${items || "curated designer furniture"}. Color palette: ${pal}. ${extras} Styling: ${budgetTier}. High-end editorial shoot, architectural digest style, clean lines, warm natural lighting, volumetric rays, 8k resolution, crisp details.`.replace(/\s+/g, " ").trim();
  }, [room, prefs, furniture, mood, shop]);

  // Keep tracking the brief/floor plan/mood board/shopping list until the user
  // manually edits the prompt themselves — otherwise later changes on those
  // tabs would only show up here after a full page refresh.
  const [promptTouched, setPromptTouched] = useState(false);
  useEffect(() => {
    if (!promptTouched) {
      setCustomPrompt(defaultPrompt);
    }
  }, [defaultPrompt, promptTouched]);

  // Sync state to local storage
  useEffect(() => { localStorage.setItem("atelier_render_mode", mode); }, [mode]);
  useEffect(() => { localStorage.setItem("atelier_webhook_url", webhookUrl); }, [webhookUrl]);
  useEffect(() => { localStorage.setItem("atelier_webhook_auth", webhookAuth); }, [webhookAuth]);
  useEffect(() => { localStorage.setItem("atelier_gemini_key", geminiApiKey); }, [geminiApiKey]);
  useEffect(() => { localStorage.setItem("atelier_gemini_model", geminiModel); }, [geminiModel]);

  const getCuratedUnsplashUrl = (roomType, seedVal, index) => {
    // Curated high-end Unsplash interior design photos
    const photos = {
      "Living Room": [
        "1618219908412-a29a1bb7b86e", // Modern minimalist beige living room
        "1600210492486-724fe5c67fb0", // Cozy warm designer living room
        "1618221195710-dd6b41faaea6", // Premium Japandi living room
        "1600607687939-ce8a6c25118c", // Minimal living room with glass walls
        "1616486338812-3dadae4b4ace", // Luxury modern beige living room
        "1616047006789-b7af5afb8c20", // Neutral modern living space
        "1616046229478-9901c5536a45", // Warm wooden coffee table sofa
        "1618219942942-555123584140"  // Neutral wall art living room
      ],
      "Bedroom": [
        "1616594039964-ae9021a400a0", // Japandi wooden bedroom
        "1598928506311-c55ded91a20c", // Cozy modern neutral bedroom
        "1505693416388-ac5ce068fe85", // Sunlit clean linen bed
        "1617806118233-18e1db207faf", // Modern minimal gray bedroom
        "1618221381711-42ca8ab6e908", // Modern bedroom nightstand
        "1615876234886-fd9a39fda97f"  // Japandi bedroom shelf decor
      ],
      "Kitchen": [
        "1556911220-e15b29be8c8f", // Warm wood and dark marble kitchen
        "1600585154340-be6161a56a0c", // Elegant white marble kitchen island
        "1556912173-3bb406ef7e77", // Cozy rustic modern kitchen
        "1600607687920-4e2a09cf159d"  // High-end minimalist kitchen
      ],
      "Dining Room": [
        "1617806118233-18e1db207faf", // Sleek modern dining table
        "1600585154526-990dced4db0d", // Grand modern warm dining room
        "1615066390971-03e4e1c36ddf", // Minimalist dining nook
        "1615529182904-14819c35db37"  // Minimal dining room chairs
      ],
      "Office": [
        "1524758631624-e2822e304c36", // Modern clean office space
        "1618220179428-22790b461013", // Japandi home office desk
        "1507679799987-c73779587ccf"  // Sunlit wooden design workspace
      ],
      "Bathroom": [
        "1584622650111-993a426fbf0a", // Luxury white bathtub/towels
        "1552321554-5fefe8c9ef14", // Modern concrete/wood bathroom
        "1600566752355-35792bedcfea"  // Elegant marble vanity
      ],
      "General": [
        "1615873968403-89e068628265", // Japandi design setup
        "1616486029423-a57e61884b95", // Modern wood dresser shelf
        "1617103996181-a61c778a2726", // Modern beige details room
        "1616486788371-62d930495c44"  // Beige couch dining table
      ]
    };

    // Normalize room type to map key
    let typeKey = "General";
    const typeLower = (roomType || "").toLowerCase();
    if (typeLower.includes("living")) typeKey = "Living Room";
    else if (typeLower.includes("bed")) typeKey = "Bedroom";
    else if (typeLower.includes("kitchen")) typeKey = "Kitchen";
    else if (typeLower.includes("dining")) typeKey = "Dining Room";
    else if (typeLower.includes("office") || typeLower.includes("study") || typeLower.includes("work")) typeKey = "Office";
    else if (typeLower.includes("bath") || typeLower.includes("powder")) typeKey = "Bathroom";

    const list = photos[typeKey] || photos["General"];
    // Select image based on seed + index to get variety
    const selectionIndex = Math.abs(seedVal + index) % list.length;
    const photoId = list[selectionIndex];
    return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=1024&q=80`;
  };

  const getUrl = (p, seed, index = 0, currentMode = mode) => {
    if (currentMode === "picsum") {
      return `https://picsum.photos/seed/${seed}/1024/768`;
    }
    if (currentMode === "unsplash") {
      return getCuratedUnsplashUrl(room.type, seed, index);
    }
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?width=1024&height=768&nologo=true&seed=${seed}`;
  };

  const generateSingleWebhook = async (idx, seedVal, promptText) => {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(webhookAuth ? { "Authorization": `Bearer ${webhookAuth}` } : {})
        },
        body: JSON.stringify({
          prompt: promptText,
          seed: seedVal,
          index: idx + 1,
          room: {
            type: room.type,
            length: room.length,
            width: room.width,
            height: room.height
          },
          style: prefs.style,
          palette: prefs.palette
        })
      });
      if (!res.ok) throw new Error("Webhook returned " + res.status);
      const data = await res.json();
      if (!data.url) throw new Error("No 'url' found in webhook response");
      
      setRenders(prev => {
        const copy = [...prev];
        if (copy[idx]) {
          copy[idx] = {
            ...copy[idx],
            url: data.url,
            loading: false,
            error: false
          };
        }
        return copy;
      });
    } catch (e) {
      setRenders(prev => {
        const copy = [...prev];
        if (copy[idx]) {
          copy[idx].loading = false;
          copy[idx].error = true;
          copy[idx].errorMessage = e.message;
        }
        return copy;
      });
    }
  };

  const generateSingleGemini = async (idx, seedVal, promptText) => {
    try {
      const res = await fetchWithGemini(`/v1beta/models/${geminiModel}:predict?key=${geminiApiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt: `${promptText} (variation seed ${seedVal})` }],
          parameters: { sampleCount: 1, aspectRatio: "4:3", outputOptions: { mimeType: "image/jpeg" } }
        })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `API returned ${res.status}`);
      }
      const data = await res.json();
      const imageBytes = data.predictions?.[0]?.bytesBase64Encoded;
      if (!imageBytes) throw new Error("No image data returned from Gemini API");
      
      const url = `data:image/jpeg;base64,${imageBytes}`;
      setRenders(prev => {
        const copy = [...prev];
        if (copy[idx]) {
          copy[idx] = {
            ...copy[idx],
            url: url,
            loading: false,
            error: false
          };
        }
        return copy;
      });
    } catch (e) {
      setRenders(prev => {
        const copy = [...prev];
        if (copy[idx]) {
          copy[idx].loading = false;
          copy[idx].error = true;
          copy[idx].errorMessage = e.message;
        }
        return copy;
      });
    }
  };

  const generateAll = () => {
    const p = customPrompt.trim() || defaultPrompt;
    
    if (mode === "webhook" && !webhookUrl) {
      alert("Please enter a Webhook URL first in the rendering settings below.");
      return;
    }


    setIsGeneratingAll(true);
    setDetections({});
    const items = Array.from({ length: renderCount }).map((_, idx) => {
      const seed = Math.floor(Math.random() * 1000000) + idx;
      return {
        seed,
        url: (mode === "webhook" || mode === "gemini") ? "" : getUrl(p, seed, idx),
        loading: true,
        error: false,
        errorMessage: ""
      };
    });
    setRenders(items);
    setSelectedIdx(0);
    setIsGeneratingAll(false);

    if (mode === "webhook") {
      items.forEach((item, idx) => generateSingleWebhook(idx, item.seed, p));
    } else if (mode === "gemini") {
      items.forEach((item, idx) => generateSingleGemini(idx, item.seed, p));
    }
  };

  const regenerateSingle = (idx) => {
    const p = customPrompt.trim() || defaultPrompt;
    const seed = Math.floor(Math.random() * 1000000) + idx;

    setDetections(d => { const copy = { ...d }; delete copy[idx]; return copy; });
    setRenders(prev => {
      const copy = [...prev];
      copy[idx] = {
        seed,
        url: (mode === "webhook" || mode === "gemini") ? "" : getUrl(p, seed, idx),
        loading: true,
        error: false,
        errorMessage: ""
      };
      return copy;
    });

    if (mode === "webhook") {
      generateSingleWebhook(idx, seed, p);
    } else if (mode === "gemini") {
      generateSingleGemini(idx, seed, p);
    }
  };

  const handleImageLoad = (idx) => {
    setRenders(prev => {
      const copy = [...prev];
      if (copy[idx]) copy[idx].loading = false;
      return copy;
    });
  };

  const handleImageError = (idx) => {
    setRenders(prev => {
      const copy = [...prev];
      if (copy[idx]) {
        // If it was using Pollinations, automatically try Picsum fallback
        if (copy[idx].url.includes("pollinations.ai")) {
          const fallbackUrl = `https://picsum.photos/seed/${copy[idx].seed}/1024/768`;
          copy[idx] = {
            ...copy[idx],
            url: fallbackUrl,
            loading: true,
            error: false
          };
        } else {
          // If Picsum also fails, mark error
          copy[idx].loading = false;
          copy[idx].error = true;
        }
      }
      return copy;
    });
  };

  const detectItems = async (idx) => {
    const item = renders[idx];
    if (!item?.url) return;
    setDetections(d => ({ ...d, [idx]: { status: "loading" } }));
    try {
      const { mimeType, data } = await urlToBase64(item.url);
      const names = furniture.map(f => f.name);
      const prompt = `This is a photo of a ${room.type.toLowerCase()}. Identify which of these specific items are visible: ${names.join(", ") || "furniture and decor"}. Respond with ONLY a JSON array, no markdown: [{"name":"<exact item name from the list>","box_2d":[ymin,xmin,ymax,xmax]}]. box_2d values are integers 0-1000, normalized to the image height/width with the origin at the top-left. Only include items you can actually see in the photo; skip ones you can't find, and don't invent extra items.`;
      const text = await askGeminiVision(prompt, data, mimeType, geminiApiKey);
      const items = parseJson(text);
      setDetections(d => ({ ...d, [idx]: { status: "done", items: Array.isArray(items) ? items : [] } }));
    } catch (e) {
      setDetections(d => ({ ...d, [idx]: { status: "error", error: e.message } }));
    }
  };

  const download = async (url, seedVal) => {
    if (!url) return;
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `atelier-render-${room.type.toLowerCase().replace(/\s+/g, "-")}-seed-${seedVal}.jpg`;
      a.click();
      URL.revokeObjectURL(downloadUrl);
    } catch(e) {
      window.open(url, '_blank');
    }
  };

  const activeRender = selectedIdx !== null ? renders[selectedIdx] : null;
  const isFallbackActive = renders.some(r => r.url.includes("picsum.photos") && mode === "ai");

  return (
    <div className="card fade" style={{ display: "grid", gap: 20 }}>
      <style>{`
        .v-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        @media(min-width: 900px) { .v-grid { grid-template-columns: repeat(5, 1fr); } }
        .v-thumb {
          border: 2px solid var(--line);
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          aspect-ratio: 4/3;
          background: var(--paper);
          box-shadow: var(--shadow);
        }
        .v-thumb:hover {
          transform: translateY(-2px);
          border-color: var(--accent);
        }
        .v-thumb.active {
          border-color: var(--brass);
          transform: scale(1.03);
          box-shadow: 0 4px 12px rgba(156, 130, 72, 0.25);
          z-index: 2;
        }
        .v-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .v-thumb:hover .v-overlay { opacity: 1; }
        .v-num-badge {
          position: absolute;
          top: 6px;
          left: 6px;
          background: rgba(30, 32, 26, 0.75);
          color: #fff;
          font: 700 11px 'Karla';
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
        }
      `}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
        <div>
          <span className="tag">3D Visualisation Gallery</span>
          <h2>AI Room Visualizer</h2>
          <p className="sub">Render {renderCount} unique design visuals based on your layout, style selection, and colour brief.</p>
        </div>
        <button className="btn primary" onClick={generateAll} disabled={isGeneratingAll}>
          {isGeneratingAll ? <><Spinner /> Loading...</> : renders.length > 0 ? `↻ Regenerate all ${renderCount} designs` : `✦ Render ${renderCount} visual options`}
        </button>
      </div>

      {isFileProtocol && (
        <div style={{ 
          background: "#FFF9E6", 
          borderLeft: "4px solid #D97706", 
          padding: "12px 16px", 
          borderRadius: 8, 
          fontSize: 13, 
          lineHeight: "1.5",
          color: "#78350F"
        }}>
          ⚠️ <b>Running from Static File:</b> You opened this app directly from your computer (showing <code>file:///</code> in the address bar). 
          In this static mode, the browser blocks direct connection to Google Gemini API (CORS block). To fix this:
          <ul style={{ margin: "6px 0 0 20px", padding: 0 }}>
            <li>Access the live app at: <a href="http://localhost:5173/" target="_blank" rel="noreferrer" style={{ fontWeight: 700, color: "#B45309", textDecoration: "underline" }}>http://localhost:5173/</a></li>
            <li>Or, if using Safari, enable <b>Develop &gt; Disable Cross-Origin Restrictions</b> in Safari's top menu bar to allow it.</li>
          </ul>
        </div>
      )}

      {/* Engine Selector - Always Visible */}
      <div style={{ display: "grid", gap: 14, borderBottom: renders.length > 0 ? "1px solid var(--line)" : "none", paddingBottom: renders.length > 0 ? 16 : 0 }}>
        <div className="notice" style={{ background: "var(--paper)", display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 6px 0", color: "var(--ink)" }}>Rendering Engine Settings</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8, fontSize: 13 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontWeight: mode === "unsplash" ? "700" : "500" }}>
                <input type="radio" name="renderMode" checked={mode === "unsplash"} onChange={() => { setMode("unsplash"); setRenders([]); }} />
                Curated Stock (Unsplash) [Free] 🌟
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontWeight: mode === "webhook" ? "700" : "500" }}>
                <input type="radio" name="renderMode" checked={mode === "webhook"} onChange={() => { setMode("webhook"); setRenders([]); }} />
                Custom Webhook / Flow 🔌
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontWeight: mode === "gemini" ? "700" : "500" }}>
                <input type="radio" name="renderMode" checked={mode === "gemini"} onChange={() => { setMode("gemini"); setRenders([]); }} />
                Google Gemini API Key 🔑
              </label>
            </div>
          </div>
        </div>

        {/* Mode specific configuration inputs */}
        {mode === "webhook" && (
          <div style={{ display: "grid", gap: 10, padding: 12, border: "1px dashed var(--line)", borderRadius: 10, background: "var(--paper)" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>WEBHOOK / FLOW CONFIGURATION</span>
            <Fld label="Webhook URL (POST)">
              <input value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder="https://hooks.make.com/... or cloud function" />
            </Fld>
            <Fld label="Authorization Token (Optional)">
              <input type="password" value={webhookAuth} onChange={e => setWebhookAuth(e.target.value)} placeholder="Bearer token or authorization header" />
            </Fld>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <button className="btn" style={{ padding: "6px 12px", fontSize: 12 }} onClick={testWebhook} disabled={webhookStatus === "testing"}>
                {webhookStatus === "testing" ? "Testing..." : "⚡ Test Webhook Connection"}
              </button>
              {webhookStatus === "success" && (
                <span style={{ fontSize: 12, color: "#2E7D32", fontWeight: 700 }}>✓ Connected successfully!</span>
              )}
              {webhookStatus === "error" && (
                <span style={{ fontSize: 12, color: "var(--danger)", fontWeight: 600 }}>✗ Failed: {webhookError}</span>
              )}
            </div>
            <span style={{ fontSize: 11, color: "var(--muted)" }}>
              Payload sent: <code>{`{ prompt: "...", seed: 123, index: 1, room: {...}, style: "...", palette: "..." }`}</code>.
              Expected response: <code>{`{ "url": "https://image-url-here" }`}</code>.
            </span>
          </div>
        )}

        {mode === "gemini" && (
          <div style={{ display: "grid", gap: 10, padding: 12, border: "1px dashed var(--line)", borderRadius: 10, background: "var(--paper)" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>GOOGLE GEMINI DEVELOPER CONFIGURATION</span>
            <Fld label="Gemini API Key (Optional if GEMINI_API_KEY env is set)">
              <input type="password" value={geminiApiKey} onChange={e => setGeminiApiKey(e.target.value)} placeholder="AIzaSy... (or leave blank to use backend variable)" />
            </Fld>
            <Fld label="Imagen Model Name">
              <input value={geminiModel} onChange={e => setGeminiModel(e.target.value)} placeholder="imagen-4.0-generate-001" />
            </Fld>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <button className="btn" style={{ padding: "6px 12px", fontSize: 12 }} onClick={testGeminiKey} disabled={geminiStatus === "testing"}>
                {geminiStatus === "testing" ? "Testing..." : "⚡ Test Key Connection"}
              </button>
              {geminiStatus === "success" && (
                <span style={{ fontSize: 12, color: "#2E7D32", fontWeight: 700 }}>✓ Key Working! ready to generate.</span>
              )}
              {geminiStatus === "error" && (
                <span style={{ fontSize: 12, color: "var(--danger)", fontWeight: 600 }}>✗ Failed: {geminiError}</span>
              )}
            </div>
            <span style={{ fontSize: 11, color: "var(--muted)" }}>
              Calls the official Google AI Studio developer endpoint. Get a free key from the <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ color: "var(--brass)", textDecoration: "underline" }}>Google AI Studio Console</a>.
            </span>
          </div>
        )}
      </div>

      {renders.length === 0 ? (
        <div style={{ 
          width: "100%", 
          padding: "40px 20px", 
          borderRadius: 16, 
          border: "2px dashed var(--line)", 
          background: "var(--paper)", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          gap: 14 
        }}>
          <span style={{ fontSize: 48 }}>🖼️</span>
          <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Render Visual Options</h3>
          <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 10px", textAlign: "center", maxWidth: "44ch" }}>
            {mode === "webhook" ? "Configure your webhook URL above, then click below to render." : mode === "gemini" ? "Configure your API key above, then click below to render." : mode === "unsplash" ? `Loads ${renderCount} high-end, curated Stock Photographs matching your room style & brief.` : `Generate ${renderCount} custom photorealistic room concepts simultaneously, drawing on your brief, floor plan, mood board and shopping list. Choose your favorite, tweak prompts, and download the design.`}
          </p>
          <button className="btn primary" onClick={generateAll}>✦ Render {renderCount} visual options</button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 20 }}>
          {isFallbackActive && (
            <div className="notice warn" style={{ background: "#FDF6E2", borderLeft: "4px solid #B58900", color: "#586E75", padding: "12px 16px", borderRadius: 8, fontSize: 13, lineHeight: "1.5" }}>
              ⚠️ <b>Rendering Fallback Active:</b> Pollinations AI could not be reached (likely blocked by browser ad-blockers, network firewalls, or privacy shields). 
              We have automatically loaded high-quality placeholder room templates (Picsum) instead. To get true custom AI visual renders:
              <ul style={{ margin: "6px 0 0 20px", padding: 0 }}>
                <li>Disable shields/adblockers for this website (e.g. Brave Shields, uBlock Origin).</li>
                <li>Or, switch to a **Custom Webhook** or your own **Gemini API Key** in the engine settings above.</li>
              </ul>
            </div>
          )}

          {/* Main Selected Render Preview */}
          {activeRender && (
            <div className="grid2" style={{ alignItems: "start", gap: 20 }}>
              {/* Main Image View */}
              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ 
                  position: "relative", 
                  width: "100%", 
                  paddingTop: "75%", 
                  borderRadius: 16, 
                  border: "1px solid var(--line)", 
                  background: "var(--paper)", 
                  overflow: "hidden",
                  boxShadow: "var(--shadow)"
                }}>
                  {activeRender.url ? (
                    <img 
                      src={activeRender.url} 
                      alt={`AI room render option ${selectedIdx + 1}`}
                      style={{ 
                        position: "absolute",
                        top: 0, left: 0,
                        width: "100%", height: "100%",
                        objectFit: "cover",
                        opacity: activeRender.loading ? 0.3 : 1,
                        transition: "opacity 0.3s ease"
                      }}
                      onLoad={() => handleImageLoad(selectedIdx)}
                      onError={() => handleImageError(selectedIdx)}
                    />
                  ) : null}
                  {activeRender.loading && (
                    <div style={{ 
                      position: "absolute", 
                      inset: 0, 
                      display: "flex", 
                      flexDirection: "column", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      gap: 12,
                      background: "rgba(251, 250, 246, 0.7)" 
                    }}>
                      <Spinner />
                      <span style={{ fontSize: 13, color: "var(--ink)", fontWeight: 600 }}>Painting room render #{selectedIdx + 1}...</span>
                    </div>
                  )}
                  {activeRender.error && (
                    <div style={{ 
                      position: "absolute", 
                      inset: 0, 
                      display: "flex", 
                      flexDirection: "column",
                      alignItems: "center", 
                      justifyContent: "center", 
                      color: "var(--danger)",
                      padding: 20,
                      textAlign: "center"
                    }}>
                      <b>Failed to generate this option.</b>
                      <span style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{activeRender.errorMessage || "Network error. Check connection."}</span>
                      <button className="btn" style={{ marginTop: 8 }} onClick={() => regenerateSingle(selectedIdx)}>Retry Slot</button>
                    </div>
                  )}
                  {activeRender.url && !activeRender.loading && !activeRender.error && detections[selectedIdx]?.status === "done" &&
                    detections[selectedIdx].items.map((it, i) => {
                      const [ymin, xmin, ymax, xmax] = it.box_2d || [];
                      if ([ymin, xmin, ymax, xmax].some(v => typeof v !== "number")) return null;
                      const leftPct = ((xmin + xmax) / 2) / 10;
                      const topPct = ((ymin + ymax) / 2) / 10;
                      const match = furniture.find(f => f.name.toLowerCase() === (it.name || "").toLowerCase());
                      return (
                        <a key={i}
                           href={shopSearchUrl(`${match ? match.name : it.name} ${prefs.style || ""}`.trim())}
                           target="_blank" rel="noreferrer"
                           title={`Shop for ${it.name}`}
                           style={{
                             position: "absolute", left: `${leftPct}%`, top: `${topPct}%`, transform: "translate(-50%,-50%)",
                             width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,.92)",
                             border: "1.5px solid var(--brass)", display: "flex", alignItems: "center", justifyContent: "center",
                             fontSize: 10, fontWeight: 700, color: "var(--brass)", textDecoration: "none",
                             boxShadow: "0 1px 4px rgba(0,0,0,.35)", cursor: "pointer"
                           }}>$</a>
                      );
                    })}
                </div>
                {activeRender.url && !activeRender.loading && !activeRender.error && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    {(!detections[selectedIdx] || detections[selectedIdx].status === "error") && (
                      <button className="btn ghost" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => detectItems(selectedIdx)}>
                        🔍 Find shoppable items in this photo
                      </button>
                    )}
                    {detections[selectedIdx]?.status === "loading" && (
                      <span style={{ fontSize: 12, color: "var(--muted)" }}><Spinner /> Analysing photo…</span>
                    )}
                    {detections[selectedIdx]?.status === "error" && (
                      <span style={{ fontSize: 12, color: "var(--danger)" }}>Couldn't analyse this photo ({detections[selectedIdx].error})</span>
                    )}
                    {detections[selectedIdx]?.status === "done" && detections[selectedIdx].items.length > 0 && (
                      <p style={{ fontSize: 11, color: "var(--muted)", margin: 0 }}>🛒 <b>$</b> markers found in this photo — click one to shop for that piece.</p>
                    )}
                    {detections[selectedIdx]?.status === "done" && detections[selectedIdx].items.length === 0 && (
                      <p style={{ fontSize: 11, color: "var(--muted)", margin: 0 }}>No matching items found in this photo.</p>
                    )}
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>Option <b>#{selectedIdx + 1}</b> (Seed: {activeRender.seed})</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn ghost" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => regenerateSingle(selectedIdx)} disabled={activeRender.loading}>
                      ⟳ Regenerate Option #{selectedIdx + 1}
                    </button>
                    {activeRender.url && (
                      <button className="btn ghost" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => download(activeRender.url, activeRender.seed)}>
                        📥 Download JPEG
                      </button>
                    )}
                    {activeRender.url && !activeRender.url.startsWith("data:") && (
                      <a href={activeRender.url} target="_blank" rel="noreferrer" className="btn ghost" style={{ padding: "6px 12px", fontSize: 12, textDecoration: "none" }}>
                        ↗ Fullscreen
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Design Controls */}
              <div style={{ display: "grid", gap: 14 }}>
                <div className="notice" style={{ background: "var(--paper)" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: "var(--ink)" }}>Active Design Brief</h3>
                  <div style={{ fontSize: 13, color: "var(--muted)", display: "grid", gap: 4 }}>
                    <div><b>Room:</b> {room.type} ({room.length}m × {room.width}m)</div>
                    <div><b>Style:</b> {prefs.style}</div>
                    <div><b>Palette:</b> {mood?.palette?.length ? mood.palette.map(c=>c.name).join(", ") : (prefs.palette || "Designer's choice")}</div>
                    <div><b>Placed Furniture:</b> {furniture.length || "None"}</div>
                    <div><b>Mood board:</b> {mood?.concept ? "Generated" : "Not generated yet"}</div>
                    <div><b>Shopping list:</b> {shop?.length ? `${shop.length} items` : "Not generated yet"}</div>
                    <div><b>Budget:</b> {prefs.budget ? `$${(+prefs.budget).toLocaleString()}` : "Not set"}</div>
                  </div>
                </div>

                {(mode === "ai" || mode === "webhook" || mode === "gemini") && (
                  <>
                    <Fld label="AI Render Prompt (drawn from your brief, floor plan, mood board & shopping list — editing this updates all renders)">
                      <textarea
                        value={customPrompt}
                        onChange={e => { setCustomPrompt(e.target.value); setPromptTouched(true); }}
                        rows={4}
                        style={{ width: "100%", resize: "vertical", fontSize: 13, fontFamily: "Karla", lineHeight: "1.4" }}
                      />
                    </Fld>

                    <button className="btn primary" onClick={generateAll} style={{ width: "fit-content" }}>
                      ✦ Apply prompt and render all {renderCount} options
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Grid of render options */}
          <div style={{ marginTop: 10 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Choose a design variation:</h3>
            <div className="v-grid">
              {renders.map((item, idx) => {
                const isActive = idx === selectedIdx;
                return (
                  <div 
                    key={idx} 
                    className={`v-thumb ${isActive ? "active" : ""}`}
                    onClick={() => setSelectedIdx(idx)}
                  >
                    <span className="v-num-badge">{idx + 1}</span>
                    {item.url ? (
                      <img 
                        src={item.url} 
                        alt={`Thumbnail ${idx + 1}`}
                        style={{ 
                          width: "100%", 
                          height: "100%", 
                          objectFit: "cover", 
                          opacity: item.loading ? 0 : 1,
                          transition: "opacity 0.2s ease"
                        }}
                        onLoad={() => handleImageLoad(idx)}
                        onError={() => handleImageError(idx)}
                      />
                    ) : null}
                    {item.loading && (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Spinner />
                      </div>
                    )}
                    {item.error && (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--danger)", padding: 4, textAlign: "center" }}>
                        Error
                      </div>
                    )}
                    <div className="v-overlay">
                      <button 
                        className="btn primary" 
                        style={{ padding: "4px 8px", fontSize: 11 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          regenerateSingle(idx);
                        }}
                      >
                        ⟳ Tweak
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= studio ================= */
const TABS = ["Brief","Floor plan","Mood board","Shopping","Budget & score","Visualise","Export"];

function Studio({ state, setState, onUpgrade, onHome }){
  const [tab,setTab]=useState("Brief");
  const [aiTips,setAiTips]=useState("");
  const svgRef=useRef(null);
  const proj = state.projects.find(p=>p.id===state.activeId) || state.projects[0];
  const canCreate = state.plan==="home" || state.projects.length < 1 + state.passes;
  const exportsUnlocked = state.plan==="home" || state.passes>0;

  const patch = (fields) => setState(s=>({ ...s, projects: s.projects.map(p=>p.id===proj.id?{...p,...(typeof fields==="function"?fields(p):fields)}:p) }));
  const setRoom = f => patch(p=>({room: typeof f==="function"?f(p.room):f}));
  const setPrefs = f => patch(p=>({prefs: typeof f==="function"?f(p.prefs):f}));
  const setFurniture = f => patch(p=>({furniture: typeof f==="function"?f(p.furniture):f}));
  const setMood = m => patch({mood:m});
  const setShop = sh => patch({shop:sh});
  const setPhoto = ph => patch({photo:ph});

  const addProject = () => {
    if (!canCreate) { onUpgrade("project"); return; }
    const np = newProject(state.projects.length+1);
    setState(s=>({...s, projects:[...s.projects, np], activeId:np.id}));
    setTab("Brief");
  };
  const renameProject = () => {
    const n = prompt("Rename this room:", proj.name);
    if (n) patch({name:n});
  };

  if(!proj) return null;
  return (
    <>
      <div className="projbar">
        {state.projects.map(p=>(
          <button key={p.id} className={"pill"+(p.id===proj.id?" on":"")} onClick={()=>setState(s=>({...s,activeId:p.id}))} onDoubleClick={renameProject}>
            {p.name} · {p.room.type}
          </button>
        ))}
        <button className="pill" onClick={addProject}>+ New room{!canCreate?" 🔒":""}</button>
        <span style={{marginLeft:"auto"}} className={"planbadge"+(state.plan==="home"||state.passes>0?" gold":"")}>
          {state.plan==="home"?"Whole Home":state.passes>0?`Room Pass ×${state.passes}`:"Free plan"}
        </span>
        {state.plan!=="home" && <button className="btn ghost" style={{whiteSpace:"nowrap"}} onClick={()=>onUpgrade("upgrade")}>Upgrade</button>}
      </div>
      <div className="atl-tabs" role="tablist">
        {TABS.map(t=><button key={t} role="tab" aria-selected={tab===t} className={"atl-tab"+(tab===t?" on":"")} onClick={()=>setTab(t)}>{t}{t==="Export"&&!exportsUnlocked?" 🔒":""}</button>)}
      </div>
      <div className="atl-main">
        <div style={{display:tab==="Brief"?"block":"none"}}><BriefPanel room={proj.room} setRoom={setRoom} prefs={proj.prefs} setPrefs={setPrefs} photo={proj.photo} setPhoto={setPhoto} go={()=>setTab("Floor plan")}/></div>
        <div style={{display:tab==="Floor plan"?"block":"none"}}><PlanPanel key={proj.id} room={proj.room} prefs={proj.prefs} furniture={proj.furniture} setFurniture={setFurniture} photo={proj.photo} svgRef={svgRef}/></div>
        <div style={{display:tab==="Visualise"?"block":"none"}}><VisualisePanel key={proj.id} room={proj.room} prefs={proj.prefs} furniture={proj.furniture} mood={proj.mood} shop={proj.shop}/></div>
        <div style={{display:tab==="Mood board"?"block":"none"}}><MoodPanel room={proj.room} prefs={proj.prefs} mood={proj.mood} setMood={setMood}/></div>
        <div style={{display:tab==="Shopping"?"block":"none"}}><ShopPanel room={proj.room} prefs={proj.prefs} shop={proj.shop} setShop={setShop}/></div>
        <div style={{display:tab==="Budget & score"?"block":"none"}}><BudgetScorePanel room={proj.room} prefs={proj.prefs} furniture={proj.furniture} shop={proj.shop} aiTips={aiTips} setAiTips={setAiTips}/></div>
        <div style={{display:tab==="Export"?"block":"none"}}><ExportPanel room={proj.room} prefs={proj.prefs} furniture={proj.furniture} mood={proj.mood} shop={proj.shop} svgRef={svgRef} locked={!exportsUnlocked} onUpgrade={()=>onUpgrade("export")}/></div>
      </div>
    </>
  );
}

/* ================= root app ================= */
export default function AtelierApp(){
  const [theme,setTheme]=useState("light");
  const [view,setView]=useState("landing"); // landing | studio | checkout
  const [checkoutPlan,setCheckoutPlan]=useState(null);
  const [paywall,setPaywall]=useState(null); // null | "project" | "export" | "upgrade"
  const [state,setState]=useState(null);
  const [toast,setToast]=useState("");

  useEffect(()=>{ (async()=>{
    const saved = await loadState();
    if (saved && saved.projects?.length) setState(saved);
    else { const p = newProject(1); setState({ plan:"free", passes:0, projects:[p], activeId:p.id }); }
  })(); },[]);

  // debounced persistence
  useEffect(()=>{
    if(!state) return;
    const t = setTimeout(()=>saveState(state), 600);
    return ()=>clearTimeout(t);
  },[state]);

  const startCheckout = (planKey)=>{ setPaywall(null); setCheckoutPlan(planKey); setView("checkout"); };
  const completePurchase = (planKey)=>{
    setState(s=> planKey==="home" ? {...s, plan:"home"} : {...s, passes:s.passes+1});
    setView("studio");
    setToast(planKey==="home" ? "Welcome to Whole Home — everything is unlocked. 🎉" : "Room Pass added — one more room + exports unlocked. 🎉");
    setTimeout(()=>setToast(""), 4000);
  };
  const openPaywall = (reason)=> reason==="upgrade" ? startCheckout("home") : setPaywall(reason);

  if(!state) return <div className="atl" data-theme={theme}><style>{CSS}</style><div style={{display:"flex",justifyContent:"center",padding:80}}><span className="spin" style={{width:26,height:26,borderWidth:3,color:"var(--accent)"}}/></div></div>;

  return (
    <div className="atl" data-theme={theme}>
      <style>{CSS}</style>
      <div className="atl-top">
        <span className="atl-logo" style={{cursor:"pointer"}} onClick={()=>setView("landing")}>Atelier<em>.ai</em></span>
        {view==="studio" && <span className="atl-roomname">Design studio</span>}
        <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
          {view==="landing" && <button className="btn primary" style={{padding:"8px 16px"}} onClick={()=>setView("studio")}>{state.projects.some(p=>p.furniture.length||p.mood)?"Back to my design":"Open the studio"}</button>}
          {view==="studio" && <button className="btn ghost" onClick={()=>setView("landing")}>Home</button>}
          <button className="btn ghost" onClick={()=>setTheme(t=>t==="light"?"dark":"light")} aria-label="Toggle dark mode">{theme==="light"?"🌙":"☀️"}</button>
        </div>
      </div>

      {view==="landing" && <Landing onStart={()=>setView("studio")} onBuy={startCheckout} plan={state.plan}/>}
      {view==="studio" && <Studio state={state} setState={setState} onUpgrade={openPaywall} onHome={()=>setView("landing")}/>}
      {view==="checkout" && checkoutPlan && <Checkout planKey={checkoutPlan} onDone={completePurchase} onCancel={()=>setView(state.projects.some(p=>p.furniture.length)?"studio":"landing")}/>}

      {paywall && <PaywallModal reason={paywall} onClose={()=>setPaywall(null)} onCheckout={startCheckout}/>}
      {toast && <div style={{position:"fixed",bottom:22,left:"50%",transform:"translateX(-50%)",background:"var(--accent)",color:"var(--accent-ink)",padding:"12px 20px",borderRadius:12,font:"700 14px Karla",boxShadow:"var(--shadow)",zIndex:200}} className="fade">{toast}</div>}
    </div>
  );
}
