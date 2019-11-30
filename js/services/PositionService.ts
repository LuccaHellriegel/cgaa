import {
  rectBuildingHalfWidth,
  rectBuildinghalfHeight,
  wallPartRadius
} from "../global";

export class PositionService {
  private constructor() {}

  //TODO: make a unit specific service for all calculation, as Phaser always needs a window, so I can never easily test it
  private static snapCoordinateToGrid(coordinate) {
    let ceil = Math.ceil(coordinate / wallPartRadius) * wallPartRadius;
    let floor = Math.floor(coordinate / wallPartRadius) * wallPartRadius;

    if ((ceil / wallPartRadius) % 2 === 0) ceil = Infinity;
    if ((floor / wallPartRadius) % 2 === 0) floor = Infinity;

    let diffCeil = Math.abs(ceil - coordinate);
    let diffFloor = Math.abs(floor - coordinate);

    if (diffCeil < diffFloor) {
      return ceil;
    } else {
      return floor;
    }
  }

  static snapXYToGrid(x, y) {
    let needToSnapX = x % wallPartRadius !== 0;
    let needToSnapY = x % wallPartRadius !== 0;

    if (!needToSnapX && !needToSnapY) return { newX: x, newY: y };

    let newX;
    let newY;

    if (needToSnapX) {
      newX = this.snapCoordinateToGrid(x);
    } else {
      newX = x;
    }

    if (needToSnapY) {
      newY = this.snapCoordinateToGrid(y);
    } else {
      newY = y;
    }
    return { newX, newY };
  }

  //TODO: idea just calculate arr for all the points and then make distance check
  private static tryToFindRelativPosInWallArea(
    wallArea,
    x,
    y,
    topLeftX,
    topLeftY
  ) {
    for (let i = 0; i < wallArea.sizeOfYAxis; i++) {
      for (let k = 0; k < wallArea.sizeOfXAxis; k++) {
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
        wallArea.x - 2 * wallPartRadius * (wallArea.sizeOfXAxis / 2);
    }

    return null;
  }

  static findCurRelativePosInWallArea(wallArea, x, y) {
    let topLeftX =
      wallArea.x - 2 * wallPartRadius * (wallArea.sizeOfXAxis / 2);
    let topLeftY =
      wallArea.y - 2 * wallPartRadius * ((wallArea.sizeOfYAxis) / 2);

    let { newX, newY } = this.snapXYToGrid(x, y);

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

}
