/** @module Interface astrid:sys/host@1.0.0 **/
export function log(level: LogLevel, message: string): void;
export function randomBytes(length: bigint): Uint8Array;
/**
 * # Variants
 * 
 * ## `"trace"`
 * 
 * ## `"debug"`
 * 
 * ## `"info"`
 * 
 * ## `"warn"`
 * 
 * ## `"error"`
 */
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error';
export type ErrorCode = ErrorCodeCapabilityDenied | ErrorCodeConfigKeyReserved | ErrorCodeTooLarge | ErrorCodeRegistryUnavailable | ErrorCodeCancelled | ErrorCodeUnknown;
export interface ErrorCodeCapabilityDenied {
  tag: 'capability-denied',
}
export interface ErrorCodeConfigKeyReserved {
  tag: 'config-key-reserved',
}
export interface ErrorCodeTooLarge {
  tag: 'too-large',
}
export interface ErrorCodeRegistryUnavailable {
  tag: 'registry-unavailable',
}
export interface ErrorCodeCancelled {
  tag: 'cancelled',
}
export interface ErrorCodeUnknown {
  tag: 'unknown',
  val: string,
}
