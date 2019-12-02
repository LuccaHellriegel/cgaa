import {
  wallPartHalfSize
} from "../globals/globalSizes";

export class PositionService {
  private constructor() {}

  private static snapCoordinateToGrid(coordinate) {
    let ceil = Math.ceil(coordinate / wallPartHalfSize) * wallPartHalfSize;
    let floor = Math.floor(coordinate / wallPartHalfSize) * wallPartHalfSize;

    if ((ceil / wallPartHalfSize) % 2 === 0) ceil = Infinity;
    if ((floor / wallPartHalfSize) % 2 === 0) floor = Infinity;

    let diffCeil = Math.abs(ceil - coordinate);
    let diffFloor = Math.abs(floor - coordinate);

    if (diffCeil < diffFloor) {
      return ceil;
    } else {
      return floor;
    }
  }

  static snapXYToGrid(x, y) {
    let needToSnapX = x % wallPartHalfSize !== 0;
    let needToSnapY = x % wallPartHalfSize !== 0;

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
          x - wallPartHalfSize === curXInArr &&
          y - wallPartHalfSize === curYInArr
        ) {
          return { row: i, column: k };
        }
        curXInArr += 2 * wallPartHalfSize;
      }
      curYInArr += 2 * wallPartHalfSize;

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

}
