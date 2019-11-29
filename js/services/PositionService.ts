import {
  rectBuildingHalfWidth,
  rectBuildinghalfHeight,
  wallPartRadius
} from "../global";

export class PositionService {
  private constructor() {}

  static snapXYToGrid(x, y) {
    //TODO: check if we need to snap 
    let ceilX = Math.ceil(x / wallPartRadius) * wallPartRadius;
    let ceilY = Math.ceil(y / wallPartRadius) * wallPartRadius;
    let floorX = Math.floor(x / wallPartRadius) * wallPartRadius;
    let floorY = Math.floor(y / wallPartRadius) * wallPartRadius;

    if((ceilX / wallPartRadius) % 2 === 0) ceilX = Infinity
    if((ceilY / wallPartRadius) % 2 === 0) ceilY = Infinity
    if((floorX / wallPartRadius) % 2 === 0) floorX = Infinity
    if((floorY / wallPartRadius) % 2 === 0) floorY = Infinity

    let diffCeilX = Math.abs(ceilX - x);
    let diffFloorX = Math.abs(floorX - x);

    let diffCeilY = Math.abs(ceilY - y);
    let diffFloorY = Math.abs(floorY - y);

    let newX;
    let newY;


    if (diffCeilX < diffFloorX) {
      newX = ceilX;
    } else {
      newX = floorX;
    }

    if (diffCeilY < diffFloorY) {
      newY = ceilY;
    } else {
      newY = floorY;
    }
    return {newX, newY };
  }

  //TODO: idea just calculate arr for all the points and then make distance check
  private static tryToFindRelativPosInWallArea(
    wallArea,
    x,
    y,
    topLeftX,
    topLeftY
  ) {
    for (let i = 0; i < wallArea.numberOfYRects + 2; i++) {
      for (let k = 0; k < wallArea.numberOfXRects; k++) {
        if (
          x - wallPartRadius === topLeftX &&
          y - wallPartRadius === topLeftY
        ) {
          return { row: i, column: k };
        }
        topLeftX += 2 * wallPartRadius;
      }
      topLeftY += 2 * wallPartRadius;

      topLeftX =
        wallArea.x - 2 * wallPartRadius * (wallArea.numberOfXRects / 2);
    }

    return null;
  }

  static findCurRelativePosInWallArea(wallArea, x, y) {
    let topLeftX =
      wallArea.x - 2 * wallPartRadius * (wallArea.numberOfXRects / 2);
    let topLeftY =
      wallArea.y - 2 * wallPartRadius * ((wallArea.numberOfYRects + 2) / 2);

      let {newX,newY} = this.snapXYToGrid(x,y)

    let relPos = this.tryToFindRelativPosInWallArea(
      wallArea,
      newX,
      newY,
      topLeftX,
      topLeftY
    );

    if (relPos) return relPos;
    
    throw "No relative position found for wallArea " +
      wallArea.x +
      " " +
      wallArea.y +
      " and point " +
      x +
      " " +
      y;
  }

  //TODO: make more general or change name to building specific
  static calculateValidSpawnPositions(buildingX, buildingY) {
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
}
