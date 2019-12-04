import { Gameplay } from "../../scenes/Gameplay";
import { wallPartHalfSize } from "../../globals/globalSizes";
import { EnemyCircle } from "./EnemyCircle";
import { ChainWeapon } from "../../weapons/ChainWeapon";
import { RandWeapon } from "../../weapons/RandWeapon";

export class PathfindingCircle extends EnemyCircle {
  curPosInPath = 0;
  path;

  constructor(scene: Gameplay, x, y, texture, physicsGroup, weapon) {
    super(scene, x, y, texture, physicsGroup, weapon);
    this.scene.time.addEvent({
      delay: 1000,
      callback: this.calculatePathCallback,
      callbackScope: this
    });
  }

  static withChainWeapon(scene, x, y, texture, physicsGroup, weaponGroup) {
    return new this(scene, x, y, texture, physicsGroup, new ChainWeapon(scene, x, y, weaponGroup, 5, 2));
  }

  static withRandWeapon(scene, x, y, texture, physicsGroup, weaponGroup) {
    return new this(scene, x, y, texture, physicsGroup, new RandWeapon(scene, x, y, weaponGroup));
  }

  private calculatePathCallback() {
    if (this.scene) {
      this.scene.pathManager.calculatePath(this, this.x, this.y);
    }
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.path && this.path[this.curPosInPath]) {
      let x = 0 + this.path[this.curPosInPath].x * 2 * wallPartHalfSize + wallPartHalfSize;
      let y = 0 + this.path[this.curPosInPath].y * 2 * wallPartHalfSize + wallPartHalfSize;
      if (Math.abs(this.x - x) < 2 && Math.abs(this.y - y) < 2) {
        this.curPosInPath++;
      } else {
        this.scene.physics.moveTo(this, x, y, 160);
      }
    } else if (this.path && this.curPosInPath >= this.path.length) {
      this.setVelocity(0, 0);
    }
  }
}
