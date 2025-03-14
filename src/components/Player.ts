import { Scene, Physics } from "phaser";
import { assert } from "../utils/assert";

export class Player {
  private scene: Scene;
  private sprite: Physics.Arcade.Sprite;
  private health: number;
  private maxHealth: number;
  private speed: number;
  private isDead: boolean;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private healthBar: Phaser.GameObjects.Rectangle;

  constructor(scene: Scene) {
    assert(scene instanceof Scene, "Must provide a valid Phaser Scene", {
      providedType: typeof scene,
      isScene: scene instanceof Scene,
    });

    this.scene = scene;
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.speed = 200;
    this.isDead = false;

    // Create sprite
    this.sprite = scene.physics.add.sprite(0, 0, "player");
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setScale(1.5); // Make the player a bit larger

    // Check if animation exists
    assert(
      this.scene.anims.exists("player_idle"),
      "player_idle animation must exist",
      { animationKey: "player_idle" }
    );

    // Start with idle animation
    this.sprite.play("player_idle");

    // Create health bar
    this.healthBar = scene.add.rectangle(0, -30, 32, 4, 0x00ff00);

    // Set up keyboard input
    const keyboard = scene.input.keyboard;
    if (!keyboard) {
      throw new Error("Scene must have keyboard input system");
    }
    this.cursors = keyboard.createCursorKeys();

    // Emit player ready event
    scene.events.emit("player-ready", this);
  }

  public setPosition(x: number, y: number): void {
    assert(typeof x === "number", "X position must be a number");
    assert(typeof y === "number", "Y position must be a number");

    this.sprite.setPosition(x, y);
  }

  public getSprite(): Physics.Arcade.Sprite {
    return this.sprite;
  }

  public getHealth(): number {
    return this.health;
  }

  public getMaxHealth(): number {
    return this.maxHealth;
  }

  public takeDamage(amount: number): void {
    assert(
      typeof amount === "number" && amount > 0,
      "Damage amount must be a positive number"
    );

    this.health = Math.max(0, this.health - amount);
    if (this.health === 0 && !this.isDead) {
      this.isDead = true;
      this.scene.events.emit("playerDeath");
    }
  }

  public heal(amount: number): void {
    assert(
      typeof amount === "number" && amount > 0,
      "Heal amount must be a positive number"
    );

    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  public update(_time: number, delta: number): void {
    if (this.isDead) return;

    // Calculate movement vector based on keyboard input
    const movementVector = new Phaser.Math.Vector2(0, 0);

    if (this.cursors.left.isDown) {
      movementVector.x -= 1;
    }
    if (this.cursors.right.isDown) {
      movementVector.x += 1;
    }
    if (this.cursors.up.isDown) {
      movementVector.y -= 1;
    }
    if (this.cursors.down.isDown) {
      movementVector.y += 1;
    }

    // Normalize and apply movement
    if (movementVector.length() > 0) {
      movementVector.normalize();
      // Apply speed adjusted for frame time
      const frameSpeed = (this.speed * delta) / 1000;
      this.sprite.x += movementVector.x * frameSpeed;
      this.sprite.y += movementVector.y * frameSpeed;
    }

    // Update health bar position
    if (this.healthBar) {
      this.healthBar.setPosition(this.sprite.x, this.sprite.y - 30);
      this.healthBar.setScale(this.health / this.maxHealth, 1);
    }
  }

  public destroy(): void {
    this.sprite.destroy();
  }
}
