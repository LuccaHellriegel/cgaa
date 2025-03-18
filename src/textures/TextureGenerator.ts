import { Scene } from "phaser";
import {
  calculateTextureSize,
  calculateTriangleTextureSize,
  colorToHex,
  createTextureKey,
  createTriangleTextureKey,
} from "./utils";

export interface CircleTextureOptions {
  radius: number;
  color: number;
  strokeColor?: number;
  strokeWidth?: number;
}

export interface TriangleTextureOptions {
  sideLength: number;
  color: number;
  strokeColor?: number;
  strokeWidth?: number;
}

/**
 * TextureGenerator handles the creation of circle textures.
 * It generates all textures during the game's loading phase.
 */
export class TextureGenerator {
  private scene: Scene;
  private textureKeys: Map<string, string>;

  constructor(scene: Scene) {
    this.scene = scene;
    this.textureKeys = new Map();
  }

  /**
   * Generates a circle texture with the given options.
   * @param options The options for the circle texture.
   * @returns The key of the generated texture.
   */
  public generateCircleTexture(options: CircleTextureOptions): string {
    const { radius, color, strokeColor, strokeWidth = 0 } = options;

    // Create a consistent key for the texture based on its properties
    const key = this.getCircleTextureKey(options);

    // Check if we already generated this texture
    if (this.textureKeys.has(key)) {
      return this.textureKeys.get(key)!;
    }

    // Calculate the actual canvas size (diameter plus any stroke)
    const size = calculateTextureSize(radius, strokeWidth);

    // Create a canvas with the calculated size
    const canvas = this.scene.textures.createCanvas(key, size, size);
    if (!canvas) {
      console.error("Failed to create canvas texture with key:", key);
      return key;
    }

    const ctx = canvas.getContext();

    // Clear the canvas
    ctx.clearRect(0, 0, size, size);

    // Draw the circle
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2);

    // Fill the circle
    ctx.fillStyle = colorToHex(color);
    ctx.fill();

    // Add stroke if specified
    if (strokeWidth > 0 && strokeColor !== undefined) {
      ctx.strokeStyle = colorToHex(strokeColor);
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }

    // Update the canvas texture
    canvas.refresh();

    // Store the key for future reference
    this.textureKeys.set(key, key);

    return key;
  }

  /**
   * Generates a triangle texture with the given options.
   * @param options The options for the triangle texture.
   * @returns The key of the generated texture.
   */
  public generateTriangleTexture(options: TriangleTextureOptions): string {
    const { sideLength, color, strokeColor, strokeWidth = 0 } = options;

    // Create a consistent key for the texture based on its properties
    const key = this.getTriangleTextureKey(options);

    // Check if we already generated this texture
    if (this.textureKeys.has(key)) {
      return this.textureKeys.get(key)!;
    }

    // Calculate the actual canvas size
    const size = calculateTriangleTextureSize(sideLength, strokeWidth);

    // Create a canvas with the calculated size
    const canvas = this.scene.textures.createCanvas(key, size, size);
    if (!canvas) {
      console.error("Failed to create canvas texture with key:", key);
      return key;
    }

    const ctx = canvas.getContext();

    // Clear the canvas
    ctx.clearRect(0, 0, size, size);

    // Calculate the height of the equilateral triangle
    const height = (Math.sqrt(3) / 2) * sideLength;

    // Add padding to ensure the stroke doesn't get clipped
    const padding = strokeWidth > 0 ? strokeWidth : 0;

    // Calculate the coordinates of the triangle
    // Center the triangle in the canvas
    const centerX = size / 2;
    const centerY = size / 2;
    const top = [centerX, centerY - height / 2 + padding / 2];
    const bottomLeft = [
      centerX - sideLength / 2 + padding / 2,
      centerY + height / 2 - padding / 2,
    ];
    const bottomRight = [
      centerX + sideLength / 2 - padding / 2,
      centerY + height / 2 - padding / 2,
    ];

    // Draw the triangle
    ctx.beginPath();
    ctx.moveTo(top[0], top[1]);
    ctx.lineTo(bottomLeft[0], bottomLeft[1]);
    ctx.lineTo(bottomRight[0], bottomRight[1]);
    ctx.closePath();

    // Fill the triangle
    ctx.fillStyle = colorToHex(color);
    ctx.fill();

    // Add stroke if specified
    if (strokeWidth > 0 && strokeColor !== undefined) {
      ctx.strokeStyle = colorToHex(strokeColor);
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }

    // Update the canvas texture
    canvas.refresh();

    // Store the key for future reference
    this.textureKeys.set(key, key);

    return key;
  }

  /**
   * Gets a previously generated circle texture by its properties.
   * If the texture doesn't exist, it creates it.
   * @param options The options for the circle texture.
   * @returns The key of the texture.
   */
  public getCircleTexture(options: CircleTextureOptions): string {
    const key = this.getCircleTextureKey(options);

    if (!this.textureKeys.has(key)) {
      return this.generateCircleTexture(options);
    }

    return this.textureKeys.get(key)!;
  }

  /**
   * Gets a previously generated triangle texture by its properties.
   * If the texture doesn't exist, it creates it.
   * @param options The options for the triangle texture.
   * @returns The key of the texture.
   */
  public getTriangleTexture(options: TriangleTextureOptions): string {
    const key = this.getTriangleTextureKey(options);

    if (!this.textureKeys.has(key)) {
      return this.generateTriangleTexture(options);
    }

    return this.textureKeys.get(key)!;
  }

  /**
   * Generates all circle textures with the specified ranges.
   * @param radiusRange The range of radii to generate textures for.
   * @param colors The colors to generate textures for.
   */
  public generateAllCircleTextures(
    radiusRange: { min: number; max: number; step: number },
    colors: number[]
  ): void {
    const { min, max, step } = radiusRange;

    for (let radius = min; radius <= max; radius += step) {
      for (const color of colors) {
        this.generateCircleTexture({ radius, color });
      }
    }
  }

  /**
   * Generates all triangle textures with the specified ranges.
   * @param sideLengthRange The range of side lengths to generate textures for.
   * @param colors The colors to generate textures for.
   */
  public generateAllTriangleTextures(
    sideLengthRange: { min: number; max: number; step: number },
    colors: number[]
  ): void {
    const { min, max, step } = sideLengthRange;

    for (let sideLength = min; sideLength <= max; sideLength += step) {
      for (const color of colors) {
        this.generateTriangleTexture({ sideLength, color });
      }
    }
  }

  /**
   * Creates a consistent key string for a texture based on its properties.
   * @param options The options for the circle texture.
   * @returns A string key.
   */
  private getCircleTextureKey(options: CircleTextureOptions): string {
    const { radius, color, strokeColor = 0, strokeWidth = 0 } = options;
    return createTextureKey(radius, color, strokeColor, strokeWidth);
  }

  /**
   * Creates a consistent key string for a triangle texture based on its properties.
   * @param options The options for the triangle texture.
   * @returns A string key.
   */
  private getTriangleTextureKey(options: TriangleTextureOptions): string {
    const { sideLength, color, strokeColor = 0, strokeWidth = 0 } = options;
    return createTriangleTextureKey(
      sideLength,
      color,
      strokeColor,
      strokeWidth
    );
  }
}
