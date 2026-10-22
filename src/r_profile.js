<script>
/* ======================= PERFIL E FOTO ======================= */
const avatarSrc = () => { const a = Store.get("avatar"); return a && a.data ? a.data : ""; };
function avatarHTML(initials){
  const src = avatarSrc();
  return (src ? `<img src="${src}" alt="">` : esc(initials)) + `<span class="cam" aria-hidden="true">${ic("camera")}</span>`;
}
function profileModal(){
  const p = P(), c = calc(p), g = GOALS[p.goal] || GOALS.bulk, src = avatarSrc();
  const acct = typeof CLOUD !== "undefined" && CLOUD.user ? CLOUD.user.email : "";
  openModal(`${sheetHead("Meu perfil")}
    <div class="col" style="gap:14px;text-align:center">
      <div class="prof-av">${src ? `<img src="${src}" alt="Sua foto de perfil">` : esc(firstName().slice(0, 1).toUpperCase())}</div>
      <div class="row" style="gap:8px;justify-content:center;flex-wrap:wrap">
        <label class="btn primary sm" style="cursor:pointer">${ic("camera")}${src ? "Trocar foto" : "Colocar foto"}<input type="file" accept="image/*" data-avatar hidden></label>
        ${src ? `<button class="btn sm ghost danger" data-act="avatarDel">${ic("trash")}Remover</button>` : ""}
      </div>
      <div class="field" style="text-align:left"><label for="pf-nick">Como quer ser chamado</label><input id="pf-nick" class="input" maxlength="40" value="${esc(p.nick || "")}" placeholder="${esc(firstName())}"></div>
      ${acct ? `<p class="sub" style="margin:0">Conta: <b>${esc(acct)}</b></p>` : ""}
      <button class="calc-card" data-act="qPlano"><span class="calc-ic">${ic("flame")}</span><span class="calc-txt"><b>Calculadora de gasto calórico</b><span>${p.edited ? `Basal ${fmt(c.bmr)} · Total ${fmt(c.tdee)} · Meta ${fmt(c.kcal)} kcal (${g.n})` : "Calcule seu gasto basal e sua meta"}</span></span></button>
      <div class="row" style="gap:8px;justify-content:center;flex-wrap:wrap">
        <button class="btn sm" data-act="qEvol">${ic("up")}Evolução e medidas</button>
        <button class="btn sm" data-act="about">${ic("phone")}Instalar e ajuda</button>
      </div>
    </div>`);
}
async function saveAvatar(file){
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); });
    const S = 320, cv = document.createElement("canvas"); cv.width = cv.height = S;
    const side = Math.min(img.naturalWidth, img.naturalHeight), sx = (img.naturalWidth - side) / 2, sy = (img.naturalHeight - side) / 2;
    cv.getContext("2d").drawImage(img, sx, sy, side, side, 0, 0, S, S);
    Store.put("avatar", {data:cv.toDataURL("image/jpeg", 0.82)});
    URL.revokeObjectURL(img.src);
    render(); profileModal(); toast("Foto de perfil salva");
  } catch (e) { toast("Não foi possível ler essa imagem"); }
}
document.addEventListener("change", ev => { const el = ev.target; if (el.matches("[data-avatar]") && el.files && el.files[0]) saveAvatar(el.files[0]); });
document.addEventListener("input", ev => { const el = ev.target; if (el.id === "pf-nick") { setP({nick: el.value.trim()}); } });
Object.assign(ACT, {
  profile: () => profileModal(),
  avatarDel: () => { Store.del("avatar"); render(); profileModal(); },
  qEvol: () => { closeModal(); go("evolucao"); }
});
if (UI.tab === "inicio") render();
</script>
