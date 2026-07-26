(() => {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const boot = () => {
    document.body.classList.add("is-ready");
  };

  if (reduceMotion) {
    boot();
    return;
  }

  if (document.readyState === "complete") {
    requestAnimationFrame(boot);
  } else {
    window.addEventListener("load", () => requestAnimationFrame(boot), { once: true });
  }
})();
