#!/usr/bin/env python3
"""Exercise the served installer resolver without installing into a real home."""
import os
import re
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

# Execute the served installer's real metadata classifier. An update banner is
# not a transport failure, but unrelated errors must remain fatal.
source = installer.read_text()
function = re.search(r'(?ms)^load_capsule_record\(\) \{.*?^\}', source).group()
for status, diagnostic, expected in (
    (1, "capsule 'aos-skills' is not installed for agent 'codex-code'", 1),
    (2, "transport unavailable", 97),
    (1, "transport unavailable", 97),
):
    with tempfile.TemporaryDirectory() as raw:
        env = dict(os.environ, WORK=raw, PROBE_STATUS=str(status), PROBE_DIAGNOSTIC=diagnostic)
        program = '''
die() { printf '%s\\n' "$*" >&2; exit 97; }
aos() {
  printf '%s\\n' '! Update available: v2026.10.0-rc.2 → v2026.9.4. Run `astrid update` to upgrade.' "$PROBE_DIAGNOSTIC" >&2
  return "$PROBE_STATUS"
}
''' + function + '\nload_capsule_record codex-code aos-skills\n'
        result = subprocess.run(['sh', '-c', program], env=env, capture_output=True, text=True, timeout=5)
        assert result.returncode == expected, result
print("3 served RC capsule metadata classification cases passed")
