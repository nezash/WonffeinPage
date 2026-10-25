// Sección "About": pestañas chicas (Who is she? / The goal / ...). Al elegir otra, el texto
// activo se desvanece ("summon-out"), se hace el swap a mitad de la animación y el nuevo
// aparece ("summon-in"). LEAVE_MS tiene que coincidir con @keyframes summon-out en about.css (.25s).

document.addEventListener("DOMContentLoaded", () => {
  const LEAVE_MS = 250;
  const factTabs = document.querySelectorAll(".fact-tab");
  const factStage = document.querySelector(".about__stage");
  let isSwitchingFact = false;

  function activateFact(tab) {
    if (isSwitchingFact || !factStage) return;

    const next = document.getElementById(tab.dataset.target);
    const current = factStage.querySelector(".fact-content.is-active");

    if (!next || next === current) return;

    isSwitchingFact = true;

    factTabs.forEach((t) => {
      t.classList.remove("is-active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("is-active");
    tab.setAttribute("aria-selected", "true");

    if (current) {
      current.classList.remove("is-active");
      current.classList.add("is-leaving");
    }

    const swap = () => {
      if (current) current.classList.remove("is-leaving");
      next.classList.add("is-active");
      isSwitchingFact = false;
    };

    if (window.Won.prefersReducedMotion) {
      swap();
    } else {
      window.setTimeout(swap, LEAVE_MS);
    }
  }

  factTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateFact(tab));

    // Flechas izquierda/derecha para moverse entre pestañas (accesibilidad).
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const dir = event.key === "ArrowRight" ? 1 : -1;
      const nextTab = factTabs[(index + dir + factTabs.length) % factTabs.length];
      nextTab.focus();
      activateFact(nextTab);
    });
  });
});
