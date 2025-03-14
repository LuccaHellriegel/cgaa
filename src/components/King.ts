import { Scene } from "phaser";
import { Enemy } from "./Enemy";
import { GameEvents } from "../events/GameEvents";

export class King extends Enemy {
  private specialAttackCooldown: number = 0;
  private readonly SPECIAL_ATTACK_INTERVAL: number = 5000; // 5 seconds
  private readonly SPECIAL_ATTACK_DAMAGE: number = 30;
  private readonly SPECIAL_ATTACK_RANGE: number = 200;
  private specialAttackIndicator: Phaser.GameObjects.Arc;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, {
      health: 1000, // Very high health
      damage: 20, // High base damage
      speed: 80, // Slower than regular enemies
      type: "king",
    });

    // Make king larger
    this.getSprite().setScale(2);

    // Create special attack indicator
    this.specialAttackIndicator = scene.add.circle(
      x,
      y,
      this.SPECIAL_ATTACK_RANGE,
      0xff0000,
      0
    );
    this.specialAttackIndicator.setStrokeStyle(2, 0xff0000);
    this.specialAttackIndicator.setVisible(false);
  }

  public update(): void {
    super.update();

    // Update special attack cooldown
    if (this.specialAttackCooldown > 0) {
      this.specialAttackCooldown -= this.scene.game.loop.delta;
      if (this.specialAttackCooldown <= 0) {
        this.performSpecialAttack();
      }
    }

    // Update special attack indicator position
    this.specialAttackIndicator.setPosition(
      this.getSprite().x,
      this.getSprite().y
    );
  }

  private performSpecialAttack(): void {
    // Show attack indicator
    this.specialAttackIndicator.setVisible(true);

    // After a brief delay, perform the attack
    this.scene.time.delayedCall(1000, () => {
      // Get all entities within range
      const sprite = this.getSprite();
      const entities = this.scene.physics.overlapCirc(
        sprite.x,
        sprite.y,
        this.SPECIAL_ATTACK_RANGE
      );

      // Deal damage to all entities in range
      entities.forEach((body) => {
        const gameObject = body.gameObject as Phaser.GameObjects.GameObject;
        if (gameObject && gameObject instanceof Phaser.GameObjects.Sprite) {
          const type = gameObject.getData("type");
          if (type === "player" || type === "tower") {
            // Emit damage event for the entity to handle
            this.scene.events.emit(GameEvents.DAMAGE_DEALT, {
              target: gameObject,
              amount: this.SPECIAL_ATTACK_DAMAGE,
              source: this,
            });
          }
        }
      });

      // Hide indicator and reset cooldown
      this.specialAttackIndicator.setVisible(false);
      this.specialAttackCooldown = this.SPECIAL_ATTACK_INTERVAL;
    });
  }

  public destroy(): void {
    this.specialAttackIndicator.destroy();
    super.destroy();

    // Emit victory event when king is destroyed
    this.scene.events.emit(GameEvents.KING_DEFEATED);
  }
}
