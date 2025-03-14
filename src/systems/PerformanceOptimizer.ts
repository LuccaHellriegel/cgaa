import { Scene } from "phaser";
import { assert } from "../utils/assert";

export class PerformanceOptimizer {
  private scene: Scene;
  private objectPools: Map<string, Phaser.GameObjects.Group> = new Map();
  private staticLayers: Map<string, Phaser.GameObjects.Container> = new Map();
  private debugGraphics: Phaser.GameObjects.Graphics | null = null;
  private isDebugMode: boolean = false;

  constructor(scene: Scene) {
    assert(scene instanceof Scene, "Must provide a valid Phaser Scene", {
      providedType: typeof scene,
      isScene: scene instanceof Scene,
    });
    this.scene = scene;

    // Initialize performance optimizations
    this.setupCulling();
    this.setupObjectPools();
    this.setupStaticLayers();
    this.setupDebugMode();
  }

  private setupCulling(): void {
    // Enable camera culling with padding to prevent pop-in
    const camera = this.scene.cameras.main;
    if (camera) {
      (camera as any).useCulling = true;
      (camera as any).cullPadding = 100;
    }
  }

  private setupObjectPools(): void {
    // Create object pools for frequently created objects
    this.createPool("projectiles", 50);
    this.createPool("enemies", 100);
    this.createPool("particles", 200);

    // TODO: Integrate object pools with actual game components
    // Currently pools are created but not consistently used across the game
    // Enemy creation, projectiles, and particles should all use these pools
  }

  private createPool(key: string, size: number): void {
    const group = this.scene.add.group({
      defaultKey: key,
      maxSize: size,
      active: false,
      visible: false,
    });
    this.objectPools.set(key, group);
  }

  private setupStaticLayers(): void {
    // Create layers for different types of static content
    this.createStaticLayer("background", 0);
    this.createStaticLayer("terrain", 10);
    this.createStaticLayer("decorations", 20);
  }

  private createStaticLayer(name: string, depth: number): void {
    const container = this.scene.add.container(0, 0);
    container.setDepth(depth);
    this.staticLayers.set(name, container);
  }

  private setupDebugMode(): void {
    // Create debug graphics for performance monitoring
    this.debugGraphics = this.scene.add.graphics();
    if (this.debugGraphics) {
      this.debugGraphics.setDepth(1000);
    }

    // Toggle debug mode with 'P' key
    if (this.scene.input?.keyboard) {
      this.scene.input.keyboard.on("keydown-P", () => {
        this.isDebugMode = !this.isDebugMode;
        if (this.debugGraphics) {
          this.debugGraphics.clear();
        }
      });
    }
  }

  public getFromPool(key: string): Phaser.GameObjects.GameObject | null {
    const pool = this.objectPools.get(key);
    if (!pool) return null;

    const obj = pool.get();
    if (!obj) {
      console.warn(`Pool ${key} is empty, consider increasing size`);
      return null;
    }

    return obj;
  }

  public returnToPool(obj: Phaser.GameObjects.GameObject, key: string): void {
    const pool = this.objectPools.get(key);
    if (!pool) return;

    pool.killAndHide(obj);
    pool.remove(obj, true, true);

    // TODO: Implement proper object reuse
    // Objects need to be reset to initial state before reuse
    // Properties should be cleared to prevent state leakage between uses
  }

  public addToStaticLayer(
    name: string,
    obj: Phaser.GameObjects.GameObject
  ): void {
    const layer = this.staticLayers.get(name);
    if (!layer) {
      console.warn(`Static layer ${name} does not exist`);
      return;
    }

    layer.add(obj);
  }

  public optimizeStaticContent(): void {
    this.staticLayers.forEach((layer) => {
      // Convert static elements to a single texture for better performance
      const bounds = layer.getBounds();
      const renderTexture = this.scene.add.renderTexture(
        bounds.x,
        bounds.y,
        bounds.width,
        bounds.height
      );

      renderTexture.draw(layer);
      layer.removeAll(true);
      layer.add(renderTexture);
    });

    // TODO: Implement texture atlas generation for dynamic content
    // Group similar textures into atlases to reduce draw calls
  }

  public update(): void {
    if (!this.isDebugMode || !this.debugGraphics) return;

    this.debugGraphics.clear();
    this.debugGraphics.lineStyle(1, 0x00ff00);

    // Draw debug information
    this.drawPoolStats();
    this.drawCullingBounds();
    this.drawPerformanceMetrics();

    // TODO: Add detailed performance monitoring
    // Track frame time, memory usage, and garbage collection events
    // Show warning indicators when performance drops below thresholds
  }

  private drawPoolStats(): void {
    let y = 10;
    this.objectPools.forEach((pool, key) => {
      const stats = `${key}: ${pool.getTotalUsed()}/${pool.maxSize}`;
      this.scene.add.text(10, y, stats, {
        fontSize: "12px",
        color: "#00ff00",
      });
      y += 20;
    });
  }

  private drawCullingBounds(): void {
    if (!this.debugGraphics) return;

    const camera = this.scene.cameras.main;
    if (!camera) return;

    const cullPadding = (camera as any).cullPadding || 0;
    this.debugGraphics.strokeRect(
      camera.scrollX - cullPadding,
      camera.scrollY - cullPadding,
      camera.width + cullPadding * 2,
      camera.height + cullPadding * 2
    );
  }

  private drawPerformanceMetrics(): void {
    const metrics = {
      fps: this.scene.game.loop.actualFps.toFixed(1),
      objects: this.scene.children.length,
      drawCalls: (this.scene.renderer as any).textureGC?.textureCount || 0,
    };

    let y = this.scene.scale.height - 60;
    Object.entries(metrics).forEach(([key, value]) => {
      this.scene.add.text(10, y, `${key}: ${value}`, {
        fontSize: "12px",
        color: "#00ff00",
      });
      y += 20;
    });
  }

  public destroy(): void {
    // Clean up resources
    this.objectPools.forEach((pool) => pool.destroy());
    this.staticLayers.forEach((layer) => layer.destroy());
    if (this.debugGraphics) {
      this.debugGraphics.destroy();
    }
  }
}
