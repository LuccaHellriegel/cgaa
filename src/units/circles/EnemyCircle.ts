import { HealthBar } from "../../ui/graphics/healthbars/HealthBar";
import { Gameplay } from "../../scenes/Gameplay";
import { Circle } from "./Circle";
import { Weapon } from "../../weapons/Weapon";
import { ChainWeapon } from "../../weapons/ChainWeapon";
import { RandWeapon } from "../../weapons/RandWeapon";
import { StateService } from "../StateService";
import { PathContainer } from "../../path/PathContainer";
import { Damageable } from "../Damageable";

export class EnemyCircle extends Circle implements Damageable {
  hasBeenAttacked: boolean;
  healthbar: HealthBar;
  pathContainer: PathContainer;
  curPosInPath = 0;
  color: string;
  spotted: any;
  pursuing: any;

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
    let weapon = new ChainWeapon(scene, x, y, weaponGroup, 5, 2, null);
    let circle = new this(scene, x, y, physicsGroup, weapon, color);
    weapon.owner = circle;
    return circle;
  }

  static withRandWeapon(scene, x, y, physicsGroup, weaponGroup, color) {
    let weapon = new RandWeapon(scene, x, y, weaponGroup, null);
    let circle = new this(scene, x, y, physicsGroup, weapon, color);
    weapon.owner = circle;
    return circle;
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
