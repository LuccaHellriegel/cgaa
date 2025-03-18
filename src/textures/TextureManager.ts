import { Scene } from "phaser";
import {
  CircleTextureOptions,
  TextureGenerator,
  TriangleTextureOptions,
} from "./TextureGenerator";
import { calculateTotalTextures } from "./utils";

/**
 * TextureManager is a singleton service responsible for managing
 * all textures in the game.
 */
export class TextureManager {
  private static instance: TextureManager | null = null;
  private generator: TextureGenerator;

  /**
   * Configuration for standard circle sizes and colors.
   */
  private readonly config = {
    circles: {
      radiusRange: { min: 5, max: 50, step: 5 },
      colors: [
        0xff0000, // Red
        0x00ff00, // Green
        0x0000ff, // Blue
        0xffff00, // Yellow
        0xff00ff, // Magenta
        0x00ffff, // Cyan
        0xffffff, // White
      ],
    },
    triangles: {
      sideLengthRange: { min: 10, max: 60, step: 10 },
      colors: [
        0xff0000, // Red
        0x00ff00, // Green
        0x0000ff, // Blue
        0xffff00, // Yellow
        0xff00ff, // Magenta
        0x00ffff, // Cyan
        0xffffff, // White
      ],
    },
  };

  /**
   * Creates a new TextureManager instance.
   * @param scene The scene to associate with this manager.
   */
  private constructor(scene: Scene) {
    this.generator = new TextureGenerator(scene);
  }

  /**
   * Gets the singleton instance of TextureManager.
   * @param scene The scene to associate with this manager.
   * @returns The TextureManager instance.
   */
  public static getInstance(scene: Scene): TextureManager {
    if (!TextureManager.instance) {
      TextureManager.instance = new TextureManager(scene);
    }
    return TextureManager.instance;
  }

  /**
   * Generates all textures for the game.
   * @param progressCallback Optional callback for reporting progress.
   */
  public generateAllTextures(
    progressCallback?: (progress: number) => void
  ): void {
    // Calculate the total number of textures to generate
    const { radiusRange, colors: circleColors } = this.config.circles;
    const { sideLengthRange, colors: triangleColors } = this.config.triangles;

    const totalCircleTextures = calculateTotalTextures(
      radiusRange.min,
      radiusRange.max,
      radiusRange.step,
      circleColors.length
    );

    const totalTriangleTextures = calculateTotalTextures(
      sideLengthRange.min,
      sideLengthRange.max,
      sideLengthRange.step,
      triangleColors.length
    );

    const totalTextures = totalCircleTextures + totalTriangleTextures;

    let generatedCount = 0;

    // Generate all circle textures
    for (
      let radius = radiusRange.min;
      radius <= radiusRange.max;
      radius += radiusRange.step
    ) {
      for (const color of circleColors) {
        this.generator.generateCircleTexture({ radius, color });

        // Update progress
        generatedCount++;
        if (progressCallback) {
          progressCallback(generatedCount / totalTextures);
        }
      }
    }

    // Generate all triangle textures
    for (
      let sideLength = sideLengthRange.min;
      sideLength <= sideLengthRange.max;
      sideLength += sideLengthRange.step
    ) {
      for (const color of triangleColors) {
        this.generator.generateTriangleTexture({ sideLength, color });

        // Update progress
        generatedCount++;
        if (progressCallback) {
          progressCallback(generatedCount / totalTextures);
        }
      }
    }
  }

  /**
   * Gets a circle texture with the specified options.
   * @param options The options for the circle texture.
   * @returns The key for the texture.
   */
  public getCircleTexture(options: CircleTextureOptions): string {
    return this.generator.getCircleTexture(options);
  }

  /**
   * Gets a triangle texture with the specified options.
   * @param options The options for the triangle texture.
   * @returns The key for the texture.
   */
  public getTriangleTexture(options: TriangleTextureOptions): string {
    return this.generator.getTriangleTexture(options);
  }
}
