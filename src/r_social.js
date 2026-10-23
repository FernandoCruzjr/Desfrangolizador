<style>
/* Comunidade: feed de posts, perfis, comentários e moderação. */
.feed{display:flex;flex-direction:column;gap:12px;width:100%;max-width:640px;margin:0 auto}
.post{background:var(--glass);border:1px solid var(--glass-b);border-radius:18px;padding:14px;display:flex;flex-direction:column;gap:10px}
.post-h{display:grid;grid-template-columns:42px 1fr auto;gap:10px;align-items:center}
.uav{width:42px;height:42px;border-radius:50%;background:var(--flame);color:var(--on-accent);display:grid;place-items:center;font:800 16px var(--f-display);overflow:hidden;flex:none;border:0;padding:0;cursor:pointer}
.uav img{width:100%;height:100%;object-fit:cover}
.uav.sm{width:32px;height:32px;font-size:13px}
.uav.lg{width:96px;height:96px;font-size:36px;margin:0 auto}
.uname{background:none;border:0;padding:0;color:var(--text);font:700 15px Figtree,sans-serif;cursor:pointer;text-align:left}
.uname small{display:block;font-weight:500;color:var(--faint);font-size:12.5px}
.post-body{white-space:pre-wrap;overflow-wrap:anywhere;font-size:15px;line-height:1.5}
.post-img{width:100%;border-radius:14px;display:block;max-height:560px;object-fit:cover;background:rgba(0,0,0,.25)}
.post-act{display:grid;grid-template-columns:110px 1fr;gap:12px;align-items:center;background:rgba(0,0,0,.22);border-radius:14px;padding:10px}
.post-act .map{aspect-ratio:1;border-radius:10px;background:rgba(0,0,0,.25);display:grid;place-items:center;color:var(--accent)}
.post-act .map svg{width:44px;height:44px}
.post-act .nums{display:grid;grid-template-columns:repeat(2,1fr);gap:6px 12px}
.post-act .nums b{display:block;font:800 19px var(--f-mono,monospace)}
.post-act .nums span{font-size:12px;color:var(--muted)}
.post-wk{background:rgba(0,0,0,.22);border-radius:14px;padding:12px}
.post-wk ul{margin:8px 0 0;padding-left:18px;color:var(--muted);font-size:14px}
.post-f{display:flex;gap:6px;align-items:center}
.pbtn{display:inline-flex;align-items:center;gap:6px;border:0;background:transparent;color:var(--muted);font:600 14px Figtree,sans-serif;padding:8px 10px;border-radius:10px;cursor:pointer}
.pbtn svg{width:20px;height:20px}
.pbtn:hover{background:var(--glass)}
.pbtn.on{color:#FF6B81}.pbtn.on svg{fill:#FF6B81;stroke:#FF6B81}
.cmt{display:grid;grid-template-columns:32px 1fr auto;gap:10px;align-items:start;padding:8px 0;border-bottom:1px solid var(--glass-b)}
.cmt p{margin:2px 0 0;white-space:pre-wrap;overflow-wrap:anywhere;font-size:14.5px}
.compose{display:flex;gap:8px;align-items:flex-end}
.compose textarea{flex:1;min-height:44px;max-height:140px;resize:vertical}
.soc-top{width:100%;display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:space-between;max-width:640px;margin:0 auto 12px}
.prof-stats{display:flex;justify-content:center;gap:22px;text-align:center}
.prof-stats b{display:block;font:800 20px var(--f-mono,monospace)}
.prof-stats span{font-size:12.5px;color:var(--muted)}
.attach{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px}
.attach button{flex:none}
.ppl{display:flex;flex-direction:column;gap:8px}
.ppl-row{display:grid;grid-template-columns:42px 1fr auto;gap:10px;align-items:center}
.rules{font-size:13.5px;color:var(--muted);margin:0;padding-left:18px;line-height:1.6}
</style>
<script>
/* ======================= COMUNIDADE ======================= */
const SOC = {me:undefined, admin:false, tab:"descobrir", posts:[], liked:new Set(), loading:false, end:false, err:"", follows:new Set(), q:"", people:null, compose:null};
const socOn = () => typeof CLOUD !== "undefined" && CLOUD.sb && CLOUD.user;
const SB = () => CLOUD.sb;
const MEDIA_PREFIX = () => (window.DESFR_SUPA ? window.DESFR_SUPA.url : "") + "/storage/v1/object/public/media/";
const safeImg = u => typeof u === "string" && u.startsWith(MEDIA_PREFIX()) ? u : "";
function ago(t){
  const s = (Date.now() - new Date(t).getTime()) / 1000;
  if (s < 60) return "agora"; if (s < 3600) return Math.floor(s / 60) + " min"; if (s < 86400) return Math.floor(s / 3600) + " h";
  if (s < 604800) return Math.floor(s / 86400) + " d"; const d = new Date(t); return dLabel(iso(d));
}
function uav(p, cls = ""){
  const src = p && safeImg(p.avatar_url), init = ((p && (p.display_name || p.username)) || "?").slice(0, 1).toUpperCase();
  return `<button class="uav ${cls}" data-act="socProfile" data-arg="${p ? p.id : ""}" aria-label="Ver perfil de ${esc(p ? p.display_name : "")}">${src ? `<img src="${esc(src)}" alt="" loading="lazy">` : esc(init)}</button>`;
}
const socErr = e => { console.warn(e); const m = (e && e.message) || ""; toast(/fetch|network/i.test(m) ? "Sem conexão agora" : /duplicate|unique/i.test(m) ? "Esse @usuário já existe" : "Não deu certo, tente de novo"); };

/* ---------- Dados ---------- */
async function socLoadMe(){
  if (SOC.loading) return; SOC.loading = true;
  try {
    const uid = CLOUD.user.id;
    const [me, ad, fl] = await Promise.all([
      SB().from("profiles").select("*").eq("id", uid).maybeSingle(),
      SB().from("admins").select("user_id").eq("user_id", uid).maybeSingle(),
      SB().from("follows").select("followee").eq("follower", uid)
    ]);
    if (me.error) throw me.error;
    SOC.me = me.data || null; SOC.admin = !!(ad.data); SOC.follows = new Set(((fl.data) || []).map(x => x.followee));
    SOC.err = "";
  } catch (e) { SOC.err = "Sem conexão com a Comunidade agora."; SOC.me = undefined; }
  SOC.loading = false;
  if (SOC.me) { socLoadFeed(true); try { const sv = JSON.parse(sessionStorage.getItem(CMP_LS) || "null"); if (sv && !SOC.compose && (sv.body || sv.img)) { SOC.compose = {body:sv.body, att:sv.att, imgData:sv.img, imgUrl:sv.img}; UI.tab = "social"; render(); composer(); toast("Seu post foi recuperado"); } } catch (e) {} }
  else if (UI.tab === "social") render();
}
const POST_SEL = "id,user_id,kind,body,data,image_url,created_at,profiles!posts_user_id_fkey(id,username,display_name,avatar_url),likes(count),comments(count)";
async function socLoadFeed(reset){
  if (SOC.loading) return; SOC.loading = true;
  if (reset) { SOC.posts = []; SOC.end = false; }
  if (UI.tab === "social") render();
  try {
    let q = SB().from("posts").select(POST_SEL).order("created_at", {ascending:false}).limit(15);
    if (SOC.tab === "seguindo") q = q.in("user_id", [CLOUD.user.id, ...SOC.follows]);
    if (SOC.posts.length) q = q.lt("created_at", SOC.posts[SOC.posts.length - 1].created_at);
    const r = await q; if (r.error) throw r.error;
    const got = r.data || []; SOC.posts = SOC.posts.concat(got); if (got.length < 15) SOC.end = true;
    if (got.length) { const lk = await SB().from("likes").select("post_id").eq("user_id", CLOUD.user.id).in("post_id", got.map(p => p.id)); (lk.data || []).forEach(x => SOC.liked.add(x.post_id)); }
    SOC.err = "";
  } catch (e) { SOC.err = "Não foi possível carregar o feed. Verifique a internet."; }
  SOC.loading = false;
  if (UI.tab === "social") render();
}
const cnt = (p, k) => (p[k] && p[k][0] && p[k][0].count) || 0;

/* ---------- Tela ---------- */
function vSocial(){
  const head = `<div class="ph"><div><div class="eyebrow">Comunidade · treine junto</div><h1>Comunidade</h1><p class="lede">Poste suas corridas, treinos e conquistas, siga a galera e incentive quem está saindo do modo frango.</p></div></div>`;
  if (typeof CLOUD === "undefined" || !CLOUD.sb) return head + `<div class="note">${ic("info")}<span>A Comunidade funciona no site do app, com a sua conta: <a href="https://fernandocruzjr.github.io/Desfrangolizador/" target="_blank" rel="noopener"><b>abrir o Desfrangolizador</b></a>.</span></div>`;
  if (!CLOUD.user) return head + `<div class="note">${ic("info")}<span>Entre na sua conta para usar a Comunidade.</span></div>`;
  if (SOC.me === undefined) { if (!SOC.loading && !SOC.err) setTimeout(socLoadMe, 0); return head + (SOC.err ? `<div class="note warn">${ic("alert")}<span>${esc(SOC.err)}</span><button class="btn sm" data-act="socRetry">Tentar de novo</button></div>` : `<div class="empty">Carregando…</div>`); }
  if (SOC.me === null) return head + socOnboard();
  const posts = SOC.posts;
  return head + `
    <div class="soc-top">
      <div class="seg">${[["descobrir","Descobrir"],["seguindo","Seguindo"]].map(([k, n]) => `<button data-act="socTab" data-arg="${k}" aria-pressed="${SOC.tab === k}">${n}</button>`).join("")}</div>
      <div class="row" style="gap:6px">
        <button class="iconbtn" data-act="socPeople" aria-label="Buscar pessoas">${ic("search")}</button>
        ${SOC.admin ? `<button class="iconbtn" data-act="socMod" aria-label="Moderação">${ic("shield")}</button>` : ""}
        <button class="iconbtn" data-act="socProfile" data-arg="${SOC.me.id}" aria-label="Meu perfil">${ic("user")}</button>
        <button class="btn primary sm" data-act="socNew">${ic("plus")}Postar</button>
      </div>
    </div>
    <div class="feed">
      ${SOC.err ? `<div class="note warn">${ic("alert")}<span>${esc(SOC.err)}</span><button class="btn sm" data-act="socRefresh">Tentar de novo</button></div>` : ""}
      ${posts.map(postCard).join("")}
      ${!posts.length && !SOC.loading && !SOC.err ? `<div class="chart-empty">${ic("users")}<b>${SOC.tab === "seguindo" ? "Siga pessoas para ver os posts delas aqui" : "Seja o primeiro a postar!"}</b><span>${SOC.tab === "seguindo" ? "Use a lupa para encontrar a galera." : "Compartilhe uma corrida, um treino ou uma foto."}</span><button class="btn primary sm" data-act="${SOC.tab === "seguindo" ? "socPeople" : "socNew"}">${SOC.tab === "seguindo" ? "Buscar pessoas" : "Criar post"}</button></div>` : ""}
      ${SOC.loading ? `<div class="empty">Carregando…</div>` : posts.length && !SOC.end ? `<button class="btn" data-act="socMore">Carregar mais</button>` : ""}
      ${posts.length ? `<div class="row" style="justify-content:center"><button class="btn sm ghost" data-act="socRefresh">${ic("history")}Atualizar</button></div>` : ""}
    </div>`;
}
function postCard(p){
  const u = p.profiles || {}, mine = p.user_id === CLOUD.user.id, liked = SOC.liked.has(p.id), d = p.data || {};
  let extra = "";
  if (p.kind === "run" && d.type) {
    const t = typeof AT === "function" ? AT(d.type) : {n:"Atividade", ic:"run"};
    extra = `<div class="post-act"><div class="map">${d.track && d.track.length > 1 && typeof routeSVG === "function" ? routeSVG(d.track, "", 4) : ic(t.ic)}</div><div><b>${esc(t.n)}</b><div class="nums" style="margin-top:6px">${d.km ? `<div><b>${fmt(d.km, 2)}</b><span>km</span></div>` : ""}<div><b>${durTxt(d.min)}</b><span>tempo</span></div>${d.km && d.type !== "bike" ? `<div><b>${paceTxt(d.min * 60, d.km)}</b><span>ritmo /km</span></div>` : ""}<div><b>${fmt(d.kcal)}</b><span>kcal</span></div></div></div></div>`;
  } else if (p.kind === "workout" && d.name) {
    extra = `<div class="post-wk"><b>${ic("dumbbell", 'style="width:18px;height:18px;vertical-align:-3px;color:var(--accent)"')} ${esc(d.name)}</b> <span class="sub">· ${fmt(d.sets)} séries · ${fmt(d.vol)} kg de volume${d.min ? " · " + durTxt(d.min) : ""}</span><ul>${(d.ex || []).slice(0, 8).map(e => `<li>${esc(e.n)}: ${e.s}× ${esc(e.best || "")}</li>`).join("")}</ul></div>`;
  }
  const img = safeImg(p.image_url);
  return `<article class="post" id="p-${p.id}">
    <div class="post-h">${uav(u)}<button class="uname" data-act="socProfile" data-arg="${u.id || ""}">${esc(u.display_name || "")}<small>@${esc(u.username || "")} · ${ago(p.created_at)}</small></button>
      <button class="iconbtn" data-act="socMenu" data-arg="${p.id}" aria-label="Mais opções">${ic("dots")}</button></div>
    ${p.body ? `<div class="post-body">${esc(p.body)}</div>` : ""}
    ${extra}
    ${img ? `<img class="post-img" src="${esc(img)}" alt="Foto do post" loading="lazy" onerror="this.remove()">` : ""}
    <div class="post-f"><button class="pbtn ${liked ? "on" : ""}" data-act="socLike" data-arg="${p.id}" aria-pressed="${liked}" aria-label="Curtir">${ic("heart")}<span>${cnt(p, "likes") || ""}</span></button>
      <button class="pbtn" data-act="socComments" data-arg="${p.id}" aria-label="Comentários">${ic("chat")}<span>${cnt(p, "comments") || ""}</span></button></div>
  </article>`;
}

/* ---------- Criar perfil ---------- */
function socOnboard(){
  const nick = (P().nick || VIEWER.name || "").trim(), sug = nick.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9_.]/g, "").slice(0, 16);
  return `<section class="panel" style="max-width:560px;margin:0 auto"><div class="panel-h"><h2>${ic("users")}Crie seu perfil na Comunidade</h2></div>
    <form class="col" data-socform="onboard" style="gap:12px" novalidate>
      <div class="field"><label for="so-user">@usuário</label><input id="so-user" class="input" maxlength="20" autocapitalize="none" autocomplete="username" placeholder="ex.: fernando.run" value="${esc(sug)}"><span class="sub">3 a 20 letras minúsculas, números, ponto ou _</span></div>
      <div class="field"><label for="so-name">Nome que aparece</label><input id="so-name" class="input" maxlength="40" value="${esc(nick)}" placeholder="Seu nome"></div>
      <div class="field"><label for="so-bio">Bio (opcional)</label><input id="so-bio" class="input" maxlength="160" placeholder="Ex.: Correndo 5 km e saindo do modo frango"></div>
      <div class="mgroup"><div class="mgroup-h">Regras da Comunidade</div><ul class="rules"><li>Respeito sempre: nada de ofensa, preconceito ou assédio.</li><li>Sem nudez, venda de produtos ou remédios, e sem dicas perigosas.</li><li>Fotos de corpo só se você quiser. Nada vai para o feed sem você postar.</li><li>Seus dados de dieta, medidas e peso continuam privados.</li><li>Posts que quebrarem as regras podem ser removidos.</li></ul></div>
      <label class="row" style="gap:10px;cursor:pointer"><input type="checkbox" id="so-ok"> <span>Li e concordo com as regras</span></label>
      <button class="btn primary" type="submit">${ic("check")}Entrar na Comunidade</button>
    </form></section>`;
}
async function uploadImg(blob, name){
  const path = CLOUD.user.id + "/" + name;
  const r = await SB().storage.from("media").upload(path, blob, {contentType:"image/jpeg", upsert:true, cacheControl:"3600"});
  if (r.error) throw r.error;
  return SB().storage.from("media").getPublicUrl(path).data.publicUrl + "?v=" + Date.now().toString(36);
}
async function toJpeg(src, max, q = .82, square = false){
  let img;
  try { img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error("decode")); i.src = typeof src === "string" ? src : URL.createObjectURL(src); }); }
  catch (e) { if (typeof src === "string" || !window.createImageBitmap) throw e; const bm = await createImageBitmap(src); img = {naturalWidth:bm.width, naturalHeight:bm.height, _bm:bm}; }
  const draw = img._bm || img;
  let w = img.naturalWidth, h = img.naturalHeight, sx = 0, sy = 0, sw = w, sh = h;
  if (square) { const s = Math.min(w, h); sx = (w - s) / 2; sy = (h - s) / 2; sw = sh = s; w = h = Math.min(max, s); }
  else { const k = Math.min(1, max / Math.max(w, h)); w = Math.round(w * k); h = Math.round(h * k); }
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; cv.getContext("2d").drawImage(draw, sx, sy, sw, sh, 0, 0, w, h);
  return new Promise((r, j) => cv.toBlob(b => b ? r(b) : j(new Error("toBlob")), "image/jpeg", q));
}
document.addEventListener("submit", async ev => {
  const f = ev.target; if (!f.matches("[data-socform]")) return; ev.preventDefault();
  const kind = f.dataset.socform, btn = f.querySelector("button[type=submit]");
  if (kind === "onboard" || kind === "editprof") {
    const username = ($("#so-user").value || "").trim().toLowerCase(), display_name = ($("#so-name").value || "").trim(), bio = ($("#so-bio").value || "").trim();
    if (!/^[a-z0-9_.]{3,20}$/.test(username)) { toast("O @usuário precisa ter 3 a 20 letras minúsculas, números, ponto ou _"); return; }
    if (!display_name) { toast("Coloque o nome que vai aparecer"); return; }
    if (kind === "onboard" && !$("#so-ok").checked) { toast("Aceite as regras para continuar"); return; }
    btn.disabled = true;
    try {
      const row = {id:CLOUD.user.id, username, display_name, bio};
      if (kind === "onboard" && typeof avatarSrc === "function" && avatarSrc()) { try { row.avatar_url = await uploadImg(await toJpeg(avatarSrc(), 256, .85, true), "avatar.jpg"); } catch (e) {} }
      const r = kind === "onboard" ? await SB().from("profiles").insert(row).select().single() : await SB().from("profiles").update({username, display_name, bio}).eq("id", CLOUD.user.id).select().single();
      if (r.error) throw r.error;
      SOC.me = r.data; closeModal(); toast(kind === "onboard" ? "Bem-vindo à Comunidade!" : "Perfil atualizado"); socLoadFeed(true);
    } catch (e) { socErr(e); btn.disabled = false; }
  }
  if (kind === "comment") {
    const ta = f.querySelector("textarea"), body = (ta.value || "").trim(); if (!body) return;
    btn.disabled = true;
    try { const r = await SB().from("comments").insert({post_id:f.dataset.post, body}); if (r.error) throw r.error; const p = SOC.posts.find(x => x.id === f.dataset.post); if (p) p.comments = [{count:cnt(p, "comments") + 1}]; commentsModal(f.dataset.post); render(); }
    catch (e) { socErr(e); btn.disabled = false; }
  }
});

/* ---------- Post novo ---------- */
function composer(){
  const c = SOC.compose; const acts = typeof allActs === "function" ? allActs().slice(0, 8) : [], ss = allSessions().slice(0, 5);
  const sel = c.att;
  openModal(`${sheetHead("Novo post", "Comunidade")}
    <div class="col" style="gap:12px">
      <textarea id="pc-body" class="input" maxlength="600" rows="3" placeholder="Como foi o treino hoje?" style="min-height:90px">${esc(c.body || "")}</textarea>
      ${c.prep ? `<div class="empty">Preparando a foto…</div>` : c.imgUrl ? `<div style="position:relative"><img src="${c.imgUrl}" alt="" class="post-img" style="max-height:280px"><button class="iconbtn" data-act="pcImgDel" style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,.6)" aria-label="Remover foto">${ic("x")}</button></div>` : `<label class="btn" style="cursor:pointer;justify-content:center">${ic("camera")}Adicionar foto<input type="file" accept="image/*" data-pcimg hidden></label>`}
      ${acts.length || ss.length ? `<div><div class="lbl" style="margin-bottom:6px">Anexar (opcional)</div><div class="attach">
        <button class="chip" data-act="pcAtt" data-arg="" aria-pressed="${!sel}">Nada</button>
        ${acts.map(a => `<button class="chip" data-act="pcAtt" data-arg="a:${a.id}" aria-pressed="${sel === "a:" + a.id}">${ic(AT(a.type).ic)}${esc(AT(a.type).n)} ${a.km ? fmt(a.km, 1) + " km" : durTxt(a.min)} · ${dShort(a.date)}</button>`).join("")}
        ${ss.map(s => `<button class="chip" data-act="pcAtt" data-arg="w:${s.id}" aria-pressed="${sel === "w:" + s.id}">${ic("dumbbell")}${esc(s.name)} · ${dShort(s.date)}</button>`).join("")}
      </div>${sel && sel.startsWith("a:") ? `<p class="sub" style="margin:6px 0 0">No mapa escondemos os primeiros e os últimos 200 m do trajeto.</p>` : ""}</div>` : ""}
      <button class="btn primary" data-act="pcSend" ${c.busy ? "disabled" : ""}>${ic("send")}${c.busy ? "Publicando…" : "Publicar"}</button>
    </div>`);
}
document.addEventListener("input", ev => { if (ev.target.id === "pc-body" && SOC.compose) { SOC.compose.body = ev.target.value; cmpSave(); } });
const CMP_LS = "desfr-compose";
function cmpSave(){ try { const c = SOC.compose; if (!c) { sessionStorage.removeItem(CMP_LS); return; } sessionStorage.setItem(CMP_LS, JSON.stringify({body:c.body || "", att:c.att || "", img:c.imgData || ""})); } catch (e) {} }
const blobToData = b => new Promise((r, j) => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.onerror = j; fr.readAsDataURL(b); });
document.addEventListener("change", async ev => {
  const el = ev.target; if (!el.matches("[data-pcimg]") || !el.files || !el.files[0] || !SOC.compose) return;
  const f = el.files[0], c = SOC.compose;
  c.prep = true; composer();
  try { const b = await toJpeg(f, 1280, .8); c.file = b; c.imgData = await blobToData(b); c.imgUrl = c.imgData; cmpSave(); }
  catch (e) { toast(/heic|heif/i.test(f.type + f.name) ? "Essa foto está em HEIC. Escolha outra ou mude a câmera para JPEG." : "Não consegui abrir essa foto. Tente outra ou tire uma nova."); }
  c.prep = false; composer();
});
async function pcSend(){
  const c = SOC.compose, body = (c.body || "").trim();
  let kind = "text", data = null;
  if (c.att && c.att.startsWith("a:")) { const a = allActs().find(x => x.id === c.att.slice(2)); if (a) { kind = "run"; data = {type:a.type, km:a.km || 0, min:a.min, kcal:a.kcal}; if (a.track && a.track.length > 3) data.track = simplify(trimEnds(a.track), 150); } }
  if (c.att && c.att.startsWith("w:")) { const s = allSessions().find(x => x.id === c.att.slice(2)); if (s) { kind = "workout"; data = {name:s.name, sets:sessSets(s), vol:Math.round(sessVolume(s)), min:s.end && s.start ? Math.round((s.end - s.start) / 60000) : 0, ex:s.ex.map(e => { const b = e.sets.reduce((m, st) => (+st.kg || 0) * (+st.r || 0) > (+m.kg || 0) * (+m.r || 0) ? st : m, e.sets[0] || {}); return {n:(EX[e.id] || {}).n || e.id, s:e.sets.length, best:b && b.r ? `${b.r}${b.kg ? " × " + fmt(b.kg, 1) + " kg" : ""}` : ""}; })}; } }
  if (!body && !c.file && !data) { toast("Escreva algo, adicione uma foto ou anexe uma atividade"); return; }
  c.busy = true; composer();
  try {
    let image_url = null;
    if (!c.file && c.imgData) c.file = await (await fetch(c.imgData)).blob();
    if (c.file) { try { image_url = await uploadImg(c.file, "p-" + uid() + ".jpg"); } catch (e) { e.stage = "foto"; throw e; } if (kind === "text") kind = "photo"; }
    const r = await SB().from("posts").insert({body, kind, data, image_url}).select(POST_SEL).single();
    if (r.error) throw r.error;
    SOC.posts.unshift(r.data); SOC.compose = null; cmpSave(); closeModal(); UI.tab = "social"; render(); toast("Post publicado!");
  } catch (e) { c.busy = false; composer(); if (e && e.stage === "foto") { console.warn(e); toast("A foto não subiu (" + String(e.message || e.statusCode || "erro").slice(0, 60) + "). Tente de novo."); } else socErr(e); }
}

/* ---------- Comentários ---------- */
async function commentsModal(pid){
  openModal(`${sheetHead("Comentários")}<div id="cm-list"><div class="empty">Carregando…</div></div>
    <form class="compose" data-socform="comment" data-post="${pid}" style="margin-top:12px"><textarea class="input" maxlength="300" rows="1" placeholder="Escreva um comentário…" aria-label="Comentário"></textarea><button class="btn primary" type="submit" aria-label="Enviar">${ic("send")}</button></form>`);
  try {
    const r = await SB().from("comments").select("id,body,created_at,user_id,profiles!comments_user_id_fkey(id,username,display_name,avatar_url)").eq("post_id", pid).order("created_at").limit(200);
    if (r.error) throw r.error;
    const post = SOC.posts.find(x => x.id === pid), mineP = post && post.user_id === CLOUD.user.id, el = $("#cm-list"); if (!el) return;
    el.innerHTML = (r.data || []).length ? r.data.map(c => `<div class="cmt">${uav(c.profiles, "sm")}<div><b>${esc((c.profiles || {}).display_name || "")}</b> <span class="sub">· ${ago(c.created_at)}</span><p>${esc(c.body)}</p></div>
      <div class="row" style="gap:0;flex-wrap:nowrap">${c.user_id === CLOUD.user.id || mineP || SOC.admin ? `<button class="iconbtn" data-act="socDelCmt" data-arg="${c.id}" data-post="${pid}" aria-label="Apagar comentário">${ic("trash")}</button>` : ""}${c.user_id !== CLOUD.user.id ? `<button class="iconbtn" data-act="socReport" data-kind="comment" data-arg="${c.id}" aria-label="Denunciar comentário">${ic("flag")}</button>` : ""}</div></div>`).join("") : `<div class="empty">Nenhum comentário ainda. Mande um incentivo!</div>`;
  } catch (e) { const el = $("#cm-list"); if (el) el.innerHTML = `<div class="note warn">${ic("alert")}<span>Não foi possível carregar os comentários.</span></div>`; }
}

/* ---------- Perfil ---------- */
async function profileView(id){
  openModal(`${sheetHead("Perfil")}<div id="pv"><div class="empty">Carregando…</div></div>`);
  try {
    const [pr, fr, fg, ps] = await Promise.all([
      SB().from("profiles").select("*").eq("id", id).maybeSingle(),
      SB().from("follows").select("follower", {count:"exact", head:true}).eq("followee", id),
      SB().from("follows").select("followee", {count:"exact", head:true}).eq("follower", id),
      SB().from("posts").select(POST_SEL).eq("user_id", id).order("created_at", {ascending:false}).limit(12)
    ]);
    const p = pr.data, el = $("#pv"); if (!el) return;
    if (!p) { el.innerHTML = `<div class="empty">Perfil indisponível.</div>`; return; }
    const me = id === CLOUD.user.id, fol = SOC.follows.has(id);
    (ps.data || []).forEach(x => { if (!SOC.posts.some(y => y.id === x.id)) SOC.posts.push(Object.assign({}, x, {_extra:true})); });
    el.innerHTML = `<div class="col" style="gap:12px;text-align:center">${uav(p, "lg")}<div><h2 style="margin:0">${esc(p.display_name)}</h2><div class="sub">@${esc(p.username)}</div></div>
      ${p.bio ? `<p style="margin:0">${esc(p.bio)}</p>` : ""}
      <div class="prof-stats"><div><b>${(ps.data || []).length}${(ps.data || []).length === 12 ? "+" : ""}</b><span>posts</span></div><div><b>${fr.count || 0}</b><span>seguidores</span></div><div><b>${fg.count || 0}</b><span>seguindo</span></div></div>
      <div class="row" style="gap:8px;justify-content:center;flex-wrap:wrap">${me ? `<button class="btn sm" data-act="socEditProf">${ic("edit")}Editar perfil</button><label class="btn sm" style="cursor:pointer">${ic("camera")}Foto<input type="file" accept="image/*" data-socav hidden></label><button class="btn sm ghost" data-act="socBlocks">${ic("ban")}Bloqueados</button>` : `<button class="btn ${fol ? "" : "primary"} sm" data-act="socFollow" data-arg="${id}">${fol ? "Seguindo ✓" : "Seguir"}</button><button class="btn sm ghost" data-act="socReport" data-kind="user" data-arg="${id}">${ic("flag")}Denunciar</button><button class="btn sm ghost danger" data-act="socBlock" data-arg="${id}">${ic("ban")}Bloquear</button>`}</div>
      <div class="feed" style="text-align:left">${(ps.data || []).map(postCard).join("") || `<div class="empty">Nenhum post ainda.</div>`}</div></div>`;
  } catch (e) { const el = $("#pv"); if (el) el.innerHTML = `<div class="note warn">${ic("alert")}<span>Não foi possível abrir o perfil.</span></div>`; }
}
document.addEventListener("change", async ev => {
  const el = ev.target; if (!el.matches("[data-socav]") || !el.files || !el.files[0]) return;
  try { toast("Enviando foto…"); const url = await uploadImg(await toJpeg(el.files[0], 256, .85, true), "avatar.jpg"); const r = await SB().from("profiles").update({avatar_url:url}).eq("id", CLOUD.user.id).select().single(); if (r.error) throw r.error; SOC.me = r.data; SOC.posts.forEach(p => { if (p.user_id === SOC.me.id && p.profiles) p.profiles.avatar_url = url; }); profileView(SOC.me.id); render(); toast("Foto atualizada"); }
  catch (e) { socErr(e); }
});
function editProfModal(){
  const p = SOC.me;
  openModal(`${sheetHead("Editar perfil")}<form class="col" data-socform="editprof" style="gap:12px" novalidate>
    <div class="field"><label for="so-user">@usuário</label><input id="so-user" class="input" maxlength="20" autocapitalize="none" value="${esc(p.username)}"></div>
    <div class="field"><label for="so-name">Nome que aparece</label><input id="so-name" class="input" maxlength="40" value="${esc(p.display_name)}"></div>
    <div class="field"><label for="so-bio">Bio</label><input id="so-bio" class="input" maxlength="160" value="${esc(p.bio || "")}"></div>
    <button class="btn primary" type="submit">${ic("check")}Salvar</button></form>`);
}

/* ---------- Pessoas ---------- */
async function peopleModal(q){
  SOC.q = q == null ? SOC.q : q;
  openModal(`${sheetHead("Buscar pessoas")}<input id="pp-q" class="input" placeholder="Nome ou @usuário" value="${esc(SOC.q)}" autocapitalize="none"><div id="pp-list" class="ppl" style="margin-top:12px"><div class="empty">Carregando…</div></div>`);
  const inp = $("#pp-q"); if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
  try {
    let r = SB().from("profiles").select("id,username,display_name,avatar_url,bio").neq("id", CLOUD.user.id).order("created_at", {ascending:false}).limit(30);
    const s = SOC.q.trim().replace(/[%_,()]/g, ""); if (s) r = r.or(`username.ilike.%${s}%,display_name.ilike.%${s}%`);
    const res = await r; if (res.error) throw res.error;
    const el = $("#pp-list"); if (!el) return;
    el.innerHTML = (res.data || []).map(p => `<div class="ppl-row">${uav(p)}<button class="uname" data-act="socProfile" data-arg="${p.id}">${esc(p.display_name)}<small>@${esc(p.username)}</small></button><button class="btn sm ${SOC.follows.has(p.id) ? "" : "primary"}" data-act="socFollow" data-arg="${p.id}" data-from="people">${SOC.follows.has(p.id) ? "Seguindo" : "Seguir"}</button></div>`).join("") || `<div class="empty">Ninguém encontrado.</div>`;
  } catch (e) { const el = $("#pp-list"); if (el) el.innerHTML = `<div class="note warn">${ic("alert")}<span>Sem conexão agora.</span></div>`; }
}
let PP_T = null;
document.addEventListener("input", ev => { if (ev.target.id === "pp-q") { clearTimeout(PP_T); const v = ev.target.value; PP_T = setTimeout(() => peopleModal(v), 400); } });

/* ---------- Moderação ---------- */
async function modModal(){
  openModal(`${sheetHead("Moderação", "Só você vê")}<div id="md"><div class="empty">Carregando…</div></div>`);
  try {
    const r = await SB().from("reports").select("id,reason,created_at,post_id,comment_id,reported_user,status,posts!reports_post_id_fkey(id,body,image_url,user_id),comments!reports_comment_id_fkey(id,body,user_id)").eq("status", "aberta").order("created_at", {ascending:false}).limit(50);
    if (r.error) throw r.error;
    const el = $("#md"); if (!el) return;
    el.innerHTML = (r.data || []).map(x => `<div class="mgroup" style="margin-bottom:10px"><div class="mgroup-h">${x.post_id ? "Post" : x.comment_id ? "Comentário" : "Perfil"}<span class="pill warn">${ago(x.created_at)}</span></div>
      <p class="sub" style="margin:0">Motivo: <b>${esc(x.reason)}</b></p>
      ${x.posts ? `<p style="margin:0;white-space:pre-wrap">${esc(x.posts.body || "(sem texto)")}</p>${safeImg(x.posts.image_url) ? `<img src="${esc(safeImg(x.posts.image_url))}" class="post-img" style="max-height:200px" alt="">` : ""}` : ""}
      ${x.comments ? `<p style="margin:0">${esc(x.comments.body)}</p>` : ""}
      <div class="row" style="gap:8px;flex-wrap:wrap">${x.post_id ? `<button class="btn sm danger" data-act="modDelPost" data-arg="${x.post_id}" data-rep="${x.id}">${ic("trash")}Apagar post</button>` : ""}${x.comment_id ? `<button class="btn sm danger" data-act="modDelCmt" data-arg="${x.comment_id}" data-rep="${x.id}">${ic("trash")}Apagar comentário</button>` : ""}${x.reported_user ? `<button class="btn sm" data-act="socProfile" data-arg="${x.reported_user}">Ver perfil</button>` : ""}<button class="btn sm ghost" data-act="modOk" data-rep="${x.id}">Manter e fechar</button></div></div>`).join("") || `<div class="empty">Nenhuma denúncia aberta. 🎉</div>`;
  } catch (e) { const el = $("#md"); if (el) el.innerHTML = `<div class="note warn">${ic("alert")}<span>Não foi possível carregar.</span></div>`; }
}
async function modResolve(rep){ try { await SB().from("reports").update({status:"resolvida"}).eq("id", rep); } catch (e) {} }

/* ---------- Ações ---------- */
Object.assign(ACT, {
  socRetry: () => { SOC.err = ""; SOC.me = undefined; render(); },
  socTab: el => { SOC.tab = el.dataset.arg; socLoadFeed(true); },
  socRefresh: () => socLoadFeed(true),
  socMore: () => socLoadFeed(false),
  socNew: () => { if (!socOn()) { go("social"); return; } if (!SOC.me) { closeModal(); go("social"); toast("Crie seu perfil primeiro"); return; } SOC.compose = SOC.compose || {body:"", att:""}; composer(); },
  qPost: () => { closeModal(); UI.tab = "social"; render(); if (SOC.me) ACT.socNew(); },
  pcAtt: el => { SOC.compose.att = el.dataset.arg; composer(); },
  pcImgDel: () => { SOC.compose.file = null; SOC.compose.imgUrl = ""; SOC.compose.imgData = ""; cmpSave(); composer(); },
  pcSend: () => pcSend(),
  socLike: async el => {
    const id = el.dataset.arg, p = SOC.posts.find(x => x.id === id), on = SOC.liked.has(id);
    if (on) SOC.liked.delete(id); else SOC.liked.add(id);
    SOC.posts.filter(x => x.id === id).forEach(x => x.likes = [{count:Math.max(0, cnt(x, "likes") + (on ? -1 : 1))}]);
    document.querySelectorAll(`[data-act="socLike"][data-arg="${id}"]`).forEach(b => { b.classList.toggle("on", !on); b.setAttribute("aria-pressed", String(!on)); b.querySelector("span").textContent = (p ? cnt(p, "likes") : 0) || ""; });
    try { const r = on ? await SB().from("likes").delete().match({post_id:id, user_id:CLOUD.user.id}) : await SB().from("likes").insert({post_id:id}); if (r.error && !/duplicate/i.test(r.error.message)) throw r.error; } catch (e) { socErr(e); }
  },
  socComments: el => commentsModal(el.dataset.arg),
  socDelCmt: el => confirmBox("Apagar comentário?", "Ele sai do post para todo mundo.", "Apagar", async () => { try { const r = await SB().from("comments").delete().eq("id", el.dataset.arg); if (r.error) throw r.error; const p = SOC.posts.find(x => x.id === el.dataset.post); if (p) p.comments = [{count:Math.max(0, cnt(p, "comments") - 1)}]; render(); commentsModal(el.dataset.post); } catch (e) { socErr(e); } }),
  socProfile: el => { if (el.dataset.arg) profileView(el.dataset.arg); },
  socEditProf: () => editProfModal(),
  socPeople: () => peopleModal(),
  socFollow: async el => {
    const id = el.dataset.arg, on = SOC.follows.has(id);
    try { const r = on ? await SB().from("follows").delete().match({follower:CLOUD.user.id, followee:id}) : await SB().from("follows").insert({followee:id}); if (r.error && !/duplicate/i.test(r.error.message)) throw r.error; if (on) SOC.follows.delete(id); else SOC.follows.add(id); toast(on ? "Deixou de seguir" : "Seguindo!"); el.dataset.from === "people" ? peopleModal() : profileView(id); }
    catch (e) { socErr(e); }
  },
  socMenu: el => {
    const p = SOC.posts.find(x => x.id === el.dataset.arg); if (!p) return; const mine = p.user_id === CLOUD.user.id;
    openModal(`${sheetHead("Opções do post")}<div class="col" style="gap:8px">
      ${mine || SOC.admin ? `<button class="btn danger" data-act="socDelPost" data-arg="${p.id}">${ic("trash")}Apagar post${!mine ? " (moderação)" : ""}</button>` : ""}
      ${!mine ? `<button class="btn" data-act="socReport" data-kind="post" data-arg="${p.id}">${ic("flag")}Denunciar post</button><button class="btn" data-act="socBlock" data-arg="${p.user_id}">${ic("ban")}Bloquear @${esc((p.profiles || {}).username || "")}</button>` : ""}
      <button class="btn ghost" data-act="closeModal">Cancelar</button></div>`);
  },
  socDelPost: el => confirmBox("Apagar post?", "Ele sai do feed para todo mundo. Não dá para desfazer.", "Apagar", async () => { try { const r = await SB().from("posts").delete().eq("id", el.dataset.arg); if (r.error) throw r.error; SOC.posts = SOC.posts.filter(x => x.id !== el.dataset.arg); render(); toast("Post apagado"); } catch (e) { socErr(e); } }),
  socReport: el => {
    const kind = el.dataset.kind, id = el.dataset.arg;
    openModal(`${sheetHead("Denunciar")}<div class="col" style="gap:8px">${["Ofensa ou assédio","Nudez ou conteúdo sexual","Spam ou venda","Informação perigosa sobre saúde","Perfil falso","Outro motivo"].map(m => `<button class="btn" data-act="socReportSend" data-kind="${kind}" data-arg="${id}" data-reason="${m}">${m}</button>`).join("")}<p class="sub" style="margin:4px 0 0">A denúncia é anônima para a outra pessoa e vai para a moderação.</p></div>`);
  },
  socReportSend: async el => {
    const k = el.dataset.kind, row = {reason:el.dataset.reason}; row[k === "post" ? "post_id" : k === "comment" ? "comment_id" : "reported_user"] = el.dataset.arg;
    if (k === "post") { const p = SOC.posts.find(x => x.id === el.dataset.arg); if (p) row.reported_user = p.user_id; }
    try { const r = await SB().from("reports").insert(row); if (r.error) throw r.error; closeModal(); toast("Denúncia enviada. Obrigado!"); } catch (e) { socErr(e); }
  },
  socBlock: el => confirmBox("Bloquear?", "Vocês deixam de ver os posts e comentários um do outro e deixam de se seguir. Você pode desbloquear no seu perfil.", "Bloquear", async () => { try { const r = await SB().from("blocks").insert({blocked:el.dataset.arg}); if (r.error && !/duplicate/i.test(r.error.message)) throw r.error; SOC.follows.delete(el.dataset.arg); SOC.posts = SOC.posts.filter(x => x.user_id !== el.dataset.arg); render(); toast("Bloqueado"); } catch (e) { socErr(e); } }),
  socBlocks: async () => {
    openModal(`${sheetHead("Bloqueados")}<div id="bl" class="ppl"><div class="empty">Carregando…</div></div>`);
    try { const r = await SB().from("blocks").select("blocked").eq("blocker", CLOUD.user.id); if (r.error) throw r.error; const ids = (r.data || []).map(x => x.blocked); const pr = ids.length ? await SB().from("profiles").select("id,username,display_name,avatar_url").in("id", ids) : {data:[]}; const el = $("#bl"); if (!el) return;
      el.innerHTML = ids.map(id => { const p = (pr.data || []).find(x => x.id === id) || {id, display_name:"Conta", username:"—"}; return `<div class="ppl-row">${uav(p)}<div><b>${esc(p.display_name)}</b><div class="sub">@${esc(p.username)}</div></div><button class="btn sm" data-act="socUnblock" data-arg="${id}">Desbloquear</button></div>`; }).join("") || `<div class="empty">Você não bloqueou ninguém.</div>`; }
    catch (e) { socErr(e); }
  },
  socUnblock: async el => { try { const r = await SB().from("blocks").delete().match({blocker:CLOUD.user.id, blocked:el.dataset.arg}); if (r.error) throw r.error; toast("Desbloqueado"); ACT.socBlocks(); socLoadFeed(true); } catch (e) { socErr(e); } },
  socMod: () => modModal(),
  modDelPost: async el => { try { const r = await SB().from("posts").delete().eq("id", el.dataset.arg); if (r.error) throw r.error; await modResolve(el.dataset.rep); SOC.posts = SOC.posts.filter(x => x.id !== el.dataset.arg); render(); modModal(); toast("Post removido"); } catch (e) { socErr(e); } },
  modDelCmt: async el => { try { const r = await SB().from("comments").delete().eq("id", el.dataset.arg); if (r.error) throw r.error; await modResolve(el.dataset.rep); modModal(); toast("Comentário removido"); } catch (e) { socErr(e); } },
  modOk: async el => { await modResolve(el.dataset.rep); modModal(); },
  actPost: el => { if (!socOn()) { toast("A Comunidade funciona no site, com sua conta"); return; } closeModal(); UI.tab = "social"; render(); SOC.compose = {body:"", att:"a:" + el.dataset.arg}; if (SOC.me) composer(); else toast("Crie seu perfil na Comunidade primeiro"); }
});
/* Ao sair da conta, limpa a Comunidade. */
/* r_cloud carrega depois deste script: espera ele existir. */
setTimeout(() => {
  if (typeof CLOUD !== "undefined" && CLOUD.sb) CLOUD.sb.auth.onAuthStateChange(ev => { if (ev === "SIGNED_OUT") { SOC.me = undefined; SOC.posts = []; SOC.liked = new Set(); SOC.follows = new Set(); SOC.admin = false; } });
  try { if (sessionStorage.getItem(CMP_LS) && typeof CLOUD !== "undefined" && CLOUD.sb && UI.tab !== "social") { UI.tab = "social"; render(); } } catch (e) {}
}, 0);
if (UI.tab === "social") render();
</script>
