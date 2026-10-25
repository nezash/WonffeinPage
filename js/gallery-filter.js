// Filtros de la galería (All / Illustrations / Chibis / Emotes / Sketches).
// Cada pieza declara su categoría en data-category; el filtro solo esconde/muestra
// (atributo hidden) y el CSS grid con "dense" reacomoda los huecos solo.
// Las piezas con data-category="always" (la tarjeta "Want to see more?") nunca se esconden.

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("[data-filter]");
  const items = document.querySelectorAll(".gallery-item");
  if (!buttons.length || !items.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      buttons.forEach((b) => {
        const active = b === button;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });

      items.forEach((item) => {
        const category = item.dataset.category;
        item.hidden = !(filter === "all" || category === "always" || category === filter);
      });
    });
  });
});
