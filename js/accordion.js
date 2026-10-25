// Filas que se abren y cierran (FAQ y Términos de comisión). Cada fila es independiente:
// se pueden tener varias abiertas. El alto lo anima el CSS (accordion.css); acá solo se
// cambia la clase is-open y los atributos aria-expanded / aria-hidden.

document.addEventListener("DOMContentLoaded", () => {
  function setOpen(trigger, open) {
    const panel = document.getElementById(trigger.getAttribute("aria-controls"));
    if (!panel) return;
    trigger.setAttribute("aria-expanded", String(open));
    panel.classList.toggle("is-open", open);
    panel.setAttribute("aria-hidden", String(!open));
  }

  document.querySelectorAll(".accordion-item__trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      setOpen(trigger, trigger.getAttribute("aria-expanded") !== "true");
    });
  });
});
