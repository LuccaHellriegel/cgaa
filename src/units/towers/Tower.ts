import { BaseImage } from "../../base/BaseImage";

export class Tower extends BaseImage {
  constructor(scene, x, y, physicsGroup) {
    super(scene, x, y, "tower", physicsGroup);
    this.setImmovable(true);
  }
}
