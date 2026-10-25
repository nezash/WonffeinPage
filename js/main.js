// Wonffein — script compartido. Se carga en el <head> (antes que los demás) y deja
// listo lo que usa TODA la página:
//  - la clase "js" en <html> (así reveal.css solo oculta cosas si el JS funciona)
//  - window.Won.prefersReducedMotion, que leen los otros scripts
//  - el año del footer
// La lógica de cada parte de la página vive en su propio archivo en /js
// (reveal.js, nav-toggle.js, facts-tabs.js, gallery-filter.js, lightbox.js,
// accordion.js, copy-handle.js).

document.documentElement.classList.add("js");

window.Won = {
  prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
};

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
