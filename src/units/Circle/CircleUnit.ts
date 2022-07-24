import { CampID } from "../../config/CampSetup";
import { listenToAnim } from "../../anim/anim-listen";
import { initUnitAnims } from "../../anim/anim-play";

import { damageable } from "../../engine/damageable";
import { HealthBar } from "../../healthbar/HealthBar";
import { Gameplay } from "../../scenes/Gameplay";
import { ChainWeapon } from "../../weapons/ChainWeapon/ChainWeapon";
import { EnemySize } from "../CircleFactory";
import { nanoid } from "nanoid";

export class CircleUnit
  extends Phaser.Physics.Arcade.Sprite
  implements damageable
{
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
    size: EnemySize,
    public healthbar: HealthBar
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
    this.type = size;

    this.weaponPhysics = weapon.circle;
  }

  damage(amount) {
    if (this.healthbar.decrease(amount)) {
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
}
