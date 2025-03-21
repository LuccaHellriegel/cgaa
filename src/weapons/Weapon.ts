import { Scene } from "phaser";

/**
 * Interface for all weapons in the game.
 * This follows the "Composition Over Inheritance" principle,
 * as specified in the requirements.
 */
export interface WeaponConfig {
  x: number;
  y: number;
  scene: Scene;
  headColor?: number;
  bodyColor?: number;
  strokeColor?: number;
  strokeWidth?: number;
}

/**
 * Abstract weapon class that all weapons should extend.
 * Implements the base functionality for all weapons.
 */
export abstract class Weapon extends Phaser.GameObjects.Container {
  public scene: Scene;

  constructor(config: WeaponConfig) {
    super(config.scene, config.x, config.y);
    this.scene = config.scene;

    // Add this container to the scene
    config.scene.add.existing(this);
  }

  /**
   * Activate the weapon (e.g., extend a chain, fire a projectile)
   * @param target The target position to aim at
   */
  abstract activate(target: Phaser.Math.Vector2): void;

  /**
   * Deactivate the weapon (e.g., retract a chain)
   */
  abstract deactivate(): void;

  /**
   * Update method called by the scene's update loop
   * @param time The current time
   * @param delta The time in ms since the last frame
   */
  abstract update(time: number, delta: number): void;
}
