#![deny(unsafe_code)]
#![deny(clippy::all)]
#![deny(unreachable_pub)]

//! site-guard — the layering-demo capsule.
//!
//! Owns the raw input topic `site.v1.input.text {text}`, dispatched here as the
//! `handle_input` interceptor. If the text contains a blocklisted term
//! (`password`, `secret`, `ssh`, case-insensitive substring) it publishes
//! `site.v1.guard.blocked {reason, redacted}`; otherwise it passes the text
//! through as `site.v1.guarded.text {text}`. Downstream capsules listen on
//! `guarded.*`, so this ordering is BUS TOPOLOGY, not kernel interceptor
//! priority (a native-daemon feature). No KV.

use astrid_sdk::prelude::*;
use serde_json::json;

/// Blocklisted terms, matched case-insensitively as substrings. The first
/// entry that matches (in this order) names the `reason`.
const BLOCKLIST: [&str; 3] = ["password", "secret", "ssh"];

/// Replacement written over every matched occurrence.
const REDACTION: &str = "\u{2022}\u{2022}\u{2022}"; // •••

/// Case-insensitive ASCII substring test. `needle` is always ASCII here.
fn contains_ci(hay: &str, needle: &str) -> bool {
    let n = needle.as_bytes();
    if n.is_empty() {
        return false;
    }
    hay.as_bytes().windows(n.len()).any(|w| w.eq_ignore_ascii_case(n))
}

/// Replace every case-insensitive occurrence of the ASCII `needle` in `hay`
/// with [`REDACTION`]. Matched regions are ASCII (needle is ASCII), so they
/// always fall on char boundaries; all other bytes are copied verbatim, so the
/// result is valid UTF-8.
fn redact_ci(hay: &str, needle: &str) -> String {
    let h = hay.as_bytes();
    let n = needle.as_bytes();
    if n.is_empty() {
        return hay.to_string();
    }
    let mut out: Vec<u8> = Vec::with_capacity(h.len());
    let mut i = 0;
    while i < h.len() {
        if i.saturating_add(n.len()) <= h.len() && h[i..i + n.len()].eq_ignore_ascii_case(n) {
            out.extend_from_slice(REDACTION.as_bytes());
            i += n.len();
        } else {
            out.push(h[i]);
            i += 1;
        }
    }
    String::from_utf8(out).unwrap_or_else(|_| hay.to_string())
}

#[derive(Default)]
struct SiteGuard;

#[capsule]
impl SiteGuard {
    /// Handle raw page input (`site.v1.input.text`).
    #[astrid::interceptor("handle_input")]
    pub(crate) fn handle_input(&self, payload: serde_json::Value) -> Result<(), SysError> {
        let Some(text) = payload.get("text").and_then(serde_json::Value::as_str) else {
            log::warn("site-guard: handle_input payload missing string `text`; ignoring");
            return Ok(());
        };

        let matched: Vec<&str> = BLOCKLIST
            .iter()
            .copied()
            .filter(|term| contains_ci(text, term))
            .collect();

        if let Some(first) = matched.first() {
            let mut redacted = text.to_string();
            for term in &matched {
                redacted = redact_ci(&redacted, term);
            }
            let out = json!({
                "reason": format!("blocked term: {first}"),
                "redacted": redacted,
            });
            if let Err(e) = ipc::publish_json("site.v1.guard.blocked", &out) {
                log::warn(format!("site-guard: publish site.v1.guard.blocked failed: {e}"));
            }
        } else {
            let out = json!({ "text": text });
            if let Err(e) = ipc::publish_json("site.v1.guarded.text", &out) {
                log::warn(format!("site-guard: publish site.v1.guarded.text failed: {e}"));
            }
        }
        Ok(())
    }
}
