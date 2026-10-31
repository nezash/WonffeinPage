# Página de Won — plan del proyecto

Página de presentación para Won (vtuber), con foco en mostrar su arte y ofrecer sus comisiones de forma amigable (no "comercial"). Sin arte generado por IA — solo piezas reales.

## Stack

HTML + CSS + JS plano. Sin build, sin framework, sin dependencias. Abre `index.html` directo en el navegador.

## Estructura

```
Pagina Won Nueva/
├── index.html            (solo estructura y textos)
├── css/                  (un archivo por componente)
│   ├── style.css         base: colores, tipografía, reset, utilidades
│   ├── section.css       franjas de sección, títulos
│   ├── button.css  chip.css  art-slot.css  social.css
│   ├── header.css  hero.css  gallery.css  lightbox.css
│   ├── services.css  recent-work.css  process.css
│   ├── about.css  stream.css  stream-fx.css  section-title.css  contact-fx.css
│   ├── accordion.css  faq.css  terms.css
│   └── contact.css  footer.css  reveal.css
├── js/                   (un archivo por función)
│   ├── main.js           compartido: clase "js", año del footer, reduced-motion
│   ├── reveal.js  nav-toggle.js  facts-tabs.js
│   ├── gallery-filter.js  lightbox.js
│   └── accordion.js  copy-handle.js
├── assets/img/           dibujos de Won
└── svg/                  íconos originales de redes (el HTML usa un sprite con los mismos trazos)
```

## Secciones (una sola página, navegación por anclas)

1. Hero — Won primero (`#inicio`)
2. Galería con filtros (`#gallery`)
3. Comisiones: 3 tarjetas con dibujo de ejemplo + tira "Made for lovely clients" (`#commissions`)
4. Cómo funciona: 4 pasos (`#process`)
5. Sobre Won + stream en vivo (`#about`). Una sola tarjeta "escenario infernal": reproductor de Twitch con marco de monitor, y abajo "Come hang out" con el botón de seguir (Won no tiene horario fijo, así que no se muestran horas). Letras propias del bloque: Pirata One, Bungee y VT323 (ya incluidas en el enlace de Google Fonts). Efectos en `css/stream-fx.css`: borde de fuego, cuernos, chispas, brillo del título y del botón; todo se detiene con "reducir movimiento". La etiqueta de cámara (REC / Camera off) la maneja `js/stream-status.js`: carga el reproductor oficial de Twitch (`Twitch.Player`, sin claves ni servidor) y escucha sus eventos ONLINE/OFFLINE; abierto como archivo (`file://`) o si Twitch no responde, la etiqueta se oculta
6. Dudas frecuentes (`#faq`)
7. Términos de servicio completos, en filas que se abren (`#terms`)
8. Contacto (`#contact`)

## Dibujos: cómo llenar un espacio pendiente

Cada dibujo que falta es un `<figure class="art-slot art-slot--pending" data-slot="N">` con un número **N que coincide con el plano** (hoja "Dibujos que hay que pedir"). Para llenarlo:

1. Guardar la imagen en `assets/img/` (ej. `gallery-fullbody.png`).
2. En ese `<figure>`: cambiar `art-slot--pending` por `art-slot--filled`, borrar el `<div class="art-slot__placeholder">…</div>` y poner `<img src="assets/img/gallery-fullbody.png" alt="descripción">`.
3. Si está dentro de la galería y se quiere que se agrande al hacer clic: reemplazar el `<figure>` por el mismo `<button class="gallery-item__trigger">` que usan las piezas ya puestas (con su `<img>` y su `<span class="gallery-item__caption visually-hidden">`).

### Estado de los dibujos

| # | Dónde va | Estado |
|---|----------|--------|
| 1 | Hero, círculo grande | listo (`avatar-wave.png`) |
| 2 | Hero, sticker flotante | listo (`emote-sparkle.png`) |
| 3 | Galería y cierre de contacto | listo (`banner-love.png`) |
| 4 | Galería | listo (`lurk-screen.png`) |
| 5 | Galería: ilustración de cuerpo completo (vertical 3:4) | **pendiente** |
| 6 | Galería: escena horizontal con fondo (16:9) | **pendiente** |
| 7 | Galería: chibi de un OC (1:1) | **pendiente** |
| 8 | Galería: retrato o busto con render (1:1) | **pendiente** |
| 9 | Galería: boceto o WIP | **pendiente** |
| 10 | Galería: hoja con varios emotes | **pendiente** |
| 11 | Comisiones: ejemplo de Icon | listo |
| 12 | Comisiones: ejemplo de Discord Stamp (PNG sin fondo) | listo |
| 13 | Comisiones: ejemplo de Rendered | listo |
| 14 (a–d) | Tira "Made for lovely clients": 4 comisiones recientes. Se llena desde `js/recent-work-data.js` (ver abajo) | **pendiente** |
| 15–18 | Cómo funciona: 4 mini Wons (mensaje, lápiz, pintando, regalo) | **pendiente** (opcional) |
| 19 | Sobre Won: Won dibujando con su tablet (4:5) | **pendiente** |
| 20 | Dudas frecuentes: mini Won pensando | **pendiente** (opcional) |

## Tira de comisiones recientes (#14)

`js/recent-work.js` pone las piezas de `window.RECENT_WORK` (en `js/recent-work-data.js`) en los 4 espacios de la tira; la lista vacía deja los espacios pendientes.

Esa lista **se genera sola**: `scripts/update-recent-work.py` pide a la API pública de VGen el portafolio de Won, toma las 4 comisiones más nuevas (campo `created`, sin advertencias de contenido), descarga sus imágenes a `assets/recent/` y reescribe `js/recent-work-data.js`. Si VGen falla, no toca nada.

- A mano (con Python instalado): `python scripts/update-recent-work.py` y luego subir los cambios a git.
- Automático: `.github/workflows/update-recent-work.yml` (copia lista en `scripts/update-recent-work.yml`: hay que moverla a `.github/workflows/`) lo corre en GitHub cada 6 horas y hace el commit. Primera vez: en GitHub, pestaña Actions → "Actualizar comisiones recientes" → Run workflow.
- Si VGen cambia el formato de su API, hay que ajustar el script (las claves usadas son `showcases`, `commissionID`, `created`, `showcaseID`, `showcaseItems[].url`, `contentWarnings`).

Las imágenes de las 3 comisiones de ejemplo (#11–13) son copias de 1000 px de `com_icon.jpg`, `discstamp_com.png` y `render_com.jpg` (los originales pesan 1–3 MB y se quedan en la carpeta sin usar): `commission-icon.jpg`, `commission-stamp.png`, `commission-rendered.jpg`.

## Look

- Ambiente oscuro: fondos morados profundos en todo el sitio y letras en lila claro (header y portada con degradado violeta). Todos los colores están en `:root` de `css/style.css`.
- Letras de Google Fonts: **Gloock** (títulos, elegante y un poco dramática) y **Jost** (texto). Para probar otra, se cambia el `<link>` del `<head>` en `index.html` y `--font-display` en `style.css`.
- El precio de cada servicio (`from $20`…) siempre va en la misma línea que el título: la tarjeta es un `container` y el título se encoge a su ancho.

## Pendientes de contenido

- Selector de idioma EN/ES (el sitio está en inglés).
- Si se pasa a dominio propio: sumar otro `&parent=` en el embed de Twitch (`index.html`, sección `#stream`).
- Las descripciones cortas de cada servicio ("A cute chibi for your avatar…") y los textos de "Cómo funciona" son redacción nueva; los precios, listas y términos son los reales de VGen.

## Títulos con estilo propio
- **Hero** (`css/hero.css`): letra Ceviche One (trazo de pincel) con degradado rosa fuerte a violeta y destello que lo cruza. Es único.
- **Stream** (`css/stream.css` / `css/stream-fx.css`): Pirata One gótica con degradado blanco a rosa. Es único.
- **Resto de secciones** (`css/section-title.css`): todas igual — letra Gloock, degradado blanco rosado → rosa → violeta que se desliza, brillo suave y raya que crece. Sin azules, para que combine con el fondo morado. Para cambiar el color de todas, editar `--t1`, `--t2` y `--t3` al inicio de ese archivo.

## Tarjeta de contacto (cierre)
Pensada para entenderse sin leer: dibujo grande inclinado con sello "Order here!", tres pasos cortos y un botón enorme a VGen con color que fluye, destello y flecha que empuja. El Discord queda como botón chico de copiar. Forma en `css/contact.css`, colores y animaciones en `css/contact-fx.css`.
El título "Ready to commission?" es la excepción: letra Outfit (sans firme), con un solo degradado rosa claro → rosa fuerte → violeta en todo el título y sin raya.

## Filas que se abren (FAQ y términos)
`css/accordion.css`: halo lila suave en la fila abierta y el ícono "+" que da media vuelta y pasa a degradado rosa → violeta. Sin movimiento constante.

