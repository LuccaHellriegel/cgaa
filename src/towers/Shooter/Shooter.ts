import { Bullets } from "./Bullets";
import { Tower } from "../Tower";
import { Gameplay } from "../../scenes/Gameplay";

export class Shooter extends Tower {
  canFire = true;
  bullets: Bullets;

  constructor(scene: Gameplay, x, y) {
    super(scene, x, y, "shooter");
    this.type = "Shooter";
    //TODO: can be spawned ontop of units because I dont check enemies in TowerModus
  }

  damage(amount: number) {
    if (this.healthbar.decrease(amount)) {
      this.poolDestroy();
    }
  }

  fire(target) {
    if (this.canFire) {
      this.bullets.fireBullet(this.x, this.y, target.x, target.y, this);
      this.canFire = false;
      if (this.scene)
        this.scene.time.addEvent({
          delay: 300,
          callback: () => {
            this.canFire = true;
            if (
              target.healthbar.value > 0 &&
              Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) <
                445
            )
              this.fire(target);
          },
          callbackScope: this,
          repeat: 0,
        });
    }
  }

  place(x, y, bullets) {
    this.scene.children.sendToBack(this);

    this.bullets = bullets;
    super.place(x, y, null);
  }

  poolDestroy() {
    this.setPosition(-1000, -1000);
    this.disableBody(true, true);
    this.healthbar.disable();
  }
}
