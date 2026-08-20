// Wonffein — script base.
// Se mantiene mínimo a propósito: acá solo va lo que sirve para TODA la página
// (año del footer, animación de entrada reutilizable). La lógica específica de
// cada sección nueva (galería, formulario de contacto, etc.) se agrega en su
// propio bloque cuando se construya esa sección.

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Animación de aparición al hacer scroll para cualquier elemento con
  // class="reveal" (ver .reveal en style.css). Las secciones futuras solo
  // necesitan agregar esa clase, no hace falta tocar este archivo.
  //
  // A pedido de Nezash, esto ya NO es "una sola vez": cada sección se
  // resetea al salir del viewport (subiendo o bajando) y vuelve a animar
  // su entrada la próxima vez que aparece — antes se usaba unobserve()
  // para que solo pasara una vez, ahora se togglea is-visible en los dos
  // sentidos.
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const revealEls = document.querySelectorAll(".reveal");

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Sección "About": panel de pestañas. Al elegir una pestaña, el contenido
  // activo se desvanece ("summon-out"), se hace el swap real de display a
  // mitad de la animación, y el contenido nuevo aparece ("summon-in").
  // LEAVE_MS tiene que coincidir con la duración de @keyframes summon-out
  // en style.css (.25s).
  const LEAVE_MS = 250;
  const factTabs = document.querySelectorAll(".fact-tab");
  const factStage = document.querySelector(".fact-panel__stage");
  let isSwitchingFact = false;

  function activateFact(tab) {
    if (isSwitchingFact || !factStage) return;

    const targetId = tab.dataset.target;
    const next = document.getElementById(targetId);
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

    if (prefersReducedMotion) {
      swap();
    } else {
      window.setTimeout(swap, LEAVE_MS);
    }
  }

  factTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateFact(tab));

    // Navegación con flechas izquierda/derecha entre pestañas (accesibilidad).
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const dir = event.key === "ArrowRight" ? 1 : -1;
      const nextTab = factTabs[(index + dir + factTabs.length) % factTabs.length];
      nextTab.focus();
      activateFact(nextTab);
    });
  });

  // Galería: lightbox compartido. Se arma la lista de piezas leyendo el DOM
  // (img src/alt + caption de cada .gallery-item__trigger), así que agregar
  // una pieza nueva en el HTML alcanza — no hay que tocar este archivo.
  const galleryTriggers = Array.from(document.querySelectorAll(".gallery-item__trigger"));
  const lightbox = document.getElementById("lightbox");

  if (galleryTriggers.length && lightbox) {
    const items = galleryTriggers.map((trigger) => {
      const img = trigger.querySelector("img");
      const caption = trigger.querySelector(".gallery-item__caption");
      return {
        src: img ? img.getAttribute("src") : "",
        alt: img ? img.getAttribute("alt") : "",
        caption: caption ? caption.textContent : "",
      };
    });

    const lightboxImage = lightbox.querySelector(".lightbox__image");
    const lightboxCaption = lightbox.querySelector(".lightbox__caption");
    const prevBtn = lightbox.querySelector(".lightbox__nav--prev");
    const nextBtn = lightbox.querySelector(".lightbox__nav--next");

    let activeIndex = 0;
    let lastFocused = null;

    function renderLightbox() {
      const item = items[activeIndex];
      lightboxImage.src = item.src;
      lightboxImage.alt = item.alt;
      lightboxCaption.textContent = item.caption;
    }

    function openLightbox(index, triggerEl) {
      activeIndex = index;
      lastFocused = triggerEl || document.activeElement;
      renderLightbox();
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      lightbox.querySelector(".lightbox__close").focus();
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    function showNext(dir) {
      activeIndex = (activeIndex + dir + items.length) % items.length;
      renderLightbox();
    }

    galleryTriggers.forEach((trigger, index) => {
      trigger.addEventListener("click", () => openLightbox(index, trigger));
    });

    lightbox.querySelectorAll("[data-close]").forEach((el) => {
      el.addEventListener("click", closeLightbox);
    });

    prevBtn.addEventListener("click", () => showNext(-1));
    nextBtn.addEventListener("click", () => showNext(1));

    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") showNext(1);
      if (event.key === "ArrowLeft") showNext(-1);
    });
  }

  // Accordion genérico: usado por Términos de comisión y por FAQ. Cada
  // ítem es independiente (se pueden tener varios abiertos a la vez) — el
  // panel anima su alto vía CSS (grid-template-rows 0fr -> 1fr), acá solo
  // se togglea la clase y los atributos aria-expanded / aria-hidden.
  function setupAccordion(triggerSelector) {
    document.querySelectorAll(triggerSelector).forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const panel = document.getElementById(trigger.getAttribute("aria-controls"));
        if (!panel) return;

        const isOpen = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", String(!isOpen));
        panel.classList.toggle("is-open", !isOpen);
        panel.setAttribute("aria-hidden", String(isOpen));
      });
    });
  }

  setupAccordion(".terms-item__trigger");
  setupAccordion(".faq-item__trigger");

  // Efecto "tilt" + brillo que sigue el cursor, en las pricing cards y en
  // la galería. Solo en dispositivos con mouse real (hover: hover) y sin
  // prefers-reduced-motion — en touch/mobile no se agrega ningún listener,
  // esas cards se quedan con su hover normal de CSS.
  const supportsTilt =
    !prefersReducedMotion &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function enableTilt(el, { maxTilt = 8, lift = -6, resetTransition } = {}) {
    el.addEventListener("mouseenter", () => {
      el.classList.add("is-tilting");
      el.style.transition = "transform .05s linear";
    });

    el.addEventListener("mousemove", (event) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - py) * maxTilt * 2;

      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
      el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${lift}px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.classList.remove("is-tilting");
      el.style.transition = resetTransition || "";
      el.style.transform = "";
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
    });
  }

  if (supportsTilt) {
    document.querySelectorAll(".pricing-card").forEach((el) => {
      enableTilt(el, { maxTilt: 5, lift: -6, resetTransition: "transform .3s ease, box-shadow .3s ease" });
    });

    document.querySelectorAll(".gallery-item__trigger").forEach((el) => {
      enableTilt(el, {
        maxTilt: 9,
        lift: -6,
        resetTransition: "transform .3s ease, box-shadow .3s ease, border-color .3s ease",
      });
    });
  }

  // Contacto: copiar el handle de Discord con un click en vez de dejarlo
  // como texto suelto. Fallback silencioso si el navegador no tiene
  // Clipboard API (ej. http sin TLS) — el texto sigue siendo legible igual.
  const copyButtons = document.querySelectorAll("[data-copy]");

  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.dataset.copy;
      const label = button.querySelector(".contact-card__copy-text");
      const originalText = label ? label.textContent : "";

      try {
        await navigator.clipboard.writeText(value);
      } catch (err) {
        return; // sin Clipboard API disponible: no rompemos nada, solo no confirmamos el copiado.
      }

      button.classList.add("is-copied");
      if (label) label.textContent = "Copied!";

      window.setTimeout(() => {
        button.classList.remove("is-copied");
        if (label) label.textContent = originalText;
      }, 1600);
    });
  });
});
