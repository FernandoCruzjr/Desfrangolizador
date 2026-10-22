<script>
/* ======================= NÍVEIS & CONQUISTAS ======================= */
const LEVELS = [{n:"Frango", min:0, ic:"chick"}, {n:"Em Evolução", min:250, ic:"up"}, {n:"Atleta", min:900, ic:"bolt"}, {n:"Avançado", min:2200, ic:"crown"}];
function dayFlags(d, c){
  const day = Store.get(dayKey(d)); if (!day || !day.meals) return {logged:false};
  const t = dayTotals(day), logged = day.meals.some(m => m.items.length);
  return {logged, kcalOk: logged && Math.abs(t.k - c.kcal) <= c.kcal * 0.1, protOk: logged && t.p >= c.prot * 0.9, waterOk: (day.water || 0) >= c.water.total, t, water: day.water || 0, supps: day.supps || {}};
}
function streakDays(){
  const sess = new Set(allSessions().map(s => s.date)), c = calc(P());
  let d = todayISO(), n = 0;
  const active = x => sess.has(x) || dayFlags(x, c).logged;
  if (!active(d)) d = addDays(d, -1);
  while (active(d) && n < 999) { n++; d = addDays(d, -1); }
  return n;
}
function computeXP(){
  const c = calc(P()); let xp = 0;
  Store.keys("day-").forEach(k => { const f = dayFlags(k.slice(4), c); if (f.logged) xp += 5; if (f.kcalOk) xp += 10; if (f.protOk) xp += 10; if (f.waterOk) xp += 5; });
  xp += allSessions().length * 25 + measures().length * 15 + Store.keys("photo-").length * 10;
  return xp;
}
function levelInfo(){
  const xp = computeXP(); let i = 0; LEVELS.forEach((l, j) => { if (xp >= l.min) i = j; });
  const cur = LEVELS[i], next = LEVELS[i + 1];
  return {xp, i, cur, next, pct: next ? (xp - cur.min) / (next.min - cur.min) : 1, streak: streakDays()};
}
function hasPR(){
  const by = {};
  [...allSessions()].reverse().forEach(s => s.ex.forEach(e => { const b = Math.max(0, ...e.sets.map(st => e1rm(+st.kg || 0, +st.r || 0))); (by[e.id] = by[e.id] || []).push(b); }));
  return Object.values(by).some(a => a.length > 1 && Math.max(...a.slice(1)) > a[0] && a[0] > 0);
}
function badgeList(){
  const c = calc(P()), days = Store.keys("day-").map(k => dayFlags(k.slice(4), c)), ss = allSessions();
  const vol = ss.reduce((a, s) => a + sessVolume(s), 0);
  return [
    {n:"Primeiro treino", d:"Registre um treino", on: ss.length >= 1, ic:"dumbbell"},
    {n:"10 treinos", d:"Constância começa aqui", on: ss.length >= 10, ic:"medal"},
    {n:"30 treinos", d:"Hábito formado", on: ss.length >= 30, ic:"trophy"},
    {n:"Diário de 7 dias", d:"7 dias de dieta registrada", on: days.filter(x => x.logged).length >= 7, ic:"plate"},
    {n:"Proteína em dia", d:"Bata a proteína em 5 dias", on: days.filter(x => x.protOk).length >= 5, ic:"target"},
    {n:"Hidratado", d:"Meta de água em 5 dias", on: days.filter(x => x.waterOk).length >= 5, ic:"drop"},
    {n:"Na mosca", d:"Calorias certeiras (±10%) em 10 dias", on: days.filter(x => x.kcalOk).length >= 10, ic:"flame"},
    {n:"Fita métrica", d:"Primeiro registro de medidas", on: measures().length >= 1, ic:"ruler"},
    {n:"Antes & depois", d:"Primeira foto de progresso", on: Store.keys("photo-").length >= 1, ic:"camera"},
    {n:"Sequência de 7", d:"7 dias seguidos ativos", on: streakDays() >= 7, ic:"bolt"},
    {n:"Recorde pessoal", d:"Supere seu 1RM estimado", on: hasPR(), ic:"crown"},
    {n:"10 toneladas", d:"10 t de volume acumulado", on: vol >= 10000, ic:"eq_barra"}
  ];
}
function badgesModal(){
  const lv = levelInfo(), b = badgeList();
  openModal(`${sheetHead("Conquistas", lv.cur.n + " · " + fmt(lv.xp) + " XP")}
    <div class="ladder">${LEVELS.map((l, i) => `<div class="${i === lv.i ? "on" : i < lv.i ? "past" : ""}">${l.n}<br><span class="num" style="font-weight:500">${fmt(l.min)} XP</span></div>`).join("")}</div>
    <div class="badges">${b.map(x => `<div class="bdg ${x.on ? "on" : ""}">${ic(x.ic)}<span><b>${x.n}</b>${x.d}</span></div>`).join("")}</div>
    <div class="note">${ic("info")}<span><b>Como ganhar XP:</b> dia com dieta registrada +5, calorias na meta (±10%) +10, proteína batida +10, água batida +5, treino +25, medidas +15, foto de progresso +10.</span></div>`, "wide");
}

/* ======================= RELATÓRIO SEMANAL ======================= */
function weeklyStats(){
  const p = P(), c = calc(p), today = todayISO(), from = addDays(today, -6);
  const days = Array.from({length:7}, (_, i) => addDays(from, i)).map(d => ({d, f:dayFlags(d, c)}));
  const logged = days.filter(x => x.f.logged);
  const avg = k => logged.length ? logged.reduce((a, x) => a + x.f.t[k], 0) / logged.length : 0;
  const sess = allSessions().filter(s => s.date >= from), ws = weekSets();
  const low = GROUPS.filter(g => ws[g.id] < 10).map(g => g.n);
  const ms = measures().filter(m => +m.weight), lastW = ms[ms.length - 1], prevW = [...ms].reverse().find(m => m.date <= addDays(today, -7));
  const rpes = sess.flatMap(s => s.ex.flatMap(e => e.sets.map(st => +st.rpe).filter(Boolean)));
  return {goal:(GOALS[p.goal] || GOALS.bulk).n, metaKcal:c.kcal, metaProt:c.prot, metaCarb:c.carb, metaFat:c.fat, metaAgua:c.water.total,
    diasComDieta:logged.length, mediaKcal:Math.round(avg("k")), mediaProt:Math.round(avg("p")), mediaCarb:Math.round(avg("c")), mediaGord:Math.round(avg("f")),
    diasProteinaBatida:days.filter(x => x.f.protOk).length, diasAguaBatida:days.filter(x => x.f.waterOk).length,
    treinos:sess.length, series:sess.reduce((a, s) => a + sessSets(s), 0), seriesPorGrupo:Object.fromEntries(GROUPS.map(g => [g.n, ws[g.id]])), gruposAbaixoDe10Series:low,
    rpeMedio: rpes.length ? +(rpes.reduce((a, b) => a + b, 0) / rpes.length).toFixed(1) : null,
    pesoAtual: lastW ? lastW.weight : null, variacaoPesoSemana: lastW && prevW ? +(lastW.weight - prevW.weight).toFixed(2) : null};
}
function weeklyDiag(){
  const s = weeklyStats(), out = [];
  const pr = s.metaProt ? s.mediaProt / s.metaProt : 0;
  if (!s.diasComDieta && !s.treinos) return `<div class="note">${ic("info")}<span>Registre sua dieta e seus treinos durante a semana e o relatório aparece aqui, com diagnóstico do que ajustar.</span></div>`;
  out.push([s.diasComDieta >= 5, `Dieta registrada em <b>${s.diasComDieta} de 7 dias</b>.`]);
  if (s.diasComDieta) {
    out.push([pr >= 0.9, `Proteína: média de <b>${s.mediaProt} g</b> (${Math.round(pr * 100)}% da meta de ${s.metaProt} g).`]);
    const kp = s.mediaKcal / s.metaKcal;
    out.push([Math.abs(kp - 1) <= 0.1, `Calorias: média de <b>${fmt(s.mediaKcal)} kcal</b> (${Math.round(kp * 100)}% da meta).`]);
  }
  out.push([s.diasAguaBatida >= 5, `Meta de água batida em <b>${s.diasAguaBatida} dia${s.diasAguaBatida === 1 ? "" : "s"}</b>.`]);
  out.push([s.treinos >= 3, `<b>${s.treinos} treino${s.treinos === 1 ? "" : "s"}</b> e ${s.series} séries na semana${s.rpeMedio ? ` · RPE médio ${fmt(s.rpeMedio, 1)}` : ""}.`]);
  if (s.treinos) out.push([!s.gruposAbaixoDe10Series.length, s.gruposAbaixoDe10Series.length ? `Abaixo de 10 séries semanais: <b>${s.gruposAbaixoDe10Series.join(", ")}</b>.` : "Todos os grupos musculares com pelo menos 10 séries."]);
  if (s.rpeMedio && s.rpeMedio < 7) out.push([false, "Intensidade baixa: aproxime as séries da falha (RPE 8–9) para estimular hipertrofia."]);
  if (s.variacaoPesoSemana != null) out.push([true, `Peso: <b>${s.variacaoPesoSemana > 0 ? "+" : ""}${fmt(s.variacaoPesoSemana, 2)} kg</b> em relação à semana anterior.`]);
  return `<div class="diag">${out.map(([ok, t]) => `<div class="${ok ? "ok" : "bad"}">${ic(ok ? "check" : "alert")}<span>${t}</span></div>`).join("")}</div>`;
}
let SAMPLE = null, SAMPLE_IMG = false;
async function aiReport(){
  const box = $("#ai-report"); if (!box) return;
  if (!SAMPLE) { box.innerHTML = `<div class="note">${ic("info")}<span>A análise com IA funciona quando o app é aberto pelo Claude, com sua conta. O diagnóstico acima continua disponível.</span></div>`; return; }
  box.textContent = "Analisando sua semana…";
  const s = weeklyStats();
  const prompt = `Você é um nutricionista esportivo e coach com formação em fisiologia do exercício, especialista em dieta flexível (IIFYM) e treino de hipertrofia. Escreva em português do Brasil, em tom direto e motivador, um relatório semanal curto (até 170 palavras) para ${firstName()}, com objetivo de ${s.goal}. Estrutura: 1 frase de resumo; "Pontos fortes" (até 2 itens); "Ajustar" (até 3 itens concretos com números). Use apenas os dados abaixo, sem inventar. Sem markdown com asteriscos; use hífens para listas.\n\nDados dos últimos 7 dias (JSON):\n${JSON.stringify(s)}`;
  try { await SAMPLE(prompt, {onText: ({text}) => { box.textContent = text; }}); }
  catch (e) { box.textContent = e.text || ""; if (e.code !== "cancelled") box.insertAdjacentHTML("beforeend", `<div class="note" style="margin-top:8px">${ic("info")}<span>${e.code === "not_granted" ? "A análise com IA não foi autorizada nesta visita." : e.code === "rate_limited" ? "Muitos pedidos agora. Tente de novo em alguns minutos." : "Não foi possível gerar a análise agora."}</span></div>`); }
}

/* ======================= SUPLEMENTOS ======================= */
function suppChecklist(d){
  const p = P(), list = (p.supps || []).filter(s => s.n), day = Store.get(dayKey(d)) || {}, done = day.supps || {};
  if (!list.length) return `<div class="empty">Nenhum suplemento cadastrado. <a href="#" data-act="go" data-arg="plano" data-anchor="supps">Adicionar</a></div>`;
  return `<div class="checks">${list.map(s => `<button class="check" data-act="suppDone" data-arg="${s.id}" data-d="${d}" aria-pressed="${!!done[s.id]}"><span class="bx">${ic("check")}</span><span class="ct">${esc(s.n)}</span><span class="sub">${esc(s.dose)}</span><span class="cs">${s.time || ""}</span></button>`).join("")}</div>`;
}

/* ======================= AGENDA & FICHAS ======================= */
const allTemplates = () => ((Store.get("tpls") || {}).list || []).concat(TEMPLATES);
function agendaModal(){
  const p = P(), ag = p.agenda || {}, tp = allTemplates();
  const order = [1,2,3,4,5,6,0], nm = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
  openModal(`${sheetHead("Agenda de treinos", "Sua semana")}
    <p class="sub">Escolha a ficha de cada dia. O Início mostra o treino do dia e marca os dias treinados.</p>
    <div class="agenda">${order.map(w => `<div class="field"><label for="ag-${w}">${nm[w]}</label><select id="ag-${w}" class="input" data-bind="agenda" data-w="${w}"><option value="">Descanso</option>${tp.map(t => `<option value="${t.id}" ${ag[w] === t.id ? "selected" : ""}>${esc(t.n)}</option>`).join("")}</select></div>`).join("")}</div>
    <div class="row"><span class="sub">Sugestões: Full body (seg, qua, sex) · Upper/Lower (seg, ter, qui, sex) · Push/Pull/Legs 2x (seg a sáb).</span><span class="spacer"></span><button class="btn primary" data-act="closeModal">${ic("check")}Pronto</button></div>`, "wide");
}

/* ======================= AÇÕES RÁPIDAS ======================= */
function quickModal(){
  const qa = [["flame","Calculadora de calorias","qPlano"],["plate","Adicionar alimento","qAddFood"],["camera","Foto do prato (IA)","qPhotoFood"],["drop","+250 ml de água","qWater"],["play","Iniciar treino","qTrain"],["scale","Registrar peso","qWeight"],["image","Foto de progresso","qProgress"],["bell","Lembretes","qRem"],["file","Relatório PDF","pdf"],["phone","Instalar e ajuda","about"]];
  openModal(`${sheetHead("Ações rápidas")}<div class="qa-grid">${qa.map(([i, n, a]) => `<button class="qa" data-act="${a}"><span>${ic(i)}</span>${n}</button>`).join("")}</div>`);
}

/* ======================= SUBSTITUIÇÕES ======================= */
function swapFoodModal(mi, ii, mode = "kcal"){
  const day = getDay(UI.date), it = day.meals[mi].items[ii], src = findFood(it.fid) || {cat:"", ...it};
  const m0 = itemMac(it), key = mode === "kcal" ? "k" : (["p","c","f"].reduce((a, k) => m0[k] * (k === "f" ? 9 : 4) > m0[a] * (a === "f" ? 9 : 4) ? k : a, "p"));
  const target = m0[key];
  const pool = allFoods().filter(f => f.id !== it.fid && f[key] > 0 && (src.cat ? f.cat === src.cat : true));
  const ranked = pool.map(f => { const g = Math.round(target / f[key] * 100 / 5) * 5; const r = g / 100; const d = Math.abs(f.p * r - m0.p) + Math.abs(f.c * r - m0.c) + Math.abs(f.f * r - m0.f); return {f, g, r, d}; }).filter(x => x.g > 0 && x.g <= Math.max(600, it.g * 3)).sort((a, b) => a.d - b.d).slice(0, 14);
  const kn = {k:"calorias", p:"proteína", c:"carboidrato", f:"gordura"}[key];
  openModal(`${sheetHead("O que posso comer no lugar?", esc(it.g + " g de " + it.n))}
    <div class="row"><span class="sub">Equivalência por</span><div class="seg"><button data-act="swapMode" data-m="${mi}" data-i="${ii}" data-v="kcal" aria-pressed="${mode === "kcal"}">Calorias</button><button data-act="swapMode" data-m="${mi}" data-i="${ii}" data-v="macro" aria-pressed="${mode !== "kcal"}">Macro principal</button></div></div>
    <p class="sub num">Original: ${fmt(m0.k)} kcal · P ${fmt(m0.p, 1)} · C ${fmt(m0.c, 1)} · G ${fmt(m0.f, 1)}${mode !== "kcal" ? ` · igualando ${kn}` : ""}</p>
    <div class="food-list">${ranked.length ? ranked.map(x => `<button class="swap-row" data-act="doSwap" data-m="${mi}" data-i="${ii}" data-f="${x.f.id}" data-g="${x.g}"><span style="min-width:0"><span style="font-weight:600;display:block">${esc(x.f.n)}</span><span class="sd">${fmt(x.f.k * x.r)} kcal · P ${fmt(x.f.p * x.r, 1)} · C ${fmt(x.f.c * x.r, 1)} · G ${fmt(x.f.f * x.r, 1)}</span></span><span class="sg num">${x.g} g</span></button>`).join("") : `<div class="empty">Sem equivalentes nessa categoria.</div>`}</div>
    <p class="sub">Ordenado pela semelhança de macros. Toque para trocar.</p>`);
}
function swapExModal(ei){
  const d = draft(), cur = EX[d.ex[ei].id];
  openModal(`${sheetHead("Trocar exercício", "Mesmo grupo: " + GN[cur.g])}<p class="sub">Aparelho ocupado? Escolha um equivalente. As séries continuam.</p>
    <div class="exlist" style="max-height:56vh;overflow:auto">${EXERCISES.filter(e => e.g === cur.g && e.id !== cur.id).map(e => exCard(e, "doSwapEx").replace('data-arg="' + e.id + '"', 'data-arg="' + e.id + '" data-e="' + ei + '"')).join("")}</div>`);
}

/* ======================= FOTO DO PRATO / RÓTULO (IA) ======================= */
let AIF = {file:null, url:"", items:null, mode:"prato", m:0};
function downscale(file, max = 1024, q = 0.82){
  return new Promise((res, rej) => { const img = new Image(); const u = URL.createObjectURL(file); img.onload = () => { const s = Math.min(1, max / Math.max(img.width, img.height)); const cv = document.createElement("canvas"); cv.width = Math.round(img.width * s); cv.height = Math.round(img.height * s); cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height); URL.revokeObjectURL(u); cv.toBlob(b => b ? res({blob:b, dataUrl:cv.toDataURL("image/jpeg", q)}) : rej(new Error("toBlob")), "image/jpeg", q); }; img.onerror = rej; img.src = u; });
}
function aiFoodModal(){
  const day = getDay(UI.date), meal = day.meals[AIF.m] || day.meals[0];
  const can = SAMPLE && SAMPLE_IMG;
  let body;
  if (!AIF.items) body = `<div class="seg"><button data-act="aiMode" data-v="prato" aria-pressed="${AIF.mode === "prato"}">Foto do prato</button><button data-act="aiMode" data-v="rotulo" aria-pressed="${AIF.mode === "rotulo"}">Foto do rótulo / tabela nutricional</button></div>
    <label class="ai-drop" for="ai-file">${AIF.url ? `<img class="ai-prev" src="${AIF.url}" alt="Foto escolhida">` : ic("camera")}<b>${AIF.url ? "Trocar foto" : AIF.mode === "prato" ? "Tire ou escolha uma foto do prato" : "Fotografe a tabela nutricional da embalagem"}</b><span class="sub">${AIF.mode === "prato" ? "A IA identifica os alimentos e estima as gramas. Você revisa antes de salvar." : "A IA lê os valores do rótulo e cria o alimento em Meus alimentos."}</span></label>
    <input id="ai-file" type="file" accept="image/*" capture="environment" hidden data-bind="aifile">
    ${can ? "" : `<div class="note warn">${ic("info")}<span>O reconhecimento por foto usa a IA do Claude e funciona quando o app é aberto pelo Claude com sua conta.</span></div>`}
    <div class="row"><span class="sub" id="ai-status"></span><span class="spacer"></span><button class="btn primary" data-act="aiRun" ${AIF.file && can ? "" : "disabled"}>${ic("sparkle")}Analisar foto</button></div>`;
  else body = `<p class="sub">Revise as quantidades. Desmarque o que não estiver certo.</p>
    <div>${AIF.items.map((x, i) => `<div class="ai-row"><input type="checkbox" ${x.on ? "checked" : ""} data-bind="aion" data-i="${i}" aria-label="Incluir ${esc(x.n)}" style="width:20px;height:20px;accent-color:var(--accent)"><span style="min-width:0"><b style="font-size:14px">${esc(x.n)}</b><br><span class="sub num">${fmt(x.k * x.g / 100)} kcal · P ${fmt(x.p * x.g / 100, 1)} · C ${fmt(x.c * x.g / 100, 1)} · G ${fmt(x.f * x.g / 100, 1)}${x.db ? " · banco" : " · estimado"}</span></span><div class="input-u"><input class="input num" type="number" value="${x.g}" data-bind="aig" data-i="${i}" aria-label="Gramas de ${esc(x.n)}"><span>g</span></div></div>`).join("")}</div>
    <div class="row"><button class="btn ghost" data-act="aiReset">${ic("chevL")}Outra foto</button><span class="spacer"></span><button class="btn primary" data-act="aiAdd">${ic("plus")}Adicionar ${meal ? "ao " + esc(meal.name.toLowerCase()) : ""}</button></div>`;
  openModal(`${sheetHead(AIF.items ? "Alimentos identificados" : "Registrar por foto", meal ? esc(meal.name) : "")}${body}`);
}
async function aiRun(){
  const st = $("#ai-status"), btn = document.querySelector('[data-act="aiRun"]'); if (btn) btn.disabled = true;
  if (st) st.textContent = "Analisando a foto… pode levar alguns segundos.";
  try {
    const {blob} = await downscale(AIF.file);
    if (AIF.mode === "rotulo") {
      const r = await SAMPLE.json(`A imagem é a tabela nutricional de uma embalagem de alimento brasileira. Extraia os valores. Responda só com JSON: {"nome": "nome do produto (curto)", "porcao_g": número, "porcao_desc": "ex.: 2 fatias", "kcal": número por porção, "proteina": g por porção, "carbo": g por porção, "gordura": g por porção}. Se não houver tabela legível, responda {"erro": "motivo"}.`, {images:[blob], modelTier:"default"});
      if (r.erro || !r.porcao_g) throw {code:"read", message:r.erro || "Tabela não legível"};
      const fac = 100 / r.porcao_g;
      const f = {id:"c" + uid(), n:r.nome || "Produto", cat:"mine", pl:r.porcao_desc || "1 porção", pg:+r.porcao_g, k:+r.kcal * fac, p:+r.proteina * fac, c:+r.carbo * fac, f:+r.gordura * fac};
      const fd = foodsDoc(); fd.custom.unshift(f); Store.put("foods", fd);
      AIF = {file:null, url:"", items:null, mode:"prato", m:AIF.m}; FP = {m:AIF.m, f:f.id, g:f.pg, view:"list"}; renderPicker(); toast("Alimento criado a partir do rótulo"); return;
    }
    const names = FOODS.map(f => f.n).join("; ");
    const r = await SAMPLE.json(`Você é nutricionista. Identifique os alimentos e preparações visíveis nesta foto de refeição e estime o peso de cada um em gramas (porção servida). Para cada item, se houver um equivalente nesta lista, use o nome EXATO da lista no campo "banco"; senão deixe "banco" vazio e estime kcal e macros por 100 g. Lista: ${names}.\nResponda só com JSON: {"itens":[{"nome":"...", "banco":"nome da lista ou vazio", "gramas":número, "kcal100":número, "p100":número, "c100":número, "g100":número}]}`, {images:[blob], modelTier:"default"});
    const items = (r.itens || []).map(x => { const db = FOODS.find(f => f.n === x.banco); return db ? {n:db.n, fid:db.id, k:db.k, p:db.p, c:db.c, f:db.f, g:Math.round(+x.gramas || db.pg), db:true, on:true} : {n:x.nome, fid:null, k:+x.kcal100 || 0, p:+x.p100 || 0, c:+x.c100 || 0, f:+x.g100 || 0, g:Math.round(+x.gramas || 100), db:false, on:true}; }).filter(x => x.n && x.g > 0);
    if (!items.length) throw {code:"none"};
    AIF.items = items; aiFoodModal();
  } catch (e) {
    if (btn) btn.disabled = false;
    if (st) st.textContent = e.code === "not_granted" ? "Uso da IA não autorizado nesta visita." : e.code === "rate_limited" ? "Muitos pedidos agora; tente em alguns minutos." : e.code === "none" ? "Não reconheci alimentos nessa foto. Tente com mais luz e de cima." : e.code === "read" ? "Não consegui ler a tabela. Tente uma foto mais nítida e reta." : "Não foi possível analisar a foto agora.";
  }
}

/* ======================= FOTOS DE PROGRESSO ======================= */
const photos = () => Store.keys("photo-").map(k => Object.assign({key:k}, Store.get(k))).sort((a, b) => a.date.localeCompare(b.date));
function photoModal(){
  openModal(`${sheetHead("Nova foto de progresso")}
    <div class="fields"><div class="field"><label for="ph-date">Data</label><input id="ph-date" class="input" type="date" value="${todayISO()}"></div><div class="field"><label for="ph-pose">Pose</label><select id="ph-pose" class="input">${["Frente","Lado","Costas","Duplo bíceps","Outra"].map(x => `<option>${x}</option>`).join("")}</select></div></div>
    <label class="ai-drop" for="ph-file">${ic("camera")}<b>Escolher ou tirar foto</b><span class="sub">Mesma pose, mesmo local e mesma luz a cada 4 semanas. A foto fica salva só na sua conta, visível apenas para você.</span></label>
    <input id="ph-file" type="file" accept="image/*" capture="environment" hidden data-bind="phfile">
    <p class="sub" id="ph-status"></p>`);
}
async function savePhoto(file){
  const st = $("#ph-status"); if (st) st.textContent = "Processando…";
  try {
    let {dataUrl} = await downscale(file, 720, 0.72);
    if (dataUrl.length > 230000) dataUrl = (await downscale(file, 560, 0.62)).dataUrl;
    const id = uid(); Store.put("photo-" + id, {date:$("#ph-date").value || todayISO(), pose:$("#ph-pose").value, data:dataUrl});
    closeModal(); UI.tab = "evolucao"; render(); toast("Foto salva");
  } catch (e) { if (st) st.textContent = "Não foi possível ler essa imagem."; }
}

/* ======================= PDF ======================= */
async function exportPDF(){
  const J = window.jspdf && window.jspdf.jsPDF;
  if (!J) { toast("Gerador de PDF indisponível agora"); return; }
  const p = P(), c = calc(p), s = weeklyStats(), ms = measures(), ss = allSessions(), lv = levelInfo();
  const doc = new J({unit:"mm", format:"a4"}); let y = 18; const L = 16, Wd = 178;
  const clean = t => String(t).replace(/[−–—]/g, "-").replace(/[≈]/g, "~").replace(/[^\x00-\xFF]/g, "");
  const h = (t) => { if (y > 270) { doc.addPage(); y = 18; } doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(10, 90, 110); doc.text(clean(t), L, y); y += 7; doc.setTextColor(30, 30, 30); };
  const line = (t, size = 10) => { doc.setFont("helvetica", "normal"); doc.setFontSize(size); doc.splitTextToSize(clean(t), Wd).forEach(l => { if (y > 284) { doc.addPage(); y = 18; } doc.text(l, L, y); y += 5; }); };
  try { doc.addImage(LOGO_SRC, "WEBP", L, 10, 14, 14); } catch (e) {}
  doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.text("Desfrangolizador", L + 18, 18); doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.text(clean(`Relatorio de ${firstName()} · gerado em ${dLabel(todayISO())} ${new Date().getFullYear()}`), L + 18, 24); y = 34;
  h("Perfil e metas");
  line(`${p.sex === "m" ? "Masculino" : "Feminino"}, ${p.age} anos, ${fmt(p.weight, 1)} kg, ${p.height} cm${p.bf ? `, ${p.bf}% de gordura` : ""}. Atividade x${p.act}. Objetivo: ${s.goal}.`);
  line(`TMB ${fmt(c.bmr)} kcal · GET ${fmt(c.tdee)} kcal · Meta ${fmt(c.kcal)} kcal/dia.`);
  line(`Macros: proteina ${c.prot} g (${fmt(p.pkg, 1)} g/kg) · carboidrato ${c.carb} g · gordura ${c.fat} g (${fmt(p.fkg, 2)} g/kg). Agua: ${fmt(c.water.total)} ml/dia.`);
  y += 2; h("Ultimos 7 dias");
  line(`Dieta registrada em ${s.diasComDieta}/7 dias. Media: ${fmt(s.mediaKcal)} kcal · P ${s.mediaProt} g · C ${s.mediaCarb} g · G ${s.mediaGord} g.`);
  line(`Proteina batida em ${s.diasProteinaBatida} dias · agua batida em ${s.diasAguaBatida} dias · ${s.treinos} treinos, ${s.series} series${s.rpeMedio ? `, RPE medio ${s.rpeMedio}` : ""}.`);
  line("Series por grupo: " + Object.entries(s.seriesPorGrupo).map(([k, v]) => `${k} ${v}`).join(" · "));
  line(`Nivel: ${lv.cur.n} (${fmt(lv.xp)} XP) · sequencia de ${lv.streak} dias.`);
  y += 2; h("Medidas corporais");
  if (!ms.length) line("Sem registros.");
  const cols = ["weight","waist","arm","chest","thigh","hip","neck","calf"], cn = {weight:"Peso", waist:"Cintura", arm:"Braco", chest:"Peito", thigh:"Coxa", hip:"Quadril", neck:"Pescoco", calf:"Pant."};
  if (ms.length) { doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.text("Data", L, y); cols.forEach((k, i) => doc.text(cn[k], L + 24 + i * 17, y)); doc.text("%G", L + 24 + cols.length * 17, y); y += 5; doc.setFont("helvetica", "normal");
    ms.slice(-18).forEach(m => { if (y > 284) { doc.addPage(); y = 18; } doc.text(dShort(m.date) + "/" + m.date.slice(2, 4), L, y); cols.forEach((k, i) => doc.text(+m[k] ? fmt(m[k], 1) : "-", L + 24 + i * 17, y)); const b = bfOf(p, m); doc.text(b ? fmt(b.v, 1) : "-", L + 24 + cols.length * 17, y); y += 5; }); }
  y += 2; h("Treinos recentes");
  if (!ss.length) line("Sem treinos registrados.");
  ss.slice(0, 12).forEach(se => line(`${dShort(se.date)} · ${se.name} · ${sessSets(se)} series · ${fmt(sessVolume(se))} kg · ` + se.ex.map(e => { const b = e.sets.reduce((a, st) => e1rm(+st.kg || 0, +st.r) > e1rm(+a.kg || 0, +a.r) ? st : a, e.sets[0]); return `${(EX[e.id] || {}).n || e.id} ${e.sets.length}x${b.r}${b.kg ? "@" + fmt(b.kg, 1) : ""}`; }).join("; "), 9));
  const blob = doc.output("blob"), fname = `desfrangolizador-${todayISO()}.pdf`;
  await saveBlob(blob, fname, "PDF pronto");
}
</script>
