import { Image } from "../../base/BasePhaser";
import { Area } from "../areas/Area";

export class Building extends Image {
  area: Area;

  constructor(scene, x, y, physicsGroup, area) {
    super(scene, x, y, "rectBuilding", physicsGroup);
    this.area = area;
  }
}
