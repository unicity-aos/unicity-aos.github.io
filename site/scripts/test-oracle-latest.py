#!/usr/bin/env python3
"""Exercise the served installer resolver without installing into a real home."""
import os
from pathlib import Path
import subprocess
import tempfile

installer = Path(__file__).resolve().parents[1] / "public/oracle-install.sh"
cases = [
    ("https://github.com/unicity-aos/oracles/releases/tag/v2026.9.1", [], "invalid AOS channel", True),
    ("https://github.com/unicity-aos/oracles/releases/tag/v2026.9.9", [], "invalid AOS channel", True),
    ("https://evil.example/v2026.9.9", [], "outside the expected repository", True),
    ("https://github.com/unicity-aos/oracles/releases/tag/v2026.9.9-rc1", [], "invalid oracle version", True),
    ("", ["--oracle-version", "2026.9.1"], "invalid AOS channel", False),
    ("", ["--local-assets", "/missing"], "explicit --oracle-version", False),
]
for url, args, error, network in cases:
    with tempfile.TemporaryDirectory() as raw:
        root = Path(raw)
        curl = root / "curl"
        curl.write_text('#!/bin/sh\ntouch "$PROBE_LOG"\nprintf "%s" "$PROBE_URL"\n')
        curl.chmod(0o700)
        env = dict(os.environ, PATH=raw + os.pathsep + os.environ["PATH"],
                   PROBE_URL=url, PROBE_LOG=str(root / "called"), AOS_HOME=str(root / "home"))
        for name in ("AOS_ORACLES_VERSION", "AOS_ORACLE_ASSETS", "AOS_ORACLES_REPO"):
            env.pop(name, None)
        result = subprocess.run(["sh", str(installer), *args, "--aos-channel", "invalid-probe-channel"],
                                env=env, capture_output=True, text=True, timeout=5)
        assert result.returncode != 0 and error in result.stderr, result
        assert (root / "called").exists() == network
        assert not (root / "home").exists()
print("6 served Oracle resolver cases passed")
