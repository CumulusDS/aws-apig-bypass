/**
 * Stringify to JSON, returning a string or else throwing an exception because of unserializable input.
 *
 * @param value
 * @returns {string}
 */
export default function jsonStringify(value: unknown): string {
  const result = JSON.stringify(value);
  if (result == null) {
    throw new Error("Cannot stringify value");
  }
  return result;
}
