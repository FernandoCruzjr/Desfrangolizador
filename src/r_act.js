<script>
function strengthPanel(ss){
  const cnt = {}; ss.forEach(s => s.ex.forEach(e => cnt[e.id] = (cnt[e.id] || 0) + 1));
  const ids = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a]);
  if (!ids.length) return "";
  if (!ids.includes(UI.strEx)) UI.strEx = ids[0];
  const pts = [...ss].reverse().filter(s => s.ex.some(e => e.id === UI.strEx)).map(s => { const e = s.ex.find(x => x.id === UI.strEx); return {x:s.date, y:Math.round(Math.max(0, ...e.sets.map(st => e1rm(+st.kg || 0, +st.r || 0))) * 10) / 10}; }).filter(p => p.y > 0);
  const best = pts.length ? Math.max(...pts.map(p => p.y)) : 0, first = pts[0], last = pts[pts.length - 1];
  const stalled = pts.length >= 3 && last.y <= Math.max(...pts.slice(0, -1).map(p => p.y)) && pts.slice(-3).every((p, i, a) => !i || p.y <= a[0].y);
  return `<section class="panel"><div class="panel-h"><h2>${ic("up")}Histórico de sobrecarga</h2><span class="sub">1RM estimado (Epley) por sessão</span></div>
    <div class="chips" style="margin-bottom:10px">${ids.map(id => `<button class="chip" data-act="strEx" data-arg="${id}" aria-pressed="${UI.strEx === id}">${esc((EX[id] || {}).n || id)}</button>`).join("")}</div>
    ${lineChart(pts, {h:200, unit:"kg", label:"1RM estimado", empty:"Registre cargas para ver sua força", emptySub:"Use o campo de carga nas séries."})}
    ${pts.length >= 2 ? `<p class="sub" style="margin-top:8px">Recorde: <b class="num">${fmt(best, 1)} kg</b> · variação desde a primeira sessão: <b class="num">${last.y - first.y >= 0 ? "+" : ""}${fmt(last.y - first.y, 1)} kg</b>.</p>` : ""}
    ${stalled ? `<div class="note warn" style="margin-top:8px">${ic("alert")}<span><b>Estagnação nas últimas 3 sessões.</b> Tente: subir 1–2 reps antes da carga, trocar por uma variação por 4 semanas, ou revisar sono e calorias.</span></div>` : ""}</section>`;
}
Object.assign(ACT, {
  quick: () => quickModal(),
  qAddFood: () => { closeModal(); UI.date = todayISO(); UI.tab = "dieta"; render(); UI.q = ""; openPicker(nextMealIndex(getDay(UI.date))); },
  qPhotoFood: () => { UI.date = todayISO(); UI.tab = "dieta"; render(); AIF = {file:null, url:"", items:null, mode:"prato", m:nextMealIndex(getDay(UI.date))}; aiFoodModal(); },
  qWater: () => { closeModal(); const day = getDay(todayISO()); day.water = (day.water || 0) + 250; saveDay(todayISO(), day); render(); toast("+250 ml de água"); },
  qTrain: () => { closeModal(); UI.tab = "treino"; UI.wtab = "treinar"; render(); },
  qWeight: () => { closeModal(); go("evolucao", "mform"); setTimeout(() => { const i = $("#m-weight"); if (i) i.focus(); }, 300); },
  qProgress: () => photoModal(),
  qPlano: () => { closeModal(); go("plano"); },
  qRem: () => { closeModal(); go("plano", "rotina"); },
  pdf: () => { closeModal(); exportPDF(); },
  badges: () => badgesModal(),
  aiReport: () => aiReport(),
  openAgenda: () => agendaModal(),
  suppDone: el => { const d = el.dataset.d || todayISO(), day = getDay(d); day.supps = Object.assign({}, day.supps || {}); day.supps[el.dataset.arg] = !day.supps[el.dataset.arg]; saveDay(d, day); if (el.dataset.close) document.getElementById("remRoot").innerHTML = ""; render(); },
  addSupp: el => { const ss = JSON.parse(JSON.stringify(P().supps || [])); const n = el.dataset.arg || ""; const dose = {"Creatina":"5 g","Whey protein":"30 g","Pré-treino":"1 dose","Ômega 3":"2 cápsulas","Cafeína":"200 mg","Vitamina D":"2.000 UI"}[n] || ""; ss.push({id:"s" + uid(), n, dose, time:"08:00", on:true}); setP({supps: ss}); render(); setTimeout(() => { const el2 = document.getElementById("supps"); if (el2) el2.scrollIntoView({block:"center"}); }, 30); },
  delSupp: el => { const ss = JSON.parse(JSON.stringify(P().supps || [])); ss.splice(+el.dataset.arg, 1); setP({supps: ss}); render(); },
  swapItem: el => swapFoodModal(+el.dataset.m, +el.dataset.i, "kcal"),
  swapMode: el => swapFoodModal(+el.dataset.m, +el.dataset.i, el.dataset.v),
  doSwap: el => { const f = findFood(el.dataset.f), g = +el.dataset.g, mi = +el.dataset.m, ii = +el.dataset.i; closeModal(); updDay(day => { day.meals[mi].items[ii] = {fid:f.id, n:f.n, k:f.k, p:f.p, c:f.c, f:f.f, g}; }); toast(`Trocado por ${g} g de ${f.n}`); },
  swapEx: el => swapExModal(+el.dataset.arg),
  doSwapEx: el => { const d = draft(), ei = +el.dataset.e; d.ex[ei].id = el.dataset.arg; saveDraft(d); closeModal(); render(); toast("Exercício trocado: " + EX[el.dataset.arg].n); },
  aiFood: el => { AIF = {file:null, url:"", items:null, mode:"prato", m:+el.dataset.m}; aiFoodModal(); },
  aiMode: el => { AIF.mode = el.dataset.v; aiFoodModal(); },
  aiRun: () => aiRun(),
  aiReset: () => { AIF.items = null; AIF.file = null; AIF.url = ""; aiFoodModal(); },
  aiAdd: () => { const items = AIF.items.filter(x => x.on && x.g > 0); if (!items.length) { toast("Nenhum item selecionado"); return; } const day = getDay(UI.date), meal = day.meals[AIF.m] || day.meals[0]; items.forEach(x => meal.items.push({fid:x.fid, n:x.n, k:x.k, p:x.p, c:x.c, f:x.f, g:x.g})); saveDay(UI.date, day); closeModal(); UI.tab = "dieta"; render(); toast(`${items.length} alimento(s) adicionados`); },
  photoNew: () => photoModal(),
  phSel: el => { const k = el.dataset.arg, i = UI.sel.indexOf(k); if (i >= 0) UI.sel.splice(i, 1); else { UI.sel.push(k); if (UI.sel.length > 2) UI.sel.shift(); } render(); },
  gridToggle: () => { UI.gridOn = !UI.gridOn; render(); },
  delPhotos: () => confirmBox("Apagar fotos?", `${UI.sel.length} foto(s) selecionada(s) serão apagadas da sua conta.`, "Apagar", () => { UI.sel.forEach(k => Store.del(k)); UI.sel = []; render(); }),
  scrollForm: () => { const f = document.getElementById("mform"); if (f) f.scrollIntoView({behavior:"smooth", block:"start"}); },
  saveTpl: () => { const d = draft(); if (!d.ex.length) { toast("Adicione exercícios antes de salvar"); return; } const doc = Store.get("tpls") || {list:[]}; const list = (doc.list || []).concat([{id:"t" + uid(), n:d.name || "Minha ficha", d:d.ex.map(e => (EX[e.id] || {}).n).slice(0, 3).join(", ") + (d.ex.length > 3 ? "…" : ""), ex:d.ex.map(e => e.id), custom:true}]); Store.put("tpls", {list}); toast("Ficha salva em Começar um treino"); },
  delTpl: (el, ev) => { ev.stopPropagation(); confirmBox("Excluir ficha?", "A ficha sai da lista e da agenda.", "Excluir", () => { const doc = Store.get("tpls") || {list:[]}; Store.put("tpls", {list:(doc.list || []).filter(t => t.id !== el.dataset.arg)}); const ag = Object.assign({}, P().agenda || {}); Object.keys(ag).forEach(k => { if (ag[k] === el.dataset.arg) delete ag[k]; }); setP({agenda: ag}); render(); }); },
  strEx: el => { UI.strEx = el.dataset.arg; render(); }
});
</script>
