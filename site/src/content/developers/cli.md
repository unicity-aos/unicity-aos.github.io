---
title: Product CLI
description: Use aos for product workflows and understand which operator commands delegate to the bundled runtime.
part: Operate AOS
order: 100
---

`aos` is the product command. It owns the product home, Community Edition
composition, health projection, version identity, and update policy.
Lower-level operator commands use the Astrid engine bundled in the same AOS
release, so the complete runtime command set remains available through one CLI.

## Product-owned commands

| Command | Behavior |
| --- | --- |
| `aos --help` | product help and delegation boundary |
| `aos --version` | AOS calendar-SemVer version, such as `2026.1.1` |
| `aos status [--json]` | read typed local runtime status without invoking the runtime CLI |
| `aos serve-health` | bind the narrow loopback health endpoint |
| `aos update` | update the AOS product and bundled runtime together from a signed channel or exact version |

`aos self-update` remains an alias for `aos update`. `aos distro` is also
product-owned and refuses replacement of the Unicity CE composition.

The public installer applies the embedded Community Edition composition and
wires the selected host plugins. There is no separate activation step. A
developer who deliberately wants another distribution uses standalone Astrid
Runtime outside the product installation.

## Delegated commands

Every other command is executed by `~/.aos/runtime/bin/astrid` with
`ASTRID_HOME=~/.aos/runtime` and the product workspace state directory
set only in the child process. This includes runtime/operator surfaces such as
daemon operation, capsule inspection, diagnostics, and agent execution. The
product-owned `aos status` remains the supported local status projection; it is
not delegated to the runtime command of the same name.

```sh
aos doctor
aos start
aos logs
aos capsule list
aos run
```

The exact delegated command set is the command set of the Astrid Runtime version
pinned into that AOS release. `aos` does not copy the implementation and should
not maintain a second parser for every runtime flag.

## Product home override

Use `AOS_HOME` to isolate a development or CI installation:

```sh
export AOS_HOME=/absolute/path/to/aos-home
aos status
```

Do not export `ASTRID_HOME` globally as an AOS setup step. The wrapper owns that
child-process setting, which prevents product state from colliding with a
standalone runtime.

## Exit codes and automation

Product commands return zero on success and nonzero on validation,
health-service, update, or child-runtime failure. Automation should consume the exit
code and structured HTTP contracts rather than matching human help text.

`aos serve-health` binds only `127.0.0.1:8765`. It is a long-running service,
not a one-shot health check; probe it with `GET /v1/runtime/health`.
