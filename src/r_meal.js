<script>
/* ======================= VIRADA DO DIA E POSTAR REFEIÇÃO ======================= */
/* App instalado fica aberto em segundo plano: quando o dia muda, a Dieta passa para hoje. */
let LAST_TODAY = todayISO();
function dayRoll(){
  const t = todayISO(); if (t === LAST_TODAY) return;
  if (UI.date === LAST_TODAY) UI.date = t;
  LAST_TODAY = t;
  if (!$("#modalRoot").innerHTML) render();
}
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") dayRoll(); });
window.addEventListener("focus", dayRoll); window.addEventListener("pageshow", dayRoll);
setInterval(dayRoll, 60000);

function mealPostBtn(mi){
  if (typeof CLOUD === "undefined" || !CLOUD.sb) return "";
  return `<button class="btn sm ghost" data-act="mealPost" data-m="${mi}">${ic("users")}Postar</button>`;
}
Object.assign(ACT, {
  mealPost: el => {
    if (typeof socOn !== "function" || !socOn()) { toast("A Comunidade funciona no site, com sua conta"); return; }
    const att = "m:" + UI.date + ":" + el.dataset.m;
    SOC.compose = {body:"", att};
    UI.tab = "social"; render();
    if (SOC.me) composer(); else if (SOC.me === undefined) SOC.openCompose = true; else toast("Crie seu perfil na Comunidade primeiro");
  }
});
</script>
