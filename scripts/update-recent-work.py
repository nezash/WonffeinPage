#!/usr/bin/env python3
"""Trae las 4 comisiones más recientes del portafolio público de Won en VGen.

- Pide la lista a la API pública de VGen (la misma que usa vgen.co/Wonffein/portfolio).
- Se queda con las que son comisiones, tienen imagen verificada y no traen advertencias de contenido
  (salvo "revealing", que se permite: escote o ropa atrevida, nada explícito), ordenadas de la más nueva
  a la más vieja (campo "created").
- Descarga cada imagen a assets/recent/ (la página no depende de que VGen deje enlazar sus imágenes).
- Escribe js/recent-work-data.js, que es lo que lee la tira "Made for lovely clients".

Si VGen falla o cambia el formato, el script termina con error y NO toca nada (la tira queda como estaba).
Solo usa la librería estándar de Python. Uso:  python scripts/update-recent-work.py
"""

import json
import re
import sys
import urllib.request
from pathlib import Path

USER_ID = "e53570eb-cdda-4a51-8e77-c2ec59c33e22"
API = (
    "https://api.vgen.co/discoverability/portfolio/showcases/" + USER_ID
    + "?verifyAge=true&isDraftExcluded=true&showOnlyCommissions=true&limit=20"
)
HOW_MANY = 4
# Advertencias de VGen que NO bloquean una pieza. Cualquier otra advertencia en verdadero la deja fuera de la página.
ALLOWED_WARNINGS = {"revealing"}
ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / "assets" / "recent"
DATA_FILE = ROOT / "js" / "recent-work-data.js"
HEADERS = {"User-Agent": "WonffeinPage-updater/1.0 (+https://github.com/nezash/WonffeinPage)"}


def get(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read()


def main():
    payload = json.loads(get(API))
    showcases = payload["showcases"]

    picked = []
    for item in sorted(showcases, key=lambda s: s.get("created", ""), reverse=True):
        if not item.get("commissionID"):
            continue
        warnings = item.get("contentWarnings") or {}
        if any(on for name, on in warnings.items() if on and name not in ALLOWED_WARNINGS):
            continue  # se saltan las piezas con otras advertencias (todo lo que no sea "revealing")
        images = [i for i in item.get("showcaseItems", []) if i.get("type") == "IMAGE" and i.get("isVerified")]
        if not images or not item.get("showcaseID"):
            continue
        picked.append((item, images[0]["url"]))
        if len(picked) == HOW_MANY:
            break

    if not picked:
        sys.exit("No se encontró ninguna comisión con imagen; no se cambió nada.")

    IMG_DIR.mkdir(parents=True, exist_ok=True)
    entries, keep = [], set()
    for item, url in picked:
        sid = item["showcaseID"]
        if not re.fullmatch(r"[0-9a-f-]{36}", sid):
            sys.exit("showcaseID con formato raro: " + sid)
        dest = IMG_DIR / (sid + ".webp")
        if not dest.exists():
            dest.write_bytes(get(url))
        keep.add(dest.name)
        entries.append({
            "img": "assets/recent/" + dest.name,
            "url": "https://vgen.co/portfolio/" + sid,
            "alt": "Commission I made: " + item.get("title", "").strip(),
        })

    for old in IMG_DIR.glob("*.webp"):
        if old.name not in keep:
            old.unlink()

    header = (
        "// Generado por scripts/update-recent-work.py (no editar a mano: se reescribe solo).\n"
        "// Las 4 comisiones más recientes de VGen, de la más nueva a la más vieja.\n"
    )
    DATA_FILE.write_text(header + "window.RECENT_WORK = " + json.dumps(entries, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    print("Listo:", ", ".join(e["alt"] for e in entries))


if __name__ == "__main__":
    main()
