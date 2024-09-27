/**
 * Stringify to JSON, returning a string or else throwing an exception because of unserializable input.
 *
 * @param value
 * @returns {string}
 */
// flowlint-next-line unclear-type:off
export default function jsonStringify(value: any): string {
  const result = JSON.stringify(value);
  if (result == null) {
    throw new Error("Cannot stringify value");
  }
  return result;
}
