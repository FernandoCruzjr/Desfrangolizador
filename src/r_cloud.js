<style>
.gate{position:fixed;inset:0;z-index:90;overflow:auto;background:radial-gradient(900px 600px at 15% -10%,var(--bg-glow1),transparent 60%),radial-gradient(800px 600px at 110% 10%,var(--bg-glow2),transparent 60%),var(--bg);display:flex;align-items:center;justify-content:center;padding:max(24px,env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) max(24px,env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px))}
.gate[hidden]{display:none}
.gate-in{width:min(980px,100%);display:grid;grid-template-columns:1.1fr 1fr;gap:40px;align-items:center}
.gate-hero h1{font-family:Montserrat,sans-serif;font-weight:900;font-size:clamp(30px,4.4vw,48px);line-height:1.05;margin:16px 0 12px;letter-spacing:-.02em}
.gate-hero h1 span{background:var(--flame);-webkit-background-clip:text;background-clip:text;color:transparent}
.gate-hero p{color:var(--muted);font-size:16px;line-height:1.55;margin:0 0 18px}
.gate-logo{width:84px;height:84px;border-radius:22px;box-shadow:0 10px 30px rgba(0,0,0,.45)}
.gate-list{display:grid;gap:10px;margin:0;padding:0;list-style:none}
.gate-list li{display:flex;gap:10px;align-items:center;font-size:14.5px}
.gate-list li svg{width:20px;height:20px;color:var(--accent);flex:none}
.gate-card{background:linear-gradient(180deg,#12303D,#0C222D);border:1px solid var(--glass-b);border-radius:22px;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.45)}
.gate-card h2{margin:0 0 4px;font-family:Montserrat,sans-serif;font-size:22px}
.gate-card .seg{display:grid;grid-template-columns:1fr 1fr;gap:6px;background:rgba(0,0,0,.25);padding:5px;border-radius:14px;margin:14px 0 4px}
.gate-card .seg button{border:0;border-radius:10px;padding:11px;font:600 15px Figtree,sans-serif;color:var(--muted);background:transparent;cursor:pointer}
.gate-card .seg button[aria-pressed="true"]{background:var(--accent);color:var(--on-accent)}
.gate-card .input{font-size:16px;min-height:48px}
.gate-card .btn.primary{min-height:50px;font-size:16px}
.gate-foot{font-size:12.5px;color:var(--faint);margin-top:12px;line-height:1.5}
@media (max-width:820px){.gate{align-items:flex-start}.gate-in{grid-template-columns:1fr;gap:20px}.gate-hero{text-align:center}.gate-hero .gate-logo{margin:0 auto;width:72px;height:72px}.gate-hero h1{margin-top:12px}.gate-list{display:none}.gate-hero p{margin-bottom:0;font-size:15px}}
</style>
<div class="gate" id="gate" hidden></div>
<script>
/* ======================= CONTA E NUVEM (SUPABASE) =======================
   Só na versão do site. Cada pessoa vê apenas os próprios dados (RLS na tabela user_docs). */
const CLOUD = {sb:null, user:null, busy:false};
(() => {
  const cfg = window.DESFR_SUPA;
  if (!cfg || !window.supabase || !window.supabase.createClient) return;
  try { CLOUD.sb = window.supabase.createClient(cfg.url, cfg.key, {auth:{persistSession:true, autoRefreshToken:true, detectSessionInUrl:true}}); } catch (e) { console.warn(e); }
  let stored = false; try { stored = Object.keys(localStorage).some(k => /^sb-.*-auth-token$/.test(k)); } catch (e) {}
  if (CLOUD.sb && !stored && !/access_token|type=recovery|code=/.test(location.hash + location.search)) CLOUD.gateEarly = true;
})();

/* Mesma interface que o Store já usa: collection(...).doc(k).set/delete e collection(...).limit(n).get(). */
function cloudDB(){
  const sb = CLOUD.sb, t = () => sb.from("user_docs");
  const chk = r => { if (r.error) throw r.error; return r; };
  return {
    collection(){ return {
      doc(k){ return {
        set: async v => chk(await t().upsert({user_id:CLOUD.user.id, key:k, data:v}, {onConflict:"user_id,key"})),
        delete: async () => chk(await t().delete().eq("key", k))
      }; },
      limit(n){ return { get: async () => { const r = chk(await t().select("key,data").limit(n)); return {docs:(r.data || []).map(x => ({id:x.key, exists:true, data:() => x.data}))}; } }; }
    }; }
  };
}

Store.connectWith = async function(db, id){
  this.db = db; this.uid = id; setSync("saving");
  try {
    const snap = await db.collection("data/users/" + id).limit(1000).get();
    const remote = {}; snap.docs.forEach(d => { if (d.exists) remote[d.id] = d.data(); });
    let changed = false;
    for (const k in remote) { const r = remote[k], l = this.mem[k]; if (!l || (r._ts || 0) > (l._ts || 0)) { this.mem[k] = JSON.parse(JSON.stringify(r)); this.local(k, this.mem[k]); changed = true; } }
    const push = Object.keys(this.mem).filter(k => this.mem[k] && (!remote[k] || (this.mem[k]._ts || 0) > (remote[k]._ts || 0)));
    for (const k of push) await this.flush(k);
    setSync("ok");
    if (changed) render();
  } catch (e) { console.warn(e); setSync("err"); }
};

async function cloudSession(session){
  const u = session && session.user;
  if (!u) { CLOUD.user = null; Store.db = null; setSync("local"); showGate(); return; }
  hideGate();
  if (CLOUD.user && CLOUD.user.id === u.id) return;
  CLOUD.user = u;
  const nm = (u.user_metadata && u.user_metadata.name) || "";
  if (nm) VIEWER.name = nm;
  await Store.connectWith(cloudDB(), u.id);
  if (UI.tab === "inicio") render();
}
if (CLOUD.sb) {
  CLOUD.sb.auth.onAuthStateChange((ev, session) => {
    setTimeout(() => {
      if (ev === "PASSWORD_RECOVERY") { authModal("nova"); return; }
      cloudSession(session);
    }, 0);
  });
}

const AUTH_ERR = [
  [/invalid login credentials/i, "E-mail ou senha incorretos."],
  [/email not confirmed/i, "Falta confirmar o e-mail. Abra o link que enviamos e tente de novo."],
  [/already registered|already exists/i, "Esse e-mail já tem conta. Use Entrar."],
  [/rate limit|too many|security purposes/i, "Muitas tentativas seguidas. Espere alguns minutos e tente de novo."],
  [/password should be at least|weak/i, "A senha precisa ter pelo menos 6 caracteres."],
  [/invalid.*email|unable to validate email/i, "Esse e-mail não parece válido."],
  [/fetch|network/i, "Sem conexão com a internet agora."]
];
const authMsg = e => { const m = (e && (e.message || e.msg)) || ""; const hit = AUTH_ERR.find(([r]) => r.test(m)); return hit ? hit[1] : "Não deu certo agora. Tente de novo em instantes."; };

function accountBlock(){
  if (!CLOUD.sb) return `<div class="note">${ic("info")}<span>Seus dados ficam salvos <b>neste aparelho</b>. Faça um backup de vez em quando.</span></div>`;
  if (CLOUD.user) return `<div class="mgroup"><div class="mgroup-h">Sua conta<span class="pill good">na nuvem</span></div>
    <p class="sub" style="margin:0">Conectado como <b>${esc(CLOUD.user.email || "")}</b>. Seus dados ficam salvos na sua conta e aparecem em qualquer aparelho em que você entrar.</p>
    <div class="row" style="gap:8px"><button class="btn sm ghost danger" data-act="logout">Sair da conta</button></div></div>`;
  return `<div class="mgroup"><div class="mgroup-h">Salve na nuvem<span class="pill">grátis</span></div>
    <p class="sub" style="margin:0">Crie uma conta com seu e-mail para guardar dieta, treinos, medidas e fotos com segurança e usar no celular e no computador. Sem conta, tudo fica só neste aparelho.</p>
    <div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn primary sm" data-act="authOpen" data-arg="criar">${ic("user")}Criar conta</button><button class="btn sm" data-act="authOpen" data-arg="entrar">Já tenho conta</button></div></div>`;
}

let AUTH = {mode:"criar", msg:"", ok:"", email:"", where:"gate"};
function authForm(){
  const m = AUTH.mode, gate = AUTH.where === "gate";
  return `<form class="col" data-auth style="gap:12px" novalidate>
      ${m === "entrar" || m === "criar" ? `<div class="${gate ? "seg" : "chips"}" role="group" aria-label="Entrar ou criar conta"><button type="button" class="${gate ? "" : "chip"}" data-act="authOpen" data-arg="criar" aria-pressed="${m === "criar"}">Criar conta</button><button type="button" class="${gate ? "" : "chip"}" data-act="authOpen" data-arg="entrar" aria-pressed="${m === "entrar"}">Entrar</button></div>` : ""}
      ${m === "criar" ? `<div class="field"><label for="au-name">Como quer ser chamado</label><input id="au-name" class="input" autocomplete="given-name" maxlength="40" placeholder="Ex.: Fernando"></div>` : ""}
      ${m !== "nova" ? `<div class="field"><label for="au-email">E-mail</label><input id="au-email" class="input" type="email" autocomplete="email" inputmode="email" required value="${esc(AUTH.email)}" placeholder="voce@email.com"></div>` : ""}
      ${m !== "senha" ? `<div class="field"><label for="au-pass">${m === "nova" ? "Nova senha" : "Senha"}</label><input id="au-pass" class="input" type="password" minlength="6" required autocomplete="${m === "entrar" ? "current-password" : "new-password"}" placeholder="Mínimo de 6 caracteres"></div>` : ""}
      ${AUTH.msg ? `<div class="note warn">${ic("alert")}<span>${esc(AUTH.msg)}</span></div>` : ""}
      ${AUTH.ok ? `<div class="note good">${ic("check")}<span>${AUTH.ok}</span></div>` : ""}
      <button class="btn primary" type="submit" ${CLOUD.busy ? "disabled" : ""}>${CLOUD.busy ? "Aguarde…" : {entrar:"Entrar", criar:"Criar minha conta grátis", senha:"Enviar link de recuperação", nova:"Salvar nova senha"}[m]}</button>
      ${m === "entrar" ? `<button type="button" class="btn ghost sm" data-act="authOpen" data-arg="senha">Esqueci minha senha</button>` : ""}
      ${m === "senha" ? `<button type="button" class="btn ghost sm" data-act="authOpen" data-arg="entrar">Voltar para Entrar</button>` : ""}
    </form>`;
}
function renderGate(){
  const g = document.getElementById("gate"); if (!g || g.hidden) return;
  const title = {entrar:"Bem-vindo de volta", criar:"Crie sua conta", senha:"Recuperar senha", nova:"Nova senha"}[AUTH.mode];
  const sub = {entrar:"Entre para ver sua dieta, treinos e evolução.", criar:"Grátis. Seus dados ficam salvos na nuvem e aparecem em qualquer aparelho.", senha:"Digite seu e-mail e enviamos um link para criar uma nova senha.", nova:"Escolha a nova senha da sua conta."}[AUTH.mode];
  g.innerHTML = `<div class="gate-in">
    <div class="gate-hero"><img class="gate-logo" src="${LOGO_SRC}" alt="Desfrangolizador">
      <h1>Saia do <span>modo frango.</span></h1>
      <p>Dieta flexível, treino de hipertrofia e evolução do corpo em um só app.</p>
      <ul class="gate-list">${[["flame","Calorias, macros e água calculados para você"],["plate","Mais de 250 alimentos e troca grama a grama"],["dumbbell","Fichas de treino com carga, RPE e descanso"],["ruler","Medidas, % de gordura e fotos de antes e depois"],["medal","Níveis de Frango a Avançado"]].map(([i, t]) => `<li>${ic(i)}<span>${t}</span></li>`).join("")}</ul>
    </div>
    <div class="gate-card"><h2>${title}</h2><div class="sub">${sub}</div>${authForm()}
      <div class="gate-foot"><a href="sobre.html" style="color:var(--accent);font-weight:700;text-decoration:none">Conheça o app e veja como instalar →</a><br>Cada pessoa vê apenas os próprios dados. Valores nutricionais são aproximados e não substituem acompanhamento profissional.</div></div>
  </div>`;
  const f = g.querySelector(AUTH.mode === "criar" ? "#au-name" : "#au-email") || g.querySelector("#au-pass");
  if (f && matchMedia("(min-width:821px)").matches) f.focus();
}
function showGate(){ const g = document.getElementById("gate"); if (!g) return; const was = g.hidden; g.hidden = false; AUTH.where = "gate"; if (was) { AUTH.msg = ""; AUTH.ok = ""; } document.body.style.overflow = "hidden"; renderGate(); }
function hideGate(){ const g = document.getElementById("gate"); if (!g || g.hidden) return; g.hidden = true; g.innerHTML = ""; document.body.style.overflow = ""; AUTH.where = "modal"; }
function authModal(mode){
  if (mode) AUTH.mode = mode;
  const g = document.getElementById("gate");
  if (g && !g.hidden && AUTH.mode !== "nova") { renderGate(); return; }
  AUTH.where = "modal";
  const title = {entrar:"Entrar", criar:"Criar conta", senha:"Recuperar senha", nova:"Nova senha"}[AUTH.mode];
  openModal(`${sheetHead(title, "Sua conta Desfrangolizador")}${authForm()}`);
}
document.addEventListener("submit", async ev => {
  const f = ev.target; if (!f.matches("[data-auth]")) return;
  ev.preventDefault(); if (CLOUD.busy) return;
  const email = (($("#au-email") || {}).value || "").trim(), pass = ($("#au-pass") || {}).value || "", name = (($("#au-name") || {}).value || "").trim();
  AUTH.email = email; AUTH.msg = ""; AUTH.ok = "";
  const m = AUTH.mode;
  if (m !== "nova" && !/^\S+@\S+\.\S+$/.test(email)) { AUTH.msg = "Digite um e-mail válido."; authModal(); return; }
  if (m !== "senha" && pass.length < 6) { AUTH.msg = "A senha precisa ter pelo menos 6 caracteres."; authModal(); return; }
  CLOUD.busy = true; authModal();
  const back = location.origin + location.pathname;
  try {
    if (m === "entrar") { const r = await CLOUD.sb.auth.signInWithPassword({email, password:pass}); if (r.error) throw r.error; CLOUD.busy = false; closeModal(); await cloudSession(r.data.session); toast("Bem-vindo de volta!"); if (!Store.get("welcome")) { Store.put("welcome", {seen:true}); aboutModal(true); } }
    else if (m === "criar") {
      const r = await CLOUD.sb.auth.signUp({email, password:pass, options:{emailRedirectTo:back, data:name ? {name} : {}}}); if (r.error) throw r.error;
      if (name) setP({nick:name});
      CLOUD.busy = false;
      if (r.data.session) { closeModal(); await cloudSession(r.data.session); toast("Conta criada"); if (!Store.get("welcome")) { Store.put("welcome", {seen:true}); aboutModal(true); } }
      else { AUTH.mode = "entrar"; AUTH.ok = `Enviamos um link de confirmação para <b>${esc(email)}</b>. Abra o e-mail, toque no link e depois entre aqui com sua senha.`; authModal(); }
    }
    else if (m === "senha") { const r = await CLOUD.sb.auth.resetPasswordForEmail(email, {redirectTo:back}); if (r.error) throw r.error; CLOUD.busy = false; AUTH.ok = `Se existir uma conta com <b>${esc(email)}</b>, você vai receber um link para criar uma nova senha.`; authModal(); }
    else if (m === "nova") { const r = await CLOUD.sb.auth.updateUser({password:pass}); if (r.error) throw r.error; CLOUD.busy = false; closeModal(); toast("Senha alterada"); }
  } catch (e) { CLOUD.busy = false; AUTH.msg = authMsg(e); authModal(); }
});

async function logout(){
  confirmBox("Sair da conta?", "Seus dados continuam salvos na nuvem. Este aparelho fica limpo até você entrar de novo.", "Sair", async () => {
    for (let i = 0; i < 20 && (Object.values(Store.busy).some(Boolean) || Object.values(Store.t).some(Boolean)); i++) { Object.keys(Store.t).forEach(k => { if (Store.t[k]) { clearTimeout(Store.t[k]); Store.t[k] = null; Store.flush(k); } }); await new Promise(r => setTimeout(r, 150)); }
    try { await CLOUD.sb.auth.signOut(); } catch (e) {}
    CLOUD.user = null; Store.db = null; VIEWER.name = "";
    try { Object.keys(localStorage).filter(k => k.startsWith(LS)).forEach(k => localStorage.removeItem(k)); } catch (e) {}
    try { const all = await PhotoDB.all(); await Promise.all(Object.keys(all).map(k => PhotoDB.del(k))); } catch (e) {}
    Store.mem = {};
    closeModal(); UI.tab = "inicio"; render(); setSync("local"); AUTH.mode = "entrar"; showGate();
  });
}

if (CLOUD.gateEarly) showGate();
Object.assign(ACT, {
  authOpen: el => { AUTH.msg = ""; AUTH.ok = ""; authModal(el.dataset.arg); },
  logout: () => logout()
});
</script>
