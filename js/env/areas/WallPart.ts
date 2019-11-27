import { BaseSprite } from "../../graphic/BaseSprite";

export class WallPart extends BaseSprite {
    x: any;
    y: any;
  constructor(scene, x, y, physicsGroup) {
    super(scene, x, y, "wallPart", physicsGroup);
    this.setImmovable(true);
    this.body.allowGravity = false;
  }
}
