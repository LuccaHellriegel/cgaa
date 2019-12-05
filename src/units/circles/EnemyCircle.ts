import { HealthBar } from "../../ui/graphics/healthbars/HealthBar";
import { normalCircleRadius } from "../../globals/globalSizes";
import { Gameplay } from "../../scenes/Gameplay";
import { Circle } from "./Circle";
import { Weapon } from "../../weapons/Weapon";
import { ChainWeapon } from "../../weapons/ChainWeapon";
import { RandWeapon } from "../../weapons/RandWeapon";
import { StateService } from "../StateService";

export class EnemyCircle extends Circle {
  hasBeenAttacked: boolean;
  healthbar: HealthBar;
  path;
  curPosInPath = 0;

  constructor(scene: Gameplay, x, y, texture, physicsGroup: Phaser.Physics.Arcade.Group, weapon: Weapon) {
    super(scene, x, y, texture, physicsGroup, weapon);
    this.hasBeenAttacked = false;
    this.healthbar = new HealthBar(scene, x - 26, y - 38, 46, 12);
    this.setCollideWorldBounds(true);
    //TODO: change this back once I figure out how to prevent push-clipping
    //TODO: If I walk across the immovable Circle, I get push-clipped
    this.setImmovable(true);
  }

  //TODO: better solution than doubling this
  static withChainWeapon(scene, x, y, texture, physicsGroup, weaponGroup) {
    return new this(scene, x, y, texture, physicsGroup, new ChainWeapon(scene, x, y, weaponGroup, 5, 2));
  }

  static withRandWeapon(scene, x, y, texture, physicsGroup, weaponGroup) {
    return new this(scene, x, y, texture, physicsGroup, new RandWeapon(scene, x, y, weaponGroup));
  }

  damage(amount) {
    if (this.healthbar.decrease(amount)) {
      this.destroy();
    } else {
      super.damage(amount);
      this.hasBeenAttacked = true;
    }
  }

  destroy() {
    super.destroy();
    this.healthbar.destroy();
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.healthbar.move(this.x - 26, this.y - 38);
    StateService.executeState(this)
  }
}
