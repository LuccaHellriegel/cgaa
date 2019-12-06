import { Gameplay } from "../../../../scenes/Gameplay";
import { ChainWeapon } from "../../../../base/weapons/ChainWeapon";
import { WeaponGenerator } from "./WeaponGenerator";

export class ChainWeaponGenerator extends WeaponGenerator {
  chainWeapon: ChainWeapon;
  arrowHeadPolygonHeight: number;
  middlePolygonHeight: number;
  finalPolygonHeight: number;
  arrowHeadWidth: number;

  constructor(hexColor: number, scene: Gameplay) {
    super(hexColor, scene);
    this.chainWeapon = new ChainWeapon(scene, this.biggerThanWeapon, this.biggerThanWeapon, this.tempWeaponGroup, 5, 2);
    this.generate();
  }

  drawFrames() {
    this.setPolygonMeasurementsForEasierPositioning();
    this.setPositionsForWeaponPolygonsForDrawing();
    this.drawChainWeaponPolygons();
  }

  setPolygonMeasurementsForEasierPositioning() {
    this.arrowHeadWidth = this.chainWeapon.polygon.width;

    this.arrowHeadPolygonHeight = this.chainWeapon.polygon.height;
    this.middlePolygonHeight = this.chainWeapon.polygonArr[1].height;
    this.finalPolygonHeight = this.chainWeapon.polygonArr[2].height;
  }

  setPositionsForWeaponPolygonsForDrawing() {
    let newX = this.chainWeapon.polygon.width / 2;

    let newY = this.finalPolygonHeight - this.arrowHeadPolygonHeight / 2;
    this.chainWeapon.polygon.setPosition(newX, newY);

    newY = this.finalPolygonHeight - this.middlePolygonHeight / 2;
    this.chainWeapon.polygonArr[1].setPosition(3 * newX, newY);

    newY = this.finalPolygonHeight / 2;
    this.chainWeapon.polygonArr[2].setPosition(5 * newX, newY);
  }

  drawChainWeaponPolygons() {
    this.chainWeapon.polygon.draw(this.graphics, 0);
    this.chainWeapon.polygonArr[1].draw(this.graphics, 0);
    this.chainWeapon.polygonArr[2].draw(this.graphics, 0);
  }

  generateTexture() {
    this.graphics.generateTexture("chainWeapon", this.arrowHeadWidth * 3, this.finalPolygonHeight);
  }

  addFrames() {
    let topLeftX = 0;
    let topLeftY = this.finalPolygonHeight - this.arrowHeadPolygonHeight;

    this.scene.textures.list["chainWeapon"].add(
      1,
      0,
      topLeftX,
      topLeftY,
      this.arrowHeadWidth,
      this.arrowHeadPolygonHeight
    );

    topLeftX += this.arrowHeadWidth;
    topLeftY = this.finalPolygonHeight - this.middlePolygonHeight;
    this.scene.textures.list["chainWeapon"].add(
      2,
      0,
      topLeftX,
      topLeftY,
      this.arrowHeadWidth,
      this.middlePolygonHeight
    );

    topLeftX += this.arrowHeadWidth;
    topLeftY = 0;
    this.scene.textures.list["chainWeapon"].add(3, 0, topLeftX, topLeftY, this.arrowHeadWidth, this.finalPolygonHeight);
  }

  destroyUsedObjects() {
    super.destroyUsedObjects();
    this.chainWeapon.destroy();
  }
}
