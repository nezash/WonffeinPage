# Página de Won — plan del proyecto

Página de presentación para Won (vtuber), con foco en mostrar su arte disponible y ofrecer sus comisiones. Sin arte generado por IA — solo piezas reales.

## Stack

HTML + CSS + JS plano. Sin build, sin framework, sin dependencias. Se descartó React + Vite: el sitio es mayormente contenido estático y el dueño del proyecto no tiene experiencia previa con React — un sitio bien hecho en HTML/CSS/JS se ve igual de profesional para este caso, con menos fricción para editar después.

## Estructura de carpetas

```
Pagina Won Nueva/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── assets/
│   └── img/
│       ├── avatar-wave.png    (arte principal / hero)
│       ├── lurk-screen.png    (pantalla de "lurk" para stream, también sirve como pieza de galería)
│       ├── banner-love.png    (banner grande, buen candidato para sección de galería o fondo decorativo)
│       └── emote-sparkle.png  (emote, pieza de galería / detalle decorativo)
└── README.md (este archivo)
```

## Secciones planeadas (una sola página, navegación por anclas)

1. **Hero** — nombre de Won, tagline, avatar-wave.png, links rápidos a redes.
2. **Bio / redes / horario** — quién es Won, links a Twitch/Twitter/YouTube/Discord/etc, horario de streams.
3. **Galería** — las 4 piezas de arte disponibles, pensada para poder agregar más piezas fácilmente después.
4. **Precios de comisiones** — tabla de tipos de arte (ícono, busto, medio cuerpo, cuerpo completo, etc.) con precios. Placeholders hasta tener precios reales.
5. **Términos de comisión** — reglas: qué dibuja / qué no, tiempos de entrega, pago, reembolsos.
6. **FAQ** — preguntas frecuentes.
7. **Contacto / cómo encargar** — instrucciones o formulario para pedir una comisión (a definir: mailto, Discord, o servicio de formularios tipo Formspree si se necesita que funcione sin backend).

Todo el contenido real (nombre, tagline, redes, precios, términos) queda en placeholders `[EDITAR: ...]` hasta que Won confirme los datos.

## Estado

Carpeta y assets ya copiados. Falta construir el HTML/CSS/JS — se hace sección por sección, en el orden de arriba, avisando antes de generar cada una.

Próximo paso: confirmar con qué sección empezar (recomendado: Hero + Bio, porque el resto de la página se apoya en esa estructura base — nav, header, footer, paleta de colores).
