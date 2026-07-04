#![deny(unsafe_code)]
#![deny(clippy::all)]
#![deny(unreachable_pub)]

//! site-pulse — the homepage routing-demo capsule.
//!
//! The page is the clock (a sandboxed guest has no timer authority): it
//! publishes `site.v1.clock.tick {n}`, dispatched here as the `handle_tick`
//! interceptor. Each tick bumps a persistent counter in KV (`pulse.count`)
//! and re-publishes `site.v1.demo.route {n, count, via: "site-pulse"}`.
//! Uninstall the capsule and the routing pulses on the page stop.

use astrid_sdk::prelude::*;
use serde_json::json;

/// KV key holding the decimal tick counter.
const COUNT_KEY: &str = "pulse.count";

/// Read `key` as a decimal `u64` (0 on absence or garbage), increment by one
/// (saturating), persist the new value, and return it.
fn bump(key: &str) -> u64 {
    let current = kv::get_bytes_opt(key)
        .ok()
        .flatten()
        .and_then(|b| String::from_utf8(b).ok())
        .and_then(|s| s.trim().parse::<u64>().ok())
        .unwrap_or(0);
    let next = current.saturating_add(1);
    if let Err(e) = kv::set_bytes(key, next.to_string().as_bytes()) {
        log::warn(format!("site-pulse: failed to persist {key}: {e}"));
    }
    next
}

#[derive(Default)]
struct SitePulse;

#[capsule]
impl SitePulse {
    /// Handle a page clock tick (`site.v1.clock.tick`).
    #[astrid::interceptor("handle_tick")]
    pub(crate) fn handle_tick(&self, payload: serde_json::Value) -> Result<(), SysError> {
        let Some(n) = payload.get("n").filter(|v| v.is_number()).cloned() else {
            log::warn("site-pulse: handle_tick payload missing numeric `n`; ignoring");
            return Ok(());
        };

        let count = bump(COUNT_KEY);
        let out = json!({ "n": n, "count": count, "via": "site-pulse" });
        if let Err(e) = ipc::publish_json("site.v1.demo.route", &out) {
            log::warn(format!("site-pulse: publish site.v1.demo.route failed: {e}"));
        }
        Ok(())
    }
}
