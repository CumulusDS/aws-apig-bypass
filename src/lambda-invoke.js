// @flow

import type { Lambda } from "aws-sdk";

/**
 * This library only needs the invoke method from aws-sdk Lambda client.
 */
export type LambdaInvoke = {
  +invoke: $PropertyType<Lambda, "invoke">
};
