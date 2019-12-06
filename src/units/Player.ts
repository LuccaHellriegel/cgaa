import { Circle } from "./circles/Circle";
import { playerStartX, playerStartY, playerTextureName } from "../globals/globalConfig";
import { ChainWeapon } from "../weapons/ChainWeapon";
export class Player extends Circle {
  constructor(scene, physicsGroup, weapon) {
    super(scene, playerStartX, playerStartY, playerTextureName, physicsGroup, weapon);
    this.unitType = "player";
    this.scene.player = this;
    this.scene.cameras.main.startFollow(this.scene.player);
  }

  setVelocityX(velo) {
    this.weapon.setVelocityX(velo);
    return super.setVelocityX(velo);
  }

  setVelocityY(velo) {
    this.weapon.setVelocityY(velo);
    return super.setVelocityY(velo);
  }

  static withChainWeapon(scene) {
    let weapon = new ChainWeapon(scene, playerStartX, playerStartY, scene.physics.add.group(), 5, 2, null);
    let circle = new Player(scene, scene.physics.add.group(), weapon);
    weapon.owner = circle;
    return circle;
  }
}
