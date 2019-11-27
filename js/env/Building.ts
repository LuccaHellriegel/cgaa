import { BaseSprite } from "../graphic/BaseSprite";

export class Building extends BaseSprite {
  x: number;
  y: number;
  constructor(scene, x, y, physicsGroup) {
    super(scene, x, y, "rectBuilding", physicsGroup);
    this.setImmovable(true);
  }
}
