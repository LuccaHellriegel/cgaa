import { Image } from "../../base/Image";

export class WallPart extends Image {
  constructor(scene, x, y, physicsGroup) {
    super(scene, x, y, "wallPart", physicsGroup);
    this.setImmovable(true);
  }
}
