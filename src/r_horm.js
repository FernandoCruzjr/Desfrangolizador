<style>
/* Saúde hormonal: aviso fixo, alertas, exames com faixas, protocolo registrado, pressão e sintomas. */
.h-banner{display:flex;gap:10px;align-items:flex-start;border:1px solid rgba(242,177,74,.45);background:rgba(242,177,74,.08);border-radius:14px;padding:12px 14px;font-size:14px;color:var(--muted);margin:12px 0 4px}
.h-banner svg{width:20px;height:20px;flex:none;margin-top:1px;color:var(--warn)}
.h-banner b{color:var(--ink)}
.h-lock{display:flex;align-items:center;gap:6px;font-size:12.5px;color:var(--muted);margin-top:6px}
.h-lock svg{width:14px;height:14px;color:var(--good)}
.h-alerts{display:flex;flex-direction:column;gap:8px}
.h-al{display:grid;grid-template-columns:22px minmax(0,1fr);gap:10px;padding:11px 12px;border-radius:12px;background:rgba(0,0,0,.2);border:1px solid var(--line);font-size:14px;color:var(--muted)}
.h-al svg{width:20px;height:20px;margin-top:1px}
.h-al b{color:var(--ink)}
.h-al.warn{border-color:rgba(242,177,74,.45)} .h-al.warn svg{color:var(--warn)}
.h-al.bad{border-color:rgba(240,106,92,.6);background:rgba(240,106,92,.08)} .h-al.bad svg{color:var(--bad)}
.h-al.good svg{color:var(--good)}
.h-al.info svg{color:var(--accent)}
.h-tbl{width:100%;border-collapse:collapse;font-size:14px}
.h-tbl th{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--faint);text-align:left;padding:10px 6px 6px}
.h-tbl td{padding:8px 6px;border-top:1px solid var(--line);vertical-align:middle}
.h-tbl td.v{font-family:var(--f-mono,monospace);text-align:right;white-space:nowrap}
.h-tbl td.r{color:var(--faint);font-size:12.5px;white-space:nowrap}
.h-tbl tr.h-grp td{border-top:none;padding-top:14px;font-weight:700;color:var(--accent-ink);font-size:13px}
.h-tbl button.lnk{background:none;border:0;padding:0;color:var(--ink);font:inherit;text-align:left;cursor:pointer}
.h-tbl button.lnk:hover{color:var(--accent-ink)}
.h-wrap{overflow-x:auto}
.h-list{display:flex;flex-direction:column;gap:8px}
.h-item{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;padding:12px;border-radius:14px;background:var(--glass);border:1px solid var(--glass-b)}
.h-item b{display:block}
@media (max-width:640px){.h-item.stack{grid-template-columns:minmax(0,1fr)}.h-item.stack>.row{justify-content:flex-end}}
.h-item .sub b{display:inline}
.h-sym{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px 12px;align-items:center}
.h-sym .seg button{min-width:0;padding:6px 9px;font-size:12.5px}
.h-days{display:flex;gap:6px;flex-wrap:wrap}
.h-days label{display:inline-flex;align-items:center;gap:5px;font-size:13px;padding:6px 10px;border-radius:999px;border:1px solid var(--line);background:rgba(0,0,0,.2);cursor:pointer}
.h-days input{accent-color:var(--accent)}
.h-steps{display:flex;flex-direction:column;gap:8px}
.h-step{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center;font-size:14px;padding:10px 12px;border-radius:12px;background:rgba(0,0,0,.18);border:1px solid var(--line)}
.h-step .dt{font-family:var(--f-mono,monospace);font-size:13px;color:var(--accent-ink);white-space:nowrap}
.h-step.late .dt{color:var(--bad)}
.h-x{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px}
.h-x div{background:rgba(0,0,0,.2);border:1px solid var(--line);border-radius:12px;padding:10px 12px}
.h-x span{display:block;font-size:12px;color:var(--faint)}
.h-x b{font-family:var(--f-display);font-size:20px}
.h-x em{font-style:normal;font-size:12.5px;color:var(--muted)}
.h-gate{display:flex;flex-direction:column;gap:12px;max-width:720px}
.h-gate ul{margin:0;padding-left:18px;color:var(--muted);display:flex;flex-direction:column;gap:6px;font-size:14.5px}
.h-gate ul b{color:var(--ink)}
</style>
<script>
/* ======================= SAÚDE HORMONAL (REDUÇÃO DE DANOS) =======================
   Só registra e alerta. Nunca sugere substância, dose ou protocolo.
   Dados no doc "horm" (privado, RLS por usuário). A Comunidade nunca lê este doc. */
Object.assign(ICONS, {
  flask:'<path d="M9 3h6M10 3v6L4.5 18.5A1.8 1.8 0 0 0 6 21h12a1.8 1.8 0 0 0 1.5-2.5L14 9V3"/><path d="M7.5 15h9"/>',
  lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  steth:'<path d="M5 3v6a5 5 0 0 0 10 0V3M5 3h2M13 3h2"/><path d="M10 14v2a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="12" r="2"/>'
});
TABS.push({id:"saude", n:"Saúde hormonal", ic:"shield"});
UI.htab = "painel"; UI.hmk = "hct";

const H_MED = "Procure um endocrinologista ou médico do esporte.";
const HDEF = {ok:false, refs:{}, exams:[], protos:[], doses:[], vitals:[], syms:[]};
const H = () => Object.assign({}, HDEF, Store.get("horm") || {});
const saveH = h => { delete h._ts; Store.put("horm", h); };
const num = v => { const n = parseFloat(String(v ?? "").replace(",", ".")); return isNaN(n) ? null : n; };
const daysBetween = (a, b) => Math.round((parseISO(b) - parseISO(a)) / 864e5);

/* Marcadores: faixas gerais de adulto. Cada laboratório tem as suas; a pessoa pode trocar pela do laudo.
   m/f = [mín, máx] (null = sem limite naquele lado; faixa null = varia muito, sem alerta automático).
   cm/cf = limites críticos [abaixo de, acima de]. */
const HGROUPS = [
  {id:"horm", n:"Hormônios"}, {id:"sangue", n:"Hemograma"}, {id:"lip", n:"Perfil lipídico"}, {id:"figado", n:"Fígado"},
  {id:"rim", n:"Rins e músculo"}, {id:"meta", n:"Metabolismo, tireoide e outros"}
];
const HMK = [
  {k:"tt", n:"Testosterona total", u:"ng/dL", g:"horm", m:[264, 916], f:[8, 60]},
  {k:"tl", n:"Testosterona livre", u:"ng/dL", g:"horm", m:[5, 21], f:[0.1, 0.85]},
  {k:"e2", n:"Estradiol (E2)", u:"pg/mL", g:"horm", m:[11, 44], f:null, tip:"Estradiol alto pode causar retenção de líquido, ginecomastia e alteração de humor; baixo demais afeta libido, articulações e humor."},
  {k:"lh", n:"LH", u:"mUI/mL", g:"horm", m:[1.7, 8.6], f:null, tip:"LH e FSH baixos indicam que a produção natural está suprimida. A recuperação do eixo precisa de acompanhamento médico."},
  {k:"fsh", n:"FSH", u:"mUI/mL", g:"horm", m:[1.5, 12.4], f:null, tip:"LH e FSH baixos indicam que a produção natural está suprimida. A recuperação do eixo precisa de acompanhamento médico."},
  {k:"prl", n:"Prolactina", u:"ng/mL", g:"horm", m:[4, 15.2], f:[4.8, 23.3], tip:"Prolactina alta pode reduzir libido e ereção e causar secreção no mamilo."},
  {k:"shbg", n:"SHBG", u:"nmol/L", g:"horm", m:[18, 54], f:[26, 110]},
  {k:"prog", n:"Progesterona", u:"ng/mL", g:"horm", m:[null, 1.4], f:null},
  {k:"hct", n:"Hematócrito", u:"%", g:"sangue", m:[40, 52], f:[36, 46], cm:[null, 54], cf:[null, 50], tip:"Hematócrito alto deixa o sangue mais grosso e aumenta o risco de trombose, infarto e AVC."},
  {k:"hb", n:"Hemoglobina", u:"g/dL", g:"sangue", m:[13.5, 17.5], f:[12, 15.5], cm:[null, 18.5], cf:[null, 17], tip:"Hemoglobina alta acompanha o hematócrito: sangue mais grosso, mais risco de trombose."},
  {k:"plt", n:"Plaquetas", u:"mil/mm³", g:"sangue", m:[150, 450], f:[150, 450]},
  {k:"ct", n:"Colesterol total", u:"mg/dL", g:"lip", m:[null, 190], f:[null, 190]},
  {k:"hdl", n:"HDL", u:"mg/dL", g:"lip", m:[40, null], f:[50, null], cm:[30, null], cf:[35, null], tip:"HDL baixo aumenta o risco cardiovascular. Hormônios, principalmente orais, costumam derrubar o HDL."},
  {k:"ldl", n:"LDL", u:"mg/dL", g:"lip", m:[null, 130], f:[null, 130], cm:[null, 190], cf:[null, 190], tip:"LDL alto aumenta o risco de placas nas artérias."},
  {k:"tg", n:"Triglicerídeos", u:"mg/dL", g:"lip", m:[null, 150], f:[null, 150], cm:[null, 500], cf:[null, 500]},
  {k:"tgo", n:"TGO (AST)", u:"U/L", g:"figado", m:[null, 40], f:[null, 32], cm:[null, 120], cf:[null, 96], tip:"Pode indicar sobrecarga no fígado (orais pesam mais). Treino pesado nos 2–3 dias antes do exame também eleva TGO, TGP e CK."},
  {k:"tgp", n:"TGP (ALT)", u:"U/L", g:"figado", m:[null, 41], f:[null, 33], cm:[null, 123], cf:[null, 99], tip:"Pode indicar sobrecarga no fígado (orais pesam mais). Treino pesado nos 2–3 dias antes do exame também eleva TGO, TGP e CK."},
  {k:"ggt", n:"GGT", u:"U/L", g:"figado", m:[8, 61], f:[5, 36], cm:[null, 183], cf:[null, 108], tip:"GGT alta aponta para o fígado ou vias biliares (álcool e orais elevam)."},
  {k:"bt", n:"Bilirrubina total", u:"mg/dL", g:"figado", m:[0.2, 1.2], f:[0.2, 1.2], cm:[null, 3], cf:[null, 3], tip:"Bilirrubina alta com pele ou olhos amarelados é sinal de alerta do fígado: procure atendimento."},
  {k:"cr", n:"Creatinina", u:"mg/dL", g:"rim", m:[0.7, 1.3], f:[0.5, 1.1], cm:[null, 2], cf:[null, 1.7], tip:"Quem tem muita massa muscular ou usa creatina tende a ter creatinina mais alta. A cistatina C ajuda o médico a separar músculo de problema no rim."},
  {k:"ur", n:"Ureia", u:"mg/dL", g:"rim", m:[15, 45], f:[15, 45], tip:"Dieta rica em proteína costuma subir a ureia."},
  {k:"cys", n:"Cistatina C", u:"mg/L", g:"rim", m:[0.6, 1.0], f:[0.6, 1.0], tip:"A cistatina C não depende da massa muscular: é a melhor pista do rim para quem treina pesado."},
  {k:"tfg", n:"Filtração glomerular (TFG)", u:"mL/min", g:"rim", m:[90, null], f:[90, null], cm:[60, null], cf:[60, null]},
  {k:"ck", n:"CK (creatinoquinase)", u:"U/L", g:"rim", m:[39, 308], f:[26, 192], tip:"CK sobe muito depois do treino. Só preocupa muito alta ou com urina escura e dor forte: aí procure atendimento."},
  {k:"gli", n:"Glicemia de jejum", u:"mg/dL", g:"meta", m:[70, 99], f:[70, 99], cm:[null, 125], cf:[null, 125], tip:"Glicemia alta indica resistência à insulina ou diabetes (GH e insulina exógena pesam aqui)."},
  {k:"ins", n:"Insulina de jejum", u:"µUI/mL", g:"meta", m:[2.6, 24.9], f:[2.6, 24.9]},
  {k:"a1c", n:"Hemoglobina glicada (HbA1c)", u:"%", g:"meta", m:[null, 5.6], f:[null, 5.6], cm:[null, 6.4], cf:[null, 6.4]},
  {k:"tsh", n:"TSH", u:"mUI/L", g:"meta", m:[0.4, 4.5], f:[0.4, 4.5]},
  {k:"t4l", n:"T4 livre", u:"ng/dL", g:"meta", m:[0.9, 1.7], f:[0.9, 1.7]},
  {k:"psa", n:"PSA total", u:"ng/mL", g:"meta", m:[null, 4], f:null, cm:[null, 10], tip:"PSA alto precisa de avaliação do urologista. Exame indicado principalmente para homens acima de 40 anos."},
  {k:"fer", n:"Ferritina", u:"ng/mL", g:"meta", m:[30, 400], f:[13, 150]}
];
const HMKX = Object.fromEntries(HMK.map(m => [m.k, m]));
const HPHASE = {pre:"Antes de começar", dur:"Durante o uso", pos:"Depois (pós/TPC)", rot:"Rotina"};
const HKIND = {trt:"Reposição prescrita (TRT)", ciclo:"Ciclo", tpc:"TPC (pós-ciclo)", outro:"Outro"};
const HVIA = {im:"Injetável (intramuscular)", sc:"Injetável (subcutânea)", oral:"Oral", gel:"Gel / adesivo", outro:"Outra"};
const HSYM = [
  ["acne","Acne / oleosidade"],["cabelo","Queda de cabelo"],["retencao","Retenção / inchaço"],["gineco","Mamilo sensível ou caroço (ginecomastia)"],
  ["libido","Libido alterada"],["humor","Irritabilidade / humor"],["ansiedade","Ansiedade"],["sono","Sono ruim"],
  ["erecao","Dificuldade de ereção", "m"],["local","Dor ou inchaço no local da aplicação"],["cabeca","Dor de cabeça"],
  ["voz","Voz mais grossa", "f"],["pelos","Aumento de pelos no rosto ou corpo", "f"],["clitoris","Aumento do clitóris", "f"],["menstrua","Ciclo menstrual alterado", "f"],
  ["peito","Dor no peito, palpitação ou falta de ar", "", "urg"],["perna","Dor e inchaço em uma panturrilha", "", "urg"],["ictericia","Pele ou olhos amarelados / urina escura", "", "urg"]
];
const HLV = ["Não", "Leve", "Médio", "Forte"];

function hRef(k, h = H()){
  if (h.refs && h.refs[k]) return h.refs[k];
  const m = HMKX[k]; return m ? (P().sex === "f" ? m.f : m.m) : null;
}
function hCrit(k){ const m = HMKX[k]; return m ? (P().sex === "f" ? m.cf : m.cm) : null; }
function hStatus(k, v, h){
  if (v == null) return null;
  const r = hRef(k, h), c = hCrit(k);
  if (c && ((c[0] != null && v < c[0]) || (c[1] != null && v > c[1]))) return {lv:"bad", t:v > (c[1] ?? Infinity) ? "muito alto" : "muito baixo"};
  if (!r) return {lv:"", t:"sem faixa"};
  if (r[0] != null && v < r[0]) return {lv:"warn", t:"abaixo"};
  if (r[1] != null && v > r[1]) return {lv:"warn", t:"acima"};
  return {lv:"good", t:"na faixa"};
}
const refTxt = r => !r ? "varia (ver laudo)" : r[0] != null && r[1] != null ? `${fmt(r[0], r[0] % 1 ? 1 : 0)}–${fmt(r[1], r[1] % 1 ? 1 : 0)}` : r[0] != null ? `≥ ${fmt(r[0], r[0] % 1 ? 1 : 0)}` : `≤ ${fmt(r[1], r[1] % 1 ? 1 : 0)}`;
const hExams = h => [...(h.exams || [])].sort((a, b) => a.date.localeCompare(b.date));
function lastVal(h, k){ const e = hExams(h).reverse().find(x => x.v && x.v[k] != null); return e ? {v:e.v[k], date:e.date} : null; }
const hVitals = h => [...(h.vitals || [])].sort((a, b) => (a.date + (a.t || "")).localeCompare(b.date + (b.t || "")));
function paClass(s, d){
  if (s >= 180 || d >= 120) return {lv:"bad", t:"crise hipertensiva"};
  if (s >= 140 || d >= 90) return {lv:"bad", t:"hipertensão"};
  if (s >= 130 || d >= 85) return {lv:"warn", t:"pré-hipertensão"};
  if (s >= 120 || d >= 80) return {lv:"good", t:"normal"};
  return {lv:"good", t:"ótima"};
}
const hActive = (pr, d = todayISO()) => pr.start && pr.start <= d && (!pr.end || pr.end >= d);
const hasGroupSince = (h, g, since) => hExams(h).some(e => e.date >= since && Object.keys(e.v || {}).some(k => HMKX[k] && HMKX[k].g === g));

/* ---------- alertas ---------- */
function hAlerts(h = H()){
  const out = [], today = todayISO();
  HMK.forEach(m => { const lv = lastVal(h, m.k); if (!lv) return; const s = hStatus(m.k, lv.v, h); if (!s || (s.lv !== "warn" && s.lv !== "bad")) return;
    out.push({lv:s.lv, t:`${m.n} ${s.t}: ${fmt(lv.v, lv.v % 1 ? 1 : 0)} ${m.u}`, d:`${m.tip ? m.tip + " " : ""}Exame de ${dLabel(lv.date)} · faixa ${refTxt(hRef(m.k, h))}. ${s.lv === "bad" ? "Leve esse resultado ao médico o quanto antes." : "Mostre ao seu médico."}`, k:m.k}); });
  ["ecg", "eco"].forEach(k => { const e = hExams(h).reverse().find(x => x[k]); if (e && e[k] === "alt") out.push({lv:"bad", t:`${k === "ecg" ? "Eletrocardiograma" : "Ecocardiograma"} com alteração (${dLabel(e.date)})`, d:"Alteração no coração precisa de avaliação do cardiologista antes de seguir com qualquer hormônio."}); });
  const vs = hVitals(h), lv = vs[vs.length - 1];
  if (lv) { const c = paClass(lv.sys, lv.dia); if (c.lv !== "good") out.push({lv:c.lv, t:`Pressão ${lv.sys}/${lv.dia} mmHg: ${c.t}`, d:(lv.sys >= 180 || lv.dia >= 120) ? "Com dor no peito, falta de ar, dor de cabeça forte ou alteração na visão, procure um pronto atendimento agora." : "Hormônios e retenção de líquido sobem a pressão. Meça de novo em repouso e mostre os registros ao médico."});
    if (+lv.hr > 100) out.push({lv:"warn", t:`Frequência cardíaca em repouso alta: ${lv.hr} bpm`, d:"Acima de 100 bpm em repouso merece avaliação médica."}); }
  const recent = (h.syms || []).filter(s => s.date >= addDays(today, -14));
  const worst = {}; recent.forEach(s => Object.entries(s.s || {}).forEach(([k, v]) => { worst[k] = Math.max(worst[k] || 0, +v || 0); }));
  HSYM.forEach(([k, n, sx, urg]) => { const v = worst[k] || 0; if (!v) return;
    if (urg) out.push({lv:"bad", t:`${n}`, d:k === "perna" ? "Pode ser trombose. Procure um pronto atendimento hoje." : k === "ictericia" ? "Pode ser problema no fígado. Procure atendimento médico hoje." : "Procure um pronto atendimento agora se estiver acontecendo."});
    else if (["voz","pelos","clitoris"].includes(k)) out.push({lv:"bad", t:`Sinal de virilização: ${n.toLowerCase()}`, d:"Esses sinais podem ficar permanentes. Converse com seu médico logo."});
    else if (k === "gineco") out.push({lv:"warn", t:"Sensibilidade ou caroço no mamilo", d:"Ginecomastia tratada cedo tem mais chance de regredir. " + H_MED});
    else if (v >= 3) out.push({lv:"warn", t:`${n}: forte`, d:"Registre e leve ao médico."}); });
  const act = (h.protos || []).filter(p => hActive(p) && p.kind !== "outro");
  if (act.length) {
    if (act.some(p => p.via === "oral") && !hasGroupSince(h, "figado", addDays(today, -56))) out.push({lv:"warn", t:"Uso oral sem exame de fígado recente", d:"Orais pesam no fígado. Faça TGO, TGP, GGT e bilirrubinas (sem exame de fígado nas últimas 8 semanas)."});
    const st = act.map(p => p.start).sort()[0];
    if (daysBetween(st, today) > 42 && !hasGroupSince(h, "sangue", addDays(today, -84))) out.push({lv:"warn", t:"Sem hemograma nas últimas 12 semanas", d:"Durante o uso, o hematócrito é o exame que mais importa acompanhar."});
    if (!vs.length || vs[vs.length - 1].date < addDays(today, -7)) out.push({lv:"info", t:"Medir a pressão esta semana", d:vs.length ? `Última medida em ${dLabel(vs[vs.length - 1].date)}.` : "Ainda não há medidas. O ideal durante o uso é medir uma vez por semana."});
    if (!act.some(p => p.med)) out.push({lv:"info", t:"Sem acompanhamento médico marcado", d:"Hormônio só com prescrição e acompanhamento. " + H_MED});
  }
  return out.sort((a, b) => ({bad:0, warn:1, info:2}[a.lv] ?? 3) - ({bad:0, warn:1, info:2}[b.lv] ?? 3));
}

/* ---------- agenda de exames (só datas, nunca conduta) ---------- */
function hSteps(h = H()){
  const out = [], today = todayISO(), ex = hExams(h), done = d0 => ex.some(e => e.date >= d0);
  (h.protos || []).filter(p => p.start && p.kind !== "outro").forEach(p => {
    const end = p.end, st = p.start;
    if (st > today && !ex.some(e => e.date >= addDays(st, -60) && e.date <= st)) out.push({d:addDays(st, -14), t:`Exames antes de começar: ${p.n}`, s:"Hormonal, hemograma, lipídico, fígado, rins, glicemia e PA. Serve de base para comparar."});
    if (end) { const mid = addDays(st, Math.round(daysBetween(st, end) / 2)); if (mid > addDays(st, 21) && !ex.some(e => e.date >= addDays(mid, -14) && e.date <= addDays(mid, 14))) out.push({d:mid, t:`Exames no meio do uso: ${p.n}`, s:"Principalmente hematócrito, lipídico, fígado e pressão."}); }
    else if (hActive(p) && !done(addDays(today, -84))) out.push({d:today, t:`Exames de acompanhamento: ${p.n}`, s:"Uso contínuo: refaça a cada 3 meses, ou quando o médico pedir."});
    if (end && !ex.some(e => e.date >= addDays(end, 21))) out.push({d:addDays(end, 42), t:`Exames 4 a 8 semanas depois do fim: ${p.n}`, s:`Janela de ${dLabel(addDays(end, 28))} a ${dLabel(addDays(end, 56))}. Mostra se o eixo hormonal e o sangue voltaram ao normal.`});
  });
  const heart = ex.filter(e => e.ecg || e.eco).pop();
  if ((h.protos || []).some(p => p.kind !== "outro") && (!heart || heart.date < addDays(today, -365))) out.push({d:heart ? addDays(heart.date, 365) : today, t:"Coração: eletrocardiograma e ecocardiograma", s:heart ? `Último em ${dLabel(heart.date)}. O ideal é pelo menos 1 vez por ano.` : "Pelo menos 1 vez por ano para quem usa hormônios."});
  if (h.nextExam) out.push({d:h.nextExam, t:"Exame marcado por você", s:h.nextNote || "", own:true});
  return out.sort((a, b) => a.d.localeCompare(b.d)).slice(0, 6);
}
function gcalDay(title, d, details){
  const a = d.replace(/-/g, ""), b = addDays(d, 1).replace(/-/g, "");
  return "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(title) + "&dates=" + a + "/" + b + "&details=" + encodeURIComponent(details);
}
function gcalWeek(title, hm, days, details){
  const by = days.map(w => ["SU","MO","TU","WE","TH","FR","SA"][w]).join(",");
  let d = todayISO(); while (!days.includes(parseISO(d).getDay())) d = addDays(d, 1);
  const st = hm.replace(":", ""), en = toHM(Math.min(toMin(hm) + 15, 1439)).replace(":", ""), dd = d.replace(/-/g, "");
  return "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(title) + "&dates=" + dd + "T" + st + "00/" + dd + "T" + en + "00&details=" + encodeURIComponent(details) + "&recur=" + encodeURIComponent("RRULE:FREQ=WEEKLY;BYDAY=" + by);
}

/* ---------- cruzamento com corpo e treino ---------- */
function atDate(list, d){ const before = list.filter(x => x.x <= d).pop(); if (before && daysBetween(before.x, d) <= 21) return before; const after = list.find(x => x.x > d); return after && daysBetween(d, after.x) <= 14 ? after : before || null; }
function bestLifts(a, b){ const best = {}; allSessions().filter(s => s.date >= a && s.date <= b).forEach(s => s.ex.forEach(e => e.sets.forEach(st => { const v = e1rm(+st.kg || 0, +st.r || 0); if (v > (best[e.id] || 0)) best[e.id] = v; }))); return best; }
function hCross(pr){
  const p = P(), ms = measures(), today = todayISO(), a = pr.start, b = pr.end && pr.end < today ? pr.end : today;
  const W = ms.filter(m => +m.weight).map(m => ({x:m.date, y:+m.weight})), WA = ms.filter(m => +m.waist).map(m => ({x:m.date, y:+m.waist}));
  const BF = ms.map(m => { const r = bfOf(p, m); return r ? {x:m.date, y:r.v} : null; }).filter(Boolean);
  const pair = L => { const s = atDate(L, a), e = atDate(L, b); return s && e && s.x !== e.x ? {s:s.y, e:e.y, d:e.y - s.y} : null; };
  const base = bestLifts(addDays(a, -28), a), cur = bestLifts(addDays(b, -28), b);
  const ids = Object.keys(base).filter(k => cur[k] && base[k] > 0), str = ids.length ? ids.reduce((s, k) => s + (cur[k] / base[k] - 1), 0) / ids.length * 100 : null;
  const ss = allSessions().filter(s => s.date >= a && s.date <= b), rp = ss.flatMap(s => s.ex.flatMap(e => e.sets.map(st => +st.rpe).filter(Boolean)));
  const vs = hVitals(H()), avgPA = L => L.length ? Math.round(L.reduce((s, v) => s + v.sys, 0) / L.length) + "/" + Math.round(L.reduce((s, v) => s + v.dia, 0) / L.length) : null;
  const after = pr.end && pr.end < today ? (() => { const e = atDate(W, pr.end), n = W[W.length - 1]; return e && n && n.x > pr.end ? n.y - e.y : null; })() : null;
  return {w:pair(W), waist:pair(WA), bf:pair(BF), str, nEx:ids.length, sess:ss.length, rpe:rp.length ? rp.reduce((s, v) => s + v, 0) / rp.length : null,
    paBefore:avgPA(vs.filter(v => v.date < a && v.date >= addDays(a, -60))), paDuring:avgPA(vs.filter(v => v.date >= a && v.date <= b)), after, b};
}
const sgn = (v, d = 1, u = "") => v == null ? "—" : (v > 0 ? "+" : v < 0 ? "−" : "") + fmt(Math.abs(v), d) + u;

/* ---------- telas ---------- */
const hBanner = () => `<div class="h-banner">${ic("alert")}<div><b>Este módulo só registra e alerta.</b> Ele não indica substância, dose nem protocolo, e não substitui consulta. Hormônio só com prescrição e acompanhamento de um <b>endocrinologista ou médico do esporte</b>.<div class="h-lock">${ic("lock")}Privado: só você vê, na sua conta. Nunca aparece na Comunidade.</div></div></div>`;
function vSaude(){
  const h = H();
  if (!h.ok) return `<div class="ph"><div><div class="eyebrow">Redução de danos · exames · pressão · sintomas</div><h1>Saúde hormonal</h1></div></div>
    <section class="panel h-gate"><div class="panel-h"><h2>${ic("shield")}Antes de começar</h2></div>
      <p>Muita gente usa hormônios sem monitorar nada. Este espaço existe para você <b>acompanhar a sua saúde</b>, levar dados organizados ao médico e perceber cedo quando algo sai do normal.</p>
      <ul><li><b>O app nunca sugere</b> substância, dose, ciclo ou protocolo. Você registra o que já foi definido com seu médico.</li>
        <li>Os alertas usam faixas gerais de referência. <b>O seu laudo e o seu médico têm a palavra final.</b></li>
        <li>Usar esteroides anabolizantes sem prescrição traz riscos sérios para coração, fígado, rins, fertilidade e humor.</li>
        <li>Seus registros ficam <b>só na sua conta</b> e nunca vão para a Comunidade.</li>
        <li>Sinais de emergência (dor no peito, falta de ar, panturrilha inchada e dolorida, pele amarelada): <b>procure um pronto atendimento</b>.</li></ul>
      <div class="row"><button class="btn primary" data-act="hAgree">${ic("check")}Entendi, quero acompanhar minha saúde</button><button class="btn ghost" data-act="go" data-arg="inicio">Agora não</button></div></section>`;
  const seg = `<div class="seg scroll">${[["painel","Painel"],["exames","Exames"],["protocolo","Protocolo"],["pressao","Pressão"],["sintomas","Sintomas"]].map(([k, n]) => `<button data-act="htab" data-arg="${k}" aria-pressed="${UI.htab === k}">${n}</button>`).join("")}</div>`;
  const body = {painel:hPainel, exames:hExamesTab, protocolo:hProtoTab, pressao:hPATab, sintomas:hSymTab}[UI.htab] || hPainel;
  return `<div class="ph"><div><div class="eyebrow">Redução de danos · privado</div><h1>Saúde hormonal</h1><p class="lede">Exames, pressão, sintomas e o que você usa, num só lugar, para levar ao médico.</p></div><div class="row"><button class="btn" data-act="hPDF">${ic("file")}Relatório para o médico</button></div></div>${hBanner()}${seg}<div style="height:12px"></div>${body(h)}`;
}
function alertHTML(a){ return `<div class="h-al ${a.lv}">${ic(a.lv === "bad" ? "alert" : a.lv === "info" ? "info" : a.lv === "good" ? "check" : "alert")}<div><b>${esc(a.t)}</b><br>${esc(a.d)}</div></div>`; }
function hPainel(h){
  const al = hAlerts(h), steps = hSteps(h), today = todayISO(), vs = hVitals(h), lv = vs[vs.length - 1], ex = hExams(h), le = ex[ex.length - 1];
  const act = (h.protos || []).filter(p => hActive(p)), main = act[0] || [...(h.protos || [])].filter(p => p.start && p.start <= today).sort((a, b) => b.start.localeCompare(a.start))[0];
  const X = main ? hCross(main) : null;
  return `<div class="grid g2">
    <section class="panel"><div class="panel-h"><h2>${ic("alert")}Alertas</h2><span class="sub">${al.length ? al.length + (al.length > 1 ? " itens" : " item") : ""}</span></div>
      <div class="h-alerts">${al.length ? al.map(alertHTML).join("") : `<div class="h-al good">${ic("check")}<div><b>Nada fora do normal nos seus registros.</b><br>${ex.length ? "Continue fazendo os exames nas datas certas." : "Registre seus exames para os alertas funcionarem."}</div></div>`}</div>
      <p class="sub" style="margin-top:10px">Alertas são um lembrete para conversar com o médico, não um diagnóstico.</p></section>
    <section class="panel"><div class="panel-h"><h2>${ic("calendar")}Próximos exames</h2><button class="btn sm" data-act="hNext">${ic("plus")}Marcar data</button></div>
      <div class="h-steps">${steps.length ? steps.map(s => `<div class="h-step ${s.d < today ? "late" : ""}"><span class="dt">${s.d <= today ? (s.d < today ? "atrasado" : "hoje") : dShort(s.d)}</span><span><b>${esc(s.t)}</b><br><span class="sub">${esc(s.s)}</span></span><span class="row" style="gap:4px;flex-wrap:nowrap"><a class="iconbtn" href="${gcalDay(s.t, s.d < today ? today : s.d, s.s + "\n\n" + H_MED)}" target="_blank" rel="noopener" aria-label="Adicionar ao Google Agenda" title="Adicionar ao Google Agenda">${ic("calendar")}</a>${s.own ? `<button class="iconbtn" data-act="hNextDel" aria-label="Remover data">${ic("x")}</button>` : ""}</span></div>`).join("") : `<div class="empty">Registre seu protocolo com as datas de início e fim: o app monta a agenda de exames (antes, durante e 4–8 semanas depois).</div>`}</div></section>
  </div>
  <section class="panel" style="margin-top:16px"><div class="stats" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">
    <div class="stat"><span class="lbl">Em uso agora</span><div class="v num">${act.length}</div><div class="d">${act.length ? esc(act.map(p => p.n).join(", ")) : "nenhum registro ativo"}</div></div>
    <div class="stat"><span class="lbl">Semana do uso</span><div class="v num">${act.length ? Math.floor(daysBetween(act.map(p => p.start).sort()[0], today) / 7) + 1 : "—"}</div><div class="d">${act.length ? "desde " + dLabel(act.map(p => p.start).sort()[0]) : "—"}</div></div>
    <div class="stat"><span class="lbl">Último exame</span><div class="v num" style="font-size:24px">${le ? dShort(le.date) : "—"}</div><div class="d">${le ? HPHASE[le.phase] || "" : "nenhum registrado"}</div></div>
    <div class="stat"><span class="lbl">Última pressão</span><div class="v num" style="font-size:24px">${lv ? lv.sys + "/" + lv.dia : "—"}</div><div class="d">${lv ? `<span class="pill ${paClass(lv.sys, lv.dia).lv}">${paClass(lv.sys, lv.dia).t}</span>` : "sem medida"}</div></div>
    <div class="stat"><span class="lbl">Hematócrito</span><div class="v num" style="font-size:24px">${lastVal(h, "hct") ? fmt(lastVal(h, "hct").v, 1) + "<small>%</small>" : "—"}</div><div class="d">${lastVal(h, "hct") ? `<span class="pill ${hStatus("hct", lastVal(h, "hct").v, h).lv}">${hStatus("hct", lastVal(h, "hct").v, h).t}</span>` : "sem exame"}</div></div>
  </div></section>
  ${X ? `<section class="panel" style="margin-top:16px"><div class="panel-h"><h2>${ic("up")}${esc(main.n)} × corpo e treino</h2><span class="sub">de ${dLabel(main.start)} até ${X.b === today ? "hoje" : dLabel(X.b)}</span></div>
    <div class="h-x">
      <div><span>Peso</span><b class="num">${X.w ? sgn(X.w.d, 1, " kg") : "—"}</b><br><em>${X.w ? fmt(X.w.s, 1) + " → " + fmt(X.w.e, 1) + " kg" : "registre o peso em Evolução"}</em></div>
      <div><span>Cintura</span><b class="num">${X.waist ? sgn(X.waist.d, 1, " cm") : "—"}</b><br><em>${X.waist ? "retenção também conta" : "sem medidas no período"}</em></div>
      <div><span>% de gordura</span><b class="num">${X.bf ? sgn(X.bf.d, 1, " pts") : "—"}</b><br><em>${X.bf ? fmt(X.bf.s, 1) + "% → " + fmt(X.bf.e, 1) + "%" : "precisa das medidas"}</em></div>
      <div><span>Força (1RM estimado)</span><b class="num">${X.str != null ? sgn(X.str, 1, "%") : "—"}</b><br><em>${X.str != null ? `média de ${X.nEx} exercícios` : "precisa de treinos antes e no período"}</em></div>
      <div><span>Treinos no período</span><b class="num">${X.sess}</b><br><em>${X.rpe ? "RPE médio " + fmt(X.rpe, 1) : "sem RPE"}</em></div>
      <div><span>Pressão média</span><b class="num">${X.paDuring || "—"}</b><br><em>${X.paBefore ? "antes: " + X.paBefore : "sem medidas de antes"}</em></div>
      ${X.after != null ? `<div><span>Peso desde o fim</span><b class="num">${sgn(X.after, 1, " kg")}</b><br><em>quanto ficou depois de parar</em></div>` : ""}
    </div>
    <p class="sub" style="margin-top:10px">Retenção de líquido infla peso e cintura no começo e some ao parar. Compare com as fotos e com a força.</p></section>` : ""}`;
}
function hExamesTab(h){
  const ex = hExams(h), withV = HMK.filter(m => ex.some(e => e.v && e.v[m.k] != null));
  if (!withV.find(m => m.k === UI.hmk) && withV.length) UI.hmk = withV[0].k;
  const mk = HMKX[UI.hmk] || HMK[0], r = hRef(mk.k, h);
  const pts = ex.filter(e => e.v && e.v[mk.k] != null).map(e => ({x:e.date, y:+e.v[mk.k]}));
  const xs = pts.length ? [pts[0].x, pts[pts.length - 1].x] : [];
  const series = [{pts, color:"var(--accent)", name:mk.n, area:true, dots:true}];
  if (r && pts.length) { if (r[1] != null) series.push({pts:xs.map(x => ({x, y:r[1]})), color:"var(--warn)", name:"Limite de cima", dash:"5 5", width:1.4, noEnd:true}); if (r[0] != null) series.push({pts:xs.map(x => ({x, y:r[0]})), color:"var(--faint)", name:"Limite de baixo", dash:"5 5", width:1.4, noEnd:true}); }
  const lastE = [...ex].reverse();
  return `<div class="grid g-evo">
    <section class="panel"><div class="panel-h"><h2>${ic("up")}Evolução</h2><button class="btn primary sm" data-act="hExamNew">${ic("plus")}Novo exame</button></div>
      ${withV.length ? `<div class="chips" style="margin-bottom:12px">${withV.map(m => `<button class="chip" data-act="hmk" data-arg="${m.k}" aria-pressed="${UI.hmk === m.k}">${esc(m.n)}</button>`).join("")}</div>` : ""}
      ${lineChartM(series, {unit:mk.u, label:mk.n, empty:"Seus exames viram gráfico aqui", emptySub:"Toque em Novo exame e copie os valores do laudo."})}
      ${pts.length ? `<p class="sub" style="margin-top:8px">Faixa usada: <b>${refTxt(r)} ${esc(mk.u)}</b>. <button class="btn sm ghost" data-act="hRef" data-arg="${mk.k}">${ic("edit")}Usar a faixa do meu laudo</button></p>${mk.tip ? `<p class="sub">${esc(mk.tip)}</p>` : ""}` : ""}
    </section>
    <section class="panel"><div class="panel-h"><h2>${ic("flask")}Últimos resultados</h2></div>
      ${ex.length ? `<div class="h-wrap"><table class="h-tbl"><thead><tr><th>Exame</th><th style="text-align:right">Valor</th><th>Faixa</th></tr></thead><tbody>${HGROUPS.map(g => { const rows = HMK.filter(m => m.g === g.id).map(m => ({m, lv:lastVal(h, m.k)})).filter(x => x.lv); return rows.length ? `<tr class="h-grp"><td colspan="3">${g.n}</td></tr>` + rows.map(({m, lv}) => { const s = hStatus(m.k, lv.v, h); return `<tr><td><button class="lnk" data-act="hmk" data-arg="${m.k}">${esc(m.n)}</button><br><span class="sub">${dShort(lv.date)}</span></td><td class="v"><span class="pill ${s.lv}">${fmt(lv.v, lv.v % 1 ? 1 : 0)}</span></td><td class="r">${refTxt(hRef(m.k, h))} ${esc(m.u)}</td></tr>`; }).join("") : ""; }).join("")}</tbody></table></div>` : `<div class="empty">Nenhum exame registrado.</div>`}
    </section></div>
  <section class="panel" style="margin-top:16px"><div class="panel-h"><h2>${ic("history")}Histórico</h2></div>
    <div class="h-list">${lastE.length ? lastE.map(e => `<div class="h-item"><span><b>${dLabel(e.date)} ${parseISO(e.date).getFullYear()} · ${HPHASE[e.phase] || ""}</b><span class="sub">${Object.keys(e.v || {}).length} valores${e.lab ? " · " + esc(e.lab) : ""}${e.ecg ? " · ECG " + (e.ecg === "ok" ? "normal" : "alterado") : ""}${e.eco ? " · Eco " + (e.eco === "ok" ? "normal" : "alterado") : ""}${(() => { const n = Object.entries(e.v || {}).filter(([k, v]) => { const s = hStatus(k, v, h); return s && (s.lv === "warn" || s.lv === "bad"); }).length; return n ? ` · <b style="color:var(--warn)">${n} fora da faixa</b>` : ""; })()}</span></span><span class="row" style="gap:4px;flex-wrap:nowrap"><button class="iconbtn" data-act="hExamEdit" data-arg="${e.id}" aria-label="Editar exame">${ic("edit")}</button><button class="iconbtn" data-act="hExamDel" data-arg="${e.id}" aria-label="Apagar exame">${ic("trash")}</button></span></div>`).join("") : `<div class="empty">Comece pelo exame de antes (base): é com ele que tudo é comparado.</div>`}</div>
    <details style="margin-top:12px"><summary class="sub" style="font-weight:600">Quais exames fazer e quando</summary><ul class="blist cue" style="margin-top:10px">${["Quando: antes de começar, no meio do uso e de 4 a 8 semanas depois do fim. Em uso contínuo, a cada 3 meses.","Hormonal: testosterona total e livre, estradiol, LH, FSH, prolactina e SHBG; progesterona se o médico indicar.","Hemograma completo: hematócrito e hemoglobina são os principais.","Perfil lipídico: HDL, LDL e triglicerídeos.","Fígado: TGO, TGP, GGT e bilirrubinas, essencial com orais.","Rins: creatinina, ureia, cistatina C e urina tipo 1.","Outros: glicemia, insulina, HbA1c, TSH, T4 livre, ferritina e PSA (homens acima de 40).","Coração: eletrocardiograma e ecocardiograma pelo menos 1 vez por ano.","No dia anterior ao exame: evite treino pesado (sobe TGO, TGP e CK) e álcool, e siga o jejum que o laboratório pedir."].map(x => `<li>${ic("check")}<span>${x}</span></li>`).join("")}</ul></details></section>`;
}
function hExamModal(id){
  const h = H(), e = (h.exams || []).find(x => x.id === id) || {date:todayISO(), phase:(h.protos || []).some(p => hActive(p)) ? "dur" : "rot", v:{}};
  const f = m => { const r = hRef(m.k, h); return `<div class="field"><label for="hx-${m.k}">${esc(m.n)}</label><div class="input-u"><input id="hx-${m.k}" class="input num" type="text" inputmode="decimal" value="${e.v[m.k] != null ? String(e.v[m.k]).replace(".", ",") : ""}" placeholder="${r ? refTxt(r) : ""}"><span>${esc(m.u)}</span></div></div>`; };
  const sel = (k, v) => `<select id="hx-${k}" class="input"><option value="">Não fiz</option><option value="ok" ${v === "ok" ? "selected" : ""}>Normal</option><option value="alt" ${v === "alt" ? "selected" : ""}>Com alteração</option></select>`;
  openModal(`${sheetHead(id ? "Editar exame" : "Novo exame", "Copie os valores do laudo")}
    <div class="fields"><div class="field"><label for="hx-date">Data da coleta</label><input id="hx-date" class="input" type="date" value="${e.date}"></div>
      <div class="field"><label for="hx-phase">Momento</label><select id="hx-phase" class="input">${Object.entries(HPHASE).map(([k, n]) => `<option value="${k}" ${e.phase === k ? "selected" : ""}>${n}</option>`).join("")}</select></div></div>
    <div class="field"><label for="hx-lab">Laboratório (opcional)</label><input id="hx-lab" class="input" type="text" maxlength="60" value="${esc(e.lab || "")}"></div>
    <p class="sub" style="margin:0">Preencha só o que fez. Use vírgula ou ponto. O cinza é a faixa geral de referência.</p>
    ${HGROUPS.map((g, i) => `<details ${i < 4 || HMK.some(m => m.g === g.id && e.v[m.k] != null) ? "open" : ""}><summary style="font-weight:700;margin-bottom:8px">${g.n}</summary><div class="fields">${HMK.filter(m => m.g === g.id).map(f).join("")}</div></details>`).join("")}
    <details ${e.ecg || e.eco ? "open" : ""}><summary style="font-weight:700;margin-bottom:8px">Coração</summary><div class="fields"><div class="field"><label for="hx-ecg">Eletrocardiograma</label>${sel("ecg", e.ecg)}</div><div class="field"><label for="hx-eco">Ecocardiograma</label>${sel("eco", e.eco)}</div></div></details>
    <div class="field"><label for="hx-note">Observações</label><input id="hx-note" class="input" type="text" maxlength="200" value="${esc(e.note || "")}" placeholder="Ex.: treinei pesado na véspera"></div>
    <div class="row"><span class="spacer"></span><button class="btn ghost" data-act="closeModal">Cancelar</button><button class="btn primary" data-act="hExamSave" data-arg="${id || ""}">${ic("check")}Salvar exame</button></div>`, "wide");
}
function hProtoTab(h){
  const today = todayISO(), ps = [...(h.protos || [])].sort((a, b) => (b.start || "").localeCompare(a.start || ""));
  const card = p => { const last = (h.doses || []).filter(d => d.pid === p.id).sort((a, b) => b.date.localeCompare(a.date))[0];
    return `<div class="h-item stack"><span><b>${esc(p.n)}</b><span class="sub">${HKIND[p.kind] || ""} · ${HVIA[p.via] || ""}${p.dose ? " · " + esc(p.dose) : ""}${p.freq ? " · " + esc(p.freq) : ""}</span><br><span class="sub">${p.start ? "de " + dLabel(p.start) : "sem data"}${p.end ? " até " + dLabel(p.end) : p.start ? " · sem data de fim" : ""}${p.med ? " · com acompanhamento médico" : ""}${p.rem && p.rem.on ? ` · lembrete ${p.rem.days.map(w => DOW[w].slice(0, 3)).join(", ")} às ${p.rem.time}` : ""}${last ? " · última aplicação " + dLabel(last.date) : ""}</span></span>
      <span class="row" style="gap:4px;flex-wrap:nowrap">${hActive(p) ? `<button class="btn sm" data-act="hDose" data-arg="${p.id}">${ic("check")}Registrei</button>` : ""}${p.rem && p.rem.on && p.rem.days.length ? `<a class="iconbtn" href="${gcalWeek("Lembrete: " + p.n, p.rem.time, p.rem.days, "Registro do Desfrangolizador.")}" target="_blank" rel="noopener" aria-label="Lembrete no Google Agenda" title="Lembrete no Google Agenda">${ic("calendar")}</a>` : ""}<button class="iconbtn" data-act="hProtoEdit" data-arg="${p.id}" aria-label="Editar">${ic("edit")}</button><button class="iconbtn" data-act="hProtoDel" data-arg="${p.id}" aria-label="Apagar">${ic("trash")}</button></span></div>`; };
  const act = ps.filter(p => hActive(p, today)), fut = ps.filter(p => p.start > today), past = ps.filter(p => !hActive(p, today) && !(p.start > today));
  const doses = [...(h.doses || [])].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12);
  return `<div class="grid g-evo"><section class="panel"><div class="panel-h"><h2>${ic("pill")}O que você usa</h2><button class="btn primary sm" data-act="hProtoEdit">${ic("plus")}Registrar</button></div>
      <div class="note warn" style="margin-bottom:12px">${ic("info")}<span>Aqui você <b>anota</b> o que já foi definido com seu médico. O app não sugere, calcula nem avalia doses.</span></div>
      ${act.length ? `<h3 class="sub" style="font-weight:700;margin:4px 0 8px">Em uso</h3><div class="h-list">${act.map(card).join("")}</div>` : ""}
      ${fut.length ? `<h3 class="sub" style="font-weight:700;margin:14px 0 8px">Programado</h3><div class="h-list">${fut.map(card).join("")}</div>` : ""}
      ${past.length ? `<h3 class="sub" style="font-weight:700;margin:14px 0 8px">Encerrado</h3><div class="h-list">${past.map(card).join("")}</div>` : ""}
      ${ps.length ? "" : `<div class="empty">Nada registrado. Com as datas de início e fim, o app monta sua agenda de exames e cruza o período com peso, medidas e força.</div>`}</section>
    <section class="panel"><div class="panel-h"><h2>${ic("history")}Aplicações registradas</h2></div>
      <div class="h-list">${doses.length ? doses.map(d => { const p = (h.protos || []).find(x => x.id === d.pid); return `<div class="h-item"><span><b>${dLabel(d.date)}${d.t ? " · " + d.t : ""}</b><span class="sub">${esc(p ? p.n : "registro apagado")}</span></span><button class="iconbtn" data-act="hDoseDel" data-arg="${d.id}" aria-label="Apagar">${ic("x")}</button></div>`; }).join("") : `<div class="empty">Toque em Registrei sempre que aplicar ou tomar. Ajuda a não esquecer nem repetir.</div>`}</div>
      <p class="sub" style="margin-top:10px">Lembretes tocam com o app aberto. Para tocar com ele fechado, use o botão de agenda do registro.</p></section></div>`;
}
function hProtoModal(id){
  const h = H(), p = (h.protos || []).find(x => x.id === id) || {n:"", dose:"", freq:"", via:"im", kind:"trt", start:todayISO(), end:"", med:false, rem:{on:false, days:[], time:"08:00"}, note:""};
  const rem = p.rem || {on:false, days:[], time:"08:00"};
  openModal(`${sheetHead(id ? "Editar registro" : "Registrar o que você usa", "Só anotação, sem sugestão de dose")}
    <div class="field"><label for="hp-n">Nome (substância ou medicamento)</label><input id="hp-n" class="input" type="text" maxlength="60" value="${esc(p.n)}" placeholder="Como está na receita" autofocus></div>
    <div class="fields"><div class="field"><label for="hp-kind">Tipo</label><select id="hp-kind" class="input">${Object.entries(HKIND).map(([k, n]) => `<option value="${k}" ${p.kind === k ? "selected" : ""}>${n}</option>`).join("")}</select></div>
      <div class="field"><label for="hp-via">Via</label><select id="hp-via" class="input">${Object.entries(HVIA).map(([k, n]) => `<option value="${k}" ${p.via === k ? "selected" : ""}>${n}</option>`).join("")}</select></div></div>
    <div class="fields"><div class="field"><label for="hp-dose">Dose (como prescrito)</label><input id="hp-dose" class="input" type="text" maxlength="40" value="${esc(p.dose || "")}"></div>
      <div class="field"><label for="hp-freq">Frequência (como prescrito)</label><input id="hp-freq" class="input" type="text" maxlength="40" value="${esc(p.freq || "")}"></div></div>
    <div class="fields"><div class="field"><label for="hp-start">Início</label><input id="hp-start" class="input" type="date" value="${p.start || ""}"></div>
      <div class="field"><label for="hp-end">Fim (vazio = contínuo)</label><input id="hp-end" class="input" type="date" value="${p.end || ""}"></div></div>
    <label class="row" style="gap:8px;cursor:pointer"><input id="hp-med" type="checkbox" ${p.med ? "checked" : ""} style="width:20px;height:20px;accent-color:var(--accent)"><span>Tenho prescrição e acompanhamento médico</span></label>
    <div class="mgroup"><label class="row" style="gap:8px;cursor:pointer"><input id="hp-rem" type="checkbox" ${rem.on ? "checked" : ""} style="width:20px;height:20px;accent-color:var(--accent)"><b>Lembrete de aplicação</b></label>
      <div class="h-days" style="margin-top:10px">${[1,2,3,4,5,6,0].map(w => `<label><input type="checkbox" data-hday="${w}" ${rem.days.includes(w) ? "checked" : ""}>${DOW[w].slice(0, 3)}</label>`).join("")}</div>
      <div class="field" style="margin-top:10px;max-width:180px"><label for="hp-time">Horário</label><input id="hp-time" class="input" type="time" value="${rem.time || "08:00"}"></div></div>
    <div class="field"><label for="hp-note">Observações</label><input id="hp-note" class="input" type="text" maxlength="200" value="${esc(p.note || "")}" placeholder="Ex.: nome do médico, local de aplicação"></div>
    <div class="row"><span class="spacer"></span><button class="btn ghost" data-act="closeModal">Cancelar</button><button class="btn primary" data-act="hProtoSave" data-arg="${id || ""}">${ic("check")}Salvar</button></div>`, "wide");
}
function hPATab(h){
  const vs = hVitals(h), now = new Date();
  const sys = vs.map(v => ({x:v.date, y:+v.sys})), dia = vs.map(v => ({x:v.date, y:+v.dia})), hr = vs.filter(v => +v.hr).map(v => ({x:v.date, y:+v.hr}));
  return `<div class="grid g-evo"><section class="panel"><div class="panel-h"><h2>${ic("heart")}Pressão arterial</h2></div>
      ${lineChartM([{pts:sys, color:"var(--prot)", name:"Sistólica (máxima)", dots:true}, {pts:dia, color:"var(--carb)", name:"Diastólica (mínima)", dots:true}], {unit:"mmHg", label:"Pressão", empty:"Suas medidas viram gráfico aqui", emptySub:"Meça uma vez por semana, sentado, depois de 5 minutos em repouso."})}
      ${hr.length ? `<div style="margin-top:14px">${lineChart(hr, {h:160, unit:"bpm", label:"Frequência em repouso", color:"var(--lime)"})}</div>` : ""}
      <div class="h-list" style="margin-top:14px">${[...vs].reverse().slice(0, 10).map(v => { const c = paClass(v.sys, v.dia); return `<div class="h-item"><span><b class="num">${v.sys}/${v.dia} mmHg${v.hr ? " · " + v.hr + " bpm" : ""}</b><span class="sub">${dLabel(v.date)}${v.t ? " · " + v.t : ""} · <span class="pill ${c.lv}">${c.t}</span></span></span><button class="iconbtn" data-act="hPADel" data-arg="${v.id}" aria-label="Apagar">${ic("x")}</button></div>`; }).join("")}</div></section>
    <section class="panel"><div class="panel-h"><h2>${ic("plus")}Nova medida</h2></div><div class="col">
      <div class="fields"><div class="field"><label for="hv-date">Data</label><input id="hv-date" class="input" type="date" value="${todayISO()}"></div><div class="field"><label for="hv-t">Hora</label><input id="hv-t" class="input" type="time" value="${toHM(now.getHours() * 60 + now.getMinutes())}"></div></div>
      <div class="fields"><div class="field"><label for="hv-sys">Máxima (sistólica)</label><div class="input-u"><input id="hv-sys" class="input num" type="number" inputmode="numeric" placeholder="120"><span>mmHg</span></div></div><div class="field"><label for="hv-dia">Mínima (diastólica)</label><div class="input-u"><input id="hv-dia" class="input num" type="number" inputmode="numeric" placeholder="80"><span>mmHg</span></div></div></div>
      <div class="field"><label for="hv-hr">Frequência cardíaca em repouso</label><div class="input-u"><input id="hv-hr" class="input num" type="number" inputmode="numeric" placeholder="65"><span>bpm</span></div></div>
      <button class="btn primary" data-act="hPASave">${ic("check")}Salvar medida</button>
      <ul class="blist cue">${["Ótima: abaixo de 120/80 · Normal: até 129/84","Pré-hipertensão: 130–139 / 85–89","Hipertensão: 140/90 ou mais. Leve ao médico.","180/120 ou mais com sintomas: pronto atendimento.","Meça sentado, braço apoiado na altura do coração, sem café nem treino nos 30 minutos antes."].map(x => `<li>${ic("check")}<span>${x}</span></li>`).join("")}</ul></div></section></div>`;
}
function hSymTab(h){
  const sx = P().sex, list = HSYM.filter(s => !s[2] || s[2] === sx), ss = [...(h.syms || [])].sort((a, b) => b.date.localeCompare(a.date));
  const tot = [...ss].reverse().map(s => ({x:s.date, y:Object.entries(s.s || {}).filter(([k]) => !HSYM.find(x => x[0] === k && x[3])).reduce((a, [, v]) => a + (+v || 0), 0)}));
  return `<div class="grid g-evo"><section class="panel"><div class="panel-h"><h2>${ic("list")}Como você está?</h2><span class="sub">marque o que sentiu nos últimos dias</span></div>
      <div class="field" style="max-width:200px;margin-bottom:12px"><label for="hs-date">Data</label><input id="hs-date" class="input" type="date" value="${todayISO()}"></div>
      <div class="h-sym">${list.map(([k, n, , urg]) => `<span style="font-size:14px${urg ? ";color:var(--bad);font-weight:600" : ""}">${esc(n)}</span><div class="seg" role="group" aria-label="${esc(n)}">${(urg ? [0, 3] : [0, 1, 2, 3]).map(v => `<button data-act="hSymLv" data-k="${k}" data-v="${v}" aria-pressed="${v === 0}">${urg ? (v ? "Sim" : "Não") : HLV[v]}</button>`).join("")}</div>`).join("")}</div>
      <div class="field" style="margin-top:12px"><label for="hs-note">Observações</label><input id="hs-note" class="input" type="text" maxlength="200" placeholder="Ex.: humor mais curto na semana 3"></div>
      <div class="row" style="margin-top:12px"><span class="spacer"></span><button class="btn primary" data-act="hSymSave">${ic("check")}Salvar</button></div></section>
    <section class="panel"><div class="panel-h"><h2>${ic("up")}Pontuação ao longo do tempo</h2></div>
      ${lineChart(tot, {h:180, unit:"pts", label:"Soma dos sintomas", empty:"Registre a cada 1–2 semanas", emptySub:"Leve = 1, médio = 2, forte = 3."})}
      <div class="h-list" style="margin-top:14px">${ss.slice(0, 8).map(s => { const on = Object.entries(s.s || {}).filter(([, v]) => +v > 0); return `<div class="h-item"><span><b>${dLabel(s.date)}</b><span class="sub">${on.length ? on.map(([k, v]) => { const d = HSYM.find(x => x[0] === k); return esc(d ? d[1] : k) + (d && d[3] ? "" : " (" + HLV[v].toLowerCase() + ")"); }).join(" · ") : "sem sintomas"}${s.note ? " · " + esc(s.note) : ""}</span></span><button class="iconbtn" data-act="hSymDel" data-arg="${s.id}" aria-label="Apagar">${ic("x")}</button></div>`; }).join("")}</div></section></div>`;
}

/* ---------- PDF para levar ao médico ---------- */
async function hPDF(){
  const J = window.jspdf && window.jspdf.jsPDF; if (!J) { toast("Gerador de PDF indisponível agora"); return; }
  const h = H(), p = P(), doc = new J({unit:"mm", format:"a4"}); let y = 18; const L = 16, Wd = 178;
  const clean = t => String(t).replace(/[−–—]/g, "-").replace(/≥/g, ">=").replace(/≤/g, "<=").replace(/µ/g, "u").replace(/³/g, "3").replace(/[^\x00-\xFF]/g, "");
  const hd = t => { if (y > 268) { doc.addPage(); y = 18; } y += 2; doc.setFont("helvetica", "bold"); doc.setFontSize(12.5); doc.setTextColor(10, 90, 110); doc.text(clean(t), L, y); y += 6.5; doc.setTextColor(30, 30, 30); };
  const line = (t, size = 10, bold = false) => { doc.setFont("helvetica", bold ? "bold" : "normal"); doc.setFontSize(size); doc.splitTextToSize(clean(t), Wd).forEach(l => { if (y > 284) { doc.addPage(); y = 18; } doc.text(l, L, y); y += size * 0.48; }); };
  doc.setFont("helvetica", "bold"); doc.setFontSize(17); doc.text("Saude hormonal - registro pessoal", L, y); y += 6;
  line(`${firstName()} · ${p.sex === "m" ? "masculino" : "feminino"}, ${p.age} anos · gerado em ${dLabel(todayISO())} ${new Date().getFullYear()} pelo Desfrangolizador`, 9.5); y += 1;
  line("Registro feito pela propria pessoa para apoiar a consulta. O app nao indica substancias, doses ou protocolos.", 9);
  hd("O que usa ou usou (anotado pela pessoa)");
  const ps = [...(h.protos || [])].sort((a, b) => (b.start || "").localeCompare(a.start || ""));
  if (!ps.length) line("Nada registrado.");
  ps.forEach(x => line(`${x.n} · ${HKIND[x.kind] || ""} · ${HVIA[x.via] || ""}${x.dose ? " · " + x.dose : ""}${x.freq ? " · " + x.freq : ""} · ${x.start ? dShort(x.start) + "/" + x.start.slice(0, 4) : "?"} a ${x.end ? dShort(x.end) + "/" + x.end.slice(0, 4) : "atual"}${x.med ? " · com acompanhamento medico" : ""}${x.note ? " · " + x.note : ""}`, 9.5));
  hd("Exames de sangue");
  const ex = hExams(h).slice(-5), used = HMK.filter(m => ex.some(e => e.v && e.v[m.k] != null));
  if (!used.length) line("Nenhum exame registrado.");
  else { const cw = Math.min(24, (Wd - 62) / ex.length), x0 = L + 62;
    doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.text("Exame (unidade)", L, y); ex.forEach((e, i) => doc.text(clean(dShort(e.date) + "/" + e.date.slice(2, 4)), x0 + i * cw, y)); doc.text("Ref.", x0 + ex.length * cw, y); y += 4.5;
    ex.forEach((e, i) => doc.text(clean((HPHASE[e.phase] || "").split(" ")[0]), x0 + i * cw, y)); y += 4.5; doc.setFont("helvetica", "normal");
    used.forEach(m => { if (y > 284) { doc.addPage(); y = 18; } doc.text(clean(`${m.n} (${m.u})`).slice(0, 40), L, y); ex.forEach((e, i) => { const v = e.v && e.v[m.k]; const s = v != null ? hStatus(m.k, v, h) : null; doc.setFont("helvetica", s && (s.lv === "warn" || s.lv === "bad") ? "bold" : "normal"); doc.text(v != null ? fmt(v, v % 1 ? 1 : 0) + (s && (s.lv === "warn" || s.lv === "bad") ? "*" : "") : "-", x0 + i * cw, y); }); doc.setFont("helvetica", "normal"); doc.text(clean(refTxt(hRef(m.k, h))), x0 + ex.length * cw, y); y += 4.6; });
    line("* fora da faixa de referencia usada no app.", 8); }
  const hearts = hExams(h).filter(e => e.ecg || e.eco);
  if (hearts.length) { hd("Coracao"); hearts.slice(-4).forEach(e => line(`${dShort(e.date)}/${e.date.slice(0, 4)}: ${e.ecg ? "ECG " + (e.ecg === "ok" ? "normal" : "com alteracao") : ""}${e.ecg && e.eco ? " · " : ""}${e.eco ? "Eco " + (e.eco === "ok" ? "normal" : "com alteracao") : ""}`, 9.5)); }
  hd("Pressao arterial e frequencia cardiaca");
  const vs = hVitals(h).slice(-14); if (!vs.length) line("Sem medidas.");
  vs.forEach(v => line(`${dShort(v.date)}/${v.date.slice(2, 4)}${v.t ? " " + v.t : ""}: ${v.sys}/${v.dia} mmHg${v.hr ? " · " + v.hr + " bpm" : ""} (${paClass(v.sys, v.dia).t})`, 9.5));
  hd("Sintomas registrados");
  const ss = [...(h.syms || [])].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8); if (!ss.length) line("Sem registros.");
  ss.forEach(s => { const on = Object.entries(s.s || {}).filter(([, v]) => +v > 0); line(`${dShort(s.date)}/${s.date.slice(2, 4)}: ${on.length ? on.map(([k, v]) => { const d = HSYM.find(x => x[0] === k); return (d ? d[1] : k) + " (" + HLV[v].toLowerCase() + ")"; }).join("; ") : "sem sintomas"}${s.note ? " · " + s.note : ""}`, 9.5); });
  const ms = measures().filter(m => +m.weight).slice(-6);
  if (ms.length) { hd("Peso recente"); line(ms.map(m => `${dShort(m.date)}: ${fmt(m.weight, 1)} kg`).join(" · "), 9.5); }
  await saveBlob(doc.output("blob"), `saude-hormonal-${todayISO()}.pdf`, "PDF pronto para levar ao médico");
}

/* ---------- lembretes de aplicação (com o app aberto) ---------- */
function hCheckRem(){
  const h = Store.get("horm"); if (!h || !h.ok) return;
  const now = new Date(), hm = toHM(now.getHours() * 60 + now.getMinutes()), d = todayISO(), w = now.getDay();
  (h.protos || []).filter(p => hActive(p, d) && p.rem && p.rem.on && p.rem.time === hm && (p.rem.days || []).includes(w)).forEach(p => {
    const id = "h" + d + hm + p.id; if (FIRED.has(id)) return; FIRED.add(id);
    const title = "Lembrete: " + p.n, body = "Registre no app quando fizer.";
    document.getElementById("remRoot").innerHTML = `<div class="reminder" role="alert"><span class="ri">${ic("pill")}</span><div style="flex:1;min-width:0"><div class="rt">${esc(title)}</div><div class="rd">${esc(body)}</div><div class="row" style="margin-top:10px"><button class="btn primary sm" data-act="hDose" data-arg="${p.id}" data-close="1">${ic("check")}Registrei</button><button class="btn sm ghost" data-act="remClose">Dispensar</button></div></div></div>`;
    beep(4); try { if ("Notification" in window && Notification.permission === "granted") new Notification(title, {body}); } catch (e) {}
  });
}
setInterval(hCheckRem, 15000);

/* ---------- ganchos no resto do app ---------- */
const _hRender = render;
render = function(){
  if (UI.tab !== "saude") { _hRender(); hNavFix(); return; }
  renderNav(); hNavFix();
  const view = $("#view"); view.innerHTML = vSaude(); mountCharts(view);
};
function hNavFix(){ if (UI.tab !== "saude") return; const b = document.querySelector('#tabNav [data-arg="inicio"]'); if (b) b.setAttribute("aria-current", "page"); }
const _hInicio = vInicio;
vInicio = function(){
  const html = _hInicio(), h = Store.get("horm");
  if (!h || !h.ok) return html;
  const al = hAlerts(H()), bad = al.filter(a => a.lv === "bad").length, warn = al.filter(a => a.lv === "warn").length, st = hSteps(H()), late = st.filter(s => s.d <= todayISO()).length;
  const card = `<button class="calc-card" data-act="go" data-arg="saude" style="${bad ? "border-color:rgba(240,106,92,.6);background:rgba(240,106,92,.08)" : ""}"><span class="calc-ic">${ic("shield")}</span><span class="calc-txt"><b>Saúde hormonal</b><span>${bad ? `<b style="color:var(--bad)">${bad} alerta${bad > 1 ? "s" : ""} importante${bad > 1 ? "s" : ""}</b> · ` : ""}${warn ? `${warn} para mostrar ao médico · ` : ""}${late ? `${late} exame${late > 1 ? "s" : ""} para fazer` : st.length ? "próximo exame " + dLabel(st[0].d) : "exames, pressão e sintomas"}</span></span><span class="calc-go">Abrir${ic("up", 'style="transform:rotate(45deg)"')}</span></button>`;
  const i = html.indexOf('<h2 class="sec-t">');
  return i < 0 ? html + card : html.slice(0, i) + card + html.slice(i);
};
const _hQuick = quickModal;
quickModal = function(){ _hQuick(); const g = document.querySelector("#modalRoot .qa-grid"); if (g) g.insertAdjacentHTML("beforeend", `<button class="qa" data-act="qSaude"><span>${ic("shield")}</span>Saúde hormonal</button>`); };
if (typeof profileModal === "function") { const _hProf = profileModal; profileModal = function(){ _hProf(); const b = document.querySelector('#modalRoot [data-act="qEvol"]'); if (b) b.insertAdjacentHTML("afterend", `<button class="btn sm" data-act="qSaude">${ic("shield")}Saúde hormonal</button>`); }; }

const hSymSel = () => { const s = {}; document.querySelectorAll('#view [data-act="hSymLv"][aria-pressed="true"]').forEach(b => { if (+b.dataset.v) s[b.dataset.k] = +b.dataset.v; }); return s; };
Object.assign(ACT, {
  qSaude: () => { closeModal(); go("saude"); },
  hAgree: () => { const h = H(); h.ok = true; saveH(h); render(); },
  htab: el => { UI.htab = el.dataset.arg; render(); },
  hmk: el => { UI.hmk = el.dataset.arg; UI.htab = "exames"; render(); },
  hExamNew: () => hExamModal(),
  hExamEdit: el => hExamModal(el.dataset.arg),
  hExamSave: el => {
    const date = $("#hx-date").value; if (!date) { toast("Informe a data da coleta"); return; }
    const v = {}; HMK.forEach(m => { const n = num($("#hx-" + m.k).value); if (n != null && n >= 0) v[m.k] = n; });
    const ecg = $("#hx-ecg").value, eco = $("#hx-eco").value;
    if (!Object.keys(v).length && !ecg && !eco) { toast("Preencha pelo menos um resultado"); return; }
    const h = H(), id = el.dataset.arg || uid(), e = {id, date, phase:$("#hx-phase").value, lab:$("#hx-lab").value.trim(), v, ecg, eco, note:$("#hx-note").value.trim()};
    h.exams = (h.exams || []).filter(x => x.id !== id).concat(e); saveH(h); closeModal(); UI.htab = "exames"; render();
    const out = Object.entries(v).filter(([k, x]) => { const s = hStatus(k, x, h); return s && (s.lv === "warn" || s.lv === "bad"); }).length;
    toast(out ? `Exame salvo · ${out} valor${out > 1 ? "es" : ""} fora da faixa` : "Exame salvo");
  },
  hExamDel: el => confirmBox("Apagar exame?", "Os valores saem dos gráficos e dos alertas.", "Apagar", () => { const h = H(); h.exams = (h.exams || []).filter(x => x.id !== el.dataset.arg); saveH(h); closeModal(); render(); }),
  hRef: el => { const m = HMKX[el.dataset.arg], r = hRef(m.k) || [null, null], h = H();
    openModal(`${sheetHead("Faixa do seu laudo", esc(m.n))}<p class="sub">Cada laboratório tem a sua faixa. Copie a do laudo para os alertas ficarem certos para você.</p>
      <div class="fields"><div class="field"><label for="hr-lo">Mínimo</label><div class="input-u"><input id="hr-lo" class="input num" type="text" inputmode="decimal" value="${r[0] ?? ""}"><span>${esc(m.u)}</span></div></div><div class="field"><label for="hr-hi">Máximo</label><div class="input-u"><input id="hr-hi" class="input num" type="text" inputmode="decimal" value="${r[1] ?? ""}"><span>${esc(m.u)}</span></div></div></div>
      <div class="row">${h.refs && h.refs[m.k] ? `<button class="btn ghost" data-act="hRefReset" data-arg="${m.k}">Voltar à faixa geral</button>` : ""}<span class="spacer"></span><button class="btn primary" data-act="hRefSave" data-arg="${m.k}">${ic("check")}Salvar</button></div>`); },
  hRefSave: el => { const lo = num($("#hr-lo").value), hi = num($("#hr-hi").value); if (lo == null && hi == null) { toast("Informe mínimo ou máximo"); return; } const h = H(); h.refs = Object.assign({}, h.refs, {[el.dataset.arg]:[lo, hi]}); saveH(h); closeModal(); render(); },
  hRefReset: el => { const h = H(); h.refs = Object.assign({}, h.refs); delete h.refs[el.dataset.arg]; saveH(h); closeModal(); render(); },
  hProtoEdit: el => hProtoModal(el.dataset.arg),
  hProtoSave: el => {
    const n = $("#hp-n").value.trim(); if (!n) { toast("Dê um nome ao registro"); return; }
    const start = $("#hp-start").value, end = $("#hp-end").value; if (end && start && end < start) { toast("O fim está antes do início"); return; }
    const days = [...document.querySelectorAll("#modalRoot [data-hday]:checked")].map(x => +x.dataset.hday);
    const rem = {on:$("#hp-rem").checked && days.length > 0, days, time:$("#hp-time").value || "08:00"};
    if ($("#hp-rem").checked && !days.length) toast("Escolha os dias do lembrete");
    const h = H(), id = el.dataset.arg || uid();
    h.protos = (h.protos || []).filter(x => x.id !== id).concat({id, n, kind:$("#hp-kind").value, via:$("#hp-via").value, dose:$("#hp-dose").value.trim(), freq:$("#hp-freq").value.trim(), start, end, med:$("#hp-med").checked, rem, note:$("#hp-note").value.trim()});
    saveH(h); if (rem.on) askNotify(); closeModal(); UI.htab = "protocolo"; render(); toast("Registro salvo");
  },
  hProtoDel: el => confirmBox("Apagar registro?", "As aplicações ligadas a ele também saem.", "Apagar", () => { const h = H(); h.protos = (h.protos || []).filter(x => x.id !== el.dataset.arg); h.doses = (h.doses || []).filter(x => x.pid !== el.dataset.arg); saveH(h); closeModal(); render(); }),
  hDose: el => { const h = H(), now = new Date(); h.doses = (h.doses || []).concat({id:uid(), pid:el.dataset.arg, date:todayISO(), t:toHM(now.getHours() * 60 + now.getMinutes())}).slice(-400); saveH(h); if (el.dataset.close) $("#remRoot").innerHTML = ""; if (UI.tab === "saude") render(); toast("Aplicação registrada"); },
  hDoseDel: el => { const h = H(); h.doses = (h.doses || []).filter(x => x.id !== el.dataset.arg); saveH(h); render(); },
  hPASave: () => {
    const sys = num($("#hv-sys").value), dia = num($("#hv-dia").value), hr = num($("#hv-hr").value);
    if (!(sys > 50 && sys < 260 && dia > 30 && dia < 160 && sys > dia)) { toast("Confira a máxima e a mínima"); return; }
    const h = H(); h.vitals = (h.vitals || []).concat({id:uid(), date:$("#hv-date").value || todayISO(), t:$("#hv-t").value, sys:Math.round(sys), dia:Math.round(dia), hr:hr > 20 && hr < 250 ? Math.round(hr) : null}); saveH(h); render();
    const c = paClass(sys, dia); toast(c.lv === "bad" ? `Pressão ${c.t}: veja o alerta no Painel` : "Medida salva");
  },
  hPADel: el => { const h = H(); h.vitals = (h.vitals || []).filter(x => x.id !== el.dataset.arg); saveH(h); render(); },
  hSymLv: el => { el.parentElement.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b === el)); },
  hSymSave: () => {
    const s = hSymSel(), h = H();
    h.syms = (h.syms || []).concat({id:uid(), date:$("#hs-date").value || todayISO(), s, note:$("#hs-note").value.trim()}); saveH(h); render();
    const urg = Object.keys(s).filter(k => (HSYM.find(x => x[0] === k) || [])[3]);
    if (urg.length) { UI.htab = "painel"; render(); toast("Sinal de alerta: veja o Painel e procure atendimento"); } else toast("Registro salvo");
  },
  hSymDel: el => { const h = H(); h.syms = (h.syms || []).filter(x => x.id !== el.dataset.arg); saveH(h); render(); },
  hNext: () => { const h = H(); openModal(`${sheetHead("Marcar data de exame")}<div class="fields"><div class="field"><label for="hn-d">Data</label><input id="hn-d" class="input" type="date" value="${h.nextExam || addDays(todayISO(), 7)}"></div><div class="field"><label for="hn-n">O quê</label><input id="hn-n" class="input" type="text" maxlength="80" value="${esc(h.nextNote || "")}" placeholder="Ex.: consulta com endocrinologista"></div></div><div class="row"><span class="spacer"></span><button class="btn primary" data-act="hNextSave">${ic("check")}Salvar</button></div>`); },
  hNextSave: () => { const h = H(); h.nextExam = $("#hn-d").value; h.nextNote = $("#hn-n").value.trim(); saveH(h); closeModal(); render(); },
  hNextDel: () => { const h = H(); delete h.nextExam; delete h.nextNote; saveH(h); render(); },
  hPDF: () => hPDF()
});
if ((location.hash || "").slice(1) === "saude") UI.tab = "saude";
render();
</script>
