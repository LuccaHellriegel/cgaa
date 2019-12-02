import { Weapon } from "./Weapon";
import { CompositePolygon } from "../polygon/CompositePolygon";

//TODO: merge Weapon classes
export abstract class PolygonWeapon extends Weapon {
  polygon: CompositePolygon;
  polygonArr: CompositePolygon[];

  constructor(scene, x, y, texture, weaponGroup, polygonArr, offSetArr) {
    super(scene, x, y, texture, weaponGroup, offSetArr);
    this.polygon = polygonArr[0];
    this.polygonArr = polygonArr;
  }

  movePolygon() {
    if (this.polygon.centerX !== this.x || this.polygon.centerY !== this.y) {
      this.polygon.setPosition(this.x, this.y);
    }
    if (this.polygon.rotation !== this.rotation) {
      this.polygon.rotate(this.rotation);
    }
  }

  setPolygonForFrame() {
    this.polygon = this.polygonArr[parseInt(this.frame.name) - 1];
  }

  syncPolygon() {
    this.setPolygonForFrame();
    this.movePolygon();
  }
}
