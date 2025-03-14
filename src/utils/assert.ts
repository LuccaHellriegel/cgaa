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
