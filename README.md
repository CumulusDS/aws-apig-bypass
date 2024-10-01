# AWS APIG Bypass

Bypass the API Gateway by directly invoking the Lambda handler that backs an endpoint.

We often build externally accessible REST endpoints using API Gateway and Lambda. Sometimes we have an endpoint with both internal and external (outside of AWS) clients. The API Gateway provides some value to external clients, since it helps authorize and rate-limit requests. However, it is a hindrance to internal clients, where we have other means of rate-limiting. Access control is often more consistent if we rely on IAM policies. The API Gateway adds cost and reduces convenience for internal clients.

This library provides an adapter for the Lambda SDK to make it easy to directly invoke the handler.

```flow js
import { createAPIGatewayEvent, createClient } from "@cumulusds/aws-apig-bypass";
import { Lambda } from "aws-sdk";

function getLunches(location: string, category: string): Promise<Array<Lunch>> {
  const getLunchIndex = createClient<LunchIndex>({ Lambda: new Lambda(), FunctionName: `LunchService-dev-index` });
  const { data, status } = getLunchIndex(createAPIGatewayEvent({ pathParameters: { location, category } }));
  if (status !== 200) {
    throw new Error("unexpected status");
  }
  return data;
}
```

# Domain Distillation

## APIG Bypass Client

The APIG Bypass Client adapts the AWS Lambda SDK to more conveniently invoke the handler that backs an API Gateway endpoint. The client encapsulates packing and unpacking of the API Gateway event interface. Use the `createClient` factory function to get a client. The following options are supported:
```flow js
  // AWS SDK Lambda client. Only the invoke function is needed. 
  Lambda: LambdaInvoke,

  // Name (or ARN) of the AWS Lambda function to invoke.
  FunctionName: string,

  // Function to validate the parsed response body. The function should throw an exception if the response is invalid.
  Validate?: T => void
}
```

The client is a function that takes one argument, an API Gateway Event. The client synchronously invokes the handler and returns a promise with the response. The response is like this:
```js
{
  // the decoded response provided by the handler
  data: {},

  // status code provided by the handler
  status: 200,

  // `headers` the HTTP headers that the server responded with
  // All header names are lower cased and can be accessed using the bracket notation.
  // Example: `response.headers['content-type']`
  headers: {}
}
```

## API Gateway Event

Use the createAPIGatewayEvent function to format an event to pass to the APIG Bypass Client.

# Development

- [Package Structure](doc/development.md#package-structure)
- [Development Environment](doc/development.md#development-environment)
- [Quality](doc/development.md#quality)
- [Release](doc/development.md#release)

## License

This package is not licensed.
