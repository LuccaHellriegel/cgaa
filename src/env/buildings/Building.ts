import { Image } from "../../base/BasePhaser";

export class Building extends Image {
  constructor(scene, x, y, physicsGroup) {
    super(scene, x, y, "rectBuilding", physicsGroup);
    this.setImmovable(true);

  }
}
