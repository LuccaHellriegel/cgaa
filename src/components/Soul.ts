import { Scene, Physics } from "phaser";
import { assert } from "../utils/assert";

export class Soul {
  private sprite: Physics.Arcade.Sprite;
  private value: number;
  private floatTween: Phaser.Tweens.Tween | null;

  constructor(scene: Scene, x: number, y: number, value: number = 1) {
    assert(scene instanceof Scene, "Must provide a valid Phaser Scene", {
      providedType: typeof scene,
      isScene: scene instanceof Scene,
    });
    assert(typeof x === "number", "X position must be a number");
    assert(typeof y === "number", "Y position must be a number");
    assert(
      typeof value === "number" && value > 0,
      "Value must be a positive number"
    );

    this.value = value;

    // Create sprite
    this.sprite = scene.physics.add.sprite(x, y, "soul");
    this.sprite.setScale(0.5);

    // Add to physics
    scene.physics.add.existing(this.sprite);

    // Create floating animation
    this.floatTween = scene.tweens.add({
      targets: this.sprite,
      y: y - 10,
      duration: 1000,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });
  }

  public getSprite(): Physics.Arcade.Sprite {
    return this.sprite;
  }

  public getValue(): number {
    return this.value;
  }

  public destroy(): void {
    if (this.floatTween) {
      this.floatTween.stop();
      this.floatTween.remove();
      this.floatTween = null;
    }
    this.sprite.destroy();
  }
}
