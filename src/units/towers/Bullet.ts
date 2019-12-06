import { Sprite } from "../../base/BasePhaser";
import { normalCircleRadius } from "../../globals/globalSizes";

export class Bullet extends Sprite {
  goalX: number;
  goalY: number;
  atTarget: boolean;
  amount: number;

  constructor(scene, x, y, bulletGroup, goalX, goalY) {
    super(scene, x, y, "bullet", bulletGroup);
    this.setCircle(normalCircleRadius / 4);
    this.goalX = goalX;
    this.goalY = goalY;
    this.atTarget = false;
    this.amount = 20
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (!this.atTarget) {
      let dist = Phaser.Math.Distance.Between(this.x, this.y, this.goalX, this.goalY);
      if (dist > normalCircleRadius) {
        this.scene.physics.moveTo(this, this.goalX, this.goalY, 160);
      } else {
        this.atTarget = true;
        this.scene.time.addEvent({
          delay: 100,
          callback: this.destroy,
          callbackScope: this,
          repeat: 0
        });
      }
    }
  }
}
