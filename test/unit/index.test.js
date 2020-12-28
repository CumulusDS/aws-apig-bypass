// @flow

import type { Lambda$InvocationResponse } from "@cumulusds/flow-aws-sdk/clients/lambda";
import type { AWSError } from "@cumulusds/flow-aws-sdk/lib/error";
import type { Request } from "@cumulusds/flow-aws-sdk/lib/request";
import type { APIGatewayHandlerClient } from "../../src/create-client";
import { createAPIGatewayEvent, createClient } from "../../src";

type ClientPayload = {};

describe("createClient", () => {
  const FunctionName = "service-stage-function";
  const data = { hello: "world" };
  const body = JSON.stringify(data);

  function createLambdaClient({ StatusCode, Payload = JSON.stringify({ statusCode: 200, body }) }) {
    const resolvedValue: Lambda$InvocationResponse = { StatusCode, Payload };

    // $FlowFixMe[incompatible-type] complete Response class is not required.
    const request: Request<Lambda$InvocationResponse, AWSError> = {
      promise: jest.fn().mockResolvedValue(resolvedValue)
    };

    const invoke = jest.fn(() => request);
    const Lambda = {
      invoke
    };
    return { invoke, Lambda };
  }

  describe("when function exists", () => {
    describe("with invocation StatusCode 200", () => {
      const { invoke, Lambda } = createLambdaClient({ StatusCode: 200 });

      it("invokes the Lambda function", async () => {
        const client: APIGatewayHandlerClient<ClientPayload> = createClient<ClientPayload>({
          Lambda,
          FunctionName
        });
        const request = createAPIGatewayEvent();
        expect(await client(request)).toEqual({ data, headers: {}, status: 200 });
        expect(invoke).toHaveBeenCalledWith({ FunctionName, Payload: JSON.stringify(request) });
      });

      it("is unsuccessful given no request", () => {
        const client = createClient<ClientPayload>({
          Lambda,
          FunctionName
        });
        // $FlowFixMe[incompatible-call] this test calls the client with an invalid (undefined) argument to test a runtime error-handling branch that is not accessible with a valid argument
        return expect(client()).rejects.toEqual(new Error("Cannot stringify value"));
      });
    });

    it("is successful with payload statusCode 500", () => {
      const { Lambda } = createLambdaClient({
        StatusCode: 200,
        Payload: JSON.stringify({ statusCode: 500, body })
      });
      const client = createClient<ClientPayload>({
        Lambda,
        FunctionName
      });
      const request = createAPIGatewayEvent({
        pathParameters: {
          site: "sts-playground-test",
          jointIdentifierId: "1234"
        }
      });
      return expect(client(request)).resolves.toEqual({ data, headers: {}, status: 500 });
    });

    it("is unsuccessful with base64-encoded response", () => {
      const { Lambda } = createLambdaClient({
        StatusCode: 200,
        Payload: JSON.stringify({ statusCode: 500, isBase64Encoded: true, body: Buffer.from(body).toString("base64") })
      });
      const client = createClient<ClientPayload>({
        Lambda,
        FunctionName
      });
      const request = createAPIGatewayEvent({
        pathParameters: {
          site: "sts-playground-test",
          jointIdentifierId: "1234"
        }
      });
      return expect(client(request)).rejects.toEqual(
        new Error("A base64 encoded response from API Gateway handler was received, but is not supported.")
      );
    });

    it("is unsuccessful with AWS Lambda API StatusCode 500", () => {
      const { Lambda } = createLambdaClient({ StatusCode: 500 });
      const client = createClient<ClientPayload>({
        Lambda,
        FunctionName
      });
      const request = createAPIGatewayEvent({
        pathParameters: {
          site: "sts-playground-test",
          jointIdentifierId: "1234"
        }
      });
      return expect(client(request)).rejects.toEqual(new Error("AWS Lambda invocation API failed with status 500"));
    });

    it("is unsuccessful with undefined StatusCode", () => {
      const { Lambda } = createLambdaClient({});
      const client = createClient<ClientPayload>({
        Lambda,
        FunctionName
      });
      const request = createAPIGatewayEvent({
        pathParameters: {
          site: "sts-playground-test",
          jointIdentifierId: "1234"
        }
      });
      return expect(client(request)).rejects.toEqual(
        new Error("AWS Lambda invocation API failed with status (no status code)")
      );
    });

    it("is unsuccessful with no request payload", () => {
      const { Lambda } = createLambdaClient({ StatusCode: 200, Payload: null });
      const client = createClient<ClientPayload>({
        Lambda,
        FunctionName
      });
      const request = createAPIGatewayEvent({
        pathParameters: {
          site: "sts-playground-test",
          jointIdentifierId: "1234"
        }
      });
      return expect(client(request)).rejects.toEqual(
        new Error("AWS Lambda invocation API returned the wrong payload type 'object'; expected 'string'")
      );
    });
  });
});
