/**
 * Calculates the size of a circle texture based on radius and stroke width.
 * @param radius The radius of the circle.
 * @param strokeWidth The width of the stroke around the circle.
 * @returns The size of the texture.
 */
export function calculateTextureSize(radius: number, strokeWidth = 0): number {
  const padding = strokeWidth > 0 ? strokeWidth : 0;
  return radius * 2 + padding * 2;
}

/**
 * Calculates the size of a triangle texture based on side length and stroke width.
 * @param sideLength The length of each side of the equilateral triangle.
 * @param strokeWidth The width of the stroke around the triangle.
 * @returns The size of the texture.
 */
export function calculateTriangleTextureSize(
  sideLength: number,
  strokeWidth = 0
): number {
  const padding = strokeWidth > 0 ? strokeWidth * 2 : 0;
  // Height of equilateral triangle = (√3/2) * side length
  const height = (Math.sqrt(3) / 2) * sideLength;
  // Return the maximum dimension plus padding
  return Math.max(sideLength, height) + padding;
}

/**
 * Converts a number color to a hex string.
 * @param color The color as a number.
 * @returns The color as a hex string.
 */
export function colorToHex(color: number): string {
  return `#${color.toString(16).padStart(6, "0")}`;
}

/**
 * Calculates the total number of textures to generate for a range of radii and colors.
 * @param radiusMin The minimum radius.
 * @param radiusMax The maximum radius.
 * @param radiusStep The step size between radius values.
 * @param colorCount The number of colors.
 * @returns The total number of textures to generate.
 */
export function calculateTotalTextures(
  radiusMin: number,
  radiusMax: number,
  radiusStep: number,
  colorCount: number
): number {
  const radiusCount = Math.floor((radiusMax - radiusMin) / radiusStep) + 1;
  return radiusCount * colorCount;
}

/**
 * Creates a texture key from the texture properties.
 * @param radius The radius of the circle.
 * @param color The color of the circle.
 * @param strokeColor The color of the stroke (optional).
 * @param strokeWidth The width of the stroke (optional).
 * @returns A string key for the texture.
 */
export function createTextureKey(
  radius: number,
  color: number,
  strokeColor = 0,
  strokeWidth = 0
): string {
  return `circle_${radius}_${color}_${strokeColor}_${strokeWidth}`;
}

/**
 * Creates a texture key for a triangle from the texture properties.
 * @param sideLength The side length of the triangle.
 * @param color The color of the triangle.
 * @param strokeColor The color of the stroke (optional).
 * @param strokeWidth The width of the stroke (optional).
 * @returns A string key for the texture.
 */
export function createTriangleTextureKey(
  sideLength: number,
  color: number,
  strokeColor = 0,
  strokeWidth = 0
): string {
  return `triangle_${sideLength}_${color}_${strokeColor}_${strokeWidth}`;
}
