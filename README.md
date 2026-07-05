# The Astrid website

**The site does not describe Astrid. The site runs Astrid.**

This page boots the real kernel, compiled to WebAssembly, in your browser tab.
Every live element on it is driven by real kernel behaviour: real event-bus
deliveries, real capability grants and denials, real audit entries. The
capsules it installs are the same sealed components that run in production.
Open devtools and check.

Live at [unicity-astrid.github.io](https://unicity-astrid.github.io/).

## Layout

| Path | What it is |
|------|------------|
| `site/` | The Astro site (all pages, components, and in-tab runtime glue) |
| `kernel-web/` | wasm-bindgen bridge over the real `astrid-kernel` crate |
| `site-capsules/` | The section capsules the page installs into its own kernel |
| `kernel-smoke/`, `spike/` | Portability proofs that made the above possible |
| `notes/`, `DESIGN.md` | Working design notes, kept honest and public |

## Develop

```sh
cd site
npm ci
npm run dev
```

`npm run build` produces the fully static site in `site/dist/`; deployment is
the Pages workflow in `.github/workflows/pages.yml`. Nothing on the page is
staged and nothing is faked: if a demo cannot run in your browser, it says so.

Astrid itself lives at [unicity-astrid/astrid](https://github.com/unicity-astrid/astrid).
Made by [Unicity](https://www.unicity.ai/).
