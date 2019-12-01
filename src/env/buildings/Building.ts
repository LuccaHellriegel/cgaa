import { BaseImage } from "../../base/BaseImage";
import { BuildingService } from "./BuildingService";

export class Building extends BaseImage {
  validSpawnPositions: any[];
  constructor(scene, x, y, physicsGroup) {
    super(scene, x, y, "rectBuilding", physicsGroup);
    this.validSpawnPositions = BuildingService.calculateValidSpawnPositionAroundBuilding(
      this.x,
      this.y
    );
  }

  calculateRandValidSpawnPosition() {
    let pos = Phaser.Math.Between(0, this.validSpawnPositions.length - 1);
    return this.validSpawnPositions[pos];
  }
}
