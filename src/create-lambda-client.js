// @flow

import type { LambdaInvoke } from "./lambda-invoke";

interface Blob {}
type _Blob = Buffer | Uint8Array | Blob | string;
type LambdaClientType = (event: _Blob) => Promise<string>;

export type CreateLambdaClientOptions = {
  Lambda: LambdaInvoke,
  FunctionName: string
};

export type Lambda$InvocationResponse = {
  /**
   * The HTTP status code is in the 200 range for a successful request. For the RequestResponse invocation type, this status code is 200. For the Event invocation type, this status code is 202. For the DryRun invocation type, the status code is 204.
   */
  StatusCode?: number,

  /**
   * If present, indicates that an error occurred during function execution. Details about the error are included in the response payload.
   */
  FunctionError?: string,

  /**
   * The last 4 KB of the execution log, which is base64 encoded.
   */
  LogResult?: string,

  /**
   * The response from the function, or an error object.
   */
  Payload?: Buffer | Uint8Array | Blob | string,

  /**
   * The version of the function that executed. When you invoke a function with an alias, this indicates which version the alias resolved to.
   */
  ExecutedVersion?: string
};

export class LambdaInvokeError extends Error {
  code: string;

  constructor(response: Lambda$InvocationResponse) {
    super(
      [
        "Invocation Failed",
        response.ExecutedVersion,
        response.StatusCode,
        response.FunctionError,
        response.Payload,
        response.LogResult != null ? Buffer.from(response.LogResult, "base64").toString("utf-8") : null
      ]
        .filter(x => x != null)
        .join(": ")
    );
    this.code = response.FunctionError ?? "";
  }
}

/**
 * AWS Lambda SDK adapter for createClient.
 */
export default function createLambdaClient({ Lambda, FunctionName }: CreateLambdaClientOptions): LambdaClientType {
  return async (Payload: _Blob) => {
    const invocationResponse = await Lambda.invoke({
      FunctionName,
      Payload
    }).promise();
    if (invocationResponse.StatusCode !== 200 || invocationResponse.FunctionError != null) {
      throw new LambdaInvokeError(invocationResponse);
    }
    if (typeof invocationResponse.Payload !== "string") {
      throw new Error(
        `AWS Lambda invocation API returned the wrong payload type '${typeof invocationResponse.Payload}'; expected 'string'`
      );
    }
    return invocationResponse.Payload;
  };
}
