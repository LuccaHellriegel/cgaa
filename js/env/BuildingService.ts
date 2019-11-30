import {
  rectBuildingHalfWidth,
  rectBuildinghalfHeight,
  wallPartRadius
} from "../global";

export class BuildingService {
  private constructor() {}
  static calculateValidSpawnPositionAroundBuilding(buildingX, buildingY) {
    let topLeftX = buildingX - rectBuildingHalfWidth;
    let topLeftY = buildingY - rectBuildinghalfHeight;
    let startXForRow = topLeftX - wallPartRadius;
    let startYForRow = topLeftY - wallPartRadius;

    //TODO: dependant on the building being 3 * wallPart
    let validPositions = [0, 1, 2, 3, 4].map(numb => {
      let randX = startXForRow + numb * 2 * wallPartRadius;
      let randY = startYForRow;
      return { randX, randY };
    });

    startYForRow += 4 * wallPartRadius;

    validPositions = validPositions.concat(
      [0, 1, 2, 3, 4].map(numb => {
        let randX = startXForRow + numb * 2 * wallPartRadius;
        let randY = startYForRow;
        return { randX, randY };
      })
    );

    let leftFromBuilding = {
      randX: buildingX - rectBuildingHalfWidth - wallPartRadius,
      randY: buildingY
    };
    let rightFromBuilding = {
      randX: buildingX + rectBuildingHalfWidth + wallPartRadius,
      randY: buildingY
    };

    return validPositions.concat([leftFromBuilding, rightFromBuilding]);
  }

  static checkIfOnTopOfOtherBuildingOrSpawnArea(buildings, randX, randY) {
    for (let index = 0; index < buildings.length; index++) {
      const building = buildings[index];
      let diffX = Math.abs(building.x - randX);
      let diffY = Math.abs(building.y - randY);
      let inRowsOverOrUnderBuilding =
        diffY >= 2 * rectBuildinghalfHeight + 2 * wallPartRadius;
      let leftOrRightFromBuilding =
        diffX >= 2 * rectBuildingHalfWidth + 2 * wallPartRadius;
      if (!inRowsOverOrUnderBuilding && !leftOrRightFromBuilding) return true;
    }

    return false;
  }
}
