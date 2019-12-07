import { Circle } from "../base/Circle";
import { playerStartX, playerStartY, playerTextureName } from "../globals/globalConfig";
import { ChainWeapon } from "../base/weapons/ChainWeapon";
import { normalCircleRadius } from "../globals/globalSizes";
import { CirclePolygon } from "../graphics/polygons/CirclePolygon";
export class Player extends Circle {
  constructor(scene, physicsGroup, weapon) {
    let polygon = new CirclePolygon(playerStartX, playerStartY, normalCircleRadius);

    super({
      scene,
      x: playerStartX,
      y: playerStartY,
      texture: playerTextureName,
      physicsGroup,
      polygon,
      weapon,
      radius: normalCircleRadius
    });

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
    let weapon = new ChainWeapon(scene, playerStartX, playerStartY, scene.physics.add.group(), null);
    let circle = new Player(scene, scene.physics.add.group(), weapon);
    weapon.owner = circle;
    return circle;
  }
}
