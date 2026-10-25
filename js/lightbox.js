// Visor de la galería: un solo overlay compartido (#lightbox). Lee las piezas desde el DOM
// (img + caption de cada .gallery-item__trigger), así que agregar un dibujo nuevo en el HTML
// alcanza — no hay que tocar este archivo. Respeta el filtro activo (solo recorre las visibles).

document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  const lightboxImage = lightbox.querySelector(".lightbox__image");
  const lightboxCaption = lightbox.querySelector(".lightbox__caption");
  const prevBtn = lightbox.querySelector(".lightbox__nav--prev");
  const nextBtn = lightbox.querySelector(".lightbox__nav--next");

  let items = [];
  let activeIndex = 0;
  let lastFocused = null;

  function collectItems() {
    return Array.from(
      document.querySelectorAll(".gallery-item:not([hidden]) .gallery-item__trigger")
    ).map((trigger) => {
      const img = trigger.querySelector("img");
      const caption = trigger.querySelector(".gallery-item__caption");
      return {
        trigger,
        src: img ? img.getAttribute("src") : "",
        alt: img ? img.getAttribute("alt") : "",
        caption: caption ? caption.textContent : "",
      };
    });
  }

  function render() {
    const item = items[activeIndex];
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;
    lightboxCaption.textContent = item.caption;
  }

  function open(trigger) {
    items = collectItems();
    activeIndex = Math.max(0, items.findIndex((item) => item.trigger === trigger));
    lastFocused = trigger;
    render();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    lightbox.querySelector(".lightbox__close").focus();
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  function step(dir) {
    activeIndex = (activeIndex + dir + items.length) % items.length;
    render();
  }

  document.querySelectorAll(".gallery-item__trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => open(trigger));
  });

  lightbox.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", close));
  prevBtn.addEventListener("click", () => step(-1));
  nextBtn.addEventListener("click", () => step(1));

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  });
});
