/** @module Interface astrid:kv/host@1.0.0 **/
export function kvGet(key: string): Uint8Array | undefined;
export function kvDelete(key: string): void;
export function kvListKeys(prefix: string): Array<string>;
export function kvListKeysPage(prefix: string, cursor: string | undefined, limit: number): KeyPage;
export function kvCas(key: string, expected: Uint8Array | undefined, new_: Uint8Array): void;
export type ErrorCode = ErrorCodeInvalidKey | ErrorCodeTooLarge | ErrorCodeQuota | ErrorCodeCasMismatch | ErrorCodeUnknown;
export interface ErrorCodeInvalidKey {
  tag: 'invalid-key',
}
export interface ErrorCodeTooLarge {
  tag: 'too-large',
}
export interface ErrorCodeQuota {
  tag: 'quota',
}
export interface ErrorCodeCasMismatch {
  tag: 'cas-mismatch',
}
export interface ErrorCodeUnknown {
  tag: 'unknown',
  val: string,
}
export interface KeyPage {
  keys: Array<string>,
  nextCursor?: string,
}
