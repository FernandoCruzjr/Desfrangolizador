<style>
/* Comunidade: feed no estilo Instagram, stories de 24 h, perfis, comentários e moderação. */
.feed{display:flex;flex-direction:column;gap:14px;width:100%;max-width:520px;margin:0 auto}
.post{background:var(--glass);border:1px solid var(--glass-b);border-radius:18px;padding:14px;display:flex;flex-direction:column;gap:10px}
.post.ig{padding:0;gap:0;overflow:hidden}
.post.ig>.post-h{padding:10px 8px 10px 12px}
.post.ig>.post-pad{padding:0 12px}
.post-h{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center}
.uav{width:42px;height:42px;border-radius:50%;background:var(--flame);color:var(--on-accent);display:grid;place-items:center;font:800 16px var(--f-display);overflow:hidden;flex:none;border:0;padding:0;cursor:pointer}
.uav img{width:100%;height:100%;object-fit:cover}
.uav.sm{width:32px;height:32px;font-size:13px}
.uav.lg{width:86px;height:86px;font-size:32px}
.uname{background:none;border:0;padding:0;color:var(--ink);font:700 14.5px Figtree,sans-serif;cursor:pointer;text-align:left;min-width:0}
.uname small{display:block;font-weight:500;color:var(--faint);font-size:12.5px}
.post-body{white-space:pre-wrap;overflow-wrap:anywhere;font-size:15px;line-height:1.5}
.post-img{width:100%;border-radius:14px;display:block;max-height:560px;object-fit:cover;background:rgba(0,0,0,.25)}
.post-media{position:relative;background:rgba(0,0,0,.35);user-select:none;-webkit-user-select:none}
.post-media img{width:100%;display:block;aspect-ratio:4/5;object-fit:cover}
.dbl-heart{position:absolute;inset:0;display:grid;place-items:center;pointer-events:none;opacity:0}
.dbl-heart svg{width:96px;height:96px;fill:#fff;stroke:#fff;filter:drop-shadow(0 4px 18px rgba(0,0,0,.45))}
.dbl-heart.go{animation:dblh .8s ease}
@keyframes dblh{0%{opacity:0;transform:scale(.4)}15%{opacity:1;transform:scale(1.15)}30%{transform:scale(.95)}70%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1)}}
.post-extra{padding:0 12px 4px}
.post-act{display:grid;grid-template-columns:110px 1fr;gap:12px;align-items:center;background:rgba(0,0,0,.22);border-radius:14px;padding:10px}
.post-act .map{aspect-ratio:1;border-radius:10px;background:rgba(0,0,0,.25);display:grid;place-items:center;color:var(--accent)}
.post-act .map svg{width:44px;height:44px}
.post-act .nums{display:grid;grid-template-columns:repeat(2,1fr);gap:6px 12px}
.post-act .nums b{display:block;font:800 19px var(--f-mono,monospace)}
.post-act .nums span{font-size:12px;color:var(--muted)}
.post-wk{background:rgba(0,0,0,.22);border-radius:14px;padding:12px}
.post-wk ul{margin:8px 0 0;padding-left:18px;color:var(--muted);font-size:14px}
.post-f{display:flex;gap:2px;align-items:center;padding:4px 6px 0}
.pbtn{display:inline-flex;align-items:center;gap:6px;border:0;background:transparent;color:var(--ink);font:600 14px Figtree,sans-serif;padding:8px;border-radius:10px;cursor:pointer}
.pbtn svg{width:25px;height:25px}
.pbtn:hover{background:var(--glass)}
.pbtn.on{color:#FF3B5C}.pbtn.on svg{fill:#FF3B5C;stroke:#FF3B5C;animation:pop .3s ease}
@keyframes pop{50%{transform:scale(1.25)}}
.post-likes{font-weight:700;font-size:14.5px}
.post-cap{font-size:14.5px;line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere;margin-top:4px}
.post-cap b{cursor:pointer}
.post-more{background:none;border:0;padding:0;color:var(--muted);font:500 14px Figtree,sans-serif;cursor:pointer;margin-top:4px;text-align:left}
.post-time{font-size:11.5px;color:var(--faint);text-transform:uppercase;letter-spacing:.03em;margin:6px 0 12px}
.cmt{display:grid;grid-template-columns:32px 1fr auto;gap:10px;align-items:start;padding:8px 0;border-bottom:1px solid var(--glass-b)}
.cmt p{margin:2px 0 0;white-space:pre-wrap;overflow-wrap:anywhere;font-size:14.5px}
.compose{display:flex;gap:8px;align-items:flex-end}
.compose textarea{flex:1;min-height:44px;max-height:140px;resize:vertical}
.ig-top{width:100%;max-width:520px;margin:0 auto 6px;display:flex;align-items:center;gap:4px}
.ig-top h1{font:800 26px var(--f-display);letter-spacing:-.02em;margin:0 auto 0 0}
.ig-top .iconbtn svg{width:24px;height:24px}
.ig-top .iconbtn{color:var(--ink)}
.ig-tabs{width:100%;display:flex;justify-content:center;gap:26px;max-width:520px;margin:0 auto 4px;border-bottom:1px solid var(--glass-b)}
.ig-tabs button{border:0;background:none;color:var(--faint);font:700 14.5px Figtree,sans-serif;padding:10px 2px;border-bottom:2px solid transparent;cursor:pointer}
.ig-tabs button[aria-pressed="true"]{color:var(--ink);border-bottom-color:var(--ink)}
.stbar{width:100%;display:flex;gap:14px;overflow-x:auto;padding:6px 2px 12px;max-width:520px;margin:0 auto;scrollbar-width:none}
.stbar::-webkit-scrollbar{display:none}
.st-it{flex:none;width:72px;display:flex;flex-direction:column;align-items:center;gap:5px;background:none;border:0;padding:0;color:var(--ink);cursor:pointer;font:500 12px Figtree,sans-serif}
.st-it>span:last-child{max-width:72px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.st-ring{position:relative;display:inline-grid;place-items:center;border-radius:50%;padding:3px;background:var(--line);flex:none}
.st-ring.new{background:conic-gradient(from 210deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5,#3CC8E6,#3DDC97,#feda75)}
.st-ring.none{background:transparent}
.st-ring>.uav,.st-ring>.uavi{border:3px solid var(--bg)}
.st-it .uav,.st-it .uavi{width:64px;height:64px;font-size:24px}
.uavi{width:42px;height:42px;border-radius:50%;background:var(--flame);color:var(--on-accent);display:grid;place-items:center;font:800 16px var(--f-display);overflow:hidden}
.uavi img{width:100%;height:100%;object-fit:cover}
.uavi.sm{width:32px;height:32px;font-size:13px}
.uavi.lg{width:86px;height:86px;font-size:32px}
button.st-ring{border:0;cursor:pointer}
.st-plus{position:absolute;right:0;bottom:0;width:22px;height:22px;border-radius:50%;background:#3797F0;color:#fff;display:grid;place-items:center;border:2px solid var(--bg)}
.st-plus svg{width:14px;height:14px;stroke-width:3}
/* Visualizador de story */
.sv{position:fixed;inset:0;z-index:96;background:#000;display:flex;align-items:center;justify-content:center;animation:fade .15s ease}
.sv-card{position:relative;width:min(100vw,calc(100dvh * 9 / 16));height:min(100dvh,calc(100vw * 16 / 9));max-height:100dvh;overflow:hidden;background:#111;border-radius:0;touch-action:pan-y}
@media (max-width:640px){.sv-card{width:100vw;height:100dvh}}
@media (min-width:641px){.sv-card{height:min(92dvh,calc(100vw * 16 / 9));width:calc(min(92dvh,calc(100vw * 16 / 9)) * 9 / 16);border-radius:14px}}
.sv-bars{position:absolute;top:calc(8px + env(safe-area-inset-top,0px));left:8px;right:8px;display:flex;gap:4px;z-index:3}
.sv-bars i{flex:1;height:2.5px;border-radius:2px;background:rgba(255,255,255,.35);overflow:hidden}
.sv-bars b{display:block;height:100%;background:#fff;width:0}
.sv-h{position:absolute;top:calc(18px + env(safe-area-inset-top,0px));left:10px;right:4px;display:flex;align-items:center;gap:8px;z-index:4;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.5)}
.sv-h .uname{color:#fff}
.sv-h .uname small{display:inline;color:rgba(255,255,255,.75);margin-left:6px}
.sv-h .iconbtn{color:#fff;margin-left:auto}
.sv-h .iconbtn+.iconbtn{margin-left:0}
.sv-body{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:18px;padding:80px 20px 90px;color:#fff}
.sv-body.photo{padding:0}
.sv-body.photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.sv-text{font:800 clamp(22px,7vw,34px)/1.2 var(--f-display);text-align:center;white-space:pre-wrap;overflow-wrap:anywhere;text-shadow:0 2px 10px rgba(0,0,0,.25);max-width:100%}
.sv-cap{position:absolute;left:16px;right:16px;bottom:calc(72px + env(safe-area-inset-bottom,0px));z-index:2;background:rgba(0,0,0,.5);color:#fff;border-radius:12px;padding:10px 12px;font-size:15px;text-align:center;white-space:pre-wrap;overflow-wrap:anywhere}
.sv-day{position:absolute;left:14px;right:14px;bottom:calc(72px + env(safe-area-inset-bottom,0px));z-index:2}
.sv-nav{position:absolute;top:70px;bottom:70px;width:35%;z-index:2;background:none;border:0;padding:0;-webkit-tap-highlight-color:transparent}
.sv-nav.prev{left:0}.sv-nav.next{right:0;width:65%}
.sv-foot{position:absolute;left:0;right:0;bottom:0;padding:12px 14px calc(14px + env(safe-area-inset-bottom,0px));z-index:4;display:flex;align-items:center;gap:8px;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.5))}
.sv-foot .btn{background:rgba(0,0,0,.35);border-color:rgba(255,255,255,.3);color:#fff}
/* Resumo do dia */
.daycard{background:linear-gradient(160deg,rgba(61,220,151,.16),rgba(60,200,230,.08) 50%,rgba(0,0,0,.25));border:1px solid var(--glass-b);border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:12px;color:var(--ink)}
.sv .daycard{background:rgba(6,19,27,.86);backdrop-filter:blur(6px)}
.dc-h{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.dc-h b{font:800 16px var(--f-display)}
.dc-h .pill{margin-left:auto}
.dc-main{display:grid;grid-template-columns:104px 1fr;gap:14px;align-items:center}
.dc-ring{position:relative;width:104px;height:104px}
.dc-ring svg{width:100%;height:100%;transform:rotate(-90deg)}
.dc-ring div{position:absolute;inset:0;display:grid;place-content:center;text-align:center;line-height:1.1}
.dc-ring b{font:800 17px var(--f-mono,monospace)}
.dc-ring span{font-size:10px;color:var(--muted)}
.dc-bars{display:flex;flex-direction:column;gap:7px}
.dc-bar{display:grid;grid-template-columns:58px 1fr auto;gap:8px;align-items:center;font-size:12.5px}
.dc-bar i{display:block;height:7px;border-radius:5px;background:rgba(255,255,255,.08);overflow:hidden}
.dc-bar i span{display:block;height:100%;border-radius:5px}
.dc-bar em{font-style:normal;font-family:var(--f-mono,monospace);color:var(--muted);font-size:12px}
.dc-tags{display:flex;gap:6px;flex-wrap:wrap}
.dc-tags span{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;font-weight:600;background:rgba(0,0,0,.25);border-radius:999px;padding:4px 10px}
.dc-tags svg{width:15px;height:15px;color:var(--accent)}
/* Perfil */
.ig-prof{display:flex;flex-direction:column;gap:12px}
.ig-ph{display:grid;grid-template-columns:auto 1fr;gap:18px;align-items:center}
.prof-stats{display:flex;justify-content:space-around;gap:10px;text-align:center}
.prof-stats b{display:block;font:800 18px var(--f-mono,monospace)}
.prof-stats span{font-size:12.5px;color:var(--muted)}
.ig-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;margin:0 -4px}
.ig-th{position:relative;aspect-ratio:1;border:0;padding:0;background:rgba(0,0,0,.3);overflow:hidden;cursor:pointer;color:var(--ink)}
.ig-th img{width:100%;height:100%;object-fit:cover;display:block}
.ig-th .tl{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:8px;text-align:center;font-size:11.5px;line-height:1.25;background:linear-gradient(160deg,rgba(61,220,151,.18),rgba(60,200,230,.08))}
.ig-th .tl svg{width:24px;height:24px;color:var(--accent)}
.ig-th .tl span{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.attach{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px}
.attach button{flex:none}
.pc-seg{align-self:center}.pc-seg button{display:inline-flex;align-items:center;gap:6px}.pc-seg svg{width:17px;height:17px}
.bgs{display:flex;gap:8px;flex-wrap:wrap}
.bgs button{width:30px;height:30px;border-radius:50%;border:2px solid transparent;cursor:pointer;padding:0}
.bgs button[aria-pressed="true"]{border-color:#fff;box-shadow:0 0 0 2px var(--accent)}
.st-prev{aspect-ratio:9/16;max-height:300px;border-radius:14px;margin:0 auto;display:flex;align-items:center;justify-content:center;padding:16px;color:#fff;overflow:hidden;position:relative}
.st-prev .sv-text{font-size:20px}
.ppl{display:flex;flex-direction:column;gap:8px}
.ppl-row{display:grid;grid-template-columns:42px 1fr auto;gap:10px;align-items:center}
.rules{font-size:13.5px;color:var(--muted);margin:0;padding-left:18px;line-height:1.6}
</style>
<script>
/* ======================= COMUNIDADE ======================= */
const SOC = {me:undefined, admin:false, tab:"descobrir", posts:[], liked:new Set(), loading:false, end:false, err:"", follows:new Set(), q:"", people:null, compose:null, stories:[], seen:new Set(), storyOff:false};
const socOn = () => typeof CLOUD !== "undefined" && CLOUD.sb && CLOUD.user;
const SB = () => CLOUD.sb;
const MEDIA_PREFIX = () => (window.DESFR_SUPA ? window.DESFR_SUPA.url : "") + "/storage/v1/object/public/media/";
const safeImg = u => typeof u === "string" && u.startsWith(MEDIA_PREFIX()) ? u : "";
Object.assign(ICONS, {eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'});
function ago(t){
  const s = (Date.now() - new Date(t).getTime()) / 1000;
  if (s < 60) return "agora"; if (s < 3600) return Math.floor(s / 60) + " min"; if (s < 86400) return Math.floor(s / 3600) + " h";
  if (s < 604800) return Math.floor(s / 86400) + " d"; const d = new Date(t); return dLabel(iso(d));
}
function avInner(p, cls = ""){
  const src = p && safeImg(p.avatar_url), init = ((p && (p.display_name || p.username)) || "?").slice(0, 1).toUpperCase();
  return `<span class="uavi ${cls}">${src ? `<img src="${esc(src)}" alt="" loading="lazy">` : esc(init)}</span>`;
}
function uav(p, cls = ""){
  const src = p && safeImg(p.avatar_url), init = ((p && (p.display_name || p.username)) || "?").slice(0, 1).toUpperCase();
  return `<button class="uav ${cls}" data-act="socProfile" data-arg="${p ? p.id : ""}" aria-label="Ver perfil de ${esc(p ? p.display_name : "")}">${src ? `<img src="${esc(src)}" alt="" loading="lazy">` : esc(init)}</button>`;
}
/* Avatar com o anel de story: toca para ver os stories da pessoa. */
function uavS(p, cls = ""){
  const g = p && storyGroup(p.id);
  if (!g) return uav(p, cls);
  return `<button class="st-ring ${g.unseen ? "new" : ""}" data-act="stUser" data-arg="${p.id}" aria-label="Ver stories de ${esc(p.display_name || "")}">${avInner(p, cls)}</button>`;
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
  if (SOC.me && SOC.openCompose && SOC.compose) { SOC.openCompose = false; setTimeout(composer, 0); }
  if (SOC.me) { socLoadFeed(true); stCleanup(); try { const sv = JSON.parse(sessionStorage.getItem(CMP_LS) || "null"); if (sv && !SOC.compose && (sv.body || sv.img)) { SOC.compose = {body:sv.body, att:sv.att, dest:sv.dest || "feed", bg:sv.bg || 0, imgData:sv.img, imgUrl:sv.img}; UI.tab = "social"; render(); composer(); toast("Seu post foi recuperado"); } } catch (e) {} }
  else if (UI.tab === "social") render();
}
const POST_SEL = "id,user_id,kind,body,data,image_url,created_at,profiles!posts_user_id_fkey(id,username,display_name,avatar_url),likes(count),comments(count)";
async function socLoadFeed(reset){
  if (SOC.loading) return; SOC.loading = true;
  if (reset) { SOC.posts = []; SOC.end = false; socLoadStories(); }
  if (UI.tab === "social") render();
  try {
    let q = SB().from("posts").select(POST_SEL).order("created_at", {ascending:false}).limit(15);
    if (SOC.tab === "seguindo") q = q.in("user_id", [CLOUD.user.id, ...SOC.follows]);
    const feed = SOC.posts.filter(p => !p._extra);
    if (feed.length) q = q.lt("created_at", feed[feed.length - 1].created_at);
    const r = await q; if (r.error) throw r.error;
    const got = r.data || []; SOC.posts = feed.concat(got); if (got.length < 15) SOC.end = true;
    if (got.length) { const lk = await SB().from("likes").select("post_id").eq("user_id", CLOUD.user.id).in("post_id", got.map(p => p.id)); (lk.data || []).forEach(x => SOC.liked.add(x.post_id)); }
    SOC.err = "";
  } catch (e) { SOC.err = "Não foi possível carregar o feed. Verifique a internet."; }
  SOC.loading = false;
  if (UI.tab === "social") render();
}
const cnt = (p, k) => (p[k] && p[k][0] && p[k][0].count) || 0;

/* ---------- Stories (somem em 24 h) ---------- */
const STORY_SEL = "id,user_id,kind,body,bg,data,image_url,created_at,expires_at,profiles!stories_user_id_fkey(id,username,display_name,avatar_url)";
const STBG = ["linear-gradient(160deg,#3DDC97,#3CC8E6)","linear-gradient(160deg,#feda75,#fa7e1e,#d62976)","linear-gradient(160deg,#962fbf,#4f5bd5)","linear-gradient(160deg,#15303D,#06131B)","linear-gradient(160deg,#ff6b6b,#ff9f43)","linear-gradient(160deg,#11998e,#38ef7d)","linear-gradient(160deg,#232526,#414345)","linear-gradient(160deg,#f857a6,#ff5858)"];
const storyGroup = id => SOC.stories.find(g => g.user.id === id);
async function socLoadStories(){
  try {
    const me = CLOUD.user.id;
    const r = await SB().from("stories").select(STORY_SEL).gt("expires_at", new Date().toISOString()).order("created_at").limit(200);
    if (r.error) throw r.error;
    const list = r.data || [], ids = list.filter(s => s.user_id !== me).map(s => s.id);
    if (ids.length) { const v = await SB().from("story_views").select("story_id").eq("viewer", me).in("story_id", ids); (v.data || []).forEach(x => SOC.seen.add(x.story_id)); }
    const by = new Map();
    list.forEach(s => { if (!s.profiles) return; if (!by.has(s.user_id)) by.set(s.user_id, {user:s.profiles, items:[]}); by.get(s.user_id).items.push(s); });
    const gs = [...by.values()];
    gs.forEach(g => { g.unseen = g.user.id !== me && g.items.some(s => !SOC.seen.has(s.id)); g.last = g.items[g.items.length - 1].created_at; });
    const rank = g => g.user.id === me ? 0 : (g.unseen ? 1 : 3) + (SOC.follows.has(g.user.id) ? 0 : 1);
    SOC.stories = gs.sort((a, b) => rank(a) - rank(b) || b.last.localeCompare(a.last));
    SOC.storyOff = false;
  } catch (e) { console.warn(e); SOC.stories = []; SOC.storyOff = true; }
  if (UI.tab === "social" && !ST.open) render();
}
/* Fotos de stories vencidos saem do armazenamento. */
async function stCleanup(){
  try {
    const me = CLOUD.user.id, r = await SB().storage.from("media").list(me, {search:"s-", limit:100});
    const old = (r.data || []).filter(f => f.name.startsWith("s-") && f.created_at && Date.now() - new Date(f.created_at).getTime() > 26 * 3600e3).map(f => me + "/" + f.name);
    if (old.length) await SB().storage.from("media").remove(old);
  } catch (e) {}
}
function storyBar(){
  if (SOC.storyOff) return "";
  const me = SOC.me, mine = storyGroup(me.id);
  const others = SOC.stories.filter(g => g.user.id !== me.id);
  return `<div class="stbar" role="list" aria-label="Stories">
    <div class="st-it" role="listitem"><span class="st-ring ${mine ? "" : "none"}" style="cursor:pointer" ${mine ? `data-act="stUser" data-arg="${me.id}"` : `data-act="stNew"`}>${avInner(me)}<button class="st-plus" data-act="stNew" aria-label="Novo story">${ic("plus")}</button></span><span>Seu story</span></div>
    ${others.map(g => `<button class="st-it" role="listitem" data-act="stUser" data-arg="${g.user.id}" aria-label="Story de ${esc(g.user.display_name)}${g.unseen ? ", novo" : ""}"><span class="st-ring ${g.unseen ? "new" : ""}">${avInner(g.user)}</span><span>${esc(g.user.username)}</span></button>`).join("")}
  </div>`;
}
const ST = {open:false, g:0, i:0, el:0, last:0, ready:false, paused:false, dur:6000, down:0};
function stRoot(){ let r = document.getElementById("storyRoot"); if (!r) { r = document.createElement("div"); r.id = "storyRoot"; document.body.appendChild(r); } return r; }
function stOpen(userId){
  const g = SOC.stories.findIndex(x => x.user.id === userId); if (g < 0) return;
  const items = SOC.stories[g].items, first = items.findIndex(s => !SOC.seen.has(s.id));
  ST.open = true; ST.g = g; ST.i = userId === CLOUD.user.id || first < 0 ? 0 : first; stShow();
  cancelAnimationFrame(ST.raf); ST.last = 0; ST.raf = requestAnimationFrame(stTick);
}
function stClose(){ ST.open = false; cancelAnimationFrame(ST.raf); stRoot().innerHTML = ""; SOC.stories.forEach(g => g.unseen = g.user.id !== CLOUD.user.id && g.items.some(s => !SOC.seen.has(s.id))); render(); }
function storyBody(s){
  const d = s.data, cap = s.body ? `<div class="${s.kind === "photo" ? "sv-cap" : "sv-text"}" ${s.kind === "day" ? 'style="font-size:20px"' : ""}>${esc(s.body)}</div>` : "";
  if (s.kind === "photo") { const img = safeImg(s.image_url); return `<div class="sv-body photo">${img ? `<img src="${esc(img)}" alt="Foto do story" onload="stReady()" onerror="stReady()">` : ""}${d && d.mk ? `<div class="sv-day">${dayCard(d, true)}</div>` : cap}${d && d.mk && s.body ? `<div class="sv-cap" style="bottom:auto;top:calc(64px + env(safe-area-inset-top,0px))">${esc(s.body)}</div>` : ""}</div>`; }
  const bg = STBG[s.bg] || STBG[0];
  if (s.kind === "day" && d) return `<div class="sv-body" style="background:${bg}">${cap}<div style="width:100%">${dayCard(d, true)}</div></div>`;
  return `<div class="sv-body" style="background:${bg}">${cap}</div>`;
}
function stShow(){
  const g = SOC.stories[ST.g]; if (!g) return stClose();
  const s = g.items[ST.i]; if (!s) return stClose();
  const mine = g.user.id === CLOUD.user.id;
  ST.el = 0; ST.ready = s.kind !== "photo" || !safeImg(s.image_url); ST.dur = s.kind === "text" ? 5000 : 7000;
  stRoot().innerHTML = `<div class="sv" role="dialog" aria-modal="true" aria-label="Story de ${esc(g.user.display_name)}"><div class="sv-card">
    <div class="sv-bars">${g.items.map((x, k) => `<i><b style="width:${k < ST.i ? 100 : 0}%"></b></i>`).join("")}</div>
    <div class="sv-h">${avInner(g.user, "sm")}<button class="uname" data-act="stProfile" data-arg="${g.user.id}">${esc(g.user.username)}<small>${ago(s.created_at)}</small></button>
      <button class="iconbtn" data-act="stMenu" aria-label="Mais opções">${ic("dots")}</button><button class="iconbtn" data-act="stX" aria-label="Fechar">${ic("x")}</button></div>
    ${storyBody(s)}
    <button class="sv-nav prev" data-sv="-1" aria-label="Anterior"></button><button class="sv-nav next" data-sv="1" aria-label="Próximo"></button>
    ${mine ? `<div class="sv-foot"><button class="btn sm" data-act="stViews" data-arg="${s.id}">${ic("eye")}<span id="sv-vc">Visto por…</span></button></div>` : ""}
  </div></div>`;
  if (mine) SB().from("story_views").select("viewer", {count:"exact", head:true}).eq("story_id", s.id).then(r => { const el = $("#sv-vc"); if (el) el.textContent = "Visto por " + (r.count || 0); });
  else if (!SOC.seen.has(s.id)) { SOC.seen.add(s.id); SB().from("story_views").insert({story_id:s.id}).then(() => {}); }
}
function stReady(){ ST.ready = true; }
function stTick(ts){
  if (!ST.open) return;
  const dt = ST.last ? Math.min(ts - ST.last, 100) : 0; ST.last = ts;
  if (ST.ready && !ST.paused && !$("#modalRoot").innerHTML && !document.hidden) ST.el += dt;
  const bar = document.querySelectorAll(".sv-bars b")[ST.i]; if (bar) bar.style.width = Math.min(100, ST.el / ST.dur * 100) + "%";
  if (ST.el >= ST.dur) stStep(1);
  ST.raf = requestAnimationFrame(stTick);
}
function stStep(dir){
  const g = SOC.stories[ST.g];
  if (dir > 0) { if (g && ST.i < g.items.length - 1) ST.i++; else { ST.g++; ST.i = 0; if (ST.g >= SOC.stories.length) return stClose(); } }
  else { if (ST.i > 0) ST.i--; else if (ST.g > 0) { ST.g--; ST.i = 0; } else ST.el = 0; }
  stShow();
}
document.addEventListener("pointerdown", ev => { if (!ST.open || !ev.target.closest(".sv-nav")) return; ST.paused = true; ST.down = Date.now(); });
document.addEventListener("pointerup", ev => {
  if (!ST.open || !ST.paused) return; ST.paused = false;
  const nav = ev.target.closest(".sv-nav"); if (nav && Date.now() - ST.down < 300) stStep(+nav.dataset.sv);
});
document.addEventListener("pointercancel", () => { ST.paused = false; });
document.addEventListener("keydown", e => {
  if (!ST.open || $("#modalRoot").innerHTML) return;
  if (e.key === "Escape") stClose(); else if (e.key === "ArrowRight") stStep(1); else if (e.key === "ArrowLeft") stStep(-1);
});

/* ---------- Resumo do dia ---------- */
function daySum(d){
  const p = P(), c = typeof calcDay === "function" ? calcDay(p, d) : calc(p), day = getDay(d);
  if (!day.meals.some(m => m.items.length)) return null;
  const t = dayTotals(day), w = day.water || 0, near = (v, m, k) => Math.abs(v - m) <= m * k;
  const ok = [near(t.k, c.kcal, .1), t.p >= c.prot * .9, near(t.c, c.carb, .15), near(t.f, c.fat, .2), w >= c.water.total];
  const ss = allSessions().filter(s => s.date === d), acts = typeof allActs === "function" ? allActs().filter(a => a.date === d) : [];
  return {date:d, goal:(GOALS[p.goal] || GOALS.bulk).n, kcal:Math.round(t.k), mk:Math.round(c.kcal), p:Math.round(t.p), mp:Math.round(c.prot), c:Math.round(t.c), mc:Math.round(c.carb), f:Math.round(t.f), mf:Math.round(c.fat), w:Math.round(w), mw:Math.round(c.water.total), hits:ok.filter(Boolean).length,
    wk:ss.slice(0, 3).map(s => ({n:String(s.name || "Treino").slice(0, 40), s:sessSets(s)})), act:acts.length ? {n:acts.length, kcal:Math.round(acts.reduce((a, x) => a + (x.kcal || 0), 0))} : null};
}
/* Cartão do dia: números vêm de outras pessoas, então tudo passa por fmt/esc. */
function dayCard(d, big){
  const n = v => Math.max(0, +v || 0), pct = (v, m) => n(m) ? Math.min(100, n(v) / n(m) * 100) : 0;
  const R = 40, C = 2 * Math.PI * R, kp = pct(d.kcal, d.mk) / 100, over = n(d.mk) && n(d.kcal) > n(d.mk) * 1.1;
  const bar = (lbl, v, m, col, u = "g") => `<div class="dc-bar"><span>${lbl}</span><i><span style="width:${pct(v, m)}%;background:${col}"></span></i><em>${fmt(n(v))}/${fmt(n(m))}${u === "ml" ? "" : " " + u}</em></div>`;
  const dt = /^\d{4}-\d{2}-\d{2}$/.test(d.date || "") ? `${DOW[parseISO(d.date).getDay()]}, ${dShort(d.date)}` : "";
  return `<div class="daycard"${big ? ' style="gap:14px"' : ""}>
    <div class="dc-h">${ic("target", 'style="width:20px;height:20px;color:var(--accent)"')}<b>Resumo do dia</b><span class="sub">${esc(dt)}</span>${d.goal ? `<span class="pill">${esc(d.goal)}</span>` : ""}</div>
    <div class="dc-main"><div class="dc-ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="${R}" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="10"/><circle cx="50" cy="50" r="${R}" fill="none" stroke="${over ? "var(--bad)" : "var(--accent)"}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - kp)}"/></svg><div><b>${fmt(n(d.kcal))}</b><span>de ${fmt(n(d.mk))} kcal</span></div></div>
      <div class="dc-bars">${bar("Proteína", d.p, d.mp, "var(--prot)")}${bar("Carbo", d.c, d.mc, "var(--carb)")}${bar("Gordura", d.f, d.mf, "var(--fat)")}${bar("Água", d.w, d.mw, "#3CC8E6", "ml")}</div></div>
    <div class="dc-tags"><span>${ic("trophy")}${fmt(Math.min(5, n(d.hits)))}/5 metas</span>${(Array.isArray(d.wk) ? d.wk : []).slice(0, 3).map(w => `<span>${ic("dumbbell")}${esc(w.n)} · ${fmt(n(w.s))} séries</span>`).join("")}${d.act && n(d.act.n) ? `<span>${ic("run")}${fmt(n(d.act.n))} atividade${n(d.act.n) > 1 ? "s" : ""} · ${fmt(n(d.act.kcal))} kcal</span>` : ""}</div>
  </div>`;
}
function dayPostBtn(){
  if (typeof CLOUD === "undefined" || !CLOUD.sb) return "";
  return `<button class="btn sm ghost" data-act="dayPost">${ic("users")}Postar</button>`;
}

/* ---------- Tela ---------- */
function vSocial(){
  const head = `<div class="ph"><div><div class="eyebrow">Comunidade · treine junto</div><h1>Comunidade</h1><p class="lede">Poste suas corridas, treinos e conquistas, siga a galera e incentive quem está saindo do modo frango.</p></div></div>`;
  if (typeof CLOUD === "undefined" || !CLOUD.sb) return head + `<div class="note">${ic("info")}<span>A Comunidade funciona no site do app, com a sua conta: <a href="https://fernandocruzjr.github.io/Desfrangolizador/" target="_blank" rel="noopener"><b>abrir o Desfrangolizador</b></a>.</span></div>`;
  if (!CLOUD.user) return head + `<div class="note">${ic("info")}<span>Entre na sua conta para usar a Comunidade.</span></div>`;
  if (SOC.me === undefined) { if (!SOC.loading && !SOC.err) setTimeout(socLoadMe, 0); return head + (SOC.err ? `<div class="note warn">${ic("alert")}<span>${esc(SOC.err)}</span><button class="btn sm" data-act="socRetry">Tentar de novo</button></div>` : `<div class="empty">Carregando…</div>`); }
  if (SOC.me === null) return head + socOnboard();
  const posts = SOC.posts.filter(p => !p._extra);
  return `
    <div class="ig-top"><h1>Comunidade</h1>
      <button class="iconbtn" data-act="socNew" aria-label="Novo post">${ic("plus")}</button>
      <button class="iconbtn" data-act="socPeople" aria-label="Buscar pessoas">${ic("search")}</button>
      ${SOC.admin ? `<button class="iconbtn" data-act="socMod" aria-label="Moderação">${ic("shield")}</button>` : ""}
      <button class="iconbtn" data-act="socProfile" data-arg="${SOC.me.id}" aria-label="Meu perfil">${avInner(SOC.me, "sm")}</button>
    </div>
    ${storyBar()}
    <div class="ig-tabs">${[["descobrir","Para você"],["seguindo","Seguindo"]].map(([k, n]) => `<button data-act="socTab" data-arg="${k}" aria-pressed="${SOC.tab === k}">${n}</button>`).join("")}</div>
    <div class="feed" style="margin-top:12px">
      ${SOC.err ? `<div class="note warn">${ic("alert")}<span>${esc(SOC.err)}</span><button class="btn sm" data-act="socRefresh">Tentar de novo</button></div>` : ""}
      ${posts.map(postCard).join("")}
      ${!posts.length && !SOC.loading && !SOC.err ? `<div class="chart-empty">${ic("users")}<b>${SOC.tab === "seguindo" ? "Siga pessoas para ver os posts delas aqui" : "Seja o primeiro a postar!"}</b><span>${SOC.tab === "seguindo" ? "Use a lupa para encontrar a galera." : "Compartilhe uma corrida, um treino, o resumo do dia ou uma foto."}</span><button class="btn primary sm" data-act="${SOC.tab === "seguindo" ? "socPeople" : "socNew"}">${SOC.tab === "seguindo" ? "Buscar pessoas" : "Criar post"}</button></div>` : ""}
      ${SOC.loading ? `<div class="empty">Carregando…</div>` : posts.length && !SOC.end ? `<button class="btn" data-act="socMore">Carregar mais</button>` : ""}
      ${posts.length ? `<div class="row" style="justify-content:center"><button class="btn sm ghost" data-act="socRefresh">${ic("history")}Atualizar</button></div>` : ""}
    </div>`;
}
function postCard(p){
  const u = p.profiles || {}, liked = SOC.liked.has(p.id), d = p.data && typeof p.data === "object" ? p.data : {};
  let extra = "";
  // Os dados do post vêm de outra pessoa: um post malformado não pode quebrar o feed.
  try {
  ["track", "items", "ex"].forEach(k => { if (d[k] != null && !Array.isArray(d[k])) d[k] = []; });
  if (p.kind === "run" && d.type) {
    const t = typeof AT === "function" ? AT(d.type) : {n:"Atividade", ic:"run"};
    extra = `<div class="post-act"><div class="map">${d.track && d.track.length > 1 && typeof routeSVG === "function" ? routeSVG(d.track, "", 4) : ic(t.ic)}</div><div><b>${esc(t.n)}</b><div class="nums" style="margin-top:6px">${d.km ? `<div><b>${fmt(d.km, 2)}</b><span>km</span></div>` : ""}<div><b>${durTxt(d.min)}</b><span>tempo</span></div>${d.km && d.type !== "bike" ? `<div><b>${paceTxt(d.min * 60, d.km)}</b><span>ritmo /km</span></div>` : ""}<div><b>${fmt(d.kcal)}</b><span>kcal</span></div></div></div></div>`;
  } else if (p.kind === "meal" && d.name) {
    const tot = Math.max(1, d.p * 4 + d.c * 4 + d.f * 9), bar = (v, k, cl) => `<span style="flex:${v * k / tot};background:var(${cl})"></span>`;
    extra = `<div class="post-wk"><div class="row" style="gap:8px;flex-wrap:wrap;align-items:baseline"><b>${ic("plate", 'style="width:18px;height:18px;vertical-align:-3px;color:var(--accent)"')} ${esc(d.name)}</b><span class="num" style="font:800 20px var(--f-mono,monospace)">${fmt(d.kcal)}<small style="font-size:12px;color:var(--muted)"> kcal</small></span></div>
      <div style="display:flex;height:8px;border-radius:6px;overflow:hidden;gap:2px;margin:8px 0">${bar(d.p, 4, "--c-p,#F07B3F")}${bar(d.c, 4, "--c-c,#3B8BF5")}${bar(d.f, 9, "--c-f,#2BB673")}</div>
      <div class="row num" style="gap:14px;font-size:13.5px"><span><i class="dot c-p"></i> P ${fmt(d.p)} g</span><span><i class="dot c-c"></i> C ${fmt(d.c)} g</span><span><i class="dot c-f"></i> G ${fmt(d.f)} g</span></div>
      <ul>${(d.items || []).slice(0, 12).map(it => `<li>${esc(it.n)} · ${fmt(it.g)} g</li>`).join("")}</ul></div>`;
  } else if (p.kind === "workout" && d.name) {
    extra = `<div class="post-wk"><b>${ic("dumbbell", 'style="width:18px;height:18px;vertical-align:-3px;color:var(--accent)"')} ${esc(d.name)}</b> <span class="sub">· ${fmt(d.sets)} séries · ${fmt(d.vol)} kg de volume${d.min ? " · " + durTxt(d.min) : ""}</span><ul>${(d.ex || []).slice(0, 8).map(e => `<li>${esc(e.n)}: ${fmt(e.s)}× ${esc(e.best || "")}</li>`).join("")}</ul></div>`;
  } else if (p.kind === "day" && d.mk) {
    extra = dayCard(d);
  }
  } catch (e) { extra = ""; }
  const img = safeImg(p.image_url), nl = cnt(p, "likes"), nc = cnt(p, "comments");
  return `<article class="post ig" id="p-${p.id}">
    <div class="post-h">${uavS(u, "sm")}<button class="uname" data-act="socProfile" data-arg="${u.id || ""}">${esc(u.username || "")}<small>${esc(u.display_name || "")}</small></button>
      <button class="iconbtn" data-act="socMenu" data-arg="${p.id}" aria-label="Mais opções">${ic("dots")}</button></div>
    ${img ? `<div class="post-media" data-dbl="${p.id}"><img src="${esc(img)}" alt="Foto do post" loading="lazy" onerror="this.parentNode.remove()"><span class="dbl-heart">${ic("heart")}</span></div>` : ""}
    ${extra ? `<div class="post-extra" ${img ? 'style="padding-top:10px"' : ""}>${extra}</div>` : ""}
    <div class="post-f"><button class="pbtn ${liked ? "on" : ""}" data-act="socLike" data-arg="${p.id}" aria-pressed="${liked}" aria-label="Curtir">${ic("heart")}</button>
      <button class="pbtn" data-act="socComments" data-arg="${p.id}" aria-label="Comentários">${ic("chat")}</button></div>
    <div class="post-pad">
      <div class="post-likes" data-likes="${p.id}">${nl ? `${fmt(nl)} curtida${nl > 1 ? "s" : ""}` : `<span class="sub" style="font-weight:500">Seja o primeiro a curtir</span>`}</div>
      ${p.body ? `<div class="post-cap"><b data-act="socProfile" data-arg="${u.id || ""}">${esc(u.username || "")}</b> ${esc(p.body)}</div>` : ""}
      ${nc ? `<button class="post-more" data-act="socComments" data-arg="${p.id}">Ver ${nc > 1 ? `os ${fmt(nc)} comentários` : "1 comentário"}</button>` : `<button class="post-more" data-act="socComments" data-arg="${p.id}">Adicionar um comentário…</button>`}
      <div class="post-time">${ago(p.created_at)}</div>
    </div>
  </article>`;
}
/* Dois toques na foto curtem o post. */
let DBL = {id:"", t:0};
document.addEventListener("click", ev => {
  const m = ev.target.closest && ev.target.closest("[data-dbl]"); if (!m) return;
  const id = m.dataset.dbl, now = Date.now();
  if (DBL.id === id && now - DBL.t < 320) {
    DBL = {id:"", t:0};
    const h = m.querySelector(".dbl-heart"); if (h) { h.classList.remove("go"); void h.offsetWidth; h.classList.add("go"); }
    if (!SOC.liked.has(id)) { const b = document.querySelector(`#p-${CSS.escape(id)} [data-act="socLike"]`); if (b) ACT.socLike(b); }
  } else DBL = {id, t:now};
});

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

/* ---------- Post novo (feed ou story) ---------- */
function mealSummary(att){
  const [, d, mi] = att.split(":"), day = typeof getDay === "function" ? getDay(d) : null, m = day && day.meals[+mi];
  if (!m || !m.items.length) return null;
  const t = m.items.reduce((a, it) => { const x = itemMac(it); a.k += x.k; a.p += x.p; a.c += x.c; a.f += x.f; return a; }, {k:0, p:0, c:0, f:0});
  return {name:m.name, kcal:Math.round(t.k), p:Math.round(t.p), c:Math.round(t.c), f:Math.round(t.f), items:m.items.slice(0, 12).map(it => ({n:it.n, g:Math.round(it.g)}))};
}
function composer(){
  const c = SOC.compose; c.dest = c.dest || "feed";
  const story = c.dest === "story", acts = typeof allActs === "function" ? allActs().slice(0, 8) : [], ss = allSessions().slice(0, 5);
  const sel = c.att || "", isMeal = sel.startsWith("m:"), isDay = sel.startsWith("d:"), today = todayISO();
  const ds = isDay ? daySum(sel.slice(2)) : null;
  const preview = story ? `<div class="st-prev" style="background:${STBG[c.bg || 0]};${c.imgUrl ? "padding:0" : ""}">${c.imgUrl ? `<img src="${c.imgUrl}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">${ds ? `<div style="position:absolute;left:8px;right:8px;bottom:8px;transform:scale(.8);transform-origin:bottom">${dayCard(ds)}</div>` : ""}` : ds ? `<div style="transform:scale(.8);width:125%">${dayCard(ds)}</div>` : `<div class="sv-text">${esc(c.body || "Escreva algo…")}</div>`}</div>` : "";
  openModal(`${sheetHead(story ? "Novo story" : "Novo post", "Comunidade")}
    <div class="col" style="gap:12px">
      ${isMeal ? "" : `<div class="seg pc-seg"><button data-act="pcDest" data-arg="feed" aria-pressed="${!story}">${ic("grid")}Feed</button><button data-act="pcDest" data-arg="story" aria-pressed="${story}">${ic("clock")}Story · 24 h</button></div>`}
      ${preview}
      <textarea id="pc-body" class="input" maxlength="${story ? 200 : 600}" rows="3" placeholder="${isMeal ? "Conta como ficou a refeição…" : isDay ? "Como foi o seu dia?" : story ? "Escreva no story…" : "Como foi o treino hoje?"}" style="min-height:${story ? 60 : 90}px">${esc((c.body || "").slice(0, story ? 200 : 600))}</textarea>
      ${story && !c.imgUrl ? `<div><div class="lbl" style="margin-bottom:6px">Fundo</div><div class="bgs">${STBG.map((b, i) => `<button data-act="pcBg" data-arg="${i}" style="background:${b}" aria-pressed="${(c.bg || 0) === i}" aria-label="Fundo ${i + 1}"></button>`).join("")}</div></div>` : ""}
      ${c.prep ? `<div class="empty">Preparando a foto…</div>` : c.imgUrl ? (story ? `<button class="btn ghost" data-act="pcImgDel">${ic("x")}Remover foto</button>` : `<div style="position:relative"><img src="${c.imgUrl}" alt="" class="post-img" style="max-height:280px"><button class="iconbtn" data-act="pcImgDel" style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,.6)" aria-label="Remover foto">${ic("x")}</button></div>`) : `<label class="btn" style="cursor:pointer;justify-content:center">${ic("camera")}Adicionar foto<input type="file" accept="image/*" data-pcimg hidden></label>`}
      ${isMeal ? (() => { const ms = mealSummary(sel); return ms ? `<div class="post-wk"><b>${ic("plate", 'style="width:18px;height:18px;vertical-align:-3px;color:var(--accent)"')} ${esc(ms.name)}</b> <span class="sub">· ${fmt(ms.kcal)} kcal · P ${ms.p} g · C ${ms.c} g · G ${ms.f} g</span><p class="sub" style="margin:6px 0 0">Só esta refeição vai para o post. O resto da sua dieta continua privado.</p></div>` : ""; })() : ""}
      ${!isMeal ? `<div><div class="lbl" style="margin-bottom:6px">Anexar (opcional)</div><div class="attach">
        <button class="chip" data-act="pcAtt" data-arg="" aria-pressed="${!sel}">Nada</button>
        <button class="chip" data-act="pcAtt" data-arg="d:${isDay ? sel.slice(2) : today}" aria-pressed="${isDay}">${ic("target")}Resumo do dia${isDay && sel.slice(2) !== today ? " · " + dShort(sel.slice(2)) : ""}</button>
        ${story ? "" : acts.map(a => `<button class="chip" data-act="pcAtt" data-arg="a:${a.id}" aria-pressed="${sel === "a:" + a.id}">${ic(AT(a.type).ic)}${esc(AT(a.type).n)} ${a.km ? fmt(a.km, 1) + " km" : durTxt(a.min)} · ${dShort(a.date)}</button>`).join("")}
        ${story ? "" : ss.map(s => `<button class="chip" data-act="pcAtt" data-arg="w:${s.id}" aria-pressed="${sel === "w:" + s.id}">${ic("dumbbell")}${esc(s.name)} · ${dShort(s.date)}</button>`).join("")}
      </div>${sel.startsWith("a:") ? `<p class="sub" style="margin:6px 0 0">No mapa escondemos os primeiros e os últimos 200 m do trajeto.</p>` : ""}${isDay ? (ds ? (story ? "" : `<div style="margin-top:10px">${dayCard(ds)}</div>`) + `<p class="sub" style="margin:6px 0 0">Vão só as calorias, macros, água e treinos deste dia. Peso, medidas e o que você comeu continuam privados.</p>` : `<p class="sub" style="margin:6px 0 0">Registre refeições nesse dia para postar o resumo.</p>`) : ""}</div>` : ""}
      ${story ? `<p class="sub" style="margin:0">${ic("clock", 'style="width:14px;height:14px;vertical-align:-2px"')} O story some da Comunidade em 24 horas.</p>` : ""}
      <button class="btn primary" data-act="pcSend" ${c.busy ? "disabled" : ""}>${ic("send")}${c.busy ? "Publicando…" : story ? "Publicar no story" : "Publicar no feed"}</button>
    </div>`);
}
document.addEventListener("input", ev => {
  if (ev.target.id !== "pc-body" || !SOC.compose) return;
  SOC.compose.body = ev.target.value; cmpSave();
  const t = document.querySelector(".st-prev .sv-text"); if (t) t.textContent = ev.target.value || "Escreva algo…";
});
const CMP_LS = "desfr-compose";
function cmpSave(){ try { const c = SOC.compose; if (!c) { sessionStorage.removeItem(CMP_LS); return; } sessionStorage.setItem(CMP_LS, JSON.stringify({body:c.body || "", att:c.att || "", dest:c.dest || "feed", bg:c.bg || 0, img:c.imgData || ""})); } catch (e) {} }
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
  const c = SOC.compose, story = c.dest === "story", body = (c.body || "").trim().slice(0, story ? 200 : 600);
  let kind = "text", data = null;
  if (c.att && c.att.startsWith("d:")) { const ds = daySum(c.att.slice(2)); if (ds) { kind = "day"; data = ds; } }
  if (!story && c.att && c.att.startsWith("a:")) { const a = allActs().find(x => x.id === c.att.slice(2)); if (a) { kind = "run"; data = {type:a.type, km:a.km || 0, min:a.min, kcal:a.kcal}; if (a.track && a.track.length > 3) data.track = simplify(trimEnds(a.track), 150); } }
  if (!story && c.att && c.att.startsWith("w:")) { const s = allSessions().find(x => x.id === c.att.slice(2)); if (s) { kind = "workout"; data = {name:s.name, sets:sessSets(s), vol:Math.round(sessVolume(s)), min:s.end && s.start ? Math.round((s.end - s.start) / 60000) : 0, ex:s.ex.map(e => { const b = e.sets.reduce((m, st) => (+st.kg || 0) * (+st.r || 0) > (+m.kg || 0) * (+m.r || 0) ? st : m, e.sets[0] || {}); return {n:(EX[e.id] || {}).n || e.id, s:e.sets.length, best:b && b.r ? `${b.r}${b.kg ? " × " + fmt(b.kg, 1) + " kg" : ""}` : ""}; })}; } }
  if (!story && c.att && c.att.startsWith("m:")) { const ms = mealSummary(c.att); if (ms) { kind = "meal"; data = ms; } }
  if (c.att && c.att.startsWith("d:") && !data) { toast("Registre refeições nesse dia para postar o resumo"); return; }
  if (!body && !c.file && !c.imgData && !data) { toast(story ? "Escreva algo, adicione uma foto ou o resumo do dia" : "Escreva algo, adicione uma foto ou anexe uma atividade"); return; }
  c.busy = true; composer();
  try {
    let image_url = null;
    if (!c.file && c.imgData) c.file = await (await fetch(c.imgData)).blob();
    if (c.file) { try { image_url = await uploadImg(c.file, (story ? "s-" : "p-") + uid() + ".jpg"); } catch (e) { e.stage = "foto"; throw e; } if (kind === "text" || story) kind = "photo"; }
    if (story) {
      const r = await SB().from("stories").insert({kind, body, bg:c.bg || 0, data, image_url}).select(STORY_SEL).single();
      if (r.error) throw r.error;
      SOC.compose = null; cmpSave(); closeModal(); UI.tab = "social"; await socLoadStories(); render(); toast("Story publicado! Ele some em 24 h");
      return;
    }
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
    el.innerHTML = (r.data || []).length ? r.data.map(c => `<div class="cmt">${uav(c.profiles, "sm")}<div><b>${esc((c.profiles || {}).username || "")}</b> <span class="sub">· ${ago(c.created_at)}</span><p>${esc(c.body)}</p></div>
      <div class="row" style="gap:0;flex-wrap:nowrap">${c.user_id === CLOUD.user.id || mineP || SOC.admin ? `<button class="iconbtn" data-act="socDelCmt" data-arg="${c.id}" data-post="${pid}" aria-label="Apagar comentário">${ic("trash")}</button>` : ""}${c.user_id !== CLOUD.user.id ? `<button class="iconbtn" data-act="socReport" data-kind="comment" data-arg="${c.id}" aria-label="Denunciar comentário">${ic("flag")}</button>` : ""}</div></div>`).join("") : `<div class="empty">Nenhum comentário ainda. Mande um incentivo!</div>`;
  } catch (e) { const el = $("#cm-list"); if (el) el.innerHTML = `<div class="note warn">${ic("alert")}<span>Não foi possível carregar os comentários.</span></div>`; }
}

/* ---------- Perfil ---------- */
function thumb(p){
  const img = safeImg(p.image_url), K = {run:["run","Corrida"], workout:["dumbbell","Treino"], meal:["plate","Refeição"], day:["target","Resumo do dia"], text:["chat",""]}[p.kind] || ["chat",""];
  return `<button class="ig-th" data-act="socOpenPost" data-arg="${p.id}" aria-label="Abrir post">${img ? `<img src="${esc(img)}" alt="" loading="lazy">` : `<span class="tl">${ic(K[0])}${K[1] ? `<b>${K[1]}</b>` : ""}${p.body ? `<span>${esc(p.body.slice(0, 80))}</span>` : ""}</span>`}</button>`;
}
async function profileView(id){
  openModal(`${sheetHead("Perfil")}<div id="pv"><div class="empty">Carregando…</div></div>`);
  try {
    const [pr, fr, fg, ps] = await Promise.all([
      SB().from("profiles").select("*").eq("id", id).maybeSingle(),
      SB().from("follows").select("follower", {count:"exact", head:true}).eq("followee", id),
      SB().from("follows").select("followee", {count:"exact", head:true}).eq("follower", id),
      SB().from("posts").select(POST_SEL).eq("user_id", id).order("created_at", {ascending:false}).limit(30)
    ]);
    const p = pr.data, el = $("#pv"); if (!el) return;
    if (!p) { el.innerHTML = `<div class="empty">Perfil indisponível.</div>`; return; }
    const me = id === CLOUD.user.id, fol = SOC.follows.has(id), list = ps.data || [];
    list.forEach(x => { if (!SOC.posts.some(y => y.id === x.id)) SOC.posts.push(Object.assign({}, x, {_extra:true})); });
    el.innerHTML = `<div class="ig-prof"><div class="ig-ph">${uavS(p, "lg")}
        <div class="prof-stats"><div><b>${list.length}${list.length === 30 ? "+" : ""}</b><span>posts</span></div><div><b>${fr.count || 0}</b><span>seguidores</span></div><div><b>${fg.count || 0}</b><span>seguindo</span></div></div></div>
      <div><b style="font-size:15px">${esc(p.display_name)}</b><div class="sub">@${esc(p.username)}</div>${p.bio ? `<p style="margin:6px 0 0;white-space:pre-wrap">${esc(p.bio)}</p>` : ""}</div>
      <div class="row" style="gap:8px;flex-wrap:wrap">${me ? `<button class="btn sm" data-act="socEditProf">${ic("edit")}Editar perfil</button><label class="btn sm" style="cursor:pointer">${ic("camera")}Foto<input type="file" accept="image/*" data-socav hidden></label><button class="btn sm" data-act="stNew">${ic("plus")}Story</button><button class="btn sm ghost" data-act="socBlocks">${ic("ban")}Bloqueados</button>` : `<button class="btn ${fol ? "" : "primary"} sm" data-act="socFollow" data-arg="${id}">${fol ? "Seguindo ✓" : "Seguir"}</button><button class="btn sm ghost" data-act="socReport" data-kind="user" data-arg="${id}">${ic("flag")}Denunciar</button><button class="btn sm ghost danger" data-act="socBlock" data-arg="${id}">${ic("ban")}Bloquear</button>`}</div>
      ${list.length ? `<div class="ig-grid">${list.map(thumb).join("")}</div>` : `<div class="empty">Nenhum post ainda.</div>`}</div>`;
  } catch (e) { const el = $("#pv"); if (el) el.innerHTML = `<div class="note warn">${ic("alert")}<span>Não foi possível abrir o perfil.</span></div>`; }
}
document.addEventListener("change", async ev => {
  const el = ev.target; if (!el.matches("[data-socav]") || !el.files || !el.files[0]) return;
  try { toast("Enviando foto…"); const url = await uploadImg(await toJpeg(el.files[0], 256, .85, true), "avatar.jpg"); const r = await SB().from("profiles").update({avatar_url:url}).eq("id", CLOUD.user.id).select().single(); if (r.error) throw r.error; SOC.me = r.data; SOC.posts.forEach(p => { if (p.user_id === SOC.me.id && p.profiles) p.profiles.avatar_url = url; }); SOC.stories.forEach(g => { if (g.user.id === SOC.me.id) g.user.avatar_url = url; }); profileView(SOC.me.id); render(); toast("Foto atualizada"); }
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
    el.innerHTML = (res.data || []).map(p => `<div class="ppl-row">${uav(p)}<button class="uname" data-act="socProfile" data-arg="${p.id}">${esc(p.username)}<small>${esc(p.display_name)}</small></button><button class="btn sm ${SOC.follows.has(p.id) ? "" : "primary"}" data-act="socFollow" data-arg="${p.id}" data-from="people">${SOC.follows.has(p.id) ? "Seguindo" : "Seguir"}</button></div>`).join("") || `<div class="empty">Ninguém encontrado.</div>`;
  } catch (e) { const el = $("#pp-list"); if (el) el.innerHTML = `<div class="note warn">${ic("alert")}<span>Sem conexão agora.</span></div>`; }
}
let PP_T = null;
document.addEventListener("input", ev => { if (ev.target.id === "pp-q") { clearTimeout(PP_T); const v = ev.target.value; PP_T = setTimeout(() => peopleModal(v), 400); } });

/* ---------- Moderação ---------- */
async function modModal(){
  openModal(`${sheetHead("Moderação", "Só você vê")}<div id="md"><div class="empty">Carregando…</div></div>`);
  try {
    const r = await SB().from("reports").select("id,reason,created_at,post_id,comment_id,story_id,reported_user,status,posts!reports_post_id_fkey(id,body,image_url,user_id),comments!reports_comment_id_fkey(id,body,user_id),stories!reports_story_id_fkey(id,body,image_url,user_id)").eq("status", "aberta").order("created_at", {ascending:false}).limit(50);
    if (r.error) throw r.error;
    const el = $("#md"); if (!el) return;
    el.innerHTML = (r.data || []).map(x => `<div class="mgroup" style="margin-bottom:10px"><div class="mgroup-h">${x.post_id ? "Post" : x.comment_id ? "Comentário" : x.story_id ? "Story" : "Perfil"}<span class="pill warn">${ago(x.created_at)}</span></div>
      <p class="sub" style="margin:0">Motivo: <b>${esc(x.reason)}</b></p>
      ${x.posts ? `<p style="margin:0;white-space:pre-wrap">${esc(x.posts.body || "(sem texto)")}</p>${safeImg(x.posts.image_url) ? `<img src="${esc(safeImg(x.posts.image_url))}" class="post-img" style="max-height:200px" alt="">` : ""}` : ""}
      ${x.comments ? `<p style="margin:0">${esc(x.comments.body)}</p>` : ""}
      ${x.stories ? `<p style="margin:0;white-space:pre-wrap">${esc(x.stories.body || "(sem texto)")}</p>${safeImg(x.stories.image_url) ? `<img src="${esc(safeImg(x.stories.image_url))}" class="post-img" style="max-height:200px" alt="">` : ""}` : ""}
      <div class="row" style="gap:8px;flex-wrap:wrap">${x.post_id ? `<button class="btn sm danger" data-act="modDelPost" data-arg="${x.post_id}" data-rep="${x.id}">${ic("trash")}Apagar post</button>` : ""}${x.comment_id ? `<button class="btn sm danger" data-act="modDelCmt" data-arg="${x.comment_id}" data-rep="${x.id}">${ic("trash")}Apagar comentário</button>` : ""}${x.story_id ? `<button class="btn sm danger" data-act="modDelStory" data-arg="${x.story_id}" data-rep="${x.id}">${ic("trash")}Apagar story</button>` : ""}${x.reported_user ? `<button class="btn sm" data-act="socProfile" data-arg="${x.reported_user}">Ver perfil</button>` : ""}<button class="btn sm ghost" data-act="modOk" data-rep="${x.id}">Manter e fechar</button></div></div>`).join("") || `<div class="empty">Nenhuma denúncia aberta. 🎉</div>`;
  } catch (e) { const el = $("#md"); if (el) el.innerHTML = `<div class="note warn">${ic("alert")}<span>Não foi possível carregar.</span></div>`; }
}
async function modResolve(rep){ try { await SB().from("reports").update({status:"resolvida"}).eq("id", rep); } catch (e) {} }
const curStory = () => { const g = SOC.stories[ST.g]; return g && g.items[ST.i]; };
async function delStory(s){
  const r = await SB().from("stories").delete().eq("id", s.id); if (r.error) throw r.error;
  const img = safeImg(s.image_url); if (img && s.user_id === CLOUD.user.id) { try { await SB().storage.from("media").remove([img.slice(MEDIA_PREFIX().length).split("?")[0]]); } catch (e) {} }
  SOC.stories.forEach(g => g.items = g.items.filter(x => x.id !== s.id)); SOC.stories = SOC.stories.filter(g => g.items.length);
}

/* ---------- Ações ---------- */
Object.assign(ACT, {
  socRetry: () => { SOC.err = ""; SOC.me = undefined; render(); },
  socTab: el => { SOC.tab = el.dataset.arg; socLoadFeed(true); },
  socRefresh: () => socLoadFeed(true),
  socMore: () => socLoadFeed(false),
  socNew: () => { if (!socOn()) { go("social"); return; } if (!SOC.me) { closeModal(); go("social"); toast("Crie seu perfil primeiro"); return; } SOC.compose = SOC.compose || {body:"", att:"", dest:"feed"}; composer(); },
  stNew: () => { if (!SOC.me) return; if (SOC.storyOff) { toast("Stories ainda não estão ativos no servidor"); return; } SOC.compose = {body:"", att:"", dest:"story", bg:0}; composer(); },
  qPost: () => { closeModal(); UI.tab = "social"; render(); if (SOC.me) ACT.socNew(); },
  dayPost: () => {
    if (!socOn()) { toast("A Comunidade funciona no site, com sua conta"); return; }
    if (!daySum(UI.date)) { toast("Registre refeições nesse dia para postar o resumo"); return; }
    SOC.compose = {body:"", att:"d:" + UI.date, dest:"feed"};
    UI.tab = "social"; render();
    if (SOC.me) composer(); else if (SOC.me === undefined) SOC.openCompose = true; else toast("Crie seu perfil na Comunidade primeiro");
  },
  pcDest: el => { const c = SOC.compose; c.dest = el.dataset.arg; if (c.dest === "story" && c.att && !c.att.startsWith("d:")) c.att = ""; cmpSave(); composer(); },
  pcBg: el => { SOC.compose.bg = +el.dataset.arg; cmpSave(); composer(); },
  pcAtt: el => { SOC.compose.att = el.dataset.arg; cmpSave(); composer(); },
  pcImgDel: () => { SOC.compose.file = null; SOC.compose.imgUrl = ""; SOC.compose.imgData = ""; cmpSave(); composer(); },
  pcSend: () => pcSend(),
  socLike: async el => {
    const id = el.dataset.arg, p = SOC.posts.find(x => x.id === id), on = SOC.liked.has(id);
    if (on) SOC.liked.delete(id); else SOC.liked.add(id);
    SOC.posts.filter(x => x.id === id).forEach(x => x.likes = [{count:Math.max(0, cnt(x, "likes") + (on ? -1 : 1))}]);
    const n = p ? cnt(p, "likes") : 0;
    document.querySelectorAll(`[data-act="socLike"][data-arg="${id}"]`).forEach(b => { b.classList.toggle("on", !on); b.setAttribute("aria-pressed", String(!on)); });
    document.querySelectorAll(`[data-likes="${id}"]`).forEach(b => b.innerHTML = n ? `${fmt(n)} curtida${n > 1 ? "s" : ""}` : `<span class="sub" style="font-weight:500">Seja o primeiro a curtir</span>`);
    try { const r = on ? await SB().from("likes").delete().match({post_id:id, user_id:CLOUD.user.id}) : await SB().from("likes").insert({post_id:id}); if (r.error && !/duplicate/i.test(r.error.message)) throw r.error; } catch (e) { socErr(e); }
  },
  socComments: el => commentsModal(el.dataset.arg),
  socOpenPost: el => { const p = SOC.posts.find(x => x.id === el.dataset.arg); if (!p) return; openModal(`${sheetHead("Post")}<div class="feed">${postCard(p)}</div><button class="btn ghost" data-act="socProfile" data-arg="${p.user_id}">${ic("chevL")}Voltar ao perfil</button>`); },
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
    const k = el.dataset.kind, row = {reason:el.dataset.reason}; row[{post:"post_id", comment:"comment_id", story:"story_id"}[k] || "reported_user"] = el.dataset.arg;
    if (k === "post") { const p = SOC.posts.find(x => x.id === el.dataset.arg); if (p) row.reported_user = p.user_id; }
    if (k === "story") { const g = SOC.stories.find(x => x.items.some(s => s.id === el.dataset.arg)); if (g) row.reported_user = g.user.id; }
    try { const r = await SB().from("reports").insert(row); if (r.error) throw r.error; closeModal(); toast("Denúncia enviada. Obrigado!"); } catch (e) { socErr(e); }
  },
  socBlock: el => confirmBox("Bloquear?", "Vocês deixam de ver os posts, stories e comentários um do outro e deixam de se seguir. Você pode desbloquear no seu perfil.", "Bloquear", async () => { try { const r = await SB().from("blocks").insert({blocked:el.dataset.arg}); if (r.error && !/duplicate/i.test(r.error.message)) throw r.error; SOC.follows.delete(el.dataset.arg); SOC.posts = SOC.posts.filter(x => x.user_id !== el.dataset.arg); SOC.stories = SOC.stories.filter(g => g.user.id !== el.dataset.arg); if (ST.open) stClose(); render(); toast("Bloqueado"); } catch (e) { socErr(e); } }),
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
  modDelStory: async el => { try { await delStory({id:el.dataset.arg}); await modResolve(el.dataset.rep); render(); modModal(); toast("Story removido"); } catch (e) { socErr(e); } },
  modOk: async el => { await modResolve(el.dataset.rep); modModal(); },
  actPost: el => { if (!socOn()) { toast("A Comunidade funciona no site, com sua conta"); return; } closeModal(); UI.tab = "social"; render(); SOC.compose = {body:"", att:"a:" + el.dataset.arg, dest:"feed"}; if (SOC.me) composer(); else toast("Crie seu perfil na Comunidade primeiro"); },
  /* Stories */
  stUser: el => stOpen(el.dataset.arg),
  stX: () => stClose(),
  stProfile: el => { stClose(); profileView(el.dataset.arg); },
  stMenu: () => {
    const s = curStory(); if (!s) return; const mine = s.user_id === CLOUD.user.id;
    openModal(`${sheetHead("Opções do story")}<div class="col" style="gap:8px">
      ${mine || SOC.admin ? `<button class="btn danger" data-act="stDel">${ic("trash")}Apagar story${!mine ? " (moderação)" : ""}</button>` : ""}
      ${!mine ? `<button class="btn" data-act="socReport" data-kind="story" data-arg="${s.id}">${ic("flag")}Denunciar story</button><button class="btn" data-act="socBlock" data-arg="${s.user_id}">${ic("ban")}Bloquear @${esc((s.profiles || {}).username || "")}</button>` : ""}
      <button class="btn ghost" data-act="closeModal">Cancelar</button></div>`);
  },
  stDel: async () => { const s = curStory(); if (!s) return; try { await delStory(s); closeModal(); toast("Story apagado"); const g = SOC.stories[ST.g]; if (g && g.user.id === s.user_id) { ST.i = Math.min(ST.i, g.items.length - 1); stShow(); } else stClose(); } catch (e) { socErr(e); } },
  stViews: async el => {
    openModal(`${sheetHead("Visto por", "Só você vê")}<div id="sv-list" class="ppl"><div class="empty">Carregando…</div></div>`);
    try {
      const r = await SB().from("story_views").select("created_at,profiles!story_views_viewer_fkey(id,username,display_name,avatar_url)").eq("story_id", el.dataset.arg).order("created_at", {ascending:false}).limit(200);
      if (r.error) throw r.error; const box = $("#sv-list"); if (!box) return;
      box.innerHTML = (r.data || []).filter(x => x.profiles).map(x => `<div class="ppl-row">${avInner(x.profiles)}<div><b>${esc(x.profiles.username)}</b><div class="sub">${esc(x.profiles.display_name)}</div></div><span class="sub">${ago(x.created_at)}</span></div>`).join("") || `<div class="empty">Ninguém viu ainda.</div>`;
    } catch (e) { const box = $("#sv-list"); if (box) box.innerHTML = `<div class="note warn">${ic("alert")}<span>Não foi possível carregar.</span></div>`; }
  }
});
/* Ao sair da conta, limpa a Comunidade. */
/* r_cloud carrega depois deste script: espera ele existir. */
setTimeout(() => {
  if (typeof CLOUD !== "undefined" && CLOUD.sb) CLOUD.sb.auth.onAuthStateChange(ev => { if (ev === "SIGNED_OUT") { SOC.me = undefined; SOC.posts = []; SOC.liked = new Set(); SOC.follows = new Set(); SOC.admin = false; SOC.stories = []; SOC.seen = new Set(); if (ST.open) stClose(); } });
  try { if (sessionStorage.getItem(CMP_LS) && typeof CLOUD !== "undefined" && CLOUD.sb && UI.tab !== "social") { UI.tab = "social"; render(); } } catch (e) {}
}, 0);
if (UI.tab === "social") render();
</script>
