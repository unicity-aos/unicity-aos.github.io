/** @module Interface astrid:ipc/host@1.0.0 **/
export function publish(topic: string, payload: string): void;
export type ErrorCode = ErrorCodeCapabilityDenied | ErrorCodeInvalidInput | ErrorCodeClosed | ErrorCodeRateLimited | ErrorCodeBackpressure | ErrorCodeQuota | ErrorCodeTimeout | ErrorCodeUnknown;
export interface ErrorCodeCapabilityDenied {
  tag: 'capability-denied',
}
export interface ErrorCodeInvalidInput {
  tag: 'invalid-input',
}
export interface ErrorCodeClosed {
  tag: 'closed',
}
export interface ErrorCodeRateLimited {
  tag: 'rate-limited',
}
export interface ErrorCodeBackpressure {
  tag: 'backpressure',
}
export interface ErrorCodeQuota {
  tag: 'quota',
}
export interface ErrorCodeTimeout {
  tag: 'timeout',
}
export interface ErrorCodeUnknown {
  tag: 'unknown',
  val: string,
}
