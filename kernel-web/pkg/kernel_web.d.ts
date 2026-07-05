/* tslint:disable */
/* eslint-disable */

/**
 * The live bridge handle exposed to JavaScript.
 *
 * Holds an `Arc<Kernel>` (the real kernel) plus the crate-owned
 * events-routed counter incremented by the boot-time wildcard pump.
 */
export class AstridWeb {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Number of entries on the real audit chain.
     *
     * Requires the genuinely-async audit storage (core branch for issue
     * #1154); on the old sync-over-async surface this call panicked on wasm.
     *
     * # Errors
     *
     * Returns a `JsError` if the audit storage fails.
     */
    auditLen(): Promise<bigint>;
    /**
     * Last `n` entries of this session's real audit chain, oldest first, as a
     * JSON array of `{hash, action, at}` — `hash` is the entry's BLAKE3
     * content hash (hex), `action` the serde tag of the audited action.
     *
     * # Errors
     *
     * Returns a `JsError` if the audit storage fails.
     */
    auditTail(n: number): Promise<string>;
    /**
     * Boot a real kernel with in-memory resources and start the
     * events-routed pump.
     *
     * This is the `kernel-smoke::boot_in_memory` recipe: `AstridHome`
     * pointing at a virtual path, an in-memory `KvStore`, a freshly
     * generated runtime keypair shared with an in-memory `AuditLog`, and a
     * generated session token. No filesystem, no network.
     *
     * # Errors
     *
     * Returns a `JsError` if `Kernel::with_resources` fails.
     */
    static boot(): Promise<AstridWeb>;
    /**
     * Check whether `principal` holds a live capability for `(resource, perm)`.
     *
     * Drives the real `CapabilityStore::find_capability`: `true` only if a
     * non-expired, signature-valid token owned by `principal` grants the
     * permission for a resource matching the token's pattern.
     *
     * # Errors
     *
     * Returns a `JsError` for an invalid principal or unsupported permission.
     */
    check(principal: string, resource: string, perm: string): Promise<boolean>;
    /**
     * Number of events the kernel has routed since boot, from the crate-owned
     * wildcard pump.
     */
    eventsRouted(): bigint;
    /**
     * Grant `principal` a real capability for `(resource, perm)`.
     *
     * Mints a session-scoped [`CapabilityToken`] (signed by the kernel's
     * runtime key) and adds it to the kernel `CapabilityStore`. Session scope
     * is deliberate: it stores the token purely in-memory, avoiding the
     * SurrealKV persistence path that a `Persistent` token would require — the
     * browser has no filesystem. Returns the new token id.
     *
     * `perm` maps `"read"`/`"write"`/`"execute"` onto the real [`Permission`]
     * variants; any other value is rejected.
     *
     * # Errors
     *
     * Returns a `JsError` for an invalid principal, an unsupported permission,
     * an invalid resource pattern, or a capability-store failure.
     */
    grant(principal: string, resource: string, perm: string): Promise<string>;
    /**
     * Read a guest KV value under `(ns, key)`, mediated by the guest's real
     * `Read` capability for resource `kv:<ns>`.
     *
     * # Errors
     *
     * Returns a `JsError` for an invalid principal, if the guest holds no
     * covering capability (denial), or if the KV read fails / is not UTF-8.
     */
    guestKvGet(principal: string, ns: string, key: string): Promise<string | undefined>;
    /**
     * Store a guest KV value under `(ns, key)`, mediated by the guest's real
     * `Write` capability for resource `kv:<ns>`.
     *
     * # Errors
     *
     * Returns a `JsError` for an invalid principal, if the guest holds no
     * covering capability (denial), or if the KV write fails.
     */
    guestKvSet(principal: string, ns: string, key: string, val: string): Promise<void>;
    /**
     * Publish a guest `Custom` event, mediated by the guest's real `Write`
     * capability for resource `topic:<topic>`.
     *
     * On allow the event is attributed to the guest principal (not
     * `"astrid-web"`), so the audited source is the guest itself.
     *
     * # Errors
     *
     * Returns a `JsError` for an invalid principal, if the guest holds no
     * covering capability (denial), or if `json` is not valid JSON.
     */
    guestPublish(principal: string, topic: string, json: string): Promise<void>;
    /**
     * Synchronously compare-and-swap `(ns, key)`: replace it with `new` iff its
     * current value matches `expected`. Backs the `astrid:kv/host#kv-cas`
     * import. See [`host_kv_get_sync`] for the `now_or_never` rationale.
     *
     * `expected: None` means "the key must currently be missing"
     * (insert-if-absent); `Some(s)` compares against `s` as UTF-8 bytes. `new`
     * is stored as UTF-8 bytes. Returns the trait's bool verbatim: `true` when
     * the swap happened, `false` when the compare failed — a failed compare is
     * NOT an error.
     *
     * [`host_kv_get_sync`]: AstridWeb::host_kv_get_sync
     *
     * # Errors
     *
     * Returns a `JsError` if the store pended (sync path unavailable) or the
     * CAS fails for a real I/O / validation reason (not the compare-failed
     * case).
     */
    hostKvCasSync(ns: string, key: string, expected: string | null | undefined, _new: string): boolean;
    /**
     * Synchronously delete every key in `ns` matching `prefix`, returning the
     * number of keys removed. Backs the `astrid:kv/host#kv-clear-prefix`
     * import. See [`host_kv_get_sync`] for the `now_or_never` rationale.
     *
     * [`host_kv_get_sync`]: AstridWeb::host_kv_get_sync
     *
     * # Errors
     *
     * Returns a `JsError` if the store pended (sync path unavailable) or the
     * clear fails.
     */
    hostKvClearPrefixSync(ns: string, prefix: string): bigint;
    /**
     * Synchronously delete `(ns, key)` from the kernel KV, returning `true`
     * iff the key existed. Backs the `astrid:kv/host#kv-delete` import. See
     * [`host_kv_get_sync`] for the `now_or_never` rationale.
     *
     * [`host_kv_get_sync`]: AstridWeb::host_kv_get_sync
     *
     * # Errors
     *
     * Returns a `JsError` if the store pended (sync path unavailable) or the
     * KV delete fails.
     */
    hostKvDeleteSync(ns: string, key: string): boolean;
    /**
     * Synchronously read `(ns, key)` from the kernel KV. Backs the
     * `astrid:kv/host#kv-get` import.
     *
     * The kernel KV is the in-memory `MemoryKvStore`, whose futures have no
     * await points and resolve on the first poll; `now_or_never` drives that
     * without blocking. If the future genuinely pended it returns an honest
     * error rather than spinning.
     *
     * # Errors
     *
     * Returns a `JsError` if the store pended (sync path unavailable), the KV
     * read fails, or the stored bytes are not valid UTF-8.
     */
    hostKvGetSync(ns: string, key: string): string | undefined;
    /**
     * Synchronously list keys in `ns`, optionally filtered by `prefix`. Backs
     * the `astrid:kv/host#kv-list-keys` import. See [`host_kv_get_sync`] for
     * the `now_or_never` rationale.
     *
     * `prefix: None` lists every key in the namespace; `Some(p)` lists only
     * keys starting with `p`.
     *
     * [`host_kv_get_sync`]: AstridWeb::host_kv_get_sync
     *
     * # Errors
     *
     * Returns a `JsError` if the store pended (sync path unavailable) or the
     * KV list fails.
     */
    hostKvListKeysSync(ns: string, prefix?: string | null): string[];
    /**
     * Synchronously store `(ns, key) = val` in the kernel KV. Backs the
     * `astrid:kv/host#kv-set` import. See [`host_kv_get_sync`] for the
     * `now_or_never` rationale.
     *
     * [`host_kv_get_sync`]: AstridWeb::host_kv_get_sync
     *
     * # Errors
     *
     * Returns a `JsError` if the store pended (sync path unavailable) or the
     * KV write fails.
     */
    hostKvSetSync(ns: string, key: string, val: string): void;
    /**
     * Synchronously publish a `Custom` event on the real bus, attributed to
     * `source`. Backs the `astrid:ipc/host#publish` import.
     *
     * The bus `publish` is already synchronous; only JSON parsing can fail.
     *
     * # Errors
     *
     * Returns a `JsError` if `json` is not valid JSON.
     */
    hostPublish(source: string, topic: string, json: string): void;
    /**
     * Create a drainable [`SyncTopicQueue`] fed by the real bus for events
     * whose derived topic matches `pattern`. Backs the sync
     * `astrid:ipc/host#subscribe` + `Subscription.recv` import pair: the
     * capsule's synchronous `recv` drains this queue instead of awaiting.
     *
     * The queue is `Rc<RefCell<..>>` (hence `!Send`), so the pump runs on
     * `wasm_bindgen_futures::spawn_local` — the same reasoning as [`subscribe`]:
     * `astrid_runtime::spawn` demands a `Send` future the `Rc` cannot satisfy.
     *
     * [`subscribe`]: AstridWeb::subscribe
     */
    hostSubscribeQueue(pattern: string): SyncTopicQueue;
    /**
     * Git commit of the `astrid-kernel` checkout this module was built from.
     */
    kernelCommit(): string;
    /**
     * Read the UTF-8 value stored under `(namespace, key)`, or `None`.
     *
     * # Errors
     *
     * Returns a `JsError` if the KV read fails or the stored bytes are not
     * valid UTF-8.
     */
    kvGet(ns: string, key: string): Promise<string | undefined>;
    /**
     * Store a UTF-8 value under `(namespace, key)` in the kernel KV.
     *
     * # Errors
     *
     * Returns a `JsError` if the KV write fails.
     */
    kvSet(ns: string, key: string, val: string): Promise<void>;
    /**
     * Publish a `Custom` event on the real bus.
     *
     * `json` is parsed as the event payload; `topic` becomes the event name.
     * The event is stamped with source `"astrid-web"`.
     *
     * # Errors
     *
     * Returns a `JsError` if `json` is not valid JSON.
     */
    publish(topic: string, json: string): Promise<void>;
    /**
     * Revoke the capability token `token_id`, removing it from the real
     * `CapabilityStore` and landing a `CapabilityRevoked` entry on the audit
     * chain.
     *
     * `token_id` accepts the `"token:<uuid>"` string returned by `grant`
     * (the bare `<uuid>` is also accepted).
     *
     * # Errors
     *
     * Returns a `JsError` for a malformed token id or a capability-store
     * failure.
     */
    revoke(token_id: string): Promise<void>;
    /**
     * Subscribe to bus events whose derived topic matches `pattern`.
     *
     * For each matching event the JS `cb` is invoked as
     * `cb(topic_string, data_json_string)`:
     * - `Custom` events deliver `(name, data)`.
     * - Any other event delivers `(kind, full_event_json)` where `kind` is
     *   the event's serde tag — nothing is dropped silently.
     *
     * The pump runs on `wasm_bindgen_futures::spawn_local` rather than
     * `astrid_runtime::spawn`: the latter requires a `Send` future, and the
     * captured `js_sys::Function` is `!Send` on this target, so spawn_local
     * (which drives `!Send` futures on the JS microtask queue) is the only
     * correct primitive here. Callback errors are ignored — a throwing JS
     * callback must not wedge or panic the pump.
     *
     * # Errors
     *
     * This constructor never fails today; the `Result` leaves room for future
     * pattern validation without an API break.
     */
    subscribe(pattern: string, cb: Function): void;
}

/**
 * A drainable, bounded queue of `(topic, data_json)` events fed by the real
 * bus, backing the synchronous `astrid:ipc/host` `Subscription.recv` import.
 *
 * The capsule's synchronous recv loop calls [`drain`](SyncTopicQueue::drain)
 * to pull all queued events (an empty `"[]"` is the "no messages" signal) and
 * [`dropped`](SyncTopicQueue::dropped) to observe lag-drop. Bounded at
 * [`SYNC_QUEUE_CAP`]; on overflow the OLDEST entry is dropped.
 */
export class SyncTopicQueue {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Drain and clear the queue, returning a JSON array
     * `[{"topic": ..., "data": ...}]` of all queued entries, oldest first.
     *
     * `data` is the event payload parsed back to JSON when possible (a bare
     * string otherwise). An empty queue returns `"[]"` — the "no messages"
     * signal the capsule's recv loop expects.
     */
    drain(): string;
    /**
     * Running count of entries dropped due to the queue being full.
     */
    dropped(): bigint;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_astridweb_free: (a: number, b: number) => void;
    readonly __wbg_synctopicqueue_free: (a: number, b: number) => void;
    readonly astridweb_auditLen: (a: number) => any;
    readonly astridweb_auditTail: (a: number, b: number) => any;
    readonly astridweb_boot: () => any;
    readonly astridweb_check: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => any;
    readonly astridweb_eventsRouted: (a: number) => bigint;
    readonly astridweb_grant: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => any;
    readonly astridweb_guestKvGet: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => any;
    readonly astridweb_guestKvSet: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => any;
    readonly astridweb_guestPublish: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => any;
    readonly astridweb_hostKvCasSync: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => [number, number, number];
    readonly astridweb_hostKvClearPrefixSync: (a: number, b: number, c: number, d: number, e: number) => [bigint, number, number];
    readonly astridweb_hostKvDeleteSync: (a: number, b: number, c: number, d: number, e: number) => [number, number, number];
    readonly astridweb_hostKvGetSync: (a: number, b: number, c: number, d: number, e: number) => [number, number, number, number];
    readonly astridweb_hostKvListKeysSync: (a: number, b: number, c: number, d: number, e: number) => [number, number, number, number];
    readonly astridweb_hostKvSetSync: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => [number, number];
    readonly astridweb_hostPublish: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => [number, number];
    readonly astridweb_hostSubscribeQueue: (a: number, b: number, c: number) => number;
    readonly astridweb_kernelCommit: (a: number) => [number, number];
    readonly astridweb_kvGet: (a: number, b: number, c: number, d: number, e: number) => any;
    readonly astridweb_kvSet: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => any;
    readonly astridweb_publish: (a: number, b: number, c: number, d: number, e: number) => any;
    readonly astridweb_revoke: (a: number, b: number, c: number) => any;
    readonly astridweb_subscribe: (a: number, b: number, c: number, d: any) => [number, number];
    readonly synctopicqueue_drain: (a: number) => [number, number];
    readonly synctopicqueue_dropped: (a: number) => bigint;
    readonly wasm_bindgen__convert__closures_____invoke__ha8fa1c53dd88e045: (a: number, b: number, c: any) => [number, number];
    readonly wasm_bindgen__convert__closures_____invoke__h31c7c599dadf562f: (a: number, b: number, c: any, d: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h5f67eaaf67bea9fb: (a: number, b: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_destroy_closure: (a: number, b: number) => void;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __externref_drop_slice: (a: number, b: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
