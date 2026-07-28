# AGENTS.md

## Cursor Cloud specific instructions

This repo is a zero-dependency static site (no package manager, build step, or backend). There is nothing to install beyond a static file server; Python 3 is preinstalled on the VM.

### Services

- `landing-page/` — production "coming soon" site (the primary product). Serve it with a static server:
  ```bash
  cd landing-page && python3 -m http.server 8080
  ```
  Then open `http://localhost:8080`.
- `examples/example_01.html` — a standalone design/brand proposal document (not deployed). Serve with `python3 -m http.server` from `examples/` if you want to view it.

### Notes

- There is no lint, test, or build tooling in this repo. "Running" the app means serving the static files and viewing them in a browser.
- External assets (Google Fonts, Unsplash background image) load from CDNs and are optional — the page renders with local fallbacks if the network is unavailable.
- Prefer serving over `http://` rather than opening via `file://`, since relative paths and CDN preconnect behave more consistently over HTTP.
