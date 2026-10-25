// Aparición de las secciones al hacer scroll (cualquier elemento con class="reveal").
// A pedido de Nezash, no es "una sola vez": al salir del viewport la sección se
// resetea y vuelve a animar su entrada la próxima vez que aparece.

document.addEventListener("DOMContentLoaded", () => {
  const revealEls = document.querySelectorAll(".reveal");

  if (!window.Won.prefersReducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      { threshold: 0.08 }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
});
