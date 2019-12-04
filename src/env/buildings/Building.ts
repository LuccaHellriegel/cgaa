import { Image } from "../../base/Image";
import { SpawnService } from "../../spawn/SpawnService";
import { Area } from "../areas/Area";
import { CollisionService } from "../../spawn/CollisionService";

export class Building extends Image {
  validSpawnPositions: any[];
  enemies: any[] = [];
  area: Area;

  constructor(scene, x, y, physicsGroup, area) {
    super(scene, x, y, "rectBuilding", physicsGroup);
    this.area = area;
    this.validSpawnPositions = SpawnService.calculateSpawnPositionsAroundBuilding(this.x, this.y);
  }

  //TODO: replae this with randomylTryFunc
  calculateRandUnitSpawnPosition() {
    let pos = Phaser.Math.Between(0, this.validSpawnPositions.length - 1);
    let chosenPosition = this.validSpawnPositions[pos];
    let positionsTried = 0;
    while (CollisionService.checkIfCircleCollidesWithCircles(this.enemies, chosenPosition.x, chosenPosition.y)) {
      positionsTried++;
      if (positionsTried === this.validSpawnPositions.length) {
        return null;
      }

      let reachedLastPos = pos === this.validSpawnPositions.length - 1;
      if (!reachedLastPos) {
        pos++;
      } else {
        pos = 0;
      }
      chosenPosition = this.validSpawnPositions[pos];
    }

    return chosenPosition;
  }
}
