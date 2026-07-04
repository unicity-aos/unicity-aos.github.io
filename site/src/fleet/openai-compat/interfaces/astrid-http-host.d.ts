/** @module Interface astrid:http/host@1.0.0 **/
export function httpRequest(request: HttpRequestData): HttpResponseData;
export function httpStreamStart(request: HttpRequestData): HttpStream;
export type HttpMethod = HttpMethodGet | HttpMethodHead | HttpMethodPost | HttpMethodPut | HttpMethodDelete | HttpMethodConnect | HttpMethodOptions | HttpMethodTrace | HttpMethodPatch | HttpMethodOther;
export interface HttpMethodGet {
  tag: 'get',
}
export interface HttpMethodHead {
  tag: 'head',
}
export interface HttpMethodPost {
  tag: 'post',
}
export interface HttpMethodPut {
  tag: 'put',
}
export interface HttpMethodDelete {
  tag: 'delete',
}
export interface HttpMethodConnect {
  tag: 'connect',
}
export interface HttpMethodOptions {
  tag: 'options',
}
export interface HttpMethodTrace {
  tag: 'trace',
}
export interface HttpMethodPatch {
  tag: 'patch',
}
export interface HttpMethodOther {
  tag: 'other',
  val: string,
}
export interface KeyValuePair {
  key: string,
  value: string,
}
export interface HttpRequestData {
  url: string,
  method: HttpMethod,
  headers: Array<KeyValuePair>,
  body?: Uint8Array,
}
export type ErrorCode = ErrorCodeCapabilityDenied | ErrorCodeInvalidRequest | ErrorCodeDnsError | ErrorCodeAirlockRejected | ErrorCodeTlsError | ErrorCodeTimeout | ErrorCodeConnectionError | ErrorCodeBodyTooLarge | ErrorCodeClosed | ErrorCodeQuota | ErrorCodeProtocol | ErrorCodeUnknown;
export interface ErrorCodeCapabilityDenied {
  tag: 'capability-denied',
}
export interface ErrorCodeInvalidRequest {
  tag: 'invalid-request',
}
export interface ErrorCodeDnsError {
  tag: 'dns-error',
}
export interface ErrorCodeAirlockRejected {
  tag: 'airlock-rejected',
}
export interface ErrorCodeTlsError {
  tag: 'tls-error',
}
export interface ErrorCodeTimeout {
  tag: 'timeout',
}
export interface ErrorCodeConnectionError {
  tag: 'connection-error',
}
export interface ErrorCodeBodyTooLarge {
  tag: 'body-too-large',
}
export interface ErrorCodeClosed {
  tag: 'closed',
}
export interface ErrorCodeQuota {
  tag: 'quota',
}
export interface ErrorCodeProtocol {
  tag: 'protocol',
  val: string,
}
export interface ErrorCodeUnknown {
  tag: 'unknown',
  val: string,
}
export interface HttpResponseData {
  status: number,
  headers: Array<KeyValuePair>,
  body: Uint8Array,
}

export class HttpStream {
  /**
   * This type does not have a public constructor.
   */
  private constructor();
  status(): number;
  headers(): Array<KeyValuePair>;
  readChunk(): Uint8Array;
}
