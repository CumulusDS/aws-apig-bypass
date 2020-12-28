// @flow

import type Lambda from "@cumulusds/flow-aws-sdk/clients/lambda";

/**
 * This library only needs the invoke method from aws-sdk Lambda client.
 */
export type LambdaInvoke = {
  +invoke: $PropertyType<Lambda, "invoke">
};
