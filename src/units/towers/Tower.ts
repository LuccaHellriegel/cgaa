import { BaseImage } from "../../base/BaseImage";

export class Tower extends BaseImage {
  constructor(scene, x, y, physicsGroup) {
    //snap to grid
    super(scene, x, y, "tower", physicsGroup);
    this.setImmovable(true);
  }
}
