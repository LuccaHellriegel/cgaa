import { BaseImage } from "../../graphic/BaseImage";

export class WallPart extends BaseImage {
  x: number;
  y: number;
  constructor(scene, x, y, physicsGroup) {
    super(scene, x, y, "wallPart", physicsGroup);
    this.setImmovable(true);
  }
}
