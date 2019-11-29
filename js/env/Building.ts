import { BaseSprite } from "../graphic/BaseSprite";

//TODO: use Phaser Image to improve performance
export class Building extends BaseSprite {
  x: number;
  y: number;
  constructor(scene, x, y, physicsGroup) {
    super(scene, x, y, "rectBuilding", physicsGroup);
    this.setImmovable(true);
  }
}
