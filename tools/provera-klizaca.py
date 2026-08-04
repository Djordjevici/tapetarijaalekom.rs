"""Provera pre/posle klizača: prikaz, tastatura i vučenje.

Klizač je najvažniji interaktivni deo sajta, pa se ne proverava samo pogledom
nego i simulacijom stvarnog unosa.
"""

import base64
import json
import subprocess
import time
import urllib.request

import websocket

PORT = 9360
BASE = "http://127.0.0.1:3211"
OUT = "/tmp/shots/site"


def start_chrome():
    subprocess.Popen(
        ["google-chrome", "--headless=new", "--disable-gpu", "--no-sandbox",
         f"--remote-debugging-port={PORT}", "--remote-allow-origins=*",
         "--user-data-dir=/tmp/chr-ba", "--hide-scrollbars",
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
        r = self.send("Runtime.evaluate", expression=e,
                      returnByValue=True, awaitPromise=True)
        res = r.get("result", {})
        if "exceptionDetails" in res:
            return {"greska": str(res["exceptionDetails"])[:200]}
        return res.get("result", {}).get("value")

    def shot(self, name, clip=None):
        args = {"format": "png"}
        if clip:
            args["clip"] = {**clip, "scale": 1}
            args["captureBeyondViewport"] = True
        r = self.send("Page.captureScreenshot", **args)
        d = r.get("result", {}).get("data")
        if d:
            with open(f"{OUT}/{name}.png", "wb") as f:
                f.write(base64.b64decode(d))
            print(f"  snimljeno {name}.png")


def main():
    if not start_chrome():
        print("Chrome nije startovao")
        return
    tab = Tab()
    tab.send("Emulation.setDeviceMetricsOverride", width=1440, height=900,
             deviceScaleFactor=1, mobile=False)
    tab.send("Page.navigate", url=BASE)
    time.sleep=getattr(time, "sleep")
    time.sleep(6)

    # dovedi sekciju u vidno polje i pusti demonstraciju
    tab.ev("document.getElementById('radovi').scrollIntoView({block:'center'})")
    time.sleep(3.0)

    info = tab.ev("""(() => {
      const s = document.querySelector('[role=slider]');
      if (!s) return {nasao: false};
      const r = s.getBoundingClientRect();
      const okvir = s.parentElement.getBoundingClientRect();
      return {
        nasao: true,
        valuenow: s.getAttribute('aria-valuenow'),
        valuetext: s.getAttribute('aria-valuetext'),
        tabindex: s.getAttribute('tabindex'),
        cx: Math.round(r.left + r.width/2),
        cy: Math.round(r.top + r.height/2),
        okvirLeft: Math.round(okvir.left),
        okvirTop: Math.round(okvir.top),
        okvirW: Math.round(okvir.width),
        okvirH: Math.round(okvir.height),
      };
    })()""")
    print("  klizač:", json.dumps(info, ensure_ascii=False))
    if not isinstance(info, dict) or not info.get("nasao"):
        return

    sekcija = tab.ev("""(() => {
      const r = document.getElementById('radovi').getBoundingClientRect();
      return {x:0, y: Math.round(r.top + window.scrollY),
              width: 1440, height: Math.round(r.height)};
    })()""")
    tab.shot("pre-posle-sekcija", sekcija)

    # tastatura: fokus, pa strelice
    tab.ev("document.querySelector('[role=slider]').focus()")
    for _ in range(6):
        tab.send("Input.dispatchKeyEvent", type="keyDown", key="ArrowRight",
                 code="ArrowRight", windowsVirtualKeyCode=39)
        tab.send("Input.dispatchKeyEvent", type="keyUp", key="ArrowRight",
                 code="ArrowRight", windowsVirtualKeyCode=39)
        time.sleep(0.12)
    posle_strelica = tab.ev(
        "document.querySelector('[role=slider]').getAttribute('aria-valuenow')")
    print(f"  posle 6x strelica desno (korak 2): {posle_strelica}")

    tab.send("Input.dispatchKeyEvent", type="keyDown", key="Home", code="Home",
             windowsVirtualKeyCode=36)
    tab.send("Input.dispatchKeyEvent", type="keyUp", key="Home", code="Home",
             windowsVirtualKeyCode=36)
    time.sleep(0.3)
    print("  posle Home:", tab.ev(
        "document.querySelector('[role=slider]').getAttribute('aria-valuenow')"))

    tab.send("Input.dispatchKeyEvent", type="keyDown", key="End", code="End",
             windowsVirtualKeyCode=35)
    tab.send("Input.dispatchKeyEvent", type="keyUp", key="End", code="End",
             windowsVirtualKeyCode=35)
    time.sleep(0.3)
    print("  posle End:", tab.ev(
        "document.querySelector('[role=slider]').getAttribute('aria-valuenow')"))

    # vučenje mišem na 30% širine okvira
    cilj_x = info["okvirLeft"] + int(info["okvirW"] * 0.30)
    cilj_y = info["okvirTop"] + int(info["okvirH"] * 0.5)
    tab.send("Input.dispatchMouseEvent", type="mousePressed", x=info["cx"],
             y=info["cy"], button="left", clickCount=1, buttons=1)
    for k in range(1, 9):
        x = info["cx"] + (cilj_x - info["cx"]) * k // 8
        tab.send("Input.dispatchMouseEvent", type="mouseMoved", x=x,
                 y=cilj_y, button="left", buttons=1)
        time.sleep(0.05)
    tab.send("Input.dispatchMouseEvent", type="mouseReleased", x=cilj_x,
             y=cilj_y, button="left", buttons=0)
    time.sleep(0.4)
    print("  posle vučenja na ~30%:", tab.ev(
        "document.querySelector('[role=slider]').getAttribute('aria-valuenow')"))
    tab.shot("pre-posle-vuceno", sekcija)

    # prelazak na drugi projekat
    tab.ev("""(() => {
      const t = document.querySelectorAll('[role=tab]');
      if (t[1]) t[1].click();
    })()""")
    time.sleep(1.2)
    print("  aktivan tab:", tab.ev(
        "document.querySelector('[role=tab][aria-selected=true]')?.textContent"))
    tab.shot("pre-posle-drugi", sekcija)

    # vodoravni overflow na svim širinama
    print("\n  provera vodoravnog prelivanja:")
    for w in (320, 375, 390, 768, 1024, 1440, 1920):
        tab.send("Emulation.setDeviceMetricsOverride", width=w, height=900,
                 deviceScaleFactor=1, mobile=w < 700)
        time.sleep(0.7)
        r = tab.ev("""(() => ({
          doc: document.documentElement.scrollWidth,
          win: window.innerWidth,
          krivci: [...document.querySelectorAll('body *')]
            .filter(e => e.getBoundingClientRect().right > window.innerWidth + 2)
            .slice(0, 4)
            .map(e => e.tagName + '.' + (e.className || '').toString().slice(0, 45))
        }))()""")
        if isinstance(r, dict):
            ok = r["doc"] <= r["win"] + 1
            print(f"    {w:5}px  doc={r['doc']:5} win={r['win']:5} "
                  f"{'OK' if ok else 'PRELIVA'}")
            if r.get("krivci"):
                for c in r["krivci"]:
                    print(f"           {c}")

    tab.ws.close()


if __name__ == "__main__":
    main()
