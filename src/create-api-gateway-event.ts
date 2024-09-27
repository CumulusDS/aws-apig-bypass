import type { APIGatewayEvent } from "aws-lambda";

export type PathParameters = { [name: string]: string } | null;
export type QueryStringParameters = { [name: string]: string } | null;

const defaultRequestContext = {
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
    userArn: null,
  },
  stage: "",
  requestId: "",
  resourceId: "",
  resourcePath: "",
};

export type CreateAPIGatewayEventOptions = {
  body?: string | null;
  headers?: {
    [name: string]: string;
  };
  multiValueHeaders?: {
    [name: string]: string[];
  };
  httpMethod?: string;
  isBase64Encoded?: boolean;
  path?: string;
  pathParameters?: PathParameters;
  queryStringParameters?: QueryStringParameters;
  multiValueQueryStringParameters?: {
    [name: string]: string[];
  };
  stageVariables?: {
    [name: string]: string;
  };
  requestContext?: typeof defaultRequestContext;
  resource?: string;
};

export default function createAPIGatewayEvent({
  body = null,
  headers = {},
  multiValueHeaders = {},
  httpMethod = "",
  isBase64Encoded = false,
  pathParameters = null,
  path = "",
  queryStringParameters = null,
  multiValueQueryStringParameters = {},
  stageVariables = {},
  requestContext = defaultRequestContext,
  resource = "",
}: CreateAPIGatewayEventOptions = {}): APIGatewayEvent {
  return {
    body,
    headers,
    multiValueHeaders,
    httpMethod,
    isBase64Encoded,
    path,
    pathParameters,
    queryStringParameters,
    multiValueQueryStringParameters,
    stageVariables,
    requestContext,
    resource,
  } as APIGatewayEvent;
}
