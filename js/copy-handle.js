// Contacto: copiar el usuario de Discord con un clic. Si el navegador no tiene Clipboard API
// (ej. http sin TLS) no pasa nada: el texto sigue siendo legible, solo no se confirma el copiado.

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const label = button.querySelector(".copy-handle__text");
      const originalText = label ? label.textContent : "";

      try {
        await navigator.clipboard.writeText(button.dataset.copy);
      } catch (err) {
        return;
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
