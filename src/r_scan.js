<script>
/* ======================= LER PRINT DA BALANÇA ======================= */
/* A pessoa manda o print do relatório do app da balança (Unique Health, OKOK, Fitdays…)
   e o app lê os números. No site a leitura é feita no próprio aparelho (Tesseract, sem
   chave e sem custo); aberto pelo Claude, usa a IA do Claude. Sempre com revisão antes de salvar. */
const TESS_VER = "5.1.1";
const SCAN_LIMB = [["braco esquerdo","la"],["braco direito","ra"],["perna esquerda","ll"],["perna direita","rl"],["tronco","tr"]];
/* [campo, precisa ter (todas), não pode ter, unidade esperada, mínimo, máximo] */
const SCAN_RULES = [
  ["weight", [/(^| )peso$/], /ideal|padrao|controle|meta/, "kg", 25, 300],
  ["hr", [/cardiac/], null, "bpm", 30, 200],
  ["bf", [/(relacao|taxa|percentual|indice) de gordura|gordura corporal|^gordura$/], /subcut|visceral|braco|perna|tronco|padrao|massa|controle/, "%", 2, 70],
  ["subq", [/subcut/], /massa/, "%", 1, 60],
  ["visc", [/visceral/], null, "", 1, 59],
  ["water", [/(relacao|taxa|percentual) (de )?agua|^agua$|agua corporal/], /intra|extra|total/, "%", 30, 80],
  ["skm", [/muscul\w* esquelet/, /massa|mossa/], /indice|taxa|qualidade|proporcao/, "kg", 5, 80],
  ["muscle", [/massa muscular|musculo$/], /esquelet|braco|perna|tronco|indice|controle|padrao/, "kg", 10, 150],
  ["protein", [/protei/], /massa/, "%", 5, 30],
  ["bone", [/osse/], null, "kg", 0.5, 8],
  ["icw", [/intracelular/], null, "kg", 5, 60],
  ["ecw", [/extracelular/], null, "kg", 3, 40],
  ["bcm", [/celular/], /intra|extra/, "kg", 5, 80],
  ["mineral", [/minera/], null, "kg", 0.5, 10],
  ["ffm", [/livre de gordura|massa magra/], null, "kg", 15, 150],
  ["bmr", [/\bbmr\b|metabolismo basal|metabolica basal|\btmb\b/], null, "kcal", 600, 5000],
  ["bage", [/idade (do |de )?corp/], null, "", 10, 99],
  ["score", [/pontuac/], null, "", 1, 100]
];
const scanNorm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const SCAN_STATUS = /^(super )?(padrao|normal|alto|alta|baixo|baixa|medio|media|excelente|saudavel|insuficiente|excessivo|bom|otimo|fraco|leve|elevado)$/;

/* Rótulo + valor → campo do registro. Devolve [campo, número] ou null. */
function scanMatch(label, num, unit){
  const l = scanNorm(label); if (!l || !isFinite(num)) return null;
  const u = (unit || "").toLowerCase();
  const limb = (SCAN_LIMB.find(([n]) => l.includes(n)) || [])[1];
  if (limb && !/proporc|padrao/.test(l) && (!u || u === "kg")) {
    if (/gord/.test(l) && /massa|mossa/.test(l)) return num > 0.05 && num < 40 ? ["seg_f_" + limb, num] : null;
    if (/muscul/.test(l) && /massa|mossa/.test(l)) return num > 0.3 && num < (limb === "tr" ? 60 : 25) ? ["seg_m_" + limb, num] : null;
    return null;
  }
  for (const [k, inc, exc, eu, mn, mx] of SCAN_RULES) {
    if (!inc.every(r => r.test(l)) || (exc && exc.test(l))) continue;
    if (u && eu && u !== eu) continue;
    if (u && !eu && /^(kg|%|bpm|kcal)$/.test(u)) continue;
    if (num < mn || num > mx) continue;
    return [k, num];
  }
  return null;
}

/* Palavras do OCR (com posição) → registro. Os cartões do relatório ficam em 2 colunas:
   em cada coluna, o rótulo vem em cima e o número logo abaixo. */
function scanParse(words, W){
  const out = {low:[]}, cols = [[], []];
  words.filter(w => w.text && w.text.trim()).forEach(w => { const b = w.bbox, cx = (b.x0 + b.x1) / 2; cols[cx < W / 2 ? 0 : 1].push({t:w.text.trim(), x:b.x0, y:(b.y0 + b.y1) / 2, h:b.y1 - b.y0, c:w.confidence == null ? 100 : w.confidence}); });
  const all = [];
  cols.forEach(ws => {
    ws.sort((a, b) => a.y - b.y);
    const lines = [];
    ws.forEach(w => { const ln = lines[lines.length - 1]; if (ln && Math.abs(w.y - ln.y) < Math.max(ln.h, w.h) * 0.6) { ln.w.push(w); ln.h = Math.max(ln.h, w.h); } else lines.push({y:w.y, h:w.h, w:[w]}); });
    lines.forEach(ln => { ln.t = ln.w.sort((a, b) => a.x - b.x).map(w => w.t).join(" "); all.push(ln.t); });
    let buf = [];
    lines.forEach(ln => {
      const t = ln.t.replace(/[—–−]/g, "-").replace(/\s+/g, " ").trim();
      const m = t.match(/^(-?\d{1,4}(?:[.,]\d{1,3})?)\s*(kg|%|bpm|kcal|pontos|idade|anos)?\b/i);
      if (m && !/^\d{1,2}[\/:]\d/.test(t)) {
        const r = scanMatch(buf.slice(-4).join(" "), parseFloat(m[1].replace(",", ".")), m[2]);
        if (r && out[r[0]] == null) { out[r[0]] = r[1]; if (ln.w[0].c < 80) out.low.push(r[0]); }
        buf = []; return;
      }
      if (SCAN_STATUS.test(scanNorm(t))) return;
      buf.push(t);
    });
  });
  const dm = all.join(" ").match(/(\d{2})[\/.-](\d{2})[\/.-](20\d{2})/);
  if (dm) out.date = `${dm[3]}-${dm[2]}-${dm[1]}`;
  return out;
}

/* ---------- motores de leitura ---------- */
function loadTess(){
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  if (loadTess.p) return loadTess.p;
  return loadTess.p = new Promise((res, rej) => { const s = document.createElement("script"); s.src = `https://cdn.jsdelivr.net/npm/tesseract.js@${TESS_VER}/dist/tesseract.min.js`; s.onload = () => res(window.Tesseract); s.onerror = () => { loadTess.p = null; rej(new Error("tess")); }; document.head.appendChild(s); });
}
function scanImg(file){
  return new Promise((res, rej) => { const img = new Image(), u = URL.createObjectURL(file); img.onload = () => { URL.revokeObjectURL(u); res(img); }; img.onerror = () => rej(new Error("img")); img.src = u; });
}
/* Print pequeno lê mal: amplia. Print enorme demora: reduz. Cinza ajuda o OCR. */
function scanCanvas(img){
  const s = img.width < 900 ? Math.min(3, 1100 / img.width) : img.width > 1500 ? 1200 / img.width : 1;
  const cv = document.createElement("canvas"); cv.width = Math.round(img.width * s); cv.height = Math.round(img.height * s);
  const g = cv.getContext("2d"); g.filter = "grayscale(1) contrast(1.15)"; g.drawImage(img, 0, 0, cv.width, cv.height); return cv;
}
async function scanOCR(files, status){
  const T = await loadTess(); status("Preparando a leitura (só na primeira vez baixa ~4 MB)…");
  const worker = await T.createWorker("por", 1, {
    workerPath:`https://cdn.jsdelivr.net/npm/tesseract.js@${TESS_VER}/dist/worker.min.js`,
    corePath:`https://cdn.jsdelivr.net/npm/tesseract.js-core@${TESS_VER}`,
    langPath:"https://cdn.jsdelivr.net/npm/@tesseract.js-data/por/4.0.0_best_int",
    logger: m => { if (m.status === "recognizing text") status(`Lendo o print${files.length > 1 ? ` ${SCAN.i + 1} de ${files.length}` : ""}… ${Math.round(m.progress * 100)}%`); }
  });
  const res = {low:[]};
  try {
    for (SCAN.i = 0; SCAN.i < files.length; SCAN.i++) {
      const cv = scanCanvas(await scanImg(files[SCAN.i]));
      const {data} = await worker.recognize(cv);
      const r = scanParse(data.words || [], cv.width);
      Object.keys(r).forEach(k => { if (k === "low") return; if (res[k] == null) { res[k] = r[k]; if (r.low.includes(k)) res.low.push(k); } });
    }
  } finally { worker.terminate(); }
  return res;
}
/* Claude: corta o print comprido em pedaços legíveis. */
async function scanTiles(files){
  const out = [];
  for (const f of files) {
    const img = await scanImg(f), W = Math.min(img.width, 1000), s = W / img.width, H = Math.round(W * 1.6), total = Math.round(img.height * s);
    for (let y = 0; y < total && out.length < 12; y += H - 60) {
      const cv = document.createElement("canvas"); cv.width = W; cv.height = Math.min(H, total - y);
      cv.getContext("2d").drawImage(img, 0, y / s, img.width, cv.height / s, 0, 0, W, cv.height);
      out.push(await new Promise(r => cv.toBlob(r, "image/jpeg", 0.85)));
    }
  }
  return out;
}
async function scanClaude(files){
  const fl = MFIELDS.filter(f => SCAN_KEYS.includes(f[0])).map(f => `${f[0]}: ${f[1]} (${f[2]})`).join("; ");
  const r = await SAMPLE.json(`As imagens são partes, em ordem, do relatório de uma balança de bioimpedância (app tipo Unique Health, OKOK ou Fitdays). Extraia SOMENTE os números que aparecem escritos; não calcule nem invente. Campos: ${fl}. Atenção: "skm" é a massa muscular esquelética em kg (não a taxa em %); "muscle" é a massa muscular total em kg; "bf" é a relação/percentual de gordura (%); "water" é a relação de água em %; segmentos seg_m_* = massa muscular e seg_f_* = massa gorda do segmento em kg (ra braço direito, la braço esquerdo, tr tronco, rl perna direita, ll perna esquerda). Inclua "date" no formato AAAA-MM-DD se a data da medição aparecer. Responda só com JSON, por exemplo {"date":"2026-11-07","weight":71.25,"bf":18.5}. Omita o que não aparecer.`, {images: await scanTiles(files), modelTier:"default"});
  const out = {};
  Object.keys(r || {}).forEach(k => { if (k === "date" && /^\d{4}-\d{2}-\d{2}$/.test(r.date)) out.date = r.date; else if (SCAN_KEYS.includes(k) && +r[k] > 0) out[k] = +r[k]; });
  return out;
}

/* ---------- tela ---------- */
const SCAN_KEYS = ["weight","bf","muscle","skm","ffm","water","visc","subq","bone","protein","bmr","bage","icw","ecw","bcm","mineral","hr","score","seg_m_ra","seg_m_la","seg_m_tr","seg_m_rl","seg_m_ll","seg_f_ra","seg_f_la","seg_f_tr","seg_f_rl","seg_f_ll"];
let SCAN = {files:[], res:null, date:"", busy:false, i:0};
function scanModal(){
  const n = SCAN.files.length;
  if (!SCAN.res) {
    openModal(`${sheetHead("Ler print da balança", "Assistente")}
      <p class="sub">Abra o relatório no app da balança, tire o print (pode ser o print longo, com a tela inteira) e mande aqui. O app lê os números e você confere antes de salvar.</p>
      <label class="ai-drop" for="scan-file">${ic("image")}<b>${n ? `${n} imagem${n > 1 ? "s" : ""} escolhida${n > 1 ? "s" : ""} · trocar` : "Escolher o print do relatório"}</b><span class="sub">Pode mandar mais de um print se o relatório estiver dividido.</span></label>
      <input id="scan-file" type="file" accept="image/*" multiple hidden>
      <div class="row"><span class="sub" id="scan-status" aria-live="polite"></span><span class="spacer"></span><button class="btn primary" data-act="scanRun" ${n && !SCAN.busy ? "" : "disabled"}>${ic("sparkle")}Ler números</button></div>
      <p class="small muted" style="margin:0">${SAMPLE && SAMPLE_IMG ? "A leitura usa a IA do Claude." : "A leitura é feita no seu celular: a imagem não sai do aparelho."}</p>`);
    return;
  }
  const r = SCAN.res, found = SCAN_KEYS.filter(k => r[k] != null), miss = SCAN_KEYS.filter(k => r[k] == null), low = r.low || [];
  const row = k => { const f = MFIELDS.find(x => x[0] === k); return `<div class="field"><label for="sc-${k}">${f[1]} <span class="muted">(${f[2] || "nível"})</span>${low.includes(k) ? ` <span class="pill warn">confira</span>` : ""}</label><input id="sc-${k}" class="input num" inputmode="decimal" value="${r[k] != null ? String(r[k]).replace(".", ",") : ""}" placeholder="—"></div>`; };
  openModal(`${sheetHead("Confira os números", found.length + " de " + SCAN_KEYS.length + " lidos")}
    <p class="sub">Compare com o print e corrija o que estiver errado${low.length ? " (principalmente os marcados com <b>confira</b>, que saíram borrados)" : ""}. Campo vazio não é salvo.</p>
    <div class="field"><label for="sc-date">Data da medição</label><input id="sc-date" class="input" type="date" value="${r.date || todayISO()}"></div>
    <div class="fields">${found.filter(k => !k.startsWith("seg_")).map(row).join("")}</div>
    ${found.some(k => k.startsWith("seg_")) ? `<div class="mgroup-h" style="margin-top:6px">Segmentos (kg)</div><div class="fields">${found.filter(k => k.startsWith("seg_")).map(row).join("")}</div>` : ""}
    ${miss.length ? `<details><summary class="sub" style="font-weight:600">Não encontrei ${miss.length} campo${miss.length > 1 ? "s" : ""}: preencher à mão</summary><div class="fields" style="margin-top:10px">${miss.map(row).join("")}</div></details>` : ""}
    ${measures().some(m => m.date === (r.date || todayISO())) ? `<div class="note">${ic("info")}<span>Já existe registro nesse dia: os números lidos completam e atualizam esse registro.</span></div>` : ""}
    <div class="row"><button class="btn ghost" data-act="scanReset">${ic("chevL")}Outro print</button><span class="spacer"></span><button class="btn primary" data-act="scanSave">${ic("check")}Salvar registro</button></div>`, "wide");
}
const scanCount = r => SCAN_KEYS.filter(k => r[k] != null).length;
async function scanRun(){
  if (!SCAN.files.length || SCAN.busy) return;
  SCAN.busy = true; const btn = document.querySelector('[data-act="scanRun"]'); if (btn) btn.disabled = true;
  const status = t => { const s = $("#scan-status"); if (s) s.textContent = t; };
  status("Lendo o print…");
  try {
    let r = null;
    if (SAMPLE && SAMPLE_IMG) { try { r = await scanClaude(SCAN.files); } catch (e) { r = null; } }
    if (!r || scanCount(r) < 3) r = await scanOCR(SCAN.files, status);
    if (scanCount(r) < 2) throw {code:"none"};
    SCAN.res = r; SCAN.busy = false; scanModal();
  } catch (e) {
    SCAN.busy = false; if (btn) btn.disabled = false;
    status(e.code === "none" ? "Não achei os números nesse print. Mande o print do relatório completo, sem cortar os nomes dos campos." : e.message === "tess" ? "Sem internet para carregar o leitor agora. Tente de novo conectado." : "Não consegui ler essa imagem. Tente de novo.");
  }
}
function scanSave(){
  const date = $("#sc-date").value || todayISO(), rec = {id:uid(), date}; let any = false;
  SCAN_KEYS.forEach(k => { const inp = $("#sc-" + k); if (!inp) return; const v = parseFloat((inp.value || "").replace(",", ".")); if (v > 0) { rec[k] = v; any = true; } });
  if (!any) { toast("Nenhum número para salvar"); return; }
  const list = measures(), ex = list.find(m => m.date === date);
  if (ex) Object.assign(ex, rec, {id:ex.id}); else list.push(rec);
  Store.put("measures", {list});
  if (rec.bf && date >= (list.filter(m => m.bf).map(m => m.date).sort().pop() || "")) setP({bf:rec.bf});
  if (rec.weight && date >= (list.filter(m => m.weight).map(m => m.date).sort().pop() || "")) setP({weight:rec.weight});
  SCAN = {files:[], res:null, date:"", busy:false, i:0};
  closeModal(); UI.tab = "evolucao"; render(); toast("Registro da balança salvo");
}
document.addEventListener("change", e => {
  if (e.target && e.target.id === "scan-file") { SCAN.files = [...(e.target.files || [])].filter(f => /^image\//.test(f.type) || !f.type); SCAN.res = null; scanModal(); }
});
Object.assign(ACT, {
  scanOpen: () => { if (!SCAN.busy) SCAN = {files:[], res:null, date:"", busy:false, i:0}; scanModal(); },
  scanRun: () => scanRun(),
  scanReset: () => { SCAN = {files:[], res:null, date:"", busy:false, i:0}; scanModal(); },
  scanSave: () => scanSave()
});
</script>
