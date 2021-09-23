// @flow

import type { APIGatewayEvent } from "@cumulusds/flow-aws-lambda";
import createLambdaClient from "./create-lambda-client";
import type { Response } from "./response";
import jsonStringify from "./json-stringify";
import parsePayload from "./parse-payload";
import type { LambdaInvoke } from "./lambda-invoke";

/**
 * Client that directly invokes an API Gateway handler, bypassing the gateway. The client handles packing and unpacking messages for invoking the handler.
 */
export type APIGatewayHandlerClient<T> = (event: APIGatewayEvent<string>) => Promise<Response<T>>;

export type CreateClientOptions<T> = {
  Lambda: LambdaInvoke,
  FunctionName: string,
  Validate?: T => void
};

/**
 * Create an APIGatewayHandlerClient. The client invokes an API Gateway handler, bypassing the gateway. It adapts the AWS SDK by packing and unpacking messages for invoking the handler.
 *
 * @param options
 * @returns {APIGatewayHandlerClient<T>}
 */
export default function createClient<T>(options: CreateClientOptions<T>): APIGatewayHandlerClient<T> {
  const client = createLambdaClient(options);
  return async (event: APIGatewayEvent<string>) => parsePayload<T>(await client(jsonStringify(event)));
}
