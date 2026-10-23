<style>
/* Corrida e atividades: painel ao vivo em tela cheia, histórico e gráfico semanal. */
.run-hero{display:grid;grid-template-columns:1fr auto;gap:16px;align-items:center}
.run-start{min-height:56px;font-size:17px;padding:0 22px}
.run-types{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px}
.act-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px}
.act-t{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 6px;border-radius:14px;border:1px solid var(--glass-b);background:var(--glass);color:var(--text);font:600 13px Figtree,sans-serif;cursor:pointer}
.act-t svg{width:24px;height:24px;color:var(--accent)}
.act-t[aria-pressed="true"]{border-color:var(--accent);background:var(--accent-soft)}
.act-list{display:flex;flex-direction:column;gap:8px}
.act-row{display:grid;grid-template-columns:46px 1fr auto;gap:12px;align-items:center;padding:12px;border-radius:14px;background:var(--glass);border:1px solid var(--glass-b)}
.act-row .ai{width:46px;height:46px;border-radius:13px;display:grid;place-items:center;background:var(--accent-soft);color:var(--accent);overflow:hidden}
.act-row .ai svg{width:22px;height:22px}
.act-row .ai svg.route{width:46px;height:46px}
.act-row b{display:block}
.act-row .sub b{display:inline;color:var(--text)}
.wkm{display:flex;align-items:flex-end;gap:8px;height:140px;padding-top:8px}
.wkm div{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;height:100%;justify-content:flex-end;min-width:0}
.wkm i{display:block;width:100%;max-width:34px;border-radius:6px 6px 2px 2px;background:var(--accent);min-height:3px}
.wkm div.now i{background:var(--lime)}
.wkm span{font-size:11px;color:var(--faint);white-space:nowrap}
.wkm em{font-style:normal;font-size:11px;color:var(--muted);font-family:var(--f-mono,monospace)}
.live{position:fixed;inset:0;z-index:95;background:radial-gradient(800px 500px at 50% -10%,rgba(61,220,151,.16),transparent 60%),var(--bg);display:flex;flex-direction:column;padding:max(16px,env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) max(16px,env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px));overflow:auto}
.live-h{display:flex;align-items:center;justify-content:space-between;gap:10px}
.live-h b{font:800 18px Montserrat,sans-serif}
.gps{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;color:var(--muted)}
.gps i{width:8px;height:8px;border-radius:50%;background:var(--warn)}
.gps.ok i{background:var(--good);box-shadow:0 0 8px var(--good)}
.gps.bad i{background:var(--bad)}
.live-time{font:800 clamp(56px,18vw,96px)/1 var(--f-mono,monospace);text-align:center;margin:18px 0 6px;letter-spacing:-.02em}
.live-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0 14px}
.live-grid div{background:var(--glass);border:1px solid var(--glass-b);border-radius:14px;padding:12px 8px;text-align:center}
.live-grid b{display:block;font:800 26px var(--f-mono,monospace)}
.live-grid span{font-size:12px;color:var(--muted)}
.live-map{flex:1;min-height:180px;border-radius:18px;background:rgba(0,0,0,.25);border:1px solid var(--glass-b);display:grid;place-items:center;overflow:hidden}
.live-map svg{width:100%;height:100%}
.live-map.lf{display:block;background:#0b1a22}
.leaflet-container{background:#0b1a22;font:12px Figtree,sans-serif}
.live-map.lf svg,.leaflet-pane svg{width:auto;height:auto;max-width:none}
.leaflet-control-attribution{background:rgba(6,19,27,.75)!important;color:#8aa!important;font-size:10px}
.leaflet-control-attribution a{color:#9cc!important}
.leaflet-control-zoom a{background:#11232c!important;color:#dfe!important;border-color:#1d3540!important}
.live-btns{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}
.live-btns .btn{min-height:58px;font-size:17px}
.live-note{font-size:12.5px;color:var(--faint);text-align:center;margin-top:10px}
.splits{display:grid;grid-template-columns:auto 1fr auto;gap:4px 12px;font-size:14px}
.splits .bar{height:8px;border-radius:4px;background:var(--accent);align-self:center}
</style>
<div id="runRoot"></div>
<script>
/* ======================= CORRIDA E ATIVIDADES ======================= */
Object.assign(ICONS, {
  run:'<circle cx="14.5" cy="4.5" r="2"/><path d="M8 21l3-6 3 2v5M6.5 12.5l3-3.5 4 1 2.5 3.5 3 .5M10.5 9l-1.5 5"/>',
  walk:'<circle cx="12.5" cy="4.5" r="2"/><path d="M10 21l2-7 3 3v4M9 12l1.5-4.5L14 9l2 3M10.5 7.5L8 13"/>',
  bike:'<circle cx="6" cy="16" r="3.5"/><circle cx="18" cy="16" r="3.5"/><path d="M6 16l4-7h5l3 7M10 9l3 7h-7M13 6h3"/>',
  ball:'<circle cx="12" cy="12" r="9"/><path d="M12 7l4 3-1.5 4.5h-5L8 10zM12 7V3.5M16 10l4-1M14.5 14.5l2.5 3.5M9.5 14.5L7 18M8 10L4 9"/>',
  swim:'<path d="M2 18c2 0 2-1.5 4-1.5S8 18 10 18s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5"/><circle cx="16" cy="7" r="2"/><path d="M6 14l4-5 3 2 3-1"/>',
  bolt2:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  glove:'<path d="M7 11V7a3 3 0 0 1 3-3h4a4 4 0 0 1 4 4v5a6 6 0 0 1-6 6h-1a4 4 0 0 1-4-4v-1M7 11h5M8 21h8"/>',
  music:'<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  mountain:'<path d="M3 20l6-10 4 6 3-4 5 8z"/><path d="M9 10l2 3"/>',
  pin:'<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  pause:'<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>',
  stop:'<rect x="6" y="6" width="12" height="12" rx="2"/>'
});
const ACT_TYPES = [
  {id:"run", n:"Corrida", ic:"run", met:9.8, perKm:1.0, gps:true, maxV:8},
  {id:"walk", n:"Caminhada", ic:"walk", met:3.8, perKm:0.55, gps:true, maxV:4},
  {id:"bike", n:"Bike", ic:"bike", met:7.5, gps:true, maxV:25},
  {id:"trail", n:"Trilha", ic:"mountain", met:6.5, gps:true, maxV:5},
  {id:"soccer", n:"Futebol", ic:"ball", met:7.0},
  {id:"swim", n:"Natação", ic:"swim", met:6.0},
  {id:"hiit", n:"HIIT / funcional", ic:"bolt2", met:8.0},
  {id:"fight", n:"Luta", ic:"glove", met:9.0},
  {id:"dance", n:"Dança", ic:"music", met:5.0},
  {id:"other", n:"Outro esporte", ic:"flame", met:6.0}
];
const AT = id => ACT_TYPES.find(t => t.id === id) || ACT_TYPES[ACT_TYPES.length - 1];

/* Calorias: corrida e caminhada pela distância (kcal/kg/km), o resto pelo MET × peso × horas. */
function actKcal(type, min, km, kg){
  const t = AT(type);
  if (t.perKm && km > 0) return Math.round(t.perKm * kg * km);
  return Math.round(t.met * kg * (min || 0) / 60);
}
/* O que entra na meta do dia: desconta o que o corpo gastaria em repouso (1 MET) no mesmo tempo. */
const actNet = (a, kg) => Math.max(0, Math.round((a.kcal || 0) - kg * (a.min || 0) / 60));

const actsKey = d => "acts-" + d.slice(0, 7);
function allActs(){ return Store.keys("acts-").flatMap(k => (Store.get(k) || {}).list || []).sort((a, b) => (b.date + (b.time || "")).localeCompare(a.date + (a.time || ""))); }
const actsOn = d => ((Store.get(actsKey(d)) || {}).list || []).filter(a => a.date === d);
function saveAct(a){ const k = actsKey(a.date), doc = Store.get(k) || {list:[]}; const list = (doc.list || []).filter(x => x.id !== a.id).concat([a]); Store.put(k, {list}); }
function delAct(id){ Store.keys("acts-").forEach(k => { const doc = Store.get(k); if (doc && (doc.list || []).some(a => a.id === id)) Store.put(k, {list:doc.list.filter(a => a.id !== id)}); }); }

/* Meta do dia com as atividades extras somadas (carbo 75 %, gordura 25 %) e 500 ml de água por hora. */
function calcDay(p, d){
  const c = calc(p); if (p.addActs === false) return c;
  const acts = actsOn(d); if (!acts.length) return c;
  const net = acts.reduce((s, a) => s + actNet(a, p.weight), 0), mins = acts.reduce((s, a) => s + (a.min || 0), 0);
  const ew = Math.round(mins / 60 * 500 / 50) * 50;
  if (!net && !ew) return c;
  return Object.assign({}, c, {kcal:c.kcal + net, carb:c.carb + Math.round(net * .75 / 4), fat:c.fat + Math.round(net * .25 / 9), water:Object.assign({}, c.water, {total:c.water.total + ew}), extra:{kcal:net, water:ew, n:acts.length}});
}

const durTxt = min => { min = Math.round(min || 0); const h = Math.floor(min / 60), m = min % 60; return h ? `${h} h ${String(m).padStart(2, "0")}` : `${m} min`; };
const paceTxt = (sec, km) => { if (!km || km < 0.05) return "–"; const s = sec / km; if (!isFinite(s) || s > 3600) return "–"; return `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`; };
const clock = ms => { const s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), ss = s % 60; return (h ? h + ":" + String(m).padStart(2, "0") : String(m).padStart(2, "0")) + ":" + String(ss).padStart(2, "0"); };

function routeSVG(pts, cls = "", stroke = 3){
  if (!pts || pts.length < 2) return "";
  const lat0 = pts[0][0] * Math.PI / 180, xs = pts.map(p => p[1] * Math.cos(lat0)), ys = pts.map(p => -p[0]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const span = Math.max(maxX - minX, maxY - minY) || 1e-6, pad = span * 0.12, S = span + pad * 2;
  const ox = minX - pad - (span - (maxX - minX)) / 2, oy = minY - pad - (span - (maxY - minY)) / 2;
  const P = pts.map((p, i) => `${((xs[i] - ox) / S * 100).toFixed(2)},${((ys[i] - oy) / S * 100).toFixed(2)}`);
  const [sx, sy] = P[0].split(","), [ex, ey] = P[P.length - 1].split(",");
  return `<svg class="${cls}" ${cls ? "" : 'style="width:100%;height:100%;display:block"'} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><polyline points="${P.join(" ")}" fill="none" stroke="var(--accent)" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/><circle cx="${sx}" cy="${sy}" r="3" fill="var(--lime)"/><circle cx="${ex}" cy="${ey}" r="3" fill="#fff" stroke="var(--accent)" stroke-width="1.5"/></svg>`;
}

/* ---------- Aba ---------- */
function runTab(){
  const p = P(), acts = allActs(), ws = weekStart(), lws = addDays(ws, -7);
  const wk = acts.filter(a => a.date >= ws), lw = acts.filter(a => a.date >= lws && a.date < ws);
  const sum = (l, f) => l.reduce((s, a) => s + (+a[f] || 0), 0);
  const kmW = sum(wk, "km"), kmL = sum(lw, "km");
  const weeks = Array.from({length:8}, (_, i) => { const s = addDays(ws, -7 * (7 - i)), e = addDays(s, 7); const l = acts.filter(a => a.date >= s && a.date < e); return {s, km:sum(l, "km"), min:sum(l, "min")}; });
  const maxKm = Math.max(1, ...weeks.map(w => w.km));
  const gpsOK = "geolocation" in navigator;
  const today = actsOn(todayISO()), cd = calcDay(p, todayISO());
  return `
  <section class="panel"><div class="panel-h" style="margin-bottom:4px"><h2>${ic("run")}Bora correr?</h2></div><div class="run-hero"><div><p class="sub" style="margin:0">Tempo, distância, ritmo e trajeto ao vivo pelo GPS do celular. Ou registre algo que você já fez hoje.</p></div></div>
    <div class="run-types">${ACT_TYPES.filter(t => t.gps).map(t => `<button class="chip" data-act="runType" data-arg="${t.id}" aria-pressed="${(UI.runType || "run") === t.id}">${ic(t.ic)}${t.n}</button>`).join("")}</div>
    <div class="row" style="margin-top:14px;gap:10px;flex-wrap:wrap">
      <button class="btn primary run-start" data-act="runStart" ${gpsOK ? "" : "disabled"}>${ic("play")}Iniciar ${AT(UI.runType || "run").n.toLowerCase()} com GPS</button>
      <button class="btn run-start" data-act="actNew">${ic("plus")}Registrar atividade</button>
    </div>
    <p class="sub" style="margin:10px 0 0">${ic("info", 'style="width:14px;height:14px;vertical-align:-2px"')} Durante a corrida deixe o app aberto e a tela ligada. Se o celular bloquear a tela ou você trocar de app, o GPS pausa.</p>
  </section>
  ${today.length ? `<div class="note good">${ic("flame")}<span>Hoje: <b>${today.length} atividade${today.length > 1 ? "s" : ""}</b>, ${fmt(today.reduce((s, a) => s + (a.kcal || 0), 0))} kcal gastas. ${cd.extra && cd.extra.kcal ? `Somamos <b>+${fmt(cd.extra.kcal)} kcal</b> e <b>+${fmt(cd.extra.water)} ml</b> de água à sua meta de hoje.` : ""}</span></div>` : ""}
  <div class="grid g2">
    <section class="panel"><div class="panel-h"><h2>${ic("calendar")}Esta semana</h2></div>
      <div class="stats"><div class="stat"><span class="lbl">Distância</span><div class="v num">${fmt(kmW, 1)}<small>km</small></div><div class="d">${kmL ? (kmW >= kmL ? "+" : "") + fmt(kmW - kmL, 1) + " km vs. semana passada" : "semana passada: 0 km"}</div></div>
      <div class="stat"><span class="lbl">Tempo ativo</span><div class="v num">${durTxt(sum(wk, "min"))}</div><div class="d">${wk.length} atividade${wk.length === 1 ? "" : "s"}</div></div>
      <div class="stat"><span class="lbl">Calorias</span><div class="v num">${fmt(sum(wk, "kcal"))}<small>kcal</small></div><div class="d">estimativa por MET e peso</div></div></div>
    </section>
    <section class="panel"><div class="panel-h"><h2>${ic("up")}Km por semana</h2><span class="sub">últimas 8 semanas</span></div>
      <div class="wkm" role="img" aria-label="Quilômetros por semana">${weeks.map((w, i) => `<div class="${i === 7 ? "now" : ""}" title="Semana de ${dShort(w.s)}: ${fmt(w.km, 1)} km, ${durTxt(w.min)}"><em>${w.km ? fmt(w.km, w.km < 10 ? 1 : 0) : ""}</em><i style="height:${Math.max(2, w.km / maxKm * 100)}%"></i><span>${i === 7 ? "atual" : dShort(w.s)}</span></div>`).join("")}</div>
    </section>
  </div>
  <section class="panel"><div class="panel-h"><h2>${ic("history")}Histórico</h2><span class="sub">${acts.length} atividade${acts.length === 1 ? "" : "s"}</span></div>
    ${acts.length ? `<div class="act-list">${acts.slice(0, 40).map(actRow).join("")}</div>` : `<div class="chart-empty">${ic("run")}<b>Nenhuma atividade ainda</b><span>Faça sua primeira corrida com GPS ou registre uma caminhada, um futebol ou uma bike.</span></div>`}
  </section>
  <section class="panel"><div class="panel-h"><h2>${ic("info")}Como contamos as calorias</h2></div>
    <p class="sub" style="margin:0">Corrida: cerca de 1 kcal por kg por km. Caminhada: cerca de 0,55 kcal por kg por km. Outras atividades: MET × peso × horas. Na meta do dia somamos só o gasto acima do repouso, e o extra entra como carboidrato (75 %) e gordura (25 %), mais 500 ml de água por hora de atividade.</p>
    <label class="row" style="margin-top:12px;gap:10px;cursor:pointer"><span class="switch"><input type="checkbox" data-act="addActs" ${p.addActs === false ? "" : "checked"}><span></span></span><span>Somar atividades extras na meta de calorias e água do dia</span></label>
  </section>`;
}
function actRow(a){
  const t = AT(a.type), pace = (a.type === "run" || a.type === "walk" || a.type === "trail") && a.km ? paceTxt(a.min * 60, a.km) + " /km" : a.km && a.min ? fmt(a.km / (a.min / 60), 1) + " km/h" : "";
  return `<div class="act-row"><span class="ai">${a.track && a.track.length > 1 ? routeSVG(a.track, "route", 2) : ic(t.ic)}</span>
    <div style="min-width:0"><b>${esc(a.name || t.n)}</b><div class="sub">${a.date === todayISO() ? "Hoje" : dLabel(a.date)}${a.time ? " · " + a.time : ""} · <b>${a.km ? fmt(a.km, 2) + " km · " : ""}${durTxt(a.min)}</b>${pace ? " · " + pace : ""} · ${fmt(a.kcal)} kcal${a.src === "gps" ? " · GPS" : ""}</div></div>
    <div class="row" style="gap:4px;flex-wrap:nowrap"><button class="iconbtn" data-act="actShare" data-arg="${a.id}" aria-label="Compartilhar">${ic("link")}</button>${true ? `<button class="iconbtn" data-act="actView" data-arg="${a.id}" aria-label="Ver detalhes">${ic("list")}</button>` : ""}<button class="iconbtn" data-act="actDel" data-arg="${a.id}" aria-label="Apagar atividade">${ic("trash")}</button></div></div>`;
}

/* ---------- Registro manual ---------- */
let AF = {type:"run", date:"", time:"", min:"", km:"", name:""};
function actModal(){
  if (!AF.date) AF.date = todayISO();
  const t = AT(AF.type), kg = P().weight, kc = actKcal(AF.type, +AF.min || 0, +AF.km || 0, kg);
  openModal(`${sheetHead("Registrar atividade", "Atividade extra do dia")}
    <div class="col" style="gap:14px">
      <div class="act-grid">${ACT_TYPES.map(x => `<button class="act-t" data-act="afType" data-arg="${x.id}" aria-pressed="${AF.type === x.id}">${ic(x.ic)}${x.n}</button>`).join("")}</div>
      <div class="row" style="gap:10px;flex-wrap:wrap">
        <div class="field" style="flex:1;min-width:140px"><label for="af-date">Data</label><input id="af-date" class="input" type="date" value="${AF.date}" max="${todayISO()}" data-af="date"></div>
        <div class="field" style="flex:1;min-width:110px"><label for="af-time">Hora (opcional)</label><input id="af-time" class="input" type="time" value="${AF.time}" data-af="time"></div>
      </div>
      <div class="row" style="gap:10px;flex-wrap:wrap">
        <div class="field" style="flex:1;min-width:120px"><label for="af-min">Duração</label><div class="input-u"><input id="af-min" class="input num" type="number" inputmode="numeric" min="1" step="1" placeholder="45" value="${AF.min}" data-af="min"><span>min</span></div></div>
        ${t.gps ? `<div class="field" style="flex:1;min-width:120px"><label for="af-km">Distância</label><div class="input-u"><input id="af-km" class="input num" type="number" inputmode="decimal" min="0" step="0.01" placeholder="5" value="${AF.km}" data-af="km"><span>km</span></div></div>` : ""}
      </div>
      <div class="note"><span>${ic("flame")}</span><span id="af-kcal">${kc ? `Gasto estimado: <b>${fmt(kc)} kcal</b>${+AF.km && +AF.min && t.gps ? ` · ritmo ${paceTxt(AF.min * 60, +AF.km)} /km` : ""}` : "Informe a duração para estimar as calorias."}</span></div>
      <button class="btn primary" data-act="afSave">${ic("check")}Salvar atividade</button>
    </div>`);
}
function afPreview(){
  const t = AT(AF.type), kc = actKcal(AF.type, +AF.min || 0, +AF.km || 0, P().weight), el = $("#af-kcal");
  if (el) el.innerHTML = kc ? `Gasto estimado: <b>${fmt(kc)} kcal</b>${+AF.km && +AF.min && t.gps ? ` · ritmo ${paceTxt(AF.min * 60, +AF.km)} /km` : ""}` : "Informe a duração para estimar as calorias.";
}
document.addEventListener("input", ev => { const el = ev.target; if (el.dataset && el.dataset.af) { AF[el.dataset.af] = el.value; afPreview(); } });

/* ---------- Corrida ao vivo ---------- */
const RUN_LS = "desfr-run-live";
let RUN = null, RUN_T = null, RUN_SAVE = 0;
const hav = (a, b) => { const R = 6371000, r = Math.PI / 180, dLa = (b[0] - a[0]) * r, dLo = (b[1] - a[1]) * r, x = Math.sin(dLa / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLo / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(x)); };
function runElapsed(){ return RUN ? RUN.moving + (RUN.status === "running" ? Date.now() - RUN.since : 0) : 0; }
function runPersist(){ try { if (!RUN) { localStorage.removeItem(RUN_LS); return; } const {watch, wake, ...s} = RUN; s.moving = runElapsed(); s.since = Date.now(); localStorage.setItem(RUN_LS, JSON.stringify(s)); } catch (e) {} }
async function wakeOn(){ try { if ("wakeLock" in navigator && RUN && !RUN.wake) { RUN.wake = await navigator.wakeLock.request("screen"); RUN.wake.addEventListener("release", () => { if (RUN) RUN.wake = null; }); } } catch (e) {} }
function wakeOff(){ try { if (RUN && RUN.wake) { RUN.wake.release(); RUN.wake = null; } } catch (e) {} }
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && RUN && RUN.status === "running") wakeOn(); });

function runStart(resume){
  if (!("geolocation" in navigator)) { toast("Este aparelho não tem GPS disponível"); return; }
  closeModal();
  if (!resume) RUN = {type:UI.runType || "run", status:"running", started:Date.now(), since:Date.now(), moving:0, dist:0, pts:[], last:null, acc:null, splits:[], gpsErr:"", recent:[]};
  else { RUN.status = "paused"; }
  RUN.watch = navigator.geolocation.watchPosition(runPos, runErr, {enableHighAccuracy:true, maximumAge:0, timeout:30000});
  wakeOn(); runRender(); clearInterval(RUN_T); RUN_T = setInterval(runTick, 1000);
}
function runPos(pos){
  if (!RUN) return;
  const c = pos.coords, pt = [+c.latitude.toFixed(6), +c.longitude.toFixed(6), Date.now()];
  RUN.acc = Math.round(c.accuracy); RUN.gpsErr = ""; RUN.here = [pt[0], pt[1]]; if (LMAP && !LMAP.me) liveMapPaint();
  if (RUN.status !== "running" || c.accuracy > 40) { runPaint(); return; }
  if (RUN.last) {
    const d = hav(RUN.last, pt), dt = (pt[2] - RUN.last[2]) / 1000;
    if (d < 3) { runPaint(); return; }
    if (dt > 0 && d / dt > AT(RUN.type).maxV * 1.4) { RUN.last = pt; runPaint(); return; }
    const before = RUN.dist; RUN.dist += d;
    if (Math.floor(RUN.dist / 1000) > Math.floor(before / 1000)) runSplit();
  }
  RUN.last = pt; RUN.pts.push(pt);
  RUN.recent.push([pt[2], RUN.dist]); RUN.recent = RUN.recent.filter(r => pt[2] - r[0] <= 30000);
  runPaint();
}
function runErr(e){ if (!RUN) return; RUN.gpsErr = e.code === 1 ? "Permita a localização para este site nas configurações do navegador." : "Procurando sinal de GPS…"; runPaint(); }
function runSplit(){
  const t = runElapsed(), prev = RUN.splits.reduce((s, x) => s + x, 0), sec = Math.round(t / 1000 - prev);
  RUN.splits.push(sec);
  try { if ("speechSynthesis" in window && P().runVoice !== false) { const u = new SpeechSynthesisUtterance(`${RUN.splits.length} quilômetro${RUN.splits.length > 1 ? "s" : ""}. Ritmo ${Math.floor(sec / 60)} minutos e ${sec % 60} segundos.`); u.lang = "pt-BR"; speechSynthesis.speak(u); } } catch (e) {}
}
function runTick(){ runPaint(); if (Date.now() - RUN_SAVE > 5000) { RUN_SAVE = Date.now(); runPersist(); } }
function runStats(){
  const ms = runElapsed(), km = RUN.dist / 1000, kg = P().weight;
  const rc = RUN.recent, cur = rc.length > 1 ? (rc[rc.length - 1][1] - rc[0][1]) / 1000 : 0, curS = rc.length > 1 ? (rc[rc.length - 1][0] - rc[0][0]) / 1000 : 0;
  return {ms, km, kcal:actKcal(RUN.type, ms / 60000, km, kg), avg:paceTxt(ms / 1000, km), cur:cur > 0.02 ? paceTxt(curS, cur) : "–", kmh:ms > 0 ? km / (ms / 3600000) : 0};
}
/* Mapa de verdade (Leaflet + CARTO) no site; sem ele, cai no desenho simples. */
const HAS_MAP = () => typeof L !== "undefined" && !!window.DESFR_PWA;
function mkMap(el, interactive){
  const m = L.map(el, {zoomControl:interactive, attributionControl:true, dragging:interactive, scrollWheelZoom:false, touchZoom:interactive, doubleClickZoom:interactive, boxZoom:false, keyboard:false});
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {maxZoom:19, subdomains:"abcd", attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> © <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>'}).addTo(m);
  m.attributionControl.setPrefix(false);
  return m;
}
const ROUTE_STYLE = {color:"#3DD6F5", weight:5, opacity:.95, lineCap:"round", lineJoin:"round"};
let LMAP = null;
function liveMapInit(){
  const el = $("#rl-map"); if (!el || !HAS_MAP()) return;
  el.innerHTML = ""; el.classList.add("lf");
  const m = mkMap(el, true), c0 = RUN.here || RUN.last || [-15.79, -47.88];
  m.setView([c0[0], c0[1]], RUN.here || RUN.last ? 17 : 4);
  LMAP = {m, line:L.polyline(RUN.pts.map(p => [p[0], p[1]]), ROUTE_STYLE).addTo(m), acc:null, me:null, start:null, follow:true};
  m.on("dragstart", () => { LMAP.follow = false; });
  setTimeout(() => m.invalidateSize(), 60);
}
function liveMapPaint(){
  if (!LMAP || !RUN) return;
  const h = RUN.here; if (!h) return;
  const ll = [h[0], h[1]];
  if (!LMAP.me) { LMAP.acc = L.circle(ll, {radius:RUN.acc || 20, color:"#3DD6F5", weight:1, fillOpacity:.12}).addTo(LMAP.m); LMAP.me = L.circleMarker(ll, {radius:8, color:"#fff", weight:3, fillColor:"#3DD6F5", fillOpacity:1}).addTo(LMAP.m); LMAP.m.setView(ll, 17); }
  else { LMAP.me.setLatLng(ll); LMAP.acc.setLatLng(ll).setRadius(RUN.acc || 20); if (LMAP.follow) LMAP.m.panTo(ll, {animate:true}); }
  if (RUN.pts.length && !LMAP.start) LMAP.start = L.circleMarker([RUN.pts[0][0], RUN.pts[0][1]], {radius:6, color:"#06131B", weight:2, fillColor:"#3BE38E", fillOpacity:1}).addTo(LMAP.m);
  if (LMAP.line.getLatLngs().length !== RUN.pts.length) LMAP.line.setLatLngs(RUN.pts.map(p => [p[0], p[1]]));
}
function staticMap(el, track){
  if (!el || !HAS_MAP() || !track || track.length < 2) return;
  el.innerHTML = ""; el.classList.add("lf");
  const m = mkMap(el, true), ll = track.map(p => [p[0], p[1]]), line = L.polyline(ll, ROUTE_STYLE).addTo(m);
  L.circleMarker(ll[0], {radius:6, color:"#06131B", weight:2, fillColor:"#3BE38E", fillOpacity:1}).addTo(m);
  L.circleMarker(ll[ll.length - 1], {radius:6, color:"#06131B", weight:2, fillColor:"#fff", fillOpacity:1}).addTo(m);
  setTimeout(() => { m.invalidateSize(); m.fitBounds(line.getBounds(), {padding:[18, 18]}); }, 80);
}
function runRender(){
  const t = AT(RUN.type), bike = RUN.type === "bike";
  $("#runRoot").innerHTML = `<div class="live" role="dialog" aria-label="${t.n} ao vivo">
    <div class="live-h"><b>${ic(t.ic, 'style="width:22px;height:22px;vertical-align:-4px;color:var(--accent)"')} ${t.n}</b><span class="gps" id="rl-gps"><i></i><span>GPS</span></span></div>
    <div class="live-time num" id="rl-time">00:00</div>
    <div class="sub" style="text-align:center" id="rl-status"></div>
    <div class="live-grid">
      <div><b class="num" id="rl-km">0,00</b><span>km</span></div>
      <div><b class="num" id="rl-pace">–</b><span>${bike ? "km/h" : "ritmo /km"}</span></div>
      <div><b class="num" id="rl-kcal">0</b><span>kcal</span></div>
    </div>
    <div class="live-map" id="rl-map"><span class="sub" style="text-align:center;padding:12px">${ic("pin", 'style="width:18px;height:18px;vertical-align:-4px"')} O trajeto aparece aqui quando você começar a se mover</span></div>
    <div class="live-btns" id="rl-btns"></div>
    <div class="live-note">Deixe a tela ligada e o app aberto. Seu progresso fica salvo mesmo se a página recarregar.</div>
  </div>`;
  runButtons(); LMAP = null; liveMapInit(); runPaint();
}
function runButtons(){
  const b = $("#rl-btns"); if (!b) return;
  b.innerHTML = RUN.status === "running"
    ? `<button class="btn" data-act="runPause">${ic("pause")}Pausar</button><button class="btn primary" data-act="runFinish">${ic("stop")}Finalizar</button>`
    : `<button class="btn primary" data-act="runResume">${ic("play")}${RUN.moving ? "Continuar" : "Começar"}</button><button class="btn" data-act="runFinish">${ic("stop")}Finalizar</button>`;
}
let RUN_PTS_DRAWN = 0;
function runPaint(){
  if (!RUN || !$("#rl-time")) return;
  const s = runStats(), bike = RUN.type === "bike";
  $("#rl-time").textContent = clock(s.ms);
  $("#rl-km").textContent = fmt(s.km, 2);
  $("#rl-pace").textContent = bike ? fmt(s.kmh, 1) : s.cur !== "–" ? s.cur : s.avg;
  $("#rl-kcal").textContent = fmt(s.kcal);
  const g = $("#rl-gps"); g.className = "gps " + (RUN.gpsErr && !RUN.acc ? "bad" : RUN.acc != null && RUN.acc <= 25 ? "ok" : "");
  g.querySelector("span").textContent = RUN.acc != null ? `GPS ±${RUN.acc} m` : "Procurando GPS…";
  $("#rl-status").textContent = RUN.gpsErr || (RUN.acc == null ? "Procurando seu sinal de GPS… vá para um lugar aberto" : RUN.acc > 40 ? `Sinal fraco (±${RUN.acc} m). Em lugar aberto ele melhora` : RUN.status === "paused" ? (RUN.moving ? "Pausado" : "GPS pronto. Toque em Começar") : RUN.dist < 1 ? "Gravando… comece a se mover" : `Ritmo médio ${s.avg} /km`);
  if (LMAP) liveMapPaint(); else if (RUN.pts.length !== RUN_PTS_DRAWN && RUN.pts.length > 1) { RUN_PTS_DRAWN = RUN.pts.length; $("#rl-map").innerHTML = routeSVG(RUN.pts, "", 4); }
}
function runStop(){ try { if (LMAP) LMAP.m.remove(); } catch (e) {} LMAP = null; clearInterval(RUN_T); RUN_T = null; try { if (RUN && RUN.watch != null) navigator.geolocation.clearWatch(RUN.watch); } catch (e) {} wakeOff(); }
function simplify(pts, max = 300){ if (pts.length <= max) return pts.map(p => [p[0], p[1]]); const step = pts.length / max, out = []; for (let i = 0; i < max; i++) out.push(pts[Math.floor(i * step)]); out.push(pts[pts.length - 1]); return out.map(p => [p[0], p[1]]); }
function runFinish(){
  if (RUN.status === "running") { RUN.moving = runElapsed(); RUN.status = "paused"; }
  const s = runStats();
  runButtons();
  openModal(`${sheetHead("Finalizar " + AT(RUN.type).n.toLowerCase() + "?")}
    <div class="col" style="gap:12px">
      <div class="stats"><div class="stat"><span class="lbl">Distância</span><div class="v num">${fmt(s.km, 2)}<small>km</small></div></div><div class="stat"><span class="lbl">Tempo</span><div class="v num">${clock(s.ms)}</div></div><div class="stat"><span class="lbl">${RUN.type === "bike" ? "Média" : "Ritmo"}</span><div class="v num">${RUN.type === "bike" ? fmt(s.kmh, 1) + "<small>km/h</small>" : s.avg + "<small>/km</small>"}</div></div><div class="stat"><span class="lbl">Calorias</span><div class="v num">${fmt(s.kcal)}</div></div></div>
      ${RUN.pts.length > 1 ? `<div style="height:180px;border-radius:14px;background:rgba(0,0,0,.25)">${routeSVG(RUN.pts, "", 3)}</div>` : ""}
      <div class="field"><label for="rn-name">Nome (opcional)</label><input id="rn-name" class="input" maxlength="50" placeholder="${esc(AT(RUN.type).n)} da ${new Date().getHours() < 12 ? "manhã" : new Date().getHours() < 18 ? "tarde" : "noite"}"></div>
      <div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn primary" data-act="runSave" style="flex:1">${ic("check")}Salvar</button><button class="btn" data-act="closeModal">Voltar</button><button class="btn ghost danger" data-act="runDiscard">Descartar</button></div>
    </div>`);
}
function runSave(){
  const s = runStats(), d = new Date(RUN.started), name = (($("#rn-name") || {}).value || "").trim();
  if (s.ms < 30000) { toast("Atividade muito curta para salvar"); return; }
  const a = {id:"a" + uid(), type:RUN.type, date:iso(d), time:String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"), min:Math.round(s.ms / 60000 * 10) / 10, km:Math.round(s.km * 100) / 100, kcal:s.kcal, src:"gps", track:simplify(RUN.pts), splits:RUN.splits.slice(0, 60)};
  if (name) a.name = name;
  saveAct(a); runStop(); RUN = null; RUN_PTS_DRAWN = 0; runPersist(); $("#runRoot").innerHTML = ""; closeModal();
  UI.tab = "treino"; UI.wtab = "corrida"; render(); toast(`${AT(a.type).n} salva: ${fmt(a.km, 2)} km`); actView(a.id);
}
function actView(id){
  const a = allActs().find(x => x.id === id); if (!a) return;
  const sp = a.splits || [], mx = Math.max(1, ...sp);
  openModal(`${sheetHead(esc(a.name || AT(a.type).n), dLabel(a.date) + (a.time ? " · " + a.time : ""))}
    <div class="col" style="gap:12px">
      ${a.track && a.track.length > 1 ? `<div id="av-map" class="live-map" style="height:${HAS_MAP() ? 260 : 200}px;flex:none;border-radius:14px">${routeSVG(a.track, "", 3)}</div>` : ""}
      <div class="stats">${a.km ? `<div class="stat"><span class="lbl">Distância</span><div class="v num">${fmt(a.km, 2)}<small>km</small></div></div>` : ""}<div class="stat"><span class="lbl">Tempo</span><div class="v num">${durTxt(a.min)}</div></div>${a.km ? `<div class="stat"><span class="lbl">${a.type === "bike" ? "Média" : "Ritmo médio"}</span><div class="v num">${a.type === "bike" ? fmt(a.km / (a.min / 60), 1) + "<small>km/h</small>" : paceTxt(a.min * 60, a.km) + "<small>/km</small>"}</div></div>` : ""}<div class="stat"><span class="lbl">Calorias</span><div class="v num">${fmt(a.kcal)}</div></div></div>
      <div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn primary" style="flex:1" data-act="actShare" data-arg="${a.id}">${ic("link")}Compartilhar imagem</button>${typeof CLOUD !== "undefined" && CLOUD.sb ? `<button class="btn" style="flex:1" data-act="actPost" data-arg="${a.id}">${ic("users")}Postar na comunidade</button>` : ""}</div>
      ${sp.length ? `<p class="sub" style="margin:0">Na imagem escondemos os primeiros e os últimos 200 m do trajeto, para não mostrar onde você mora.</p>` : ""}
      ${sp.length ? `<div><b>Parciais por km</b><div class="splits" style="margin-top:8px">${sp.map((s, i) => `<span class="num">km ${i + 1}</span><span class="bar" style="width:${s / mx * 100}%"></span><span class="num">${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}</span>`).join("")}</div></div>` : ""}
    </div>`);
  staticMap($("#av-map"), a.track);
}


/* ---------- Imagem para compartilhar (1080 × 1350, formato do feed) ---------- */
function trimEnds(pts, m = 200){
  if (!pts || pts.length < 4) return pts;
  const cut = arr => { let d = 0, i = 1; for (; i < arr.length; i++) { d += hav(arr[i - 1], arr[i]); if (d >= m) break; } return i; };
  const a = cut(pts), b = pts.length - cut([...pts].reverse());
  return b - a > 2 ? pts.slice(a, b) : pts;
}
async function shareCard(a){
  const W = 1080, H = 1350, cv = document.createElement("canvas"); cv.width = W; cv.height = H; const x = cv.getContext("2d");
  try { await document.fonts.ready; } catch (e) {}
  const bg = x.createLinearGradient(0, 0, W, H); bg.addColorStop(0, "#0B2A36"); bg.addColorStop(1, "#06131B"); x.fillStyle = bg; x.fillRect(0, 0, W, H);
  const glow = x.createRadialGradient(W * .2, 0, 0, W * .2, 0, 900); glow.addColorStop(0, "rgba(61,220,151,.22)"); glow.addColorStop(1, "rgba(61,220,151,0)"); x.fillStyle = glow; x.fillRect(0, 0, W, H);
  const logo = await new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = LOGO_SRC; });
  if (logo) { x.save(); x.beginPath(); x.roundRect(72, 72, 96, 96, 24); x.clip(); x.drawImage(logo, 72, 72, 96, 96); x.restore(); }
  x.fillStyle = "#EAF4F7"; x.font = "800 40px Montserrat, sans-serif"; x.fillText("Desfrangolizador", 192, 118);
  x.fillStyle = "#9DB3BC"; x.font = "500 30px Figtree, sans-serif"; x.fillText(`${a.name || AT(a.type).n} · ${dLabel(a.date)}${a.time ? " · " + a.time : ""}`, 192, 158);
  // trajeto
  const pts = a.hideEnds === false ? a.track : trimEnds(a.track);
  const box = {x:90, y:230, w:W - 180, h:700};
  x.fillStyle = "rgba(0,0,0,.25)"; x.beginPath(); x.roundRect(box.x - 30, box.y - 30, box.w + 60, box.h + 60, 40); x.fill();
  if (pts && pts.length > 1) {
    const lat0 = pts[0][0] * Math.PI / 180, xs = pts.map(p => p[1] * Math.cos(lat0)), ys = pts.map(p => -p[0]);
    const mnX = Math.min(...xs), mxX = Math.max(...xs), mnY = Math.min(...ys), mxY = Math.max(...ys);
    const sc = Math.min(box.w / ((mxX - mnX) || 1e-6), box.h / ((mxY - mnY) || 1e-6)) * .92;
    const ox = box.x + (box.w - (mxX - mnX) * sc) / 2, oy = box.y + (box.h - (mxY - mnY) * sc) / 2;
    const P = xs.map((v, i) => [ox + (v - mnX) * sc, oy + (ys[i] - mnY) * sc]);
    const grd = x.createLinearGradient(box.x, box.y, box.x + box.w, box.y + box.h); grd.addColorStop(0, "#3DDC97"); grd.addColorStop(1, "#3CC8E6");
    x.strokeStyle = grd; x.lineWidth = 14; x.lineCap = "round"; x.lineJoin = "round"; x.shadowColor = "rgba(60,200,230,.6)"; x.shadowBlur = 24;
    x.beginPath(); P.forEach(([px, py], i) => i ? x.lineTo(px, py) : x.moveTo(px, py)); x.stroke(); x.shadowBlur = 0;
    [[P[0], "#3DDC97"], [P[P.length - 1], "#FFFFFF"]].forEach(([q, col]) => { x.fillStyle = col; x.beginPath(); x.arc(q[0], q[1], 16, 0, Math.PI * 2); x.fill(); });
  } else {
    x.fillStyle = "#3CC8E6"; x.font = "900 120px Montserrat, sans-serif"; x.textAlign = "center"; x.fillText(AT(a.type).n.toUpperCase(), W / 2, box.y + box.h / 2 + 40); x.textAlign = "left";
  }
  // números
  const bike = a.type === "bike", stats = [];
  if (a.km) stats.push([fmt(a.km, 2), "km"]);
  stats.push([durTxt(a.min), "tempo"]);
  if (a.km) stats.push(bike ? [fmt(a.km / (a.min / 60), 1), "km/h"] : [paceTxt(a.min * 60, a.km), "ritmo /km"]);
  stats.push([fmt(a.kcal), "kcal"]);
  const colW = (W - 144) / stats.length;
  stats.forEach(([v, l], i) => {
    const cx = 72 + colW * i + colW / 2; x.textAlign = "center";
    x.fillStyle = "#EAF4F7"; x.font = `800 ${stats.length > 3 ? 64 : 76}px Montserrat, sans-serif`; x.fillText(v, cx, 1080);
    x.fillStyle = "#9DB3BC"; x.font = "600 30px Figtree, sans-serif"; x.fillText(l, cx, 1128);
  });
  x.textAlign = "left";
  x.fillStyle = "#3DDC97"; x.font = "800 34px Montserrat, sans-serif"; x.fillText("Saindo do modo frango 🔥", 72, 1250);
  x.fillStyle = "#6E8791"; x.font = "500 26px Figtree, sans-serif"; x.fillText("fernandocruzjr.github.io/Desfrangolizador", 72, 1292);
  const blob = await new Promise(r => cv.toBlob(r, "image/png"));
  const file = new File([blob], `desfrangolizador-${a.type}-${a.date}.png`, {type:"image/png"});
  const text = `${AT(a.type).n}${a.km ? " de " + fmt(a.km, 2) + " km" : ""} em ${durTxt(a.min)} no Desfrangolizador 🔥`;
  try { if (navigator.canShare && navigator.canShare({files:[file]})) { await navigator.share({files:[file], text}); return; } } catch (e) { if (e && e.name === "AbortError") return; }
  await saveBlob(blob, file.name, "Imagem salva. Agora é só postar!");
}

Object.assign(ACT, {
  runType: el => { UI.runType = el.dataset.arg; render(); },
  runStart: () => runStart(false),
  runPause: () => { RUN.moving = runElapsed(); RUN.status = "paused"; runButtons(); runPaint(); runPersist(); },
  runResume: () => { RUN.since = Date.now(); RUN.status = "running"; RUN.last = null; RUN.recent = []; runButtons(); wakeOn(); runPaint(); },
  runFinish: () => runFinish(),
  runSave: () => runSave(),
  runDiscard: () => confirmBox("Descartar atividade?", "O tempo e o trajeto desta atividade serão apagados.", "Descartar", () => { runStop(); RUN = null; RUN_PTS_DRAWN = 0; runPersist(); $("#runRoot").innerHTML = ""; render(); }),
  actNew: () => { AF = {type:"run", date:todayISO(), time:"", min:"", km:"", name:""}; actModal(); },
  afType: el => { AF.type = el.dataset.arg; if (!AT(AF.type).gps) AF.km = ""; actModal(); },
  afSave: () => {
    const min = +AF.min, km = +AF.km || 0;
    if (!(min > 0)) { toast("Informe a duração em minutos"); return; }
    const a = {id:"a" + uid(), type:AF.type, date:AF.date || todayISO(), min, kcal:actKcal(AF.type, min, km, P().weight), src:"manual"};
    if (AF.time) a.time = AF.time; if (km > 0) a.km = Math.round(km * 100) / 100;
    saveAct(a); closeModal(); render(); toast(`${AT(a.type).n} registrada: ${fmt(a.kcal)} kcal`);
  },
  actDel: el => confirmBox("Apagar atividade?", "Ela sai do histórico e da meta do dia.", "Apagar", () => { delAct(el.dataset.arg); render(); }),
  actView: el => actView(el.dataset.arg),
  actShare: el => { const a = allActs().find(x => x.id === el.dataset.arg); if (a) { toast("Gerando imagem…"); shareCard(a); } },
  addActs: el => { setP({addActs: el.checked}); render(); },
  qAct: () => { closeModal(); UI.tab = "treino"; UI.wtab = "corrida"; render(); ACT.actNew(); },
  qRun: () => { closeModal(); UI.tab = "treino"; UI.wtab = "corrida"; render(); }
});

/* Corrida em andamento antes de recarregar a página: oferece continuar. */
(() => {
  let s = null; try { s = JSON.parse(localStorage.getItem(RUN_LS) || "null"); } catch (e) {}
  if (!s || !s.started || Date.now() - s.started > 6 * 3600000) { try { localStorage.removeItem(RUN_LS); } catch (e) {} return; }
  RUN = Object.assign(s, {status:"paused", watch:null, wake:null, last:null, recent:[]});
  runStart(true);
  toast("Sua atividade em andamento foi recuperada. Toque em Continuar.");
})();
if (UI.tab === "treino" || UI.tab === "inicio" || UI.tab === "dieta") render();
</script>
