import type { InvocationResponse } from "@aws-sdk/client-lambda";

import type { LambdaInvoke } from "./lambda-invoke";

type _Blob = Buffer | Uint8Array | Blob | string;
type LambdaClientType = (event: _Blob) => Promise<string>;

export type CreateLambdaClientOptions = {
  Lambda: LambdaInvoke;
  FunctionName: string;
};

export class LambdaInvokeError extends Error {
  code: string;

  constructor(response: InvocationResponse) {
    super(
      [
        "Invocation Failed",
        response.ExecutedVersion,
        response.StatusCode,
        response.FunctionError,
        response.Payload,
        response.LogResult != null ? Buffer.from(response.LogResult, "base64").toString("utf-8") : null,
      ]
        .filter((x) => x != null)
        .join(": "),
    );
    this.code = response.FunctionError ?? "";
  }
}

/**
 * AWS Lambda SDK adapter for createClient.
 */
export default function createLambdaClient({
  Lambda: LambdaShadow,
  FunctionName,
}: CreateLambdaClientOptions): LambdaClientType {
  return async (Payload: _Blob) => {
    const invocationResponse = await LambdaShadow.invoke({
      FunctionName,
      Payload,
    });
    if (invocationResponse.StatusCode !== 200 || invocationResponse.FunctionError != null) {
      throw new LambdaInvokeError(invocationResponse);
    }
    if (!invocationResponse.Payload) {
      throw new Error(
        `AWS Lambda invocation API returned the wrong payload type '${typeof invocationResponse.Payload}';`,
      );
    }
    return Buffer.from(invocationResponse.Payload).toString();
  };
}
