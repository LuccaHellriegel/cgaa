import { Shooter } from "./Shooter";
import { Gameplay } from "../../scenes/Gameplay";
import { TowerSetup } from "../../config/TowerSetup";
import { UnitSetup } from "../../config/UnitSetup";

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  goalX: number;
  goalY: number;
  amount: number = TowerSetup.bulletDamage;
  owner: Shooter;
  scene: Gameplay;

  constructor(scene, x, y) {
    super(scene, x, y, "bullet");
  }

  shoot(x, y, goalX, goalY, shooter) {
    this.enableBody(true, x, y, true, true);
    this.goalX = goalX;
    this.goalY = goalY;
    this.owner = shooter;
  }

  hitTarget() {
    this.disableBody(true, true);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.goalX) {
      let dist = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        this.goalX,
        this.goalY
      );
      if (dist > UnitSetup.normalCircleRadius) {
        this.scene.physics.moveTo(
          this,
          this.goalX,
          this.goalY,
          TowerSetup.bulletSpeed
        );
      } else {
        this.hitTarget();
      }
    }
  }
}
