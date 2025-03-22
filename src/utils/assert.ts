/**
 * Type guard that asserts a value is not null or undefined
 */
export function assertExists<T>(
  value: T | null | undefined,
  message?: string
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message || `Expected value to exist but got ${value}`);
  }
}

/**
 * Assert with type narrowing that returns the input value
 */
export function assert<T>(condition: boolean, message: string, value: T): T {
  if (!condition) {
    throw new Error(message);
  }
  return value;
}

/**
 * Asserts that a value is not null/undefined and returns it
 */
export function assertValue<T>(
  value: T | null | undefined,
  message?: string
): T {
  if (value === null || value === undefined) {
    throw new Error(message || `Expected value to exist but got ${value}`);
  }
  return value;
}

/**
 * Asserts that a number is within a range
 */
export function assertRange(
  value: number,
  min: number,
  max: number,
  message?: string
): number {
  if (value < min || value > max) {
    throw new Error(
      message ||
        `Expected value to be between ${min} and ${max}, but got ${value}`
    );
  }
  return value;
}

/**
 * Asserts that an array is not empty
 */
export function assertNonEmpty<T>(
  array: T[],
  message?: string
): NonEmptyArray<T> {
  if (array.length === 0) {
    throw new Error(message || "Expected array to be non-empty");
  }
  return array as NonEmptyArray<T>;
}

// Type helper for non-empty arrays
type NonEmptyArray<T> = T[] & { 0: T };

/**
 * Assert that a condition is true without returning a value
 * Useful for pure validation checks where we don't need the value back
 * @param condition The condition to check
 * @param message The error message to display if the assertion fails
 */
export function assertCondition(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}
