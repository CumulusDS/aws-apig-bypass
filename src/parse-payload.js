// @flow

import type { ProxyResult } from "flow-aws-lambda";
import type { Response } from "./response";

/**
 * Decode the handler response
 *
 * @param payload
 * @param validate if given, the validate function is called on the parsed response body. The function should throw an exception if the response is invalid.
 * @returns {{headers: {[p: string]: boolean|number|string}, data: *, status: number}}
 */
export default function parsePayload<T>(payload: string, validate?: T => void): Response<T> {
  const proxyResult: ProxyResult = JSON.parse(payload);
  if (proxyResult.isBase64Encoded === true) {
    throw new Error("A base64 encoded response from API Gateway handler was received, but is not supported.");
  }
  const data: T = JSON.parse(proxyResult.body);
  validate?.(data);
  return {
    data,
    status: proxyResult.statusCode,
    headers: proxyResult.headers ?? {}
  };
}
