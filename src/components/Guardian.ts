import { Scene } from "phaser";
import { Enemy } from "./Enemy";
import { CampBuilding } from "./CampBuilding";

interface GuardianConfig {
  patrolRadius: number;
}

export class Guardian extends Enemy {
  private readonly PATROL_STATE = "patrol";
  private readonly CHASE_STATE = "chase";
  private currentState: string = this.PATROL_STATE;
  private camp: CampBuilding;
  private patrolRadius: number;
  private patrolAngle: number = 0;
  private patrolSpeed: number = 0.02;
  private detectionRange: number = 150;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    camp: CampBuilding,
    config: GuardianConfig
  ) {
    super(scene, x, y);
    this.camp = camp;
    this.patrolRadius = config.patrolRadius;
    this.type = "guardian";

    // Set guardian appearance
    const sprite = this.getSprite();
    if (sprite) {
      sprite.setTint(0x8b0000); // Dark red tint for guardians
    }
  }

  private findNearbyTarget(): Phaser.GameObjects.Sprite | null {
    const sprite = this.getSprite();
    if (!sprite) return null;

    // Get all potential targets (player and towers)
    const player = this.scene.children
      .getChildren()
      .find(
        (obj) =>
          obj instanceof Phaser.GameObjects.Sprite &&
          obj.getData("type") === "player"
      ) as Phaser.GameObjects.Sprite;

    const towers = this.scene.children
      .getChildren()
      .filter(
        (obj) =>
          obj instanceof Phaser.GameObjects.Sprite &&
          obj.getData("type") === "tower"
      ) as Phaser.GameObjects.Sprite[];

    // Check player first
    if (player && this.isInRange(player)) {
      return player;
    }

    // Then check towers
    for (const tower of towers) {
      if (this.isInRange(tower)) {
        return tower;
      }
    }

    return null;
  }

  private isInRange(target: Phaser.GameObjects.Sprite): boolean {
    const sprite = this.getSprite();
    if (!sprite) return false;

    const distance = Phaser.Math.Distance.Between(
      sprite.x,
      sprite.y,
      target.x,
      target.y
    );

    return distance <= this.detectionRange;
  }

  public update(): void {
    const sprite = this.getSprite();
    if (!sprite) return;

    // Update state based on conditions
    if (this.currentState === this.PATROL_STATE) {
      this.patrol();
    } else if (this.currentState === this.CHASE_STATE) {
      this.chase();
    }

    // Update patrol angle
    this.patrolAngle += this.patrolSpeed;
    if (this.patrolAngle >= Math.PI * 2) {
      this.patrolAngle = 0;
    }
  }

  private patrol(): void {
    const sprite = this.getSprite();
    if (!sprite) return;

    // Calculate patrol position
    const patrolX =
      this.camp.getSprite().x + Math.cos(this.patrolAngle) * this.patrolRadius;
    const patrolY =
      this.camp.getSprite().y + Math.sin(this.patrolAngle) * this.patrolRadius;

    // Move towards patrol position
    const angle = Phaser.Math.Angle.Between(
      sprite.x,
      sprite.y,
      patrolX,
      patrolY
    );
    const velocity = new Phaser.Math.Vector2(
      Math.cos(angle) * this.getSpeed(),
      Math.sin(angle) * this.getSpeed()
    );
    sprite.setVelocity(velocity.x, velocity.y);

    // Check for nearby targets
    const nearbyTarget = this.findNearbyTarget();
    if (nearbyTarget) {
      this.currentState = this.CHASE_STATE;
      this.setTarget(new Phaser.Math.Vector2(nearbyTarget.x, nearbyTarget.y));
    }
  }

  private chase(): void {
    const sprite = this.getSprite();
    if (!sprite) return;

    const target = this.getCurrentTarget();
    if (!target) {
      this.currentState = this.PATROL_STATE;
      return;
    }

    // Move towards target
    const angle = Phaser.Math.Angle.Between(
      sprite.x,
      sprite.y,
      target.x,
      target.y
    );
    const velocity = new Phaser.Math.Vector2(
      Math.cos(angle) * this.getSpeed(),
      Math.sin(angle) * this.getSpeed()
    );
    sprite.setVelocity(velocity.x, velocity.y);

    // Check if target is still in range
    const nearbyTarget = this.findNearbyTarget();
    if (!nearbyTarget) {
      this.currentState = this.PATROL_STATE;
      this.setTarget(new Phaser.Math.Vector2(sprite.x, sprite.y)); // Stay at current position
    } else {
      this.setTarget(new Phaser.Math.Vector2(nearbyTarget.x, nearbyTarget.y));
    }
  }

  public reset(): void {
    const sprite = this.getSprite();
    if (sprite) {
      super.reset(sprite.x, sprite.y);
    }
    this.currentState = this.PATROL_STATE;
    this.patrolAngle = 0;
  }

  public getSpeed(): number {
    return 100; // Base speed for guardians
  }

  private getCurrentTarget(): Phaser.Math.Vector2 | null {
    const sprite = this.getSprite();
    if (!sprite) return null;
    return new Phaser.Math.Vector2(sprite.x, sprite.y);
  }
}
