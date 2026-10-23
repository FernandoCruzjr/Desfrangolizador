<style>
.fcard{background:var(--glass);border:1px solid var(--glass-b);border-radius:18px;padding:14px;display:flex;flex-direction:column;gap:10px}
.fcard-h{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.fcard-h h3{margin:0;font:800 17px var(--f-display);flex:1 1 220px;min-width:0}
.fdays{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px}
.fday{display:flex;gap:10px;align-items:center;text-align:left;background:rgba(0,0,0,.22);border:1px solid var(--glass-b);border-radius:14px;padding:10px;color:var(--text);cursor:pointer;font:inherit}
.fday:hover{border-color:var(--accent)}
.fl{width:34px;height:34px;border-radius:10px;background:var(--flame);color:var(--on-accent);display:grid;place-items:center;font:800 16px var(--f-display);flex:none}
.fday b{display:block;font-size:14px}.fday span span{font-size:12.5px;color:var(--muted)}
.fed-day{background:var(--glass);border:1px solid var(--glass-b);border-radius:18px;padding:12px;display:flex;flex-direction:column;gap:8px}
.fed-row{display:grid;grid-template-columns:minmax(0,1fr) 58px 76px auto;gap:6px;align-items:center;padding:6px 0;border-bottom:1px solid var(--glass-b)}
.fed-row:last-of-type{border-bottom:0}
.fed-row .n{font-weight:600;font-size:14px;line-height:1.25}.fed-row .n small{display:block;color:var(--faint);font-weight:500;font-size:12px}
.fed-row .input{padding:8px 6px;text-align:center;min-width:0}
.fed-row .row{flex-wrap:nowrap;gap:0}
.fed-row .iconbtn{width:32px;height:32px}
.subchips{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 10px}
.seg.scroll{max-width:100%;overflow-x:auto;flex-wrap:nowrap;scrollbar-width:none}.seg.scroll::-webkit-scrollbar{display:none}.seg.scroll button{flex:none}
@media (max-width:560px){.fed-row{grid-template-columns:minmax(0,1fr) 48px 66px auto}.fed-row .iconbtn{width:28px;height:28px}}
</style>
<script>
/* ======================= MINHAS FICHAS (A, B, C…) ======================= */
const LETTERS = "ABCDEF";
const FX = (id, s, r) => ({id, s, r});
const PROGS = [
  {id:"ppl", n:"ABC · Empurrar, Puxar, Pernas", lvl:"Intermediário", d:"3 a 6 dias por semana. Cada músculo 1 a 2 vezes.", days:[
    {n:"Peito, ombros e tríceps", ex:[FX("supino-reto",4,"6–10"),FX("supino-inclinado-halter",3,"8–12"),FX("crossover-alto",3,"12–15"),FX("desenv-halter",3,"8–12"),FX("elev-lateral",4,"12–15"),FX("triceps-corda",3,"10–15"),FX("triceps-overhead-polia",3,"10–15")]},
    {n:"Costas, bíceps e posterior de ombro", ex:[FX("barra-fixa",3,"6–10"),FX("remada-curvada",4,"8–10"),FX("puxada-triangulo",3,"10–12"),FX("remada-baixa",3,"10–12"),FX("face-pull",3,"12–15"),FX("rosca-direta",3,"8–12"),FX("rosca-martelo",3,"10–12")]},
    {n:"Pernas completas", ex:[FX("agachamento",4,"6–10"),FX("leg-press",3,"10–12"),FX("stiff",3,"8–10"),FX("cadeira-extensora",3,"12–15"),FX("mesa-flexora",3,"10–12"),FX("hip-thrust",3,"8–12"),FX("pant-pe",4,"10–15")]}]},
  {id:"abc", n:"ABC clássico", lvl:"Iniciante a intermediário", d:"3 dias por semana (ou 6, repetindo).", days:[
    {n:"Peito e tríceps", ex:[FX("supino-reto",4,"8–10"),FX("supino-inclinado-halter",3,"8–12"),FX("peck-deck",3,"12–15"),FX("crossover-alto",3,"12–15"),FX("triceps-barra-polia",3,"10–12"),FX("triceps-frances",3,"10–12")]},
    {n:"Costas e bíceps", ex:[FX("puxada-frontal",4,"8–12"),FX("remada-curvada",3,"8–10"),FX("remada-unilateral",3,"10–12"),FX("pulldown-braco-reto",3,"12–15"),FX("rosca-w",3,"8–12"),FX("rosca-alternada",3,"10–12")]},
    {n:"Pernas e ombros", ex:[FX("agachamento",4,"8–10"),FX("leg-press",3,"10–12"),FX("cadeira-extensora",3,"12–15"),FX("mesa-flexora",3,"10–12"),FX("desenv-halter",3,"8–12"),FX("elev-lateral",3,"12–15"),FX("pant-pe",3,"12–15")]}]},
  {id:"abcd", n:"ABCD", lvl:"Intermediário", d:"4 dias por semana, com peito e perna divididos por região.", days:[
    {n:"Peito (superior, médio e inferior) e tríceps", ex:[FX("supino-inclinado-barra",4,"6–10"),FX("supino-reto-halter",3,"8–12"),FX("crossover-baixo",3,"12–15"),FX("crossover-alto",3,"12–15"),FX("triceps-corda",3,"10–15"),FX("triceps-testa",3,"8–12")]},
    {n:"Costas e bíceps", ex:[FX("barra-fixa",3,"6–10"),FX("remada-cavalinho",4,"8–10"),FX("puxada-supinada",3,"10–12"),FX("remada-maquina",3,"10–12"),FX("rosca-direta",3,"8–12"),FX("rosca-inclinada",3,"10–12")]},
    {n:"Perna · quadríceps e panturrilha", ex:[FX("agachamento",4,"6–10"),FX("hack",3,"8–12"),FX("bulgaro",3,"8–10"),FX("cadeira-extensora",3,"12–15"),FX("pant-pe",4,"10–15"),FX("pant-sentado",3,"12–20")]},
    {n:"Ombros, posterior de coxa e glúteos", ex:[FX("desenv-barra",4,"6–10"),FX("elev-lateral",4,"12–15"),FX("voador-inverso",3,"12–15"),FX("stiff",3,"8–10"),FX("mesa-flexora",3,"10–12"),FX("hip-thrust",3,"8–12")]}]},
  {id:"abcde", n:"ABCDE", lvl:"Avançado", d:"5 dias, um grupo grande por dia e muito volume por sessão.", days:[
    {n:"Peito", ex:[FX("supino-reto",4,"6–8"),FX("supino-inclinado-halter",4,"8–10"),FX("supino-declinado",3,"8–10"),FX("peck-deck",3,"12–15"),FX("crossover-baixo",3,"12–15")]},
    {n:"Costas", ex:[FX("barra-fixa",4,"6–10"),FX("remada-curvada",4,"8–10"),FX("puxada-triangulo",3,"10–12"),FX("remada-unilateral",3,"10–12"),FX("pullover-halter",3,"10–12"),FX("encolhimento",3,"10–15")]},
    {n:"Ombros e abdômen", ex:[FX("desenv-halter",4,"8–10"),FX("elev-lateral",4,"12–15"),FX("elev-lateral-polia",3,"12–15"),FX("crucifixo-inverso",3,"12–15"),FX("abdominal-polia",3,"10–15"),FX("prancha-lateral",3,"30 s")]},
    {n:"Pernas", ex:[FX("agachamento",4,"6–8"),FX("leg-press",4,"10–12"),FX("stiff",4,"8–10"),FX("cadeira-extensora",3,"12–15"),FX("cadeira-flexora",3,"10–12"),FX("pant-pe",4,"10–15")]},
    {n:"Braços", ex:[FX("rosca-direta",3,"8–10"),FX("supino-fechado",3,"6–10"),FX("rosca-inclinada",3,"10–12"),FX("triceps-overhead-polia",3,"10–12"),FX("rosca-martelo",3,"10–12"),FX("triceps-corda",3,"12–15")]}]},
  {id:"ul", n:"AB · Superior e Inferior", lvl:"Iniciante a intermediário", d:"4 dias por semana: A, B, descanso, A, B.", days:[
    {n:"Superior", ex:[FX("supino-reto",4,"6–10"),FX("remada-curvada",4,"8–10"),FX("desenv-halter",3,"8–12"),FX("puxada-frontal",3,"10–12"),FX("elev-lateral",3,"12–15"),FX("rosca-alternada",2,"10–12"),FX("triceps-corda",2,"10–15")]},
    {n:"Inferior", ex:[FX("agachamento",4,"6–10"),FX("stiff",3,"8–10"),FX("leg-press",3,"10–12"),FX("mesa-flexora",3,"10–12"),FX("pant-pe",4,"10–15"),FX("prancha",3,"40 s")]}]},
  {id:"fb", n:"AB · Corpo inteiro (iniciante)", lvl:"Iniciante", d:"3 dias por semana alternando A e B.", days:[
    {n:"Corpo inteiro A", ex:[FX("goblet",3,"10–12"),FX("supino-reto-halter",3,"8–12"),FX("puxada-frontal",3,"10–12"),FX("desenv-maquina",2,"10–12"),FX("mesa-flexora",2,"10–12"),FX("prancha",3,"30 s")]},
    {n:"Corpo inteiro B", ex:[FX("leg-press",3,"10–12"),FX("supino-inclinado-maquina",3,"10–12"),FX("remada-maquina",3,"10–12"),FX("elev-lateral",2,"12–15"),FX("ponte-gluteo",3,"12–15"),FX("dead-bug",3,"10")]}]}
];
const FD = () => Store.get("fichas") || {list:[]};
const saveFD = d => Store.put("fichas", d);
const fichaById = id => FD().list.find(f => f.id === id);
function fichaTemplates(){
  const out = [];
  FD().list.forEach(f => f.days.forEach((d, i) => out.push({id:`f:${f.id}:${i}`, n:`${f.n} · Treino ${LETTERS[i]}`, d:d.n, ex:d.ex.map(x => x.id), sets:d.ex.map(x => +x.s || 0), reps:d.ex.map(x => x.r || ""), ficha:true})));
  return out;
}
const progPreview = p => p.days.map((d, i) => `<b>${LETTERS[i]}</b> ${esc(d.n)}`).join(" · ");
function fichasTab(){
  const fd = FD(), ed = UI.fEdit && fichaById(UI.fEdit);
  if (ed) return fichaEditor(ed);
  return `<section class="panel"><div class="panel-h"><h2>${ic("list")}Minhas fichas</h2><button class="btn primary sm" data-act="fNew">${ic("plus")}Criar ficha</button></div>
      ${fd.list.length ? `<div class="col" style="gap:12px">${fd.list.map(f => `<div class="fcard"><div class="fcard-h"><h3>${esc(f.n)}</h3><button class="btn sm" data-act="fEdit" data-arg="${f.id}">${ic("edit")}Editar</button><button class="btn sm ghost" data-act="fAgenda" data-arg="${f.id}">${ic("calendar")}Colocar na agenda</button><button class="iconbtn" data-act="fDel" data-arg="${f.id}" aria-label="Excluir ficha">${ic("trash")}</button></div>
        <div class="fdays">${f.days.map((d, i) => `<button class="fday" data-act="startTpl" data-arg="f:${f.id}:${i}"><span class="fl">${LETTERS[i]}</span><span style="min-width:0"><b>${esc(d.n || "Treino " + LETTERS[i])}</b><span>${d.ex.length} exercícios · toque para treinar</span></span></button>`).join("")}</div></div>`).join("")}</div>`
      : `<div class="chart-empty">${ic("list")}<b>Você ainda não tem ficha</b><span>Crie do zero ou use uma das sugestões abaixo e ajuste do seu jeito.</span></div>`}
    </section>
    <section class="panel"><div class="panel-h"><h2>${ic("star")}Fichas sugeridas</h2><span class="sub">Toque em Usar e depois edite à vontade</span></div>
      <div class="col" style="gap:10px">${PROGS.map(p => `<div class="fcard"><div class="fcard-h"><h3>${esc(p.n)}</h3><span class="pill">${esc(p.lvl)}</span><button class="btn sm ghost" data-act="fPreview" data-arg="${p.id}">Ver exercícios</button><button class="btn sm primary" data-act="fUse" data-arg="${p.id}">${ic("plus")}Usar</button></div><div class="sub">${esc(p.d)}</div><div class="sub" style="line-height:1.6">${progPreview(p)}</div></div>`).join("")}</div>
    </section>
    <section class="panel"><div class="panel-h"><h2>${ic("info")}Qual escolher?</h2></div><div class="grid g3">
      <div><b>Começando agora</b><p class="sub">AB corpo inteiro, 3x por semana. Aprenda a técnica e suba a carga aos poucos.</p></div>
      <div><b>Já treina há alguns meses</b><p class="sub">ABC ou AB Superior/Inferior. Cada músculo 2x por semana dá ótimo resultado.</p></div>
      <div><b>Treina há anos</b><p class="sub">ABCD ou ABCDE com mais volume. Mantenha 10 a 20 séries por músculo na semana.</p></div></div></section>`;
}
function fichaEditor(f){
  return `<section class="panel"><div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn sm ghost" data-act="fBack">${ic("chevL")}Voltar</button><input class="input" style="flex:1;min-width:180px;font-weight:700" value="${esc(f.n)}" data-bind="fname" aria-label="Nome da ficha"><button class="btn primary sm" data-act="fBack">${ic("check")}Pronto</button></div>
    <p class="sub" style="margin:10px 0 0">Tudo é salvo na hora. Ajuste séries e repetições de cada exercício.</p></section>
    <div class="col" style="gap:12px">${f.days.map((d, i) => `<section class="fed-day">
      <div class="row" style="gap:8px;flex-wrap:nowrap"><span class="fl">${LETTERS[i]}</span><input class="input" style="flex:1;min-width:0;font-weight:600" value="${esc(d.n)}" placeholder="Ex.: Peito e tríceps" data-bind="fdname" data-d="${i}" aria-label="Nome do treino ${LETTERS[i]}">${f.days.length > 1 ? `<button class="iconbtn" data-act="fDelDay" data-d="${i}" aria-label="Remover treino ${LETTERS[i]}">${ic("trash")}</button>` : ""}</div>
      ${d.ex.length ? `<div class="fed-row" style="padding:0;border:0"><span class="lbl">Exercício</span><span class="lbl" style="text-align:center">Séries</span><span class="lbl" style="text-align:center">Reps</span><span></span></div>` : ""}
      ${d.ex.map((x, j) => { const e = EX[x.id] || {n:x.id, g:""}; return `<div class="fed-row"><button class="n" data-act="exInfo" data-arg="${x.id}" style="background:none;border:0;padding:0;color:var(--text);text-align:left;cursor:pointer;font:inherit">${esc(e.n)}<small>${GN[e.g] || ""}${e.s ? " · " + SUBN(e.g, e.s) : ""}</small></button><input class="input num" type="number" inputmode="numeric" min="1" max="10" value="${x.s}" data-bind="fsets" data-d="${i}" data-j="${j}" aria-label="Séries de ${esc(e.n)}"><input class="input num" value="${esc(x.r)}" maxlength="8" data-bind="freps" data-d="${i}" data-j="${j}" aria-label="Repetições de ${esc(e.n)}"><div class="row">${j > 0 ? `<button class="iconbtn" data-act="fUp" data-d="${i}" data-j="${j}" aria-label="Subir">${ic("chevR", 'style="transform:rotate(-90deg)"')}</button>` : `<span style="width:28px"></span>`}<button class="iconbtn" data-act="fRm" data-d="${i}" data-j="${j}" aria-label="Remover ${esc(e.n)}">${ic("x")}</button></div></div>`; }).join("") || `<div class="empty" style="padding:10px">Nenhum exercício ainda.</div>`}
      <button class="btn sm" style="border-style:dashed" data-act="fAdd" data-d="${i}">${ic("plus")}Adicionar exercício ao treino ${LETTERS[i]}</button>
    </section>`).join("")}
    ${f.days.length < LETTERS.length ? `<button class="btn" style="border-style:dashed;padding:14px" data-act="fAddDay">${ic("plus")}Adicionar treino ${LETTERS[f.days.length]}</button>` : ""}</div>`;
}
/* Escolher exercício: grupos e subgrupos */
let FP2 = {f:null, d:0, g:"peito", s:""};
function subChips(g, cur, act){
  const L = SUBS[g]; if (!L) return "";
  return `<div class="subchips"><button class="chip" data-act="${act}" data-arg="" aria-pressed="${!cur}">Todos</button>${L.map(([k, n]) => `<button class="chip" data-act="${act}" data-arg="${k}" aria-pressed="${cur === k}">${n}</button>`).join("")}</div>`;
}
function fPickModal(){
  const f = fichaById(FP2.f); if (!f) return;
  const list = EXERCISES.filter(e => e.g === FP2.g && (!FP2.s || e.s === FP2.s)), have = new Set(f.days[FP2.d].ex.map(x => x.id));
  openModal(`${sheetHead("Adicionar ao treino " + LETTERS[FP2.d], esc(f.n))}
    <div class="chips" style="margin-bottom:8px">${GROUPS.map(g => `<button class="chip" data-act="fpGrp" data-arg="${g.id}" aria-pressed="${FP2.g === g.id}">${g.n}</button>`).join("")}</div>
    ${subChips(FP2.g, FP2.s, "fpSub")}
    <div class="exlist" style="grid-template-columns:minmax(0,1fr);max-height:52vh;overflow:auto">${list.map(e => exCard(e, "fpAdd").replace("</span></span></button>", have.has(e.id) ? `<span class="pill ac">${ic("check")}na ficha</span></span></span></button>` : "</span></span></button>")).join("")}</div>`);
}
/* Adicionar a partir da biblioteca */
function addToFichaModal(exId){
  const fd = FD(), e = EX[exId];
  openModal(`${sheetHead("Adicionar à ficha", esc(e.n))}
    ${fd.list.length ? fd.list.map(f => `<div class="mgroup" style="margin-bottom:10px"><div class="mgroup-h">${esc(f.n)}</div><div class="fdays">${f.days.map((d, i) => `<button class="fday" data-act="fAddTo" data-f="${f.id}" data-d="${i}" data-arg="${exId}"><span class="fl">${LETTERS[i]}</span><span style="min-width:0"><b>${esc(d.n || "Treino " + LETTERS[i])}</b><span>${d.ex.some(x => x.id === exId) ? "Já está aqui" : d.ex.length + " exercícios"}</span></span></button>`).join("")}</div></div>`).join("") : `<p class="sub">Você ainda não tem ficha. Vou criar uma ficha ABC vazia para você.</p>`}
    <button class="btn ${fd.list.length ? "" : "primary"}" data-act="fNewWith" data-arg="${exId}">${ic("plus")}Nova ficha com este exercício</button>`);
}
function newFicha(n, days){ const f = {id:"f" + uid(), n, days}; const fd = FD(); fd.list.unshift(f); saveFD(fd); return f; }
const exItem = id => { const e = EX[id]; return {id, s:parseInt(e && e.rx[0]) || 3, r:(e && e.rx[1]) || "8–12"}; };
function mutF(fn){ const fd = FD(), f = fd.list.find(x => x.id === UI.fEdit); if (!f) return; fn(f); saveFD(fd); }

document.addEventListener("input", ev => {
  const el = ev.target, b = el.dataset && el.dataset.bind; if (!b || !/^(fname|fdname|fsets|freps)$/.test(b)) return;
  mutF(f => {
    if (b === "fname") f.n = el.value.slice(0, 50) || "Minha ficha";
    if (b === "fdname") f.days[+el.dataset.d].n = el.value.slice(0, 50);
    if (b === "fsets") f.days[+el.dataset.d].ex[+el.dataset.j].s = Math.max(1, Math.min(10, +el.value || 1));
    if (b === "freps") f.days[+el.dataset.d].ex[+el.dataset.j].r = el.value.slice(0, 8);
  });
}, true);

const startTpl0 = ACT.startTpl;
Object.assign(ACT, {
  startTpl: el => {
    const id = el.dataset.arg || "";
    if (!id.startsWith("f:")) return startTpl0(el);
    const t = fichaTemplates().find(x => x.id === id); if (!t) return;
    closeModal(); const d = newDraft(t.n);
    d.ex = t.ex.map((x, i) => { const w = exEntry(x); const n = t.sets[i]; if (n && !lastFor(x)) w.sets = Array.from({length:n}, () => ({kg:"", r:"", done:false})); w.plan = t.reps[i]; return w; });
    saveDraft(d); initAudio(); UI.tab = "treino"; UI.wtab = "treinar"; render();
  },
  fNew: () => { const f = newFicha("Minha ficha ABC", [{n:"", ex:[]}, {n:"", ex:[]}, {n:"", ex:[]}]); UI.fEdit = f.id; render(); window.scrollTo(0, 0); },
  fEdit: el => { UI.fEdit = el.dataset.arg; render(); window.scrollTo(0, 0); },
  fBack: () => { UI.fEdit = null; render(); toast("Ficha salva"); },
  fDel: el => confirmBox("Excluir ficha?", "A ficha e os dias dela na agenda serão apagados.", "Excluir", () => { const fd = FD(); fd.list = fd.list.filter(f => f.id !== el.dataset.arg); saveFD(fd); const ag = Object.assign({}, P().agenda || {}); Object.keys(ag).forEach(k => { if (String(ag[k]).startsWith("f:" + el.dataset.arg + ":")) delete ag[k]; }); setP({agenda:ag}); render(); }),
  fUse: el => { const p = PROGS.find(x => x.id === el.dataset.arg); const f = newFicha(p.n, p.days.map(d => ({n:d.n, ex:d.ex.map(x => Object.assign({}, x))}))); closeModal(); UI.fEdit = null; render(); toast(`"${p.n}" salva em Minhas fichas`); },
  fPreview: el => { const p = PROGS.find(x => x.id === el.dataset.arg); openModal(`${sheetHead(esc(p.n), esc(p.lvl))}<p class="sub">${esc(p.d)}</p>${p.days.map((d, i) => `<div class="mgroup" style="margin-bottom:10px"><div class="mgroup-h"><span class="fl" style="width:28px;height:28px;font-size:14px">${LETTERS[i]}</span> ${esc(d.n)}</div><ol class="sub" style="margin:0;padding-left:20px;line-height:1.7">${d.ex.map(x => `<li>${esc((EX[x.id] || {}).n || x.id)} · <b class="num">${x.s} × ${esc(x.r)}</b></li>`).join("")}</ol></div>`).join("")}<button class="btn primary" data-act="fUse" data-arg="${p.id}">${ic("plus")}Usar esta ficha</button>`); },
  fAgenda: el => { const f = fichaById(el.dataset.arg); if (!f) return; const n = f.days.length, plan = {1:[[1,3,5],[1,3,5]],2:[[1,4],[2,5]],3:[[1,4],[2,5],[3,6]],4:[[1],[2],[4],[5]],5:[[1],[2],[3],[4],[5]],6:[[1],[2],[3],[4],[5],[6]]}[n] || []; const ag = {}; if (n === 1) [1,3,5].forEach(w => ag[w] = `f:${f.id}:0`); else plan.forEach((ws, i) => ws.forEach(w => ag[w] = `f:${f.id}:${i}`)); if (n === 2) { ag[1] = `f:${f.id}:0`; ag[2] = `f:${f.id}:1`; ag[4] = `f:${f.id}:0`; ag[5] = `f:${f.id}:1`; } setP({agenda:ag}); toast("Agenda montada. Ajuste os dias se quiser."); agendaModal(); },
  fAddDay: () => { mutF(f => { if (f.days.length < LETTERS.length) f.days.push({n:"", ex:[]}); }); render(); },
  fDelDay: el => confirmBox(`Remover o treino ${LETTERS[+el.dataset.d]}?`, "Os exercícios dele saem da ficha.", "Remover", () => { mutF(f => f.days.splice(+el.dataset.d, 1)); render(); }),
  fUp: el => { mutF(f => { const L = f.days[+el.dataset.d].ex, j = +el.dataset.j; [L[j - 1], L[j]] = [L[j], L[j - 1]]; }); render(); },
  fRm: el => { mutF(f => f.days[+el.dataset.d].ex.splice(+el.dataset.j, 1)); render(); },
  fAdd: el => { FP2 = {f:UI.fEdit, d:+el.dataset.d, g:FP2.g || "peito", s:""}; fPickModal(); },
  fpGrp: el => { FP2.g = el.dataset.arg; FP2.s = ""; fPickModal(); },
  fpSub: el => { FP2.s = el.dataset.arg; fPickModal(); },
  fpAdd: el => { const fd = FD(), f = fd.list.find(x => x.id === FP2.f); if (!f) return; const L = f.days[FP2.d].ex; if (!L.some(x => x.id === el.dataset.arg)) { L.push(exItem(el.dataset.arg)); saveFD(fd); toast(`${EX[el.dataset.arg].n} adicionado ao treino ${LETTERS[FP2.d]}`); } fPickModal(); render(); },
  fToFicha: el => addToFichaModal(el.dataset.arg),
  fAddTo: el => { const fd = FD(), f = fd.list.find(x => x.id === el.dataset.f); if (!f) return; const L = f.days[+el.dataset.d].ex; if (!L.some(x => x.id === el.dataset.arg)) L.push(exItem(el.dataset.arg)); saveFD(fd); closeModal(); toast(`Adicionado ao treino ${LETTERS[+el.dataset.d]} de ${f.n}`); render(); },
  fNewWith: el => { const f = newFicha("Minha ficha ABC", [{n:"", ex:[exItem(el.dataset.arg)]}, {n:"", ex:[]}, {n:"", ex:[]}]); closeModal(); UI.tab = "treino"; UI.wtab = "fichas"; UI.fEdit = f.id; render(); window.scrollTo(0, 0); },
  libSub: el => { UI.libSub = el.dataset.arg; render(); },
  pickSub: el => { UI.pickSub = el.dataset.arg; pickExModal(); }
});
if (UI.tab === "treino") render();
</script>
