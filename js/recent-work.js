// Tira "Made for lovely clients": si window.RECENT_WORK (js/recent-work-data.js) trae piezas,
// las pone en los 4 espacios de la tira, cada una con enlace a su página en VGen.
// Sin datos no hace nada: se quedan los espacios pendientes.

(function () {
  var items = window.RECENT_WORK;
  if (!Array.isArray(items) || items.length === 0) return;

  var slots = document.querySelectorAll(".recent-work .art-slot");
  Array.prototype.forEach.call(slots, function (slot, i) {
    var item = items[i];
    if (!item || !item.img) return;

    var link = document.createElement("a");
    link.className = "recent-work__link";
    link.href = item.url || "https://vgen.co/Wonffein/portfolio";
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    var img = document.createElement("img");
    img.src = item.img;
    img.alt = item.alt || "A recent commission I made";
    img.loading = "lazy";
    img.referrerPolicy = "no-referrer"; // algunos servidores de imágenes rechazan pedidos con referer de otro sitio

    link.appendChild(img);
    slot.className = "art-slot art-slot--filled";
    slot.textContent = "";
    slot.appendChild(link);
  });
})();
