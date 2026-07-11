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
.atl{min-height:100vh;background:var(--bg);color:var(--ink);font-family:'Karla',sans-serif;font-size:15px;line-height:1.5;-webkit-font-smoothing:antialiased;transition:background .3s,color .3s}
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

/* ---------------- AI helpers ---------------- */
async function askClaude(messages) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages }),
  });
  if (!res.ok) throw new Error("AI request failed (" + res.status + ")");
  const data = await res.json();
  return (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
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
function PlanCanvas({ room, furniture, setFurniture, selId, setSelId, svgRef }) {
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
          return (
            <g key={f.id} className="fitem" onPointerDown={(e)=>down(e,f)}>
              <rect x={pad+f.x*scale} y={pad+f.y*scale} width={f.w*scale} height={f.h*scale} rx={f.cat==="plant"?f.w*scale/2:5}
                    fill={fill} fillOpacity={f.cat==="rug"?0.45:0.78}
                    stroke={sel?"var(--brass)":"var(--plan)"} strokeWidth={sel?2.5:1.2} strokeOpacity={sel?1:0.55}/>
              {f.keep && <circle cx={pad+f.x*scale+7} cy={pad+f.y*scale+7} r={3.5} fill="var(--brass)"/>}
              <text x={pad+(f.x+f.w/2)*scale} y={pad+(f.y+f.h/2)*scale+3} textAnchor="middle"
                    fontSize={Math.max(7.5, Math.min(11, f.w*scale/8))} fill="#fff" fontFamily="Karla" fontWeight="700"
                    style={{pointerEvents:"none",textShadow:"0 1px 2px rgba(0,0,0,.45)"}}>{f.name}</text>
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
function BriefPanel({ room, setRoom, prefs, setPrefs, go }) {
  const set = k => e => setRoom(r => ({ ...r, [k]: e.target.value }));
  const setP = k => e => setPrefs(p => ({ ...p, [k]: e.target.value }));
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
        <div style={{marginTop:18}}>
          <button className="btn primary" onClick={go}>Continue to floor plan →</button>
        </div>
      </div>
    </div>
  );
}

function PlanPanel({ room, prefs, furniture, setFurniture, svgRef }) {
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
        <PlanCanvas room={room} furniture={furniture} setFurniture={setFurniture} selId={selId} setSelId={setSelId} svgRef={svgRef}/>
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
        <table className="tbl"><thead><tr><th>Category</th><th>Item</th><th>Colour / material</th><th>Note</th><th style={{textAlign:"right"}}>Price</th></tr></thead>
          <tbody>{rows.map((i,k)=>(
            <tr key={k}><td>{i.category}</td><td style={{fontWeight:700}}>{i.sustainable?"♻ ":""}{i.name}</td>
            <td style={{color:"var(--muted)"}}>{[i.colour,i.material].filter(Boolean).join(" · ")}</td>
            <td style={{color:"var(--muted)",fontSize:13}}>{i.note}</td>
            <td style={{textAlign:"right",fontWeight:700}}>${(+i.price||0).toLocaleString()}</td></tr>))}
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

function ExportPanel({ room, prefs, furniture, mood, shop, svgRef }) {
  const dl = (name, content, type) => {
    const url = URL.createObjectURL(new Blob([content],{type}));
    const a = document.createElement("a"); a.href=url; a.download=name; a.click();
    URL.revokeObjectURL(url);
  };
  const report = () => {
    const scores = computeScores(room,prefs,furniture);
    const md = `# Design Report — ${room.name||room.type}\n\n## Brief\n${roomBrief(room,prefs)}\n\n## Furniture plan\n${furnitureBrief(furniture)}\n\n## Mood board\n${mood?`Concept: ${mood.concept}\nPalette: ${(mood.palette||[]).map(c=>`${c.name} ${c.hex} (${c.use})`).join(", ")}\nMaterials: ${(mood.materials||[]).join("; ")}`:"Not generated yet."}\n\n## Shopping list\n${shop?shop.map(i=>`- ${i.category}: ${i.name} — $${i.price}`).join("\n"):"Not generated yet."}\n\n## Scores\n${Object.entries(scores).filter(([k])=>!k.startsWith("_")).map(([k,v])=>`- ${k}: ${v}/100`).join("\n")}\n\n_Generated with Atelier AI._`;
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
  return (
    <div className="card fade">
      <span className="tag">Export</span>
      <h2>Take your design with you</h2>
      <p className="sub">Downloads are generated from your current plan, mood board and shopping list.</p>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        <button className="btn primary" onClick={report}>📄 Design report (.md)</button>
        <button className="btn" onClick={csv} disabled={!shop}>🛒 Shopping list (.csv)</button>
        <button className="btn" onClick={svg}>📐 Floor plan (.svg)</button>
      </div>
      {!shop && <p className="sub" style={{marginTop:10}}>Generate a shopping list first to enable the CSV export.</p>}
    </div>
  );
}

/* ---------------- app shell ---------------- */
const TABS = ["Brief","Floor plan","Chat designer","Mood board","Shopping","Budget & score","Export"];

export default function AtelierApp(){
  const [theme,setTheme]=useState("light");
  const [tab,setTab]=useState("Brief");
  const [room,setRoom]=useState({type:"Living Room",name:"",length:5,width:4,height:2.7,ceiling:"Flat",windows:"",doors:"",builtIns:""});
  const [prefs,setPrefs]=useState({style:"Japandi",palette:"",budget:5000,occupants:2,storage:"Moderate",accessibility:"",brands:"",pets:false,children:false});
  const [furniture,setFurniture]=useState([]);
  const [mood,setMood]=useState(null);
  const [shop,setShop]=useState(null);
  const [aiTips,setAiTips]=useState("");
  const svgRef=useRef(null);

  return (
    <div className="atl" data-theme={theme}>
      <style>{CSS}</style>
      <div className="atl-top">
        <span className="atl-logo">Atelier<em>.ai</em></span>
        <span className="atl-roomname">{room.name||room.type} · {prefs.style}</span>
        <button className="btn ghost" style={{marginLeft:"auto"}} onClick={()=>setTheme(t=>t==="light"?"dark":"light")} aria-label="Toggle dark mode">{theme==="light"?"🌙":"☀️"}</button>
      </div>
      <div className="atl-tabs" role="tablist">
        {TABS.map(t=><button key={t} role="tab" aria-selected={tab===t} className={"atl-tab"+(tab===t?" on":"")} onClick={()=>setTab(t)}>{t}</button>)}
      </div>
      <div className="atl-main">
        <div style={{display:tab==="Brief"?"block":"none"}}><BriefPanel room={room} setRoom={setRoom} prefs={prefs} setPrefs={setPrefs} go={()=>setTab("Floor plan")}/></div>
        <div style={{display:tab==="Floor plan"?"block":"none"}}><PlanPanel room={room} prefs={prefs} furniture={furniture} setFurniture={setFurniture} svgRef={svgRef}/></div>
        <div style={{display:tab==="Chat designer"?"block":"none"}}><ChatPanel room={room} prefs={prefs} furniture={furniture}/></div>
        <div style={{display:tab==="Mood board"?"block":"none"}}><MoodPanel room={room} prefs={prefs} mood={mood} setMood={setMood}/></div>
        <div style={{display:tab==="Shopping"?"block":"none"}}><ShopPanel room={room} prefs={prefs} shop={shop} setShop={setShop}/></div>
        <div style={{display:tab==="Budget & score"?"block":"none"}}><BudgetScorePanel room={room} prefs={prefs} furniture={furniture} shop={shop} aiTips={aiTips} setAiTips={setAiTips}/></div>
        <div style={{display:tab==="Export"?"block":"none"}}><ExportPanel room={room} prefs={prefs} furniture={furniture} mood={mood} shop={shop} svgRef={svgRef}/></div>
      </div>
    </div>
  );
}
