import { BaseSprite } from "../../graphic/BaseSprite";

export class WallPart extends BaseSprite {
  x: number;
  y: number;
  constructor(scene, x, y, physicsGroup) {
    super(scene, x, y, "wallPart", physicsGroup);
    this.setImmovable(true);
  }
}
