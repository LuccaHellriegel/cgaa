import { Image } from "../../base/Image";

export class Tower extends Image {
  constructor(scene, x, y, physicsGroup) {
    super(scene, x, y, "tower", physicsGroup);
    this.setImmovable(true);
  }
}
