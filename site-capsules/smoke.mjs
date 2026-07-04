// smoke.mjs — the verification gate for the three site section capsules.
//
// For each transpiled capsule: instantiate it with the spike's stub host,
// call astridInstall() if present, drive the hook via astridHookTrigger, and
// assert on the host-call journal. Prints PASS/FAIL per assertion and exits
// non-zero on any failure.
//
//   node smoke.mjs      (run from site-capsules/)

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createHost } from "../spike/host-stubs.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const SRC = join(here, "..", "site", "src", "capsules");
const PUB = join(here, "..", "site", "public", "capsules");

const enc = (obj) =>
  new TextEncoder().encode(typeof obj === "string" ? obj : JSON.stringify(obj));

let failures = 0;
function check(name, cond, detail = "") {
  const ok = !!cond;
  if (!ok) failures++;
  console.log(`  [${ok ? "PASS" : "FAIL"}] ${name}${!ok && detail ? ` — ${detail}` : ""}`);
}

// Instantiate a transpiled capsule against a fresh stub host.
async function load(name) {
  const mod = await import(join(SRC, name, `${name}.component.js`));
  const { imports, journal } = createHost();
  const getCoreModule = async (path) =>
    WebAssembly.compile(await readFile(join(PUB, name, path)));
  const root = await mod.instantiate(getCoreModule, imports);
  if (typeof root.astridInstall === "function") root.astridInstall();
  return { root, journal };
}

// All publishes to `topic`, newest last, payloads parsed from JSON.
const publishesTo = (journal, topic) =>
  journal
    .filter((e) => e.fn === "publish" && e.args[0] === topic)
    .map((e) => JSON.parse(e.args[1]));

const anySitePublishCount = (journal) =>
  journal.filter((e) => e.fn === "publish" && String(e.args[0]).startsWith("site.")).length;

async function testPulse() {
  console.log("\n== site-pulse ==");
  const { root, journal } = await load("site-pulse");
  root.astridHookTrigger("handle_tick", enc({ n: 7 }));
  root.astridHookTrigger("handle_tick", enc({ n: 7 }));

  const routes = publishesTo(journal, "site.v1.demo.route");
  check("two publishes to site.v1.demo.route", routes.length === 2, `got ${routes.length}`);
  const second = routes[1] ?? {};
  check("second.count === 2", second.count === 2, `got ${JSON.stringify(second.count)}`);
  check("second.n === 7", second.n === 7, `got ${JSON.stringify(second.n)}`);
  check('second.via === "site-pulse"', second.via === "site-pulse", `got ${JSON.stringify(second.via)}`);

  await malformed("site-pulse", root, journal, "handle_tick");
}

async function testGuard() {
  console.log("\n== site-guard ==");
  const { root, journal } = await load("site-guard");

  root.astridHookTrigger("handle_input", enc({ text: "my PASSWORD is hunter2" }));
  const blocked = publishesTo(journal, "site.v1.guard.blocked");
  check("one publish to site.v1.guard.blocked", blocked.length === 1, `got ${blocked.length}`);
  const b = blocked[0] ?? {};
  check('reason === "blocked term: password"', b.reason === "blocked term: password", `got ${JSON.stringify(b.reason)}`);
  check("redacted contains •••", typeof b.redacted === "string" && b.redacted.includes("•••"), `got ${JSON.stringify(b.redacted)}`);
  check("redacted does NOT contain PASSWORD (ci)", typeof b.redacted === "string" && !b.redacted.toLowerCase().includes("password"), `got ${JSON.stringify(b.redacted)}`);

  root.astridHookTrigger("handle_input", enc({ text: "hello astrid" }));
  const guarded = publishesTo(journal, "site.v1.guarded.text");
  check("one publish to site.v1.guarded.text", guarded.length === 1, `got ${guarded.length}`);
  check('guarded text unchanged ("hello astrid")', (guarded[0] ?? {}).text === "hello astrid", `got ${JSON.stringify((guarded[0] ?? {}).text)}`);

  await malformed("site-guard", root, journal, "handle_input");
}

async function testEcho() {
  console.log("\n== site-echo ==");
  const { root, journal } = await load("site-echo");
  root.astridHookTrigger("handle_guarded", enc({ text: "hi" }));

  const replies = publishesTo(journal, "site.v1.echo.reply");
  check("one publish to site.v1.echo.reply", replies.length === 1, `got ${replies.length}`);
  const r = replies[0] ?? {};
  check('reply === "echo: hi"', r.reply === "echo: hi", `got ${JSON.stringify(r.reply)}`);
  check("seen === 1", r.seen === 1, `got ${JSON.stringify(r.seen)}`);

  await malformed("site-echo", root, journal, "handle_guarded");
}

// Malformed input must NOT publish and must NOT throw.
async function malformed(name, root, journal, action) {
  const before = anySitePublishCount(journal);
  let threw = false;
  try {
    root.astridHookTrigger(action, enc("not json"));
  } catch (e) {
    threw = true;
    console.log(`    (threw: ${e})`);
  }
  const after = anySitePublishCount(journal);
  check(`${name}: malformed input does not throw`, !threw);
  check(`${name}: malformed input publishes nothing`, after === before, `publishes ${before} -> ${after}`);
}

async function main() {
  console.log("== site-capsules smoke gate ==");
  console.log("node", process.version);
  await testPulse();
  await testGuard();
  await testEcho();
  console.log(`\n${failures === 0 ? "ALL PASS" : `${failures} FAILURE(S)`}`);
  if (failures > 0) process.exit(1);
}

main().catch((e) => {
  console.error("SMOKE ERROR:", e);
  process.exit(1);
});
