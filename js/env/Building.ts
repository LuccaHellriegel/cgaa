import { BaseSprite } from "../graphic/BaseSprite";
import { PositionService } from "../services/PositionService";

//TODO: use Phaser Image to improve performance
export class Building extends BaseSprite {
  x: number;
  y: number;
  constructor(scene, x, y, physicsGroup) {
    super(scene, x, y, "rectBuilding", physicsGroup);
    this.setImmovable(true);
  }

  //TODO: still broken
  calculateRandValidSpawnPosition() {
   
    let validPositions = PositionService.calculateValidSpawnPositions(this.x, this.y)
    let pos = Phaser.Math.Between(0,validPositions.length-1)

    return validPositions[pos]
  }
}
