// Escenario de Twitch: carga el reproductor con la librería oficial de Twitch (Twitch.Player) y escucha sus eventos
// ONLINE / OFFLINE para encender o apagar la "cámara" de la tarjeta (etiqueta REC, esquinas rojas, título).
// No usa claves ni servidor: el propio reproductor avisa si el canal está en vivo.
//
// Estados (se guardan en data-live del .live-stage; los estilos están en css/stream-fx.css):
//   checking → esperando el aviso de Twitch · live → en vivo · off → cámara apagada
//   unknown  → no se pudo saber (sin Twitch, abierto como archivo local, sin respuesta): se oculta la etiqueta
// Si algo falla se queda el <iframe> que ya está en el HTML, así el reproductor se ve igual.

document.addEventListener("DOMContentLoaded", () => {
  const stage = document.querySelector(".live-stage");
  const holder = document.getElementById("twitch-player");
  const label = document.querySelector(".live-card__status-text");
  const title = document.querySelector(".live-card__title");
  if (!stage || !holder || !label || !title) return;

  const TEXT = {
    checking: { label: "Checking…", title: "Am I live?" },
    live: { label: "REC · Live now", title: "I'm live!" },
    off: { label: "Camera off", title: "Am I live?" },
    unknown: { label: "", title: "Am I live?" },
  };

  function setState(state) {
    stage.dataset.live = state;
    label.textContent = TEXT[state].label;
    title.textContent = TEXT[state].title;
  }

  setState("checking");

  // Twitch solo deja el reproductor en una página servida por http(s) con su dominio en "parent": abierto como archivo no hay forma de saberlo.
  if (!/^https?:$/.test(location.protocol)) {
    setState("unknown");
    return;
  }

  let answered = false;
  const giveUp = window.setTimeout(() => {
    if (!answered) setState("unknown");
  }, 12000);

  function answer(state) {
    answered = true;
    window.clearTimeout(giveUp);
    setState(state);
  }

  const script = document.createElement("script");
  script.src = "https://player.twitch.tv/js/embed/v1.js";
  script.async = true;

  script.onload = () => {
    const fallback = holder.innerHTML;
    try {
      holder.textContent = "";
      const player = new window.Twitch.Player(holder.id, {
        channel: "wonffein",
        parent: [location.hostname],
        width: "100%",
        height: "100%",
        muted: true,
        autoplay: true,
      });
      player.addEventListener(window.Twitch.Player.ONLINE, () => answer("live"));
      player.addEventListener(window.Twitch.Player.OFFLINE, () => answer("off"));
    } catch (err) {
      holder.innerHTML = fallback;
      setState("unknown");
    }
  };

  script.onerror = () => setState("unknown");
  document.head.appendChild(script);
});
