#!/usr/bin/env bash
set -euo pipefail
root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
# Execute the shipped POSIX parser functions, not a second regex implementation.
functions=$(awk '/^is_aos_nightly_version\(\)/ {keep=1} /^if \[ -n "\$AOS_VERSION"/ {keep=0} keep' "$root/public/base-install.sh")
check() {
  local expected=$1 channel=$2 version=$3 result=0
  sh -c "$functions; is_aos_channel_version \"\$1\" \"\$2\"" sh "$channel" "$version" || result=$?
  if [[ "$expected" == pass ]]; then [[ "$result" == 0 ]]; else [[ "$result" != 0 ]]; fi
}
check pass dev 2026.10.0-rc.1
check pass dev 2026.10.0-rc.42
check pass dev 2026.10.0
check pass stable 2026.10.0
check fail stable 2026.10.0-rc.1
check fail nightly 2026.10.0-rc.1
for version in 2026.10.0-rc.0 2026.10.0-rc.01 2026.10.0-beta.1 2026.10.0-rc.1+build; do
  check fail dev "$version"
done
check pass nightly "2026.10.0-nightly.20261006.g$(printf '%040d' 0)"
check fail dev "2026.10.0-nightly.20261006.g$(printf '%040d' 0)"
printf '%s\n' 'Public installer RC channel selection: PASS'
