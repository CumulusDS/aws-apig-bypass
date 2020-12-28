// @flow

import type { LambdaInvoke } from "./lambda-invoke";

interface Blob {}
type _Blob = Buffer | Uint8Array | Blob | string;
type LambdaClientType = (event: _Blob) => Promise<string>;

export type CreateLambdaClientOptions = {
  Lambda: LambdaInvoke,
  FunctionName: string
};

/**
 * AWS Lambda SDK adapter for createClient.
 */
export default function createLambdaClient({ Lambda, FunctionName }: CreateLambdaClientOptions): LambdaClientType {
  return async (Payload: _Blob) => {
    const invocationResponse = await Lambda.invoke({
      FunctionName,
      Payload
    }).promise();
    if (invocationResponse.StatusCode !== 200) {
      throw new Error(
        `AWS Lambda invocation API failed with status ${invocationResponse.StatusCode ?? "(no status code)"}`
      );
    }
    if (typeof invocationResponse.Payload !== "string") {
      throw new Error(
        `AWS Lambda invocation API returned the wrong payload type '${typeof invocationResponse.Payload}'; expected 'string'`
      );
    }
    return invocationResponse.Payload;
  };
}
