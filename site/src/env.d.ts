/// <reference types="astro/client" />

/**
 * 'kernel-web' is a Vite alias (see astro.config.mjs): the wasm-pack output
 * of the kernel bridge crate, or a throwing stub until that pkg is built.
 */
declare module 'kernel-web' {
  const init: () => Promise<unknown>;

  export class AstridWeb {
    static boot(): Promise<AstridWeb>;
    kernel_commit(): string;
    kv_set(ns: string, key: string, val: string): Promise<void>;
    kv_get(ns: string, key: string): Promise<string | undefined>;
    publish(topic: string, json: string): Promise<void>;
    subscribe(pattern: string, cb: (topic: string, json: string) => void): void;
    grant(principal: string, resource: string, perm: string): Promise<string>;
    check(principal: string, resource: string, perm: string): Promise<boolean>;
    audit_len(): Promise<bigint>;
    audit_tail(n: number): Promise<string>;
    events_routed(): bigint;
  }

  export default init;
}
