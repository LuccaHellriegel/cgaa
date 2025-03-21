import { Scene } from "phaser";
import { TextureManager } from "../textures/TextureManager";
import { Weapon, WeaponConfig } from "./Weapon";

export interface ChainWeaponConfig extends WeaponConfig {
  linkCount?: number;
  linkSize?: number;
  headSize?: number;
  retractSpeed?: number;
  extendSpeed?: number;
}

/**
 * ChainWeapon - A weapon consisting of a series of circles with a triangle head.
 * This follows the specification from the chain-weapon.md file.
 */
export class ChainWeapon extends Weapon {
  private links: Phaser.GameObjects.Sprite[] = [];
  private head: Phaser.GameObjects.Sprite;
  private handle: Phaser.GameObjects.Sprite;

  private linkCount: number;
  private linkSize: number;
  private headSize: number;

  private isExtended: boolean = false;
  private timeline: Phaser.Tweens.TimelineConfig | null = null;
  private extendSpeed: number;
  private retractSpeed: number;

  // Store the initial positions for all links
  private basePositions: Phaser.Math.Vector2[] = [];

  constructor(config: ChainWeaponConfig) {
    super(config);

    // Default configuration values
    this.linkCount = config.linkCount || 5;
    this.linkSize = config.linkSize || 10;
    this.headSize = config.headSize || 20;
    this.extendSpeed = config.extendSpeed || 400;
    this.retractSpeed = config.retractSpeed || 300;

    const headColor = config.headColor || 0xff0000;
    const bodyColor = config.bodyColor || 0xffffff;
    const strokeColor = config.strokeColor || 0x000000;
    const strokeWidth = config.strokeWidth || 1;

    // Get the TextureManager from the registry
    const textureManager = this.scene.registry.get(
      "textureManager"
    ) as TextureManager;

    // Create the triangle head
    const headTextureKey = textureManager.getTriangleTexture({
      sideLength: this.headSize,
      color: headColor,
      strokeColor,
      strokeWidth,
    });

    this.head = this.scene.add.sprite(0, 0, headTextureKey);
    this.head.setOrigin(0.5, 1); // Set origin to bottom center
    this.add(this.head);

    // Create the chain links
    for (let i = 0; i < this.linkCount; i++) {
      const linkTextureKey = textureManager.getCircleTexture({
        radius: this.linkSize,
        color: bodyColor,
        strokeColor,
        strokeWidth,
      });

      // Position links in a line, starting from base
      const y = (i + 1) * (this.linkSize * 2) + this.headSize / 2;
      const link = this.scene.add.sprite(0, y, linkTextureKey);

      // Store initial position for retracting
      this.basePositions.push(new Phaser.Math.Vector2(0, y));

      this.links.push(link);
      this.add(link);
    }

    // Create the handle (base of the chain)
    const handleTextureKey = textureManager.getCircleTexture({
      radius: this.linkSize * 1.5,
      color: headColor,
      strokeColor,
      strokeWidth,
    });

    const handleY =
      this.linkCount * (this.linkSize * 2) + this.headSize / 2 + this.linkSize;
    this.handle = this.scene.add.sprite(0, handleY, handleTextureKey);
    this.add(this.handle);

    // Set depth values to ensure proper layering
    this.head.setDepth(10);
    this.links.forEach((link, index) => {
      link.setDepth(9 - index); // Earlier links are on top
    });
    this.handle.setDepth(0);
  }

  /**
   * Activate the weapon, extending the chain toward the target.
   * @param target The target position to extend toward
   */
  activate(target: Phaser.Math.Vector2): void {
    if (this.isExtended) {
      return; // Don't activate if already extended
    }

    // Calculate the angle to the target
    const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);

    // Rotate the weapon to face the target
    this.rotation = angle + Math.PI / 2; // Add 90 degrees because our weapon points up by default

    // Calculate a bezier path for natural chain movement
    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      target.x,
      target.y
    );
    const controlPoint = new Phaser.Math.Vector2(
      this.x +
        Math.cos(angle) * distance * 0.5 -
        Math.sin(angle) * distance * 0.2,
      this.y +
        Math.sin(angle) * distance * 0.5 +
        Math.cos(angle) * distance * 0.2
    );

    const points = this.calculateBezierPath(
      new Phaser.Math.Vector2(0, 0), // Local space origin
      new Phaser.Math.Vector2(0, -distance), // Target in local space (up)
      controlPoint
    );

    // Create tweens for animation
    // Tween for the head
    this.scene.tweens.add({
      targets: this.head,
      y: -distance,
      ease: "Cubic.easeOut",
      duration: this.extendSpeed,
    });

    // Add tweens for each link with staggered timing
    this.links.forEach((link, index) => {
      const offset = index * (this.extendSpeed / this.linkCount);

      this.scene.tweens.add({
        targets: link,
        y:
          this.basePositions[index].y - distance * (1 - index / this.linkCount),
        ease: "Cubic.easeOut",
        delay: offset,
      });
    });

    // Set flag
    this.isExtended = true;

    // Add collision detection to the head
    if (this.scene.physics.world) {
      this.scene.physics.world.enable(this.head);
      const body = this.head.body as Phaser.Physics.Arcade.Body;
      body.setSize(this.headSize, this.headSize);
    }
  }

  /**
   * Deactivate the weapon, retracting the chain back to its original position.
   */
  deactivate(): void {
    if (!this.isExtended) {
      return;
    }

    // Stop all existing tweens for our links and head
    this.scene.tweens.killTweensOf([this.head, ...this.links]);

    // Retract the links in reverse order (from the base up)
    for (let i = this.links.length - 1; i >= 0; i--) {
      const link = this.links[i];
      const delay =
        (this.links.length - 1 - i) * (this.retractSpeed / this.linkCount);

      this.scene.tweens.add({
        targets: link,
        y: this.basePositions[i].y,
        ease: "Cubic.easeIn",
        delay: delay,
      });
    }

    // Retract the head last
    this.scene.tweens.add({
      targets: this.head,
      y: 0,
      ease: "Cubic.easeIn",
      delay: this.links.length * (this.retractSpeed / this.linkCount),
      onComplete: () => {
        this.isExtended = false;

        // Disable physics on the head
        if (this.scene.physics.world) {
          this.scene.physics.world.disable(this.head);
        }
      },
    });
  }

  /**
   * Update method called by the scene's update loop.
   * @param time The current time
   * @param delta The time in ms since the last frame
   */
  update(time: number, delta: number): void {
    // Update logic, such as responding to collisions
    if (this.isExtended && this.scene.physics.world) {
      const headBody = this.head.body as Phaser.Physics.Arcade.Body;
      if (headBody && headBody.embedded) {
        // If the head hits something, retract
        this.deactivate();
      }
    }
  }

  /**
   * Calculate a bezier path for the chain movement.
   * @param start The start position in local coordinates
   * @param end The end position in local coordinates
   * @param control The control point for the bezier curve
   * @returns An array of positions along the path
   */
  private calculateBezierPath(
    start: Phaser.Math.Vector2,
    end: Phaser.Math.Vector2,
    control: Phaser.Math.Vector2
  ): Phaser.Math.Vector2[] {
    const curve = new Phaser.Curves.QuadraticBezier(start, control, end);
    const points: Phaser.Math.Vector2[] = [];

    // Generate positions for each link
    for (let i = 0; i <= this.linkCount; i++) {
      const t = i / this.linkCount;
      points.push(curve.getPoint(t));
    }

    return points;
  }

  /**
   * Get the head of the chain weapon for collision detection.
   */
  getHead(): Phaser.GameObjects.Sprite {
    return this.head;
  }

  /**
   * Set the level of detail for the chain based on distance from camera.
   * @param interval Show every nth link
   */
  setLinkInterval(interval: number): void {
    this.links.forEach((link, index) => {
      link.setVisible(index % interval === 0);
    });
  }
}
