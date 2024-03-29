import { CampID } from "../config/CampSetup";
import { listenToAnim } from "../anim/anim-listen";
import { initUnitAnims } from "../anim/anim-play";

import { damageable } from "../engine/damageable";
import { HealthBar, HealthComponent } from "../healthbar/HealthBar";
import { Gameplay } from "../scenes/Gameplay";
import { ChainWeapon } from "../weapons/ChainWeapon";
import { EnemySize } from "./CircleFactory";
import { nanoid } from "nanoid";
import { Point } from "../engine/Point";

const correctionForPhasersMinus90DegreeTopPostion = (Math.PI / 180) * 90;

export class CircleUnit
  extends Phaser.Physics.Arcade.Sprite
  implements damageable
{
  entityId: number;
  unitType: string;
  id: string;
  scene: Gameplay;

  playIdle: Function;
  playDamage: Function;
  weaponPhysics: Phaser.Physics.Arcade.Sprite;

  constructor(
    scene: Gameplay,
    x: number,
    y: number,
    texture: string,
    public campID: CampID,
    public campMask: number,
    public weapon: ChainWeapon,
    public enemySize: EnemySize,
    public healthbar: HealthBar,
    public health: HealthComponent
  ) {
    super(scene, x, y, texture);
    this.id = nanoid();
    scene.add.existing(this);
    scene.physics.add.existing(this);
    initUnitAnims(this);
    listenToAnim(this, {
      animComplete: true,
      damageComplete: this.playIdle.bind(this),
    });

    this.unitType = "circle";
    //Needed for gaining souls
    this.type = enemySize;

    this.weaponPhysics = weapon.circle;
  }

  damage(amount) {
    const res = this.health.decrease(amount);
    this.healthbar.draw();
    if (res) {
      this.destroy();
      return true;
    } else {
      this.playDamage();
      return false;
    }
  }

  destroy() {
    this.weapon.destroy();
    this.healthbar.destroy();
    super.destroy();
  }

  dist(point: Point) {
    return Phaser.Math.Distance.Between(this.x, this.y, point.x, point.y);
  }

  turnTo(obj: Point) {
    let newRotation = Phaser.Math.Angle.Between(this.x, this.y, obj.x, obj.y);
    this.setRotation(newRotation + correctionForPhasersMinus90DegreeTopPostion);
  }
}
