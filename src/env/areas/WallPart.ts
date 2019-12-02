import { BaseImage } from "../../base/BaseImage";

export class WallPart extends BaseImage {
  constructor(scene, x, y, physicsGroup) {
    super(scene, x, y, "wallPart", physicsGroup);
    this.setImmovable(true);
  }
}
