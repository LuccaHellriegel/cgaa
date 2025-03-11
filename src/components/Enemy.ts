import { Scene, Physics } from "phaser";
import { BaseComponent, ComponentConfig } from "./BaseComponent";

export interface EnemyConfig extends ComponentConfig {
  speed?: number;
  health?: number;
  damage?: number;
  target?: { x: number; y: number } | null;
}

export class Enemy extends BaseComponent {
  private sprite: Physics.Arcade.Sprite;
  private speed: number;
  private health: number;
  private damage: number;
  private target: { x: number; y: number } | null = null;
  private isDead: boolean = false;
  private isAttacking: boolean = false;
  private attackCooldown: number = 0;
  private particles: any;

  constructor(config: EnemyConfig) {
    super(config);
    this.speed = config.speed || 100;
    this.health = config.health || 100;
    this.damage = config.damage || 10;
    this.target = config.target || null;

    // Create enemy sprite
    this.sprite = this.scene.physics.add.sprite(
      config.x || 0,
      config.y || 0,
      config.texture || "enemy"
    );

    // Setup physics
    this.sprite.setCollideWorldBounds(true);

    // Get particle effects if available
    try {
      this.particles = this.scene.registry.get("particles");
    } catch (e) {
      console.warn("Particle effects not available");
      this.particles = null;
    }

    // Play idle animation
    this.sprite.anims.play("enemy-idle", true);

    // Set up animation completion listener
    this.sprite.on("animationcomplete", this.handleAnimationComplete, this);
  }

  private handleAnimationComplete(
    animation: Phaser.Animations.Animation
  ): void {
    if (animation.key === "enemy-death") {
      this.destroy();
    }
  }

  public takeDamage(amount: number): void {
    if (this.isDead) return;

    this.health -= amount;

    // Flash red
    this.sprite.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      if (!this.isDead) {
        this.sprite.clearTint();
      }
    });

    // Emit impact particles if available
    if (this.particles?.impact) {
      try {
        this.particles.impact.emitParticleAt(this.sprite.x, this.sprite.y, 5);
      } catch (e) {
        console.warn("Failed to emit impact particles");
      }
    }

    if (this.health <= 0) {
      this.die();
    }
  }

  private die(): void {
    this.isDead = true;
    this.sprite.setVelocity(0, 0);
    this.sprite.anims.play("enemy-death", true);

    // Emit death particles if available
    if (this.particles?.death) {
      try {
        this.particles.death.emitParticleAt(this.sprite.x, this.sprite.y);
      } catch (e) {
        console.warn("Failed to emit death particles");
      }
    }
  }

  public attack(target: any): void {
    if (this.isDead || this.isAttacking) return;

    this.isAttacking = true;
    this.attackCooldown = 1000; // 1 second cooldown

    // Play attack animation
    this.sprite.anims.play("enemy-attack", true);

    // Deal damage after animation delay
    this.scene.time.delayedCall(500, () => {
      if (!this.isDead && target.takeDamage) {
        target.takeDamage(this.damage);
      }
    });

    // Reset attack state after cooldown
    this.scene.time.delayedCall(this.attackCooldown, () => {
      this.isAttacking = false;
    });
  }

  public update(time: number, delta: number): void {
    if (this.isDead) {
      this.sprite.setVelocity(0, 0);
      return;
    }

    if (this.isAttacking) {
      this.sprite.setVelocity(0, 0);
      return;
    }

    if (!this.target) {
      this.sprite.setVelocity(0, 0);
      if (!this.sprite.anims.isPlaying) {
        this.sprite.anims.play("enemy-idle", true);
      }
      return;
    }

    // Calculate direction to target
    const dx = this.target.x - this.sprite.x;
    const dy = this.target.y - this.sprite.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      // Normalize and apply speed
      const vx = (dx / distance) * this.speed;
      const vy = (dy / distance) * this.speed;

      this.sprite.setVelocity(vx, vy);
      this.sprite.setFlipX(vx < 0);
      if (
        !this.sprite.anims.isPlaying ||
        (this.sprite.anims.currentAnim &&
          this.sprite.anims.currentAnim.key !== "enemy-move")
      ) {
        this.sprite.anims.play("enemy-move", true);
      }
    } else {
      this.sprite.setVelocity(0, 0);
      if (
        !this.sprite.anims.isPlaying ||
        (this.sprite.anims.currentAnim &&
          this.sprite.anims.currentAnim.key !== "enemy-idle")
      ) {
        this.sprite.anims.play("enemy-idle", true);
      }
    }
  }

  public setTarget(target: { x: number; y: number } | null): void {
    this.target = target;
  }

  public getDamage(): number {
    return this.damage;
  }

  public getSprite(): Physics.Arcade.Sprite {
    return this.sprite;
  }

  public isCollidingWith(object: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): boolean {
    return (
      this.sprite.x < object.x + object.width &&
      this.sprite.x + this.sprite.width > object.x &&
      this.sprite.y < object.y + object.height &&
      this.sprite.y + this.sprite.height > object.y
    );
  }

  public destroy(): void {
    if (this.sprite) {
      this.sprite.destroy();
    }
    super.destroy();
  }
}
