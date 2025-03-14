import { Scene, Physics } from "phaser";

// Add assertion utility function
function assert(
  condition: boolean,
  message: string,
  context?: any
): asserts condition {
  if (!condition) {
    const contextStr = context ? ` Context: ${JSON.stringify(context)}` : "";
    const errorMsg = `Assertion failed: ${message}.${contextStr}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

export class Player {
  private scene: Scene;
  private sprite: Physics.Arcade.Sprite;
  private health: number;
  private maxHealth: number;
  private speed: number;
  private isDead: boolean;

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

    // Emit player ready event
    this.scene.events.emit("player-ready", this);
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

  public update(): void {
    if (this.isDead) return;

    const keyboard = this.scene.input.keyboard;
    assert(keyboard !== null, "Scene must have keyboard input system");

    const wasdKeys = this.scene.registry.get("wasdKeys");
    if (!wasdKeys) return;

    // Calculate movement vector
    const movement = {
      x: 0,
      y: 0,
    };

    if (wasdKeys.W.isDown) movement.y -= 1;
    if (wasdKeys.S.isDown) movement.y += 1;
    if (wasdKeys.A.isDown) movement.x -= 1;
    if (wasdKeys.D.isDown) movement.x += 1;

    // Normalize and apply movement
    const length = Math.sqrt(movement.x * movement.x + movement.y * movement.y);
    if (length > 0) {
      movement.x = (movement.x / length) * this.speed;
      movement.y = (movement.y / length) * this.speed;
      this.sprite.setVelocity(movement.x, movement.y);
    } else {
      this.sprite.setVelocity(0, 0);
    }
  }

  public destroy(): void {
    this.sprite.destroy();
  }
}
