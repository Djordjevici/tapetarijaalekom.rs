"""CDP provera internih navigacionih odredišta i skrola."""
import json
import os
import subprocess
import sys
import time
import urllib.request

import websocket

PORT = 9372
BASE = os.environ.get("SITE_BASE", "http://127.0.0.1:3210").rstrip("/")
EXPECT_WORKS = os.environ.get("EXPECT_HOME_RADOVI", "true").lower() == "true"


def start_chrome():
    subprocess.Popen([
        "google-chrome", "--headless=new", "--disable-gpu", "--no-sandbox",
        f"--remote-debugging-port={PORT}", "--remote-allow-origins=*",
        "--user-data-dir=/tmp/chr-navigation", "--hide-scrollbars", "about:blank",
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(40):
        time.sleep(.5)
        try:
            urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json/version", timeout=1)
            return True
        except Exception:
            pass
    return False


class Tab:
    def __init__(self):
        tabs = json.load(urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json"))
        page = next(t for t in tabs if t["type"] == "page")
        self.ws = websocket.create_connection(page["webSocketDebuggerUrl"], timeout=30,
                                               origin="", suppress_origin=True)
        self.n = 0
        self.send("Page.enable")
        self.send("Runtime.enable")

    def send(self, method, **params):
        self.n += 1
        self.ws.send(json.dumps({"id": self.n, "method": method, "params": params}))
        while True:
            message = json.loads(self.ws.recv())
            if message.get("id") == self.n:
                return message

    def js(self, expression):
        result = self.send("Runtime.evaluate", expression=expression, returnByValue=True,
                           awaitPromise=True).get("result", {})
        if "exceptionDetails" in result:
            raise RuntimeError(str(result["exceptionDetails"])[:400])
        return result.get("result", {}).get("value")

    def goto(self, path):
        self.send("Page.navigate", url=BASE + path)
        time.sleep(2)


def assert_true(value, message):
    if not value:
        raise AssertionError(message)


def target_state(tab, path, fragment):
    tab.goto(path + "#" + fragment)
    return tab.js("""(() => {
      const id = decodeURIComponent(location.hash.slice(1));
      const nodes = [...document.querySelectorAll('[id]')].filter(n => n.id === id);
      const target = nodes[0];
      const header = document.querySelector('header');
      if (!target || !header) return { count: nodes.length };
      const rect = target.getBoundingClientRect();
      const style = getComputedStyle(target.querySelector('.otkrij') || target);
      return { count: nodes.length, top: rect.top, header: header.getBoundingClientRect().bottom,
        visible: style.opacity !== '0', path: location.pathname, hash: location.hash };
    })()""")


def check_target(tab, path, fragment):
    state = target_state(tab, path, fragment)
    assert_true(state.get("count") == 1, f"{path}#{fragment}: ID nije jedinstven")
    assert_true(state.get("path") == path and state.get("hash") == "#" + fragment,
                f"{path}#{fragment}: pogrešno odredište")
    assert_true(state.get("top", -1) >= state.get("header", 0) - 1,
                f"{path}#{fragment}: meta je ispod headera")
    assert_true(state.get("visible"), f"{path}#{fragment}: sadržaj mete nije vidljiv")


def check_static(tab):
    tab.goto("/")
    result = tab.js("""(() => {
      const badBlank = [...document.querySelectorAll('a[target="_blank"]')]
        .filter(a => !/\\bnoopener\\b/.test(a.rel) || !/\\bnoreferrer\\b/.test(a.rel));
      const rootAnchors = [...document.querySelectorAll('a[href^="/"]')]
        .filter(a => !a.closest('header') && !a.closest('footer'));
      return { badBlank: badBlank.map(a => a.href), rootAnchors: rootAnchors.map(a => a.getAttribute('href')) };
    })()""")
    assert_true(not result["badBlank"], "_blank eksterni link nema noopener/noreferrer")


def check_radovi_click(tab):
    tab.goto("/")
    if not EXPECT_WORKS:
        href = tab.js("document.querySelector('header nav a[href=" + json.dumps("/radovi") + "]')?.getAttribute('href')")
        assert_true(href == "/radovi", "Radovi mora voditi na /radovi bez početnih projekata")
        return
    tab.js("window.scrollTo(0, document.body.scrollHeight); window.__scrolls=[]; addEventListener('scroll', () => __scrolls.push(scrollY), {passive:true});")
    tab.js("document.querySelector('header nav a[href=" + json.dumps("/#radovi") + "]').click()")
    time.sleep(2)
    result = tab.js("({hash: location.hash, values: __scrolls, y: scrollY})")
    assert_true(result["hash"] == "#radovi" and result["y"] > 0, "Radovi klik nije stigao do mete")
    assert_true(not any(y == 0 for y in result["values"]), "Radovi klik je prvo skrolovao na vrh")


def check_logo(tab):
    tab.goto("/#kontakt")
    tab.js("window.scrollTo({top: 500, behavior: 'instant'}); document.querySelector('header a[href=" + json.dumps("/") + "]').click()")
    time.sleep(1)
    state = tab.js("({path:location.pathname, hash:location.hash, y:scrollY})")
    assert_true(state["path"] == "/" and not state["hash"] and state["y"] == 0,
                "logo na početnoj ne vraća na vrh")
    tab.goto("/usluge")
    before = tab.js("""(() => {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
      const logo = document.querySelector('header a[href="/"]');
      document.addEventListener('click', event => event.preventDefault(), { once: true });
      logo.dispatchEvent(new MouseEvent('click', {
        bubbles: true, cancelable: true, ctrlKey: true, button: 0,
      }));
      return scrollY;
    })()""")
    assert_true(before > 0 and tab.js("scrollY") == before,
                "modifikovan klik logotipa menja trenutni skrol")


def run_viewport(tab, width, height):
    tab.send("Emulation.setDeviceMetricsOverride", width=width, height=height,
             deviceScaleFactor=1, mobile=width < 600)
    for fragment in ("usluge", "o-nama", "procena", "kontakt"):
        check_target(tab, "/", fragment)
    if EXPECT_WORKS:
        check_target(tab, "/", "radovi")
    else:
        tab.goto("/")
        assert_true(tab.js("document.querySelectorAll('#radovi').length") == 0,
                    "početna bez projekata ipak ima radovi ID")
    for slug in ("presvlacenje-namestaja", "kozni-namestaj", "poslovni-enterijeri",
                 "sivenje-i-izrada-po-meri", "stilski-i-zahtevni-komadi",
                 "bastenski-moto-i-nauticki-program"): 
        check_target(tab, "/usluge", slug)
    check_target(tab, "/kontakt", "procena")
    check_radovi_click(tab)
    check_logo(tab)
    print(f"PASS {width}x{height}")


def main():
    if not start_chrome():
        raise RuntimeError("Chrome nije startovao")
    tab = Tab()
    try:
        check_static(tab)
        run_viewport(tab, 1440, 900)
        run_viewport(tab, 390, 844)
        print("NAVIGACIJA: sve provere prolaze")
    finally:
        tab.ws.close()


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print("NAVIGACIJA: PAO —", error)
        sys.exit(1)
