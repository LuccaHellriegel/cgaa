import { Scene } from "phaser";
import { calculateTextureSize, colorToHex, createTextureKey } from "./utils";

export interface CircleTextureOptions {
  radius: number;
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
   * Creates a consistent key string for a texture based on its properties.
   * @param options The options for the circle texture.
   * @returns A string key.
   */
  private getCircleTextureKey(options: CircleTextureOptions): string {
    const { radius, color, strokeColor = 0, strokeWidth = 0 } = options;
    return createTextureKey(radius, color, strokeColor, strokeWidth);
  }
}
