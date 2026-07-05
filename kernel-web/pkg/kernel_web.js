/* @ts-self-types="./kernel_web.d.ts" */

/**
 * The live bridge handle exposed to JavaScript.
 *
 * Holds an `Arc<Kernel>` (the real kernel) plus the crate-owned
 * events-routed counter incremented by the boot-time wildcard pump.
 */
export class AstridWeb {
    static __wrap(ptr) {
        const obj = Object.create(AstridWeb.prototype);
        obj.__wbg_ptr = ptr;
        AstridWebFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AstridWebFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_astridweb_free(ptr, 0);
    }
    /**
     * Number of entries on the real audit chain.
     *
     * Requires the genuinely-async audit storage (core branch for issue
     * #1154); on the old sync-over-async surface this call panicked on wasm.
     *
     * # Errors
     *
     * Returns a `JsError` if the audit storage fails.
     * @returns {Promise<bigint>}
     */
    auditLen() {
        const ret = wasm.astridweb_auditLen(this.__wbg_ptr);
        return ret;
    }
    /**
     * Last `n` entries of this session's real audit chain, oldest first, as a
     * JSON array of `{hash, action, at}` — `hash` is the entry's BLAKE3
     * content hash (hex), `action` the serde tag of the audited action.
     *
     * # Errors
     *
     * Returns a `JsError` if the audit storage fails.
     * @param {number} n
     * @returns {Promise<string>}
     */
    auditTail(n) {
        const ret = wasm.astridweb_auditTail(this.__wbg_ptr, n);
        return ret;
    }
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
     * @returns {Promise<AstridWeb>}
     */
    static boot() {
        const ret = wasm.astridweb_boot();
        return ret;
    }
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
     * @param {string} principal
     * @param {string} resource
     * @param {string} perm
     * @returns {Promise<boolean>}
     */
    check(principal, resource, perm) {
        const ptr0 = passStringToWasm0(principal, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(resource, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(perm, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.astridweb_check(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
        return ret;
    }
    /**
     * Number of events the kernel has routed since boot, from the crate-owned
     * wildcard pump.
     * @returns {bigint}
     */
    eventsRouted() {
        const ret = wasm.astridweb_eventsRouted(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
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
     * @param {string} principal
     * @param {string} resource
     * @param {string} perm
     * @returns {Promise<string>}
     */
    grant(principal, resource, perm) {
        const ptr0 = passStringToWasm0(principal, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(resource, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(perm, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.astridweb_grant(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
        return ret;
    }
    /**
     * Read a guest KV value under `(ns, key)`, mediated by the guest's real
     * `Read` capability for resource `kv:<ns>`.
     *
     * # Errors
     *
     * Returns a `JsError` for an invalid principal, if the guest holds no
     * covering capability (denial), or if the KV read fails / is not UTF-8.
     * @param {string} principal
     * @param {string} ns
     * @param {string} key
     * @returns {Promise<string | undefined>}
     */
    guestKvGet(principal, ns, key) {
        const ptr0 = passStringToWasm0(principal, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(ns, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.astridweb_guestKvGet(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
        return ret;
    }
    /**
     * Store a guest KV value under `(ns, key)`, mediated by the guest's real
     * `Write` capability for resource `kv:<ns>`.
     *
     * # Errors
     *
     * Returns a `JsError` for an invalid principal, if the guest holds no
     * covering capability (denial), or if the KV write fails.
     * @param {string} principal
     * @param {string} ns
     * @param {string} key
     * @param {string} val
     * @returns {Promise<void>}
     */
    guestKvSet(principal, ns, key, val) {
        const ptr0 = passStringToWasm0(principal, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(ns, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passStringToWasm0(val, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len3 = WASM_VECTOR_LEN;
        const ret = wasm.astridweb_guestKvSet(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3);
        return ret;
    }
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
     * @param {string} principal
     * @param {string} topic
     * @param {string} json
     * @returns {Promise<void>}
     */
    guestPublish(principal, topic, json) {
        const ptr0 = passStringToWasm0(principal, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(topic, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.astridweb_guestPublish(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
        return ret;
    }
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
     * @param {string} ns
     * @param {string} key
     * @param {string | null | undefined} expected
     * @param {string} _new
     * @returns {boolean}
     */
    hostKvCasSync(ns, key, expected, _new) {
        const ptr0 = passStringToWasm0(ns, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(expected) ? 0 : passStringToWasm0(expected, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        const ptr3 = passStringToWasm0(_new, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len3 = WASM_VECTOR_LEN;
        const ret = wasm.astridweb_hostKvCasSync(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] !== 0;
    }
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
     * @param {string} ns
     * @param {string} prefix
     * @returns {bigint}
     */
    hostKvClearPrefixSync(ns, prefix) {
        const ptr0 = passStringToWasm0(ns, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.astridweb_hostKvClearPrefixSync(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return BigInt.asUintN(64, ret[0]);
    }
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
     * @param {string} ns
     * @param {string} key
     * @returns {boolean}
     */
    hostKvDeleteSync(ns, key) {
        const ptr0 = passStringToWasm0(ns, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.astridweb_hostKvDeleteSync(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] !== 0;
    }
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
     * @param {string} ns
     * @param {string} key
     * @returns {string | undefined}
     */
    hostKvGetSync(ns, key) {
        const ptr0 = passStringToWasm0(ns, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.astridweb_hostKvGetSync(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        let v3;
        if (ret[0] !== 0) {
            v3 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v3;
    }
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
     * @param {string} ns
     * @param {string | null} [prefix]
     * @returns {string[]}
     */
    hostKvListKeysSync(ns, prefix) {
        const ptr0 = passStringToWasm0(ns, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(prefix) ? 0 : passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        const ret = wasm.astridweb_hostKvListKeysSync(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v3 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v3;
    }
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
     * @param {string} ns
     * @param {string} key
     * @param {string} val
     */
    hostKvSetSync(ns, key, val) {
        const ptr0 = passStringToWasm0(ns, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(val, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.astridweb_hostKvSetSync(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Synchronously publish a `Custom` event on the real bus, attributed to
     * `source`. Backs the `astrid:ipc/host#publish` import.
     *
     * The bus `publish` is already synchronous; only JSON parsing can fail.
     *
     * # Errors
     *
     * Returns a `JsError` if `json` is not valid JSON.
     * @param {string} source
     * @param {string} topic
     * @param {string} json
     */
    hostPublish(source, topic, json) {
        const ptr0 = passStringToWasm0(source, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(topic, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.astridweb_hostPublish(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
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
     * @param {string} pattern
     * @returns {SyncTopicQueue}
     */
    hostSubscribeQueue(pattern) {
        const ptr0 = passStringToWasm0(pattern, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.astridweb_hostSubscribeQueue(this.__wbg_ptr, ptr0, len0);
        return SyncTopicQueue.__wrap(ret);
    }
    /**
     * Git commit of the `astrid-kernel` checkout this module was built from.
     * @returns {string}
     */
    kernelCommit() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.astridweb_kernelCommit(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Read the UTF-8 value stored under `(namespace, key)`, or `None`.
     *
     * # Errors
     *
     * Returns a `JsError` if the KV read fails or the stored bytes are not
     * valid UTF-8.
     * @param {string} ns
     * @param {string} key
     * @returns {Promise<string | undefined>}
     */
    kvGet(ns, key) {
        const ptr0 = passStringToWasm0(ns, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.astridweb_kvGet(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret;
    }
    /**
     * Store a UTF-8 value under `(namespace, key)` in the kernel KV.
     *
     * # Errors
     *
     * Returns a `JsError` if the KV write fails.
     * @param {string} ns
     * @param {string} key
     * @param {string} val
     * @returns {Promise<void>}
     */
    kvSet(ns, key, val) {
        const ptr0 = passStringToWasm0(ns, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(val, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.astridweb_kvSet(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
        return ret;
    }
    /**
     * Publish a `Custom` event on the real bus.
     *
     * `json` is parsed as the event payload; `topic` becomes the event name.
     * The event is stamped with source `"astrid-web"`.
     *
     * # Errors
     *
     * Returns a `JsError` if `json` is not valid JSON.
     * @param {string} topic
     * @param {string} json
     * @returns {Promise<void>}
     */
    publish(topic, json) {
        const ptr0 = passStringToWasm0(topic, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.astridweb_publish(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret;
    }
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
     * @param {string} token_id
     * @returns {Promise<void>}
     */
    revoke(token_id) {
        const ptr0 = passStringToWasm0(token_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.astridweb_revoke(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
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
     * @param {string} pattern
     * @param {Function} cb
     */
    subscribe(pattern, cb) {
        const ptr0 = passStringToWasm0(pattern, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.astridweb_subscribe(this.__wbg_ptr, ptr0, len0, cb);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
}
if (Symbol.dispose) AstridWeb.prototype[Symbol.dispose] = AstridWeb.prototype.free;

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
    static __wrap(ptr) {
        const obj = Object.create(SyncTopicQueue.prototype);
        obj.__wbg_ptr = ptr;
        SyncTopicQueueFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SyncTopicQueueFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_synctopicqueue_free(ptr, 0);
    }
    /**
     * Drain and clear the queue, returning a JSON array
     * `[{"topic": ..., "data": ...}]` of all queued entries, oldest first.
     *
     * `data` is the event payload parsed back to JSON when possible (a bare
     * string otherwise). An empty queue returns `"[]"` — the "no messages"
     * signal the capsule's recv loop expects.
     * @returns {string}
     */
    drain() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.synctopicqueue_drain(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Running count of entries dropped due to the queue being full.
     * @returns {bigint}
     */
    dropped() {
        const ret = wasm.synctopicqueue_dropped(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
}
if (Symbol.dispose) SyncTopicQueue.prototype[Symbol.dispose] = SyncTopicQueue.prototype.free;
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg_Error_92b29b0548f8b746: function(arg0, arg1) {
            const ret = Error(getStringFromWasm0(arg0, arg1));
            return ret;
        },
        __wbg___wbindgen_debug_string_c25d447a39f5578f: function(arg0, arg1) {
            const ret = debugString(arg1);
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_is_function_1ff95bcc5517c252: function(arg0) {
            const ret = typeof(arg0) === 'function';
            return ret;
        },
        __wbg___wbindgen_is_undefined_c05833b95a3cf397: function(arg0) {
            const ret = arg0 === undefined;
            return ret;
        },
        __wbg___wbindgen_throw_344f42d3211c4765: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg__wbg_cb_unref_fffb441def202758: function(arg0) {
            arg0._wbg_cb_unref();
        },
        __wbg_astridweb_new: function(arg0) {
            const ret = AstridWeb.__wrap(arg0);
            return ret;
        },
        __wbg_call_a6e5c5dce5018821: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.call(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_call_e3b662382210db98: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.call(arg1, arg2, arg3);
            return ret;
        }, arguments); },
        __wbg_getRandomValues_cc7f052a444bb2ce: function() { return handleError(function (arg0, arg1) {
            globalThis.crypto.getRandomValues(getArrayU8FromWasm0(arg0, arg1));
        }, arguments); },
        __wbg_getTime_d6f070c088c9b5ed: function(arg0) {
            const ret = arg0.getTime();
            return ret;
        },
        __wbg_get_78f252d074a84d0b: function() { return handleError(function (arg0, arg1) {
            const ret = Reflect.get(arg0, arg1);
            return ret;
        }, arguments); },
        __wbg_instanceof_Object_33f20e6f12439f3e: function(arg0) {
            let result;
            try {
                result = arg0 instanceof Object;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_new_0_3da9e97f24fc69be: function() {
            const ret = new Date();
            return ret;
        },
        __wbg_new_typed_1824d93f294193e5: function(arg0, arg1) {
            try {
                var state0 = {a: arg0, b: arg1};
                var cb0 = (arg0, arg1) => {
                    const a = state0.a;
                    state0.a = 0;
                    try {
                        return wasm_bindgen__convert__closures_____invoke__h31c7c599dadf562f(a, state0.b, arg0, arg1);
                    } finally {
                        state0.a = a;
                    }
                };
                const ret = new Promise(cb0);
                return ret;
            } finally {
                state0.a = 0;
            }
        },
        __wbg_now_55c5352b4b61d145: function(arg0) {
            const ret = arg0.now();
            return ret;
        },
        __wbg_now_e7c6795a7f81e10f: function(arg0) {
            const ret = arg0.now();
            return ret;
        },
        __wbg_performance_3fcf6e32a7e1ed0a: function(arg0) {
            const ret = arg0.performance;
            return ret;
        },
        __wbg_performance_aa4d78060a5b8a2f: function(arg0) {
            const ret = arg0.performance;
            return ret;
        },
        __wbg_queueMicrotask_0ab5b2d2393e99b9: function(arg0) {
            const ret = arg0.queueMicrotask;
            return ret;
        },
        __wbg_queueMicrotask_6a09b7bc46549209: function(arg0) {
            queueMicrotask(arg0);
        },
        __wbg_resolve_2191a4dfe481c25b: function(arg0) {
            const ret = Promise.resolve(arg0);
            return ret;
        },
        __wbg_setTimeout_05a790c35d76ff25: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.setTimeout(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_static_accessor_GLOBAL_4ef717fb391d88b7: function() {
            const ret = typeof global === 'undefined' ? null : global;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_GLOBAL_THIS_8d1badc68b5a74f4: function() {
            const ret = typeof globalThis === 'undefined' ? null : globalThis;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_SELF_146583524fe1469b: function() {
            const ret = typeof self === 'undefined' ? null : self;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_WINDOW_f2829a2234d7819e: function() {
            const ret = typeof window === 'undefined' ? null : window;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_then_6ec10ae38b3e92f7: function(arg0, arg1) {
            const ret = arg0.then(arg1);
            return ret;
        },
        __wbindgen_cast_0000000000000001: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [Externref], shim_idx: 631, ret: Result(Unit), inner_ret: Some(Result(Unit)) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen__convert__closures_____invoke__ha8fa1c53dd88e045);
            return ret;
        },
        __wbindgen_cast_0000000000000002: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [], shim_idx: 371, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen__convert__closures_____invoke__h5f67eaaf67bea9fb);
            return ret;
        },
        __wbindgen_cast_0000000000000003: function(arg0, arg1) {
            // Cast intrinsic for `Ref(String) -> Externref`.
            const ret = getStringFromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_cast_0000000000000004: function(arg0) {
            // Cast intrinsic for `U64 -> Externref`.
            const ret = BigInt.asUintN(64, arg0);
            return ret;
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./kernel_web_bg.js": import0,
    };
}

function wasm_bindgen__convert__closures_____invoke__h5f67eaaf67bea9fb(arg0, arg1) {
    wasm.wasm_bindgen__convert__closures_____invoke__h5f67eaaf67bea9fb(arg0, arg1);
}

function wasm_bindgen__convert__closures_____invoke__ha8fa1c53dd88e045(arg0, arg1, arg2) {
    const ret = wasm.wasm_bindgen__convert__closures_____invoke__ha8fa1c53dd88e045(arg0, arg1, arg2);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

function wasm_bindgen__convert__closures_____invoke__h31c7c599dadf562f(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures_____invoke__h31c7c599dadf562f(arg0, arg1, arg2, arg3);
}

const AstridWebFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_astridweb_free(ptr, 1));
const SyncTopicQueueFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_synctopicqueue_free(ptr, 1));

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => wasm.__wbindgen_destroy_closure(state.a, state.b));

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_externrefs.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function makeMutClosure(arg0, arg1, f) {
    const state = { a: arg0, b: arg1, cnt: 1 };
    const real = (...args) => {

        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            state.a = a;
            real._wbg_cb_unref();
        }
    };
    real._wbg_cb_unref = () => {
        if (--state.cnt === 0) {
            wasm.__wbindgen_destroy_closure(state.a, state.b);
            state.a = 0;
            CLOSURE_DTORS.unregister(state);
        }
    };
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('kernel_web_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
