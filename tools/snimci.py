"""Full-page snimci sajta preko CDP-a.

Chrome --screenshot slika samo viewport, pa bi visok --window-size pokvario
sve što koristi svh jedinice. Zato se viewport postavlja na realnu visinu, a
snimak se pravi sa captureBeyondViewport.
"""

import base64
import json
import subprocess
import sys
import time
import urllib.request

import websocket

PORT = 9350
BASE = "http://127.0.0.1:3210"
OUT = "/tmp/shots/site"

SNIMCI = [
    ("home-desktop", 1440, 900, "/", True),
    ("home-laptop", 1024, 768, "/", True),
    ("home-mobile", 390, 844, "/", True),
    ("home-mobile-small", 320, 640, "/", True),
    ("usluge-desktop", 1440, 900, "/usluge", True),
    ("usluge-mobile", 390, 844, "/usluge", True),
    ("radovi-desktop", 1440, 900, "/radovi", True),
    ("kontakt-desktop", 1440, 900, "/kontakt", True),
    ("hero-desktop", 1440, 900, "/", False),
    ("hero-mobile", 390, 844, "/", False),
]


def start_chrome():
    subprocess.Popen(
        ["google-chrome", "--headless=new", "--disable-gpu", "--no-sandbox",
         f"--remote-debugging-port={PORT}", "--remote-allow-origins=*",
         "--user-data-dir=/tmp/chr-cdp-shots", "--hide-scrollbars",
         "--force-device-scale-factor=1", "about:blank"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
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
        self.ws = websocket.create_connection(
            page["webSocketDebuggerUrl"], timeout=120,
            origin="", suppress_origin=True,
        )
        self.n = 0
        self.send("Page.enable")
        self.send("Runtime.enable")

    def send(self, method, **params):
        self.n += 1
        self.ws.send(json.dumps({"id": self.n, "method": method, "params": params}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == self.n:
                return msg

    def ev(self, expr):
        r = self.send("Runtime.evaluate", expression=expr,
                      returnByValue=True, awaitPromise=True)
        return r.get("result", {}).get("result", {}).get("value")


def snap(tab, name, w, h, path, full):
    tab.send("Emulation.setDeviceMetricsOverride",
             width=w, height=h, deviceScaleFactor=1,
             mobile=w < 700, screenWidth=w, screenHeight=h)
    tab.send("Page.navigate", url=f"{BASE}{path}")
    time.sleep(3.5)

    if full:
        # skrol do dna da se ispale svi IntersectionObserver-i, pa vrati na vrh
        # prolazak kroz celu stranu, da svaki reveal stigne da se dovrši
        tab.ev("""(async () => {
          const step = window.innerHeight * 0.55;
          const h = () => Math.max(document.body.scrollHeight,
                                   document.documentElement.scrollHeight);
          for (let y = 0; y < h(); y += step) {
            window.scrollTo(0, y);
            await new Promise(r => setTimeout(r, 320));
          }
          window.scrollTo(0, h());
          await new Promise(r => setTimeout(r, 900));
          window.scrollTo(0, 0);
          await new Promise(r => setTimeout(r, 1200));
        })()""")
        # provera da nijedan reveal nije ostao skriven
        skriveni = tab.ev(
            "document.querySelectorAll('.otkrij:not([data-vidljivo=\"true\"])').length")
        if skriveni:
            print(f"    (još {skriveni} skrivenih, dodatno čekanje)")
            time.sleep(2.5)

    args = {"format": "png", "captureBeyondViewport": bool(full)}
    if full:
        height = tab.ev("Math.ceil(Math.max(document.body.scrollHeight, document.documentElement.scrollHeight))") or h
        args["clip"] = {"x": 0, "y": 0, "width": w,
                        "height": min(int(height), 24000), "scale": 1}
    r = tab.send("Page.captureScreenshot", **args)
    data = r.get("result", {}).get("data")
    if not data:
        print(f"  ! {name}: nema podataka")
        return
    with open(f"{OUT}/{name}.png", "wb") as f:
        f.write(base64.b64decode(data))
    print(f"  {name}.png  {w}x{args.get('clip', {}).get('height', h)}")


def main():
    if not start_chrome():
        print("Chrome se nije pokrenuo")
        sys.exit(1)
    tab = Tab()
    for name, w, h, path, full in SNIMCI:
        snap(tab, name, w, h, path, full)
    tab.ws.close()


if __name__ == "__main__":
    main()
