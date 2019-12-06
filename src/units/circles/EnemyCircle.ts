import { HealthBar } from "../../ui/graphics/healthbars/HealthBar";
import { Gameplay } from "../../scenes/Gameplay";
import { Circle } from "./Circle";
import { Weapon } from "../../weapons/Weapon";
import { ChainWeapon } from "../../weapons/ChainWeapon";
import { RandWeapon } from "../../weapons/RandWeapon";
import { StateService } from "../StateService";
import { PathContainer } from "../../path/PathContainer";

export class EnemyCircle extends Circle {
  hasBeenAttacked: boolean;
  healthbar: HealthBar;
  pathContainer: PathContainer;
  curPosInPath = 0;
  color: string;

  constructor(
    scene: Gameplay,
    x: number,
    y: number,
    physicsGroup: Phaser.Physics.Arcade.Group,
    weapon: Weapon,
    color: string
  ) {
    super(scene, x, y, color + "Circle", physicsGroup, weapon);
    this.hasBeenAttacked = false;
    this.healthbar = new HealthBar(scene, x - 26, y - 38, 46, 12);
    this.setCollideWorldBounds(true);
    //TODO: change this back once I figure out how to prevent push-clipping
    //TODO: If I walk across the immovable Circle, I get push-clipped
    this.setImmovable(true);
    this.color = color;
  }

  //TODO: better solution than doubling this
  static withChainWeapon(scene, x, y, physicsGroup, weaponGroup, color) {
    return new this(scene, x, y, physicsGroup, new ChainWeapon(scene, x, y, weaponGroup, 5, 2), color);
  }

  static withRandWeapon(scene, x, y, physicsGroup, weaponGroup, color) {
    return new this(scene, x, y, physicsGroup, new RandWeapon(scene, x, y, weaponGroup), color);
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
    StateService.executeState(this);
  }
}
