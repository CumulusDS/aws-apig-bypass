import createLambdaClient from "./create-lambda-client";
import type { Response } from "./response";
import jsonStringify from "./json-stringify";
import parsePayload from "./parse-payload";
import type { LambdaInvoke } from "./lambda-invoke";
import { APIGatewayEvent } from "aws-lambda";

/**
 * Client that directly invokes an API Gateway handler, bypassing the gateway. The client handles packing and unpacking messages for invoking the handler.
 */
export type APIGatewayHandlerClient<T> = (event: APIGatewayEvent) => Promise<Response<T>>;

export type CreateClientOptions<T> = {
 Lambda: LambdaInvoke,
 FunctionName: string,
 Validate?: (arg1: T) => void
};

/**
 * Create an APIGatewayHandlerClient. The client invokes an API Gateway handler, bypassing the gateway. It adapts the AWS SDK by packing and unpacking messages for invoking the handler.
 *
 * @param options
 * @returns {APIGatewayHandlerClient<T>}
 */
export default function createClient<T>(options: CreateClientOptions<T>): APIGatewayHandlerClient<T> {
  const client = createLambdaClient(options);
  return async (event: APIGatewayEvent) => parsePayload<T>(await client(jsonStringify(event)));
}
