import {
  normalCircleRadius,
  rectBuildinghalfHeight,
  wallPartHalfSize,
  rectBuildingHalfWidth,
  towerHalfSize
} from "../globals/globalSizes";
import { PositionService } from "../services/PositionService";

export class CollisionService {
  private constructor() {}

  static checkIfSpawnWouldCollide(otherObjects, randX, randY, checkDiffCallback) {
    for (let index = 0; index < otherObjects.length; index++) {
      const otherObject = otherObjects[index];
      let diffX = Math.abs(otherObject.x - randX);
      let diffY = Math.abs(otherObject.y - randY);
      if (checkDiffCallback(diffX, diffY)) return true;
    }
    return false;
  }

  static checkIfCircleCollidesWithCircles(circles, randX, randY) {
    return this.checkIfSpawnWouldCollide(circles, randX, randY, (diffX, diffY) => {
      if (diffX < 2 * normalCircleRadius || diffY < 2 * normalCircleRadius) return true;
      return false;
    });
  }

  static checkIfBuildingCollidesWithBuildings(buildings, randX, randY) {
    let checkDiffCallback = (diffX, diffY) => {
      let inRowsOverOrUnderBuilding = diffY >= 2 * rectBuildinghalfHeight + 2 * wallPartHalfSize;
      let leftOrRightFromBuilding = diffX >= 2 * rectBuildingHalfWidth + 2 * wallPartHalfSize;
      if (!inRowsOverOrUnderBuilding && !leftOrRightFromBuilding) return true;
      return false;
    };
    return this.checkIfSpawnWouldCollide(buildings, randX, randY, checkDiffCallback);
  }

  static checkIfTowerCollidesWithTowers(towers, randX, randY) {
    let checkDiffCallback = (diffX, diffY) => {
      let inRowsOverOrUnderBuilding = diffY >= 2 * towerHalfSize;
      let leftOrRightFromBuilding = diffX >= 2 * towerHalfSize;
      if (!inRowsOverOrUnderBuilding && !leftOrRightFromBuilding) return true;
      return false;
    };
    return this.checkIfSpawnWouldCollide(towers, randX, randY, checkDiffCallback);
  }
 
}
