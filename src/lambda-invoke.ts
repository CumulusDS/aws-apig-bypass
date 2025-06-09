import type { Lambda } from "@aws-sdk/client-lambda";

/**
 * This library only needs the invoke method from aws-sdk Lambda client.
 */
export type LambdaInvoke = {
  readonly invoke: Lambda["invoke"];
};
