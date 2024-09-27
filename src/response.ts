/**
 * Decoded handler response
 */
export type Response<T> = {
  // the response provided by the handler
  data: T;
  // the HTTP status code
  status: number;
  // response headers
  headers: {
    [header: string]: boolean | number | string;
  };
};
