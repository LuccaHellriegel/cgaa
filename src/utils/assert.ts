/**
 * Utility function for runtime assertions
 * @param condition - The condition to check
 * @param message - Error message if condition fails
 * @param context - Optional context object for additional error information
 */
export function assert(
  condition: boolean,
  message: string,
  context?: any
): asserts condition {
  if (!condition) {
    const contextStr = context ? ` Context: ${JSON.stringify(context)}` : "";
    const errorMsg = `Assertion failed: ${message}.${contextStr}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Utility function to assert a value is not null and return it
 * @param value - The value to check for null/undefined
 * @param message - Error message if value is null/undefined
 * @returns The non-null value
 */
export function assertNotNull<T>(
  value: T | null | undefined,
  message: string
): T {
  if (value === null || value === undefined) {
    throw new Error(`Assertion failed: ${message}`);
  }
  return value;
}
