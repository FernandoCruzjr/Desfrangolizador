<script>
/* ======================= APP INSTALÁVEL, BOAS-VINDAS E BACKUP ======================= */
const STANDALONE_BUILD = !!window.DESFR_PWA;
ICONS.download = '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>';
ICONS.phone = '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>';
document.querySelectorAll("[data-ic]").forEach(el => el.innerHTML = ic(el.dataset.ic));

/* Fotos ficam no IndexedDB do aparelho: o localStorage só guarda uns 5 MB. */
const PhotoDB = {
  db:null,
  open(){ if (this.db) return Promise.resolve(this.db); return new Promise((res, rej) => { try { const r = indexedDB.open("desfrangolizador", 1); r.onupgradeneeded = () => r.result.createObjectStore("kv"); r.onsuccess = () => { this.db = r.result; res(this.db); }; r.onerror = () => rej(r.error); } catch (e) { rej(e); } }); },
  async tx(mode, fn){ const db = await this.open(); return new Promise((res, rej) => { const t = db.transaction("kv", mode), s = t.objectStore("kv"), out = fn(s); t.oncomplete = () => res(out && out.result); t.onerror = () => rej(t.error); }); },
  put(k, v){ return this.tx("readwrite", s => s.put(v, k)).catch(() => {}); },
  del(k){ return this.tx("readwrite", s => s.delete(k)).catch(() => {}); },
  async all(){ const db = await this.open(); return new Promise((res, rej) => { const out = {}, r = db.transaction("kv").objectStore("kv").openCursor(); r.onsuccess = () => { const c = r.result; if (c) { out[c.key] = c.value; c.continue(); } else res(out); }; r.onerror = () => rej(r.error); }); }
};
{
  const local0 = Store.local.bind(Store);
  Store.local = function(k, v){
    if (k.startsWith("photo-")) { try { localStorage.removeItem(LS + k); } catch (e) {} v == null ? PhotoDB.del(k) : PhotoDB.put(k, v); return; }
    local0(k, v);
  };
  PhotoDB.all().then(all => {
    let changed = false;
    for (const k in all) { const l = Store.mem[k]; if (!l || (all[k]._ts || 0) > (l._ts || 0)) { Store.mem[k] = all[k]; changed = true; } }
    Object.keys(Store.mem).filter(k => k.startsWith("photo-") && Store.mem[k] && !all[k]).forEach(k => Store.local(k, Store.mem[k]));
    if (changed && (UI.tab === "evolucao" || UI.tab === "inicio")) render();
  }).catch(() => {});
}

/* Instalação */
let INSTALL_EVT = null;
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); INSTALL_EVT = e; });
window.addEventListener("appinstalled", () => { INSTALL_EVT = null; toast("Desfrangolizador instalado"); });
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isInstalled = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;

const FEATURES = [
  ["flame","Plano sob medida","Calcula seu gasto (TMB e GET), a meta de calorias para ganhar massa (+500) ou secar (−500), os macros e a sua água do dia."],
  ["plate","Dieta flexível","Monte as refeições com mais de 250 alimentos, veja os macros em tempo real e troque qualquer item grama a grama."],
  ["camera","Foto do prato com IA","Fotografe o prato ou o rótulo e o app estima os alimentos e as gramas por você." + (STANDALONE_BUILD ? " Disponível na versão aberta pelo Claude." : "")],
  ["dumbbell","Treino de hipertrofia","45 exercícios por grupo muscular com execução detalhada, fichas prontas e suas, carga, reps, RPE e descanso cronometrado."],
  ["up","Sobrecarga progressiva","Gráfico de força (1RM) por exercício e alerta quando você estagnar."],
  ["ruler","Meu Progresso","Peso com média de 7 dias, medidas guiadas, dados da balança de bioimpedância, % de gordura, massa magra e fotos de antes e depois."],
  ["bell","Lembretes","Horários de refeição, água e suplementos calculados pela hora que você acorda e dorme."],
  ["medal","Níveis e relatório","Suba de Frango para Avançado com constância, veja o diagnóstico da semana e exporte tudo em PDF para o seu treinador."]
];

function installBlock(){
  if (isInstalled()) return `<div class="note good">${ic("check")}<span><b>App instalado.</b> Abra o Desfrangolizador pelo ícone na sua tela inicial.</span></div>`;
  if (!STANDALONE_BUILD) return `<div class="note">${ic("phone")}<span><b>Ícone na tela inicial:</b> no iPhone, toque em Compartilhar e depois em <b>Adicionar à Tela de Início</b>. No Android, toque nos três pontinhos e depois em <b>Adicionar à tela inicial</b>.</span></div>`;
  if (INSTALL_EVT) return `<button class="btn primary" data-act="install" style="width:100%">${ic("download")}Instalar o app</button>`;
  if (isIOS()) return `<div class="note">${ic("phone")}<span><b>Para instalar no iPhone:</b> abra este site no Safari, toque em Compartilhar (o quadrado com a seta) e depois em <b>Adicionar à Tela de Início</b>.</span></div>`;
  return `<div class="note">${ic("phone")}<span><b>Para instalar:</b> no Android, toque nos três pontinhos do Chrome e depois em <b>Instalar app</b>. No computador, clique no ícone de instalar na barra de endereço.</span></div>`;
}

function aboutModal(first){
  openModal(`${sheetHead(first ? "Bem-vindo ao Desfrangolizador" : "Sobre o app", "Treino & dieta flexível")}
    <div class="col" style="gap:14px">
      <div class="feat-hero"><img src="${LOGO_SRC}" alt="" style="width:64px;height:64px;border-radius:18px;flex:none"><p style="margin:0;font-size:15px;line-height:1.5"><b>Saia do modo frango.</b> O Desfrangolizador junta dieta flexível, treino de hipertrofia e acompanhamento do corpo em um só lugar, com base científica e sem dieta engessada.</p></div>
      <div class="col" style="gap:10px">${FEATURES.map(([i, n, d]) => `<div class="feat"><span class="feat-i">${ic(i)}</span><div><b>${n}</b><div class="sub">${d}</div></div></div>`).join("")}</div>
      <div class="mgroup"><div class="mgroup-h">Como começar</div>
        <ol class="sub" style="margin:0;padding-left:18px;line-height:1.7">
          <li>Em <b>Plano</b>, preencha sexo, idade, peso, altura, atividade e objetivo. O app calcula calorias, macros e água.</li>
          <li>Informe a hora que você acorda e dorme e ligue os lembretes, se quiser.</li>
          <li>Registre as refeições em <b>Dieta</b>, os treinos em <b>Treino</b> e o peso e as medidas em <b>Evolução</b>.</li>
          <li>Use o botão <b>+</b> no meio da barra para as ações rápidas do dia.</li>
        </ol></div>
      ${typeof accountBlock === "function" ? "" : installBlock()}
      ${typeof accountBlock === "function" ? accountBlock() + installBlock() : STANDALONE_BUILD ? `<div class="note">${ic("info")}<span>Seus dados ficam salvos <b>neste aparelho</b>. Faça um backup de vez em quando para não perder nada se trocar de celular ou limpar o navegador.</span></div>` : ""}
      <div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn sm" data-act="backup">${ic("download")}Fazer backup</button><label class="btn sm" style="cursor:pointer">${ic("history")}Restaurar backup<input type="file" accept="application/json,.json" data-restore hidden></label></div>
      ${STANDALONE_BUILD ? `<a class="btn sm ghost" href="sobre.html" style="justify-content:center">${ic("info")}Página de apresentação e como instalar</a>` : ""}
      ${first ? `<button class="btn primary" data-act="welcomeGo">${ic("flame")}Montar meu plano</button>` : ""}
    </div>`);
}

async function backupData(){
  const data = {app:"desfrangolizador", v:2, at:new Date().toISOString(), docs:{}};
  Object.keys(Store.mem).forEach(k => { if (Store.mem[k] && k !== "wkdraft") data.docs[k] = Store.mem[k]; });
  const blob = new Blob([JSON.stringify(data)], {type:"application/json"}), filename = `desfrangolizador-backup-${todayISO()}.json`;
  await saveBlob(blob, filename, "Backup salvo");
}
async function saveBlob(blob, filename, okMsg){
  const dl = !STANDALONE_BUILD && window.claude && window.claude.use ? await window.claude.use("downloads") : null;
  if (dl) { try { await dl.save({filename, data:blob}); toast(okMsg); } catch (e) { if (e.code !== "declined") toast("Não foi possível salvar agora"); } return; }
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); toast(okMsg);
}
document.addEventListener("change", async ev => {
  const el = ev.target; if (!el.matches("[data-restore]")) return;
  const f = el.files && el.files[0]; if (!f) return;
  try {
    const d = JSON.parse(await f.text());
    if (!d || d.app !== "desfrangolizador" || !d.docs) throw new Error("formato");
    const n = Object.keys(d.docs).length;
    confirmBox("Restaurar backup?", `${n} registros de ${dLabel((d.at || todayISO()).slice(0, 10))} vão substituir os dados com o mesmo nome neste aparelho.`, "Restaurar", () => { Object.entries(d.docs).forEach(([k, v]) => Store.put(k, v)); closeModal(); render(); toast("Backup restaurado"); });
  } catch (e) { toast("Esse arquivo não é um backup do Desfrangolizador"); }
});

Object.assign(ACT, {
  about: () => aboutModal(false),
  welcomeGo: () => { closeModal(); go("plano"); },
  install: async () => { if (!INSTALL_EVT) return; INSTALL_EVT.prompt(); try { await INSTALL_EVT.userChoice; } catch (e) {} INSTALL_EVT = null; aboutModal(false); },
  backup: () => backupData()
});

/* Primeira visita: mostra a apresentação uma vez. */
setTimeout(() => {
  if ((typeof CLOUD !== "undefined" && CLOUD.sb) || Store.get("welcome") || Store.keys("day-").length || Store.keys("photo-").length || (Store.get("measures") || {}).list?.length) return;
  Store.put("welcome", {seen:true});
  if (!$("#modalRoot").innerHTML) aboutModal(true);
}, 1800);

if (STANDALONE_BUILD && "serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("sw.js").catch(() => {});
</script>
