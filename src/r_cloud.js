<script>
/* ======================= CONTA E NUVEM (SUPABASE) =======================
   Só na versão do site. Cada pessoa vê apenas os próprios dados (RLS na tabela user_docs). */
const CLOUD = {sb:null, user:null, busy:false};
(() => {
  const cfg = window.DESFR_SUPA;
  if (!cfg || !window.supabase || !window.supabase.createClient) return;
  try { CLOUD.sb = window.supabase.createClient(cfg.url, cfg.key, {auth:{persistSession:true, autoRefreshToken:true, detectSessionInUrl:true}}); } catch (e) { console.warn(e); }
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
  if (!u) { CLOUD.user = null; Store.db = null; setSync("local"); return; }
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

let AUTH = {mode:"entrar", msg:"", ok:"", email:""};
function authModal(mode){
  if (mode) AUTH.mode = mode;
  const m = AUTH.mode;
  const title = {entrar:"Entrar", criar:"Criar conta", senha:"Recuperar senha", nova:"Nova senha"}[m];
  openModal(`${sheetHead(title, "Sua conta Desfrangolizador")}
    <form class="col" data-auth style="gap:12px" novalidate>
      ${m !== "nova" ? `<div class="chips"><button type="button" class="chip" data-act="authOpen" data-arg="entrar" aria-pressed="${m === "entrar"}">Entrar</button><button type="button" class="chip" data-act="authOpen" data-arg="criar" aria-pressed="${m === "criar"}">Criar conta</button></div>` : ""}
      ${m === "criar" ? `<div class="field"><label for="au-name">Como quer ser chamado</label><input id="au-name" class="input" autocomplete="given-name" maxlength="40" placeholder="Ex.: Fernando"></div>` : ""}
      ${m !== "nova" ? `<div class="field"><label for="au-email">E-mail</label><input id="au-email" class="input" type="email" autocomplete="email" inputmode="email" required value="${esc(AUTH.email)}" autofocus></div>` : ""}
      ${m !== "senha" ? `<div class="field"><label for="au-pass">${m === "nova" ? "Nova senha" : "Senha"}</label><input id="au-pass" class="input" type="password" minlength="6" required autocomplete="${m === "entrar" ? "current-password" : "new-password"}" placeholder="Mínimo de 6 caracteres"></div>` : ""}
      ${AUTH.msg ? `<div class="note warn">${ic("alert")}<span>${esc(AUTH.msg)}</span></div>` : ""}
      ${AUTH.ok ? `<div class="note good">${ic("check")}<span>${AUTH.ok}</span></div>` : ""}
      <button class="btn primary" type="submit" ${CLOUD.busy ? "disabled" : ""}>${CLOUD.busy ? "Aguarde…" : {entrar:"Entrar", criar:"Criar minha conta", senha:"Enviar link de recuperação", nova:"Salvar nova senha"}[m]}</button>
      ${m === "entrar" ? `<button type="button" class="btn ghost sm" data-act="authOpen" data-arg="senha">Esqueci minha senha</button>` : ""}
      ${m === "criar" ? `<p class="sub" style="margin:0">Os dados que já estão neste aparelho vão junto para a sua conta.</p>` : ""}
    </form>`);
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
    if (m === "entrar") { const r = await CLOUD.sb.auth.signInWithPassword({email, password:pass}); if (r.error) throw r.error; CLOUD.busy = false; closeModal(); toast("Bem-vindo de volta!"); await cloudSession(r.data.session); }
    else if (m === "criar") {
      const r = await CLOUD.sb.auth.signUp({email, password:pass, options:{emailRedirectTo:back, data:name ? {name} : {}}}); if (r.error) throw r.error;
      if (name) setP({nick:name});
      CLOUD.busy = false;
      if (r.data.session) { closeModal(); toast("Conta criada"); await cloudSession(r.data.session); }
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
    Store.mem = {}; Store.put("welcome", {seen:true});
    closeModal(); UI.tab = "inicio"; render(); setSync("local"); toast("Você saiu da conta");
  });
}

Object.assign(ACT, {
  authOpen: el => { AUTH.msg = ""; AUTH.ok = ""; authModal(el.dataset.arg); },
  logout: () => logout()
});
</script>
