#![deny(unsafe_code)]
#![deny(clippy::all)]
#![deny(unreachable_pub)]

//! site-echo — sits BEHIND site-guard.
//!
//! Listens only on `site.v1.guarded.text {text}`, dispatched here as the
//! `handle_guarded` interceptor. It bumps a persistent counter in KV
//! (`echo.seen`) and publishes `site.v1.echo.reply {reply, seen}`. Because it
//! subscribes to `guarded.*` only, uninstalling site-guard means raw input
//! reaches nobody.

use astrid_sdk::prelude::*;
use serde_json::json;

/// KV key holding the decimal seen counter.
const SEEN_KEY: &str = "echo.seen";

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
        log::warn(format!("site-echo: failed to persist {key}: {e}"));
    }
    next
}

#[derive(Default)]
struct SiteEcho;

#[capsule]
impl SiteEcho {
    /// Handle guarded text (`site.v1.guarded.text`).
    #[astrid::interceptor("handle_guarded")]
    pub(crate) fn handle_guarded(&self, payload: serde_json::Value) -> Result<(), SysError> {
        let Some(text) = payload.get("text").and_then(serde_json::Value::as_str) else {
            log::warn("site-echo: handle_guarded payload missing string `text`; ignoring");
            return Ok(());
        };

        let seen = bump(SEEN_KEY);
        let out = json!({ "reply": format!("echo: {text}"), "seen": seen });
        if let Err(e) = ipc::publish_json("site.v1.echo.reply", &out) {
            log::warn(format!("site-echo: publish site.v1.echo.reply failed: {e}"));
        }
        Ok(())
    }
}
