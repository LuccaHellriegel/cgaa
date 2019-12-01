import { Gameplay } from "../../../scenes/Gameplay";
import { RandWeapon } from "../../../weapons/RandWeapon";
import { WeaponGenerator } from "./WeaponGenerator";

export class RandWeaponGenerator extends WeaponGenerator {
  randWeapon: RandWeapon;
  idlePolygonWidth: number;
  idlePolygonHeight: number;
  attackPolygonWidth: number;
  attackPolygonHeight: number;

  constructor(hexColor: number, scene: Gameplay) {
    super(hexColor, scene);
    this.randWeapon = new RandWeapon(
      scene,
      this.biggerThanWeapon,
      this.biggerThanWeapon,
      this.tempWeaponGroup
    );
  }

  generate() {
    this.setPolygonMeasurementsForEasierPositioning();
    this.setPositionsForWeaponPolygonsForDrawing();
    this.drawRandWeaponPolygons();
    this.generateRandWeaponTexture();
    this.addFramesToRandWeaponTexture();
    this.destroyUsedObjects();
  }

  setPolygonMeasurementsForEasierPositioning() {
    this.idlePolygonWidth = this.randWeapon.polygon.width;
    this.idlePolygonHeight = this.randWeapon.polygon.height;

    this.attackPolygonWidth = this.randWeapon.polygonArr[1].width;
    this.attackPolygonHeight = this.randWeapon.polygonArr[1].height;
  }

  setPositionsForWeaponPolygonsForDrawing() {
    this.randWeapon.polygon.setPosition(
      this.idlePolygonWidth / 2,
      this.idlePolygonHeight / 2
    );

    this.randWeapon.polygonArr[1].setPosition(
      this.idlePolygonWidth + this.attackPolygonWidth / 2,
      (this.attackPolygonHeight / 2)
    );
    let diffBetweenAttackCenterAndIdleCenterY = this.randWeapon.polygonArr[1].polygons[0].y - this.randWeapon.polygonArr[0].centerY
    this.randWeapon.polygonArr[1].setPosition(
      this.idlePolygonWidth + this.attackPolygonWidth / 2,
      (this.attackPolygonHeight / 2) - diffBetweenAttackCenterAndIdleCenterY
    );
  }

  drawRandWeaponPolygons() {
    this.randWeapon.polygon.draw(this.graphics, 0);
    this.randWeapon.polygonArr[1].draw(this.graphics, 0);
  }

  generateRandWeaponTexture() {
    this.graphics.generateTexture(
      "randWeapon",
      this.idlePolygonWidth + this.attackPolygonWidth,
      this.attackPolygonHeight
    );
  }

  addFramesToRandWeaponTexture() {
    let topLeftX = 0;
    let topLeftY = 0;

    this.scene.textures.list["randWeapon"].add(
      1,
      0,
      topLeftX,
      topLeftY,
      this.idlePolygonWidth,
      this.idlePolygonHeight
    );

    topLeftX += this.idlePolygonWidth;
    this.scene.textures.list["randWeapon"].add(
      2,
      0,
      topLeftX,
      topLeftY,
      this.attackPolygonWidth,
      this.attackPolygonHeight
    );
  }

  destroyUsedObjects() {
    super.destroyUsedObjects();
    this.randWeapon.destroy();
  }
}
