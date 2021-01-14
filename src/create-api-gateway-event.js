// @flow

import type { APIGatewayEvent } from "flow-aws-lambda";

export type PathParameters = { [name: string]: string } | null;
export type QueryStringParameters = { [name: string]: string } | null;

export type CreateAPIGatewayEventOptions = {
  body?: string,
  path?: string,
  pathParameters?: PathParameters,
  queryStringParameters?: QueryStringParameters,
  isBase64Encoded?: boolean
};

export default function createAPIGatewayEvent({
  pathParameters = null,
  path = "",
  body = null,
  queryStringParameters = null,
  isBase64Encoded = false
}: CreateAPIGatewayEventOptions = {}): APIGatewayEvent<string> {
  return {
    body,
    headers: {},
    multiValueHeaders: {},
    httpMethod: "",
    isBase64Encoded,
    path,
    pathParameters,
    queryStringParameters,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {
      accountId: "",
      apiId: "",
      httpMethod: "",
      identity: {
        accessKey: null,
        accountId: null,
        apiKey: null,
        caller: null,
        cognitoAuthenticationProvider: null,
        cognitoAuthenticationType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        sourceIp: "",
        user: null,
        userAgent: null,
        userArn: null
      },
      stage: "",
      requestId: "",
      resourceId: "",
      resourcePath: ""
    },
    resource: ""
  };
}
