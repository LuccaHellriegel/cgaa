import { CampID, CampSetup } from "../config/CampSetup";
import { EventSetup } from "../config/EventSetup";
import { UnitSetup } from "../config/UnitSetup";
import { listenToAnim } from "../anim/anim-listen";
import { unitAnims, initUnitAnims } from "../anim/anim-play";

import { healable } from "../engine/healable";
import { Gameplay } from "../scenes/Gameplay";
import { weaponHeights } from "../weapons/chain-weapon-data";
import { ChainWeapon } from "../weapons/ChainWeapon";
import { nanoid } from "nanoid";
import { EntityManager } from "../EntityManager";

const playerTextureName = "blueNormalCircle";

export class Player
  extends Phaser.Physics.Arcade.Sprite
  implements healable, unitAnims
{
  unitType: string = "player";
  type = "Normal";
  campID: CampID = CampSetup.playerCampID;
  campMask = CampSetup.playerCampMask;
  // move back is needed for bounce
  stateHandler = { spotted: null, obstacle: null, moveBack: () => {} };

  id: string;
  scene: Gameplay;

  playIdle: Function;
  playDamage: Function;
  weaponPhysics: Phaser.Physics.Arcade.Sprite;
  attack: any;

  constructor(
    scene: Gameplay,
    x: number,
    y: number,
    public weapon: ChainWeapon
  ) {
    super(scene, x, y, playerTextureName);

    this.id = nanoid();
    scene.add.existing(this);
    scene.physics.add.existing(this);
    initUnitAnims(this);
    listenToAnim(this, {
      animComplete: true,
      damageComplete: this.playIdle.bind(this),
    });
    this.setCircle(this.texture.get(0).halfWidth);

    this.weaponPhysics = weapon.circle;
    this.attack = this.weapon.attack.bind(this.weapon);
  }

  setVelocityX(velo) {
    this.weapon.setVelocityX(velo);
    return super.setVelocityX(velo);
  }

  setVelocityY(velo) {
    this.weapon.setVelocityY(velo);
    return super.setVelocityY(velo);
  }

  heal(amount) {
    this.scene.events.emit(EventSetup.healPlayer, amount);
  }

  damage(amount) {
    this.playDamage();
    this.scene.events.emit(EventSetup.partialDamage + this.unitType, amount);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    // we dont need to set rotation by hand because we do it every frame here
    // EntityManager.setRotationAroundOwner(this, this.weapon);
  }

  static withChainWeapon(
    scene: Gameplay,
    entityManager: EntityManager,
    x: number,
    y: number
  ) {
    let weapon = new ChainWeapon(
      scene,
      x,
      y - UnitSetup.sizeDict["Normal"] - weaponHeights["Normal"].frame2 / 2,
      "NormalchainWeapon",
      40,
      "Normal"
    );
    let circle = new Player(scene, x, y, weapon);
    entityManager.registerWeapon(circle, weapon);
    //DEV: weapon.amount = 40000;

    return circle;
  }
}
