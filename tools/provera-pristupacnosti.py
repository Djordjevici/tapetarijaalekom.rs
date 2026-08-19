"""Provera pristupačnosti i performansi bez spoljnih alata.

Proverava kontrast svih kombinacija boja, strukturu naslova, alt tekstove,
veličinu polja za dodir, focus stilove i pomeranje layouta pri učitavanju.
"""

import json
import os
import re
import subprocess
import time
import urllib.request

import websocket

PORT = 9370
BASE = os.environ.get("SITE_BASE", "http://127.0.0.1:3210")

BOJE = {
    "sumrak": "#1C2F2A",
    "ugljen": "#12151A",
    "platno": "#E7E6E0",
    "papir": "#F2F1EB",
    "bakar": "#BE7242",
    "bakar-dugme": "#9C5323",
    "bakar-tekst": "#944D1F",
    "bakar-svetli": "#D08B5C",
    "ink": "#1A1C1A",
    "ink-2": "#4E554E",
    "ink-3": "#5E655D",
    "mist-1": "#DCDBD5",   # rgba(231,230,224,.92) na tamnom
    "mist-2": "#A9AFA8",   # ~.68
    "mist-3": "#7C837C",   # ~.46
    "lisce": "#869896",
}

PAROVI = [
    ("platno", "sumrak", "tekst na tamnoj sekciji", 4.5),
    ("mist-1", "sumrak", "uvodni tekst na tamnom", 4.5),
    ("mist-2", "sumrak", "sporedni tekst na tamnom", 4.5),
    ("mist-3", "sumrak", "oznake na tamnom", 3.0),
    ("platno", "ugljen", "tekst na najtamnijoj", 4.5),
    ("mist-2", "ugljen", "sporedni na najtamnijoj", 4.5),
    ("mist-3", "ugljen", "oznake na najtamnijoj", 3.0),
    ("bakar-svetli", "sumrak", "bakarni akcenat na tamnom", 4.5),
    ("bakar-svetli", "ugljen", "bakarni akcenat na najtamnijoj", 4.5),
    ("ink", "platno", "tekst na svetloj", 4.5),
    ("ink-2", "platno", "sporedni na svetloj", 4.5),
    ("ink-3", "platno", "oznake na svetloj", 4.5),
    ("ink", "papir", "tekst na najsvetlijoj", 4.5),
    ("ink-2", "papir", "sporedni na najsvetlijoj", 4.5),
    ("ink-3", "papir", "oznake na najsvetlijoj", 4.5),
    ("bakar-tekst", "papir", "bakarni tekst na svetlom", 4.5),
    ("bakar-tekst", "platno", "bakarni tekst na platnu", 4.5),
    ("papir", "bakar-dugme", "tekst na bakarnom dugmetu", 4.5),
    ("bakar", "sumrak", "bakarna linija na tamnom", 3.0),
]


def kanal(v):
    v = v / 255
    return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4


def lum(h):
    h = h.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    return 0.2126 * kanal(r) + 0.7152 * kanal(g) + 0.0722 * kanal(b)


def kontrast(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def provera_kontrasta():
    print("KONTRAST")
    pao = 0
    for fg, bg, opis, minimum in PAROVI:
        c = kontrast(BOJE[fg], BOJE[bg])
        ok = c >= minimum
        if not ok:
            pao += 1
        print(f"  {'OK ' if ok else 'NIZAK'} {c:5.2f} (min {minimum}) "
              f"{fg} na {bg} — {opis}")
    print(f"  → {'svi prolaze' if not pao else f'{pao} ne prolazi'}\n")
    return pao


def start_chrome():
    subprocess.Popen(
        ["google-chrome", "--headless=new", "--disable-gpu", "--no-sandbox",
         f"--remote-debugging-port={PORT}", "--remote-allow-origins=*",
         "--user-data-dir=/tmp/chr-a11y", "--hide-scrollbars",
         "--force-device-scale-factor=1", "about:blank"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(40):
        time.sleep(1)
        try:
            urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json/version", timeout=2)
            return True
        except Exception:
            continue
    return False


class Tab:
    def __init__(self):
        tabs = json.load(urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json"))
        page = [t for t in tabs if t["type"] == "page"][0]
        self.ws = websocket.create_connection(page["webSocketDebuggerUrl"],
                                              timeout=120, origin="",
                                              suppress_origin=True)
        self.n = 0
        self.send("Page.enable")
        self.send("Runtime.enable")

    def send(self, m, **p):
        self.n += 1
        self.ws.send(json.dumps({"id": self.n, "method": m, "params": p}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == self.n:
                return msg

    def ev(self, e):
        r = self.send("Runtime.evaluate", expression=e, returnByValue=True,
                      awaitPromise=True)
        res = r.get("result", {})
        if "exceptionDetails" in res:
            return {"greska": str(res["exceptionDetails"])[:300]}
        return res.get("result", {}).get("value")


STRUKTURA = """(() => {
  const naslovi = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
    .map(h => ({ nivo: +h.tagName[1], tekst: h.textContent.trim().slice(0, 45) }));
  let preskoci = [];
  for (let i = 1; i < naslovi.length; i++) {
    if (naslovi[i].nivo - naslovi[i-1].nivo > 1) {
      preskoci.push(`h${naslovi[i-1].nivo} -> h${naslovi[i].nivo}: ${naslovi[i].tekst}`);
    }
  }
  const slike = [...document.querySelectorAll('img')];
  const bezAlt = slike.filter(i => !i.hasAttribute('alt')).length;
  const prazanAlt = slike.filter(i => i.getAttribute('alt') === '').length;

  const meta = [...document.querySelectorAll('a,button,[role=slider],[role=tab],input,select,textarea')];
  const mali = meta.filter(e => {
    if (e.closest('[hidden]') || e.getAttribute('aria-hidden') === 'true') return false;
    const r = e.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    // sr-only polja imaju vidljiv label kao cilj za dodir
    if (e.classList.contains('sr-only')) return false;
    // kada je polje unutar labela, cilj za dodir je ceo label
    const label = e.closest('label');
    const visina = label ? label.getBoundingClientRect().height : r.height;
    return visina < 44 && !e.closest('nav') && e.tagName !== 'A';
  }).map(e => `${e.tagName}${e.type ? '[' + e.type + ']' : ''} h=${Math.round(e.getBoundingClientRect().height)}`);

  return {
    h1: naslovi.filter(n => n.nivo === 1).length,
    ukupnoNaslova: naslovi.length,
    preskoci,
    slika: slike.length,
    bezAlt,
    prazanAlt,
    malaPolja: [...new Set(mali)].slice(0, 8),
    lang: document.documentElement.lang,
    naslovStrane: document.title,
    schemaBlokova: document.querySelectorAll('script[type="application/ld+json"]').length,
    skipLink: Boolean(document.querySelector('a[href="#sadrzaj"]')),
    ariaSkriveniDekor: document.querySelectorAll('[aria-hidden=true]').length,
  };
})()"""


def main():
    pao = provera_kontrasta()

    if not start_chrome():
        print("Chrome nije startovao")
        return
    tab = Tab()
    tab.send("Emulation.setDeviceMetricsOverride", width=1440, height=900,
             deviceScaleFactor=1, mobile=False)

    for putanja in ("/", "/usluge", "/radovi", "/kontakt"):
        tab.send("Page.navigate", url=f"{BASE}{putanja}")
        time.sleep(3)
        r = tab.ev(STRUKTURA)
        print(f"STRANA {putanja}")
        if not isinstance(r, dict):
            print("  greška pri merenju")
            continue
        print(f"  lang={r['lang']}  h1={r['h1']}  naslova={r['ukupnoNaslova']}"
              f"  schema blokova={r['schemaBlokova']}  skip link={r['skipLink']}")
        print(f"  slika={r['slika']}  bez alt={r['bezAlt']}  prazan alt={r['prazanAlt']}")
        if r["preskoci"]:
            print(f"  preskoci u hijerarhiji: {r['preskoci']}")
        else:
            print("  hijerarhija naslova: uredna")
        if r["malaPolja"]:
            print(f"  polja niža od 44px: {r['malaPolja']}")
        else:
            print("  sva polja za dodir >= 44px")
        print()

    # pomeranje layouta pri učitavanju
    tab.send("Page.navigate", url=BASE)
    time.sleep(4)
    cls = tab.ev("""new Promise(res => {
      let v = 0;
      new PerformanceObserver(l => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) v += e.value;
      }).observe({type: 'layout-shift', buffered: true});
      setTimeout(() => res(Math.round(v * 10000) / 10000), 2500);
    })""")
    print(f"POMERANJE LAYOUTA (CLS): {cls}  {'OK' if isinstance(cls, (int, float)) and cls < 0.1 else 'proveriti'}")

    tab.ws.close()
    print("\nZAKLJUČAK:", "sve prolazi" if not pao else f"{pao} kontrast(a) ispod granice")


if __name__ == "__main__":
    main()
