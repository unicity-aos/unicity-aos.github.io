//! Inject the core checkout's git commit at build time so the running bridge
//! can prove which `astrid-kernel` revision it was compiled from (DESIGN §0
//! provenance rule: every live element carries "real kernel @ <commit>").
//!
//! Resolves `git -C ../../core rev-parse --short HEAD`; if git is unavailable
//! or the checkout is not a repo, falls back to "unknown" rather than failing
//! the build.

use std::process::Command;

fn main() {
    let commit = Command::new("git")
        .args(["-C", "../../core", "rev-parse", "--short", "HEAD"])
        .output()
        .ok()
        .filter(|out| out.status.success())
        .and_then(|out| String::from_utf8(out.stdout).ok())
        .map(|s| s.trim().to_string())
        .filter(|s| !s.is_empty())
        .unwrap_or_else(|| "unknown".to_string());

    println!("cargo:rustc-env=KERNEL_WEB_CORE_COMMIT={commit}");

    // Re-run if the core checkout's HEAD moves.
    println!("cargo:rerun-if-changed=../../core/.git/HEAD");
}
