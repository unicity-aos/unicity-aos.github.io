#!/usr/bin/env bash
#
# Build, componentize, and jco-transpile the three site section capsules.
#
# For each capsule:
#   1. cargo build --release            (its own .cargo/config.toml picks the
#                                         wasm32-unknown-unknown target)
#   2. wasm-tools component new          (no adapter; must have zero wasi:* imports)
#   3. jco transpile --instantiation async  -> ../site/src/capsules/<name>/
#   4. move the emitted *.core*.wasm to  ../site/public/capsules/<name>/
#      (the page fetches core modules from /capsules/<name>/<file>; the JS's
#       getCoreModule receives just the basename, the page supplies the prefix)
#
# jco is reused from ../spike/node_modules (verified 1.24.6) to avoid a network
# install in the sandbox. wasm-tools 1.250.0 is expected on PATH.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# The global ~/.npm cache is sandbox-blocked; reuse the spike's local cache.
export npm_config_cache="${npm_config_cache:-$SCRIPT_DIR/../spike/.npmcache}"

JCO="$SCRIPT_DIR/../spike/node_modules/.bin/jco"
if [[ ! -x "$JCO" ]]; then
  echo "FATAL: jco not found at $JCO — run 'npm install' in astrid-web/spike first" >&2
  exit 1
fi

SITE_SRC="$SCRIPT_DIR/../site/src/capsules"
SITE_PUB="$SCRIPT_DIR/../site/public/capsules"

CAPSULES=(site-pulse site-guard site-echo)

for cap in "${CAPSULES[@]}"; do
  echo "== $cap =="
  crate_lib="${cap//-/_}" # site-pulse -> site_pulse

  ( cd "$SCRIPT_DIR/$cap" && cargo build --release )

  core="$SCRIPT_DIR/$cap/target/wasm32-unknown-unknown/release/${crate_lib}.wasm"
  comp="$SCRIPT_DIR/$cap/${cap}.component.wasm"
  wasm-tools component new "$core" -o "$comp"

  # Zero-wasi invariant: a wasi:* import is a STOP condition, not something to shim.
  if wasm-tools component wit "$comp" | grep -qi 'import wasi:'; then
    echo "FATAL: $cap imports wasi:* — aborting (must ride only astrid:*)" >&2
    exit 1
  fi

  out_src="$SITE_SRC/$cap"
  out_pub="$SITE_PUB/$cap"
  rm -rf "$out_src"
  mkdir -p "$out_src" "$out_pub"

  "$JCO" transpile "$comp" -o "$out_src" --instantiation async

  # Move core wasm modules out of the JS source tree into public/. The JS keeps
  # only *.js + *.d.ts + interfaces/; core wasm is fetched from /capsules/<name>/.
  rm -f "$out_pub"/*.wasm
  shopt -s nullglob
  for w in "$out_src"/*.wasm; do
    mv "$w" "$out_pub/"
  done
  shopt -u nullglob

  echo "  src ($out_src):"
  ( cd "$out_src" && ls )
  echo "  public ($out_pub):"
  ( cd "$out_pub" && ls )
done

echo
echo "build.sh: OK"
