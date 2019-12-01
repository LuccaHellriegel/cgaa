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

  private static tryToFindRelativePosInArr(
    walkableArr,
    x,
    y
  ) {
    //TODO: symmetrical arr is assumed

    let curXInArr = 0
    let curYInArr = 0
    for (let i = 0; i < walkableArr.length; i++) {
      for (let k = 0; k < walkableArr[0].length; k++) {
        if (
          x - wallPartRadius === curXInArr &&
          y - wallPartRadius === curYInArr
        ) {
          return { row: i, column: k };
        }
        curXInArr += 2 * wallPartRadius;
      }
      curYInArr += 2 * wallPartRadius;

      curXInArr = 0
    }

    return null;
  }

  static findCurRelativePosition(walkableArr: number[][], x, y) {
    let { newX, newY } = this.snapXYToGrid(x, y);

    let relPos = this.tryToFindRelativePosInArr(
      walkableArr,
      newX,
      newY
    );

    if (relPos) return relPos;

    throw "No relative position found for point " +
      x +
      " " +
      y;
  }

  static findClosestArea(areas: any[], x, y) {
    let closesArea;
    let curDistance: number = Infinity;
    areas.forEach(wallArea => {
      let newDist = Math.hypot( wallArea.x-x, wallArea.y-y)
      if (newDist < curDistance) {
        closesArea = wallArea;
        curDistance = newDist;
      }
    });
    return closesArea;
  }

}
