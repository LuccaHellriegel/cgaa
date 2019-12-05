import { wallPartHalfSize } from "../globals/globalSizes";
import { SpawnService } from "../spawn/SpawnService";

export class PositionService {
  private constructor() {}

  static snapCoordinateToGrid(coordinate) {
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
    let needToSnapX = x % wallPartHalfSize !== 0 || x / wallPartHalfSize / 2 === 0;
    let needToSnapY = y % wallPartHalfSize !== 0 || y / wallPartHalfSize / 2 === 0;

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

  private static tryToFindRelativePosInArr(walkableArr, x, y) {
    //symmetrical arr is assumed

    let curXInArr = 0;
    let curYInArr = 0;
    for (let i = 0; i < walkableArr.length; i++) {
      for (let k = 0; k < walkableArr[0].length; k++) {
        if (x - wallPartHalfSize === curXInArr && y - wallPartHalfSize === curYInArr) {
          return { row: i, column: k };
        }
        curXInArr += 2 * wallPartHalfSize;
      }
      curYInArr += 2 * wallPartHalfSize;

      curXInArr = 0;
    }

    return null;
  }

  static findCurRelativePosition(walkableArr: number[][], x, y) {
    let { newX, newY } = this.snapXYToGrid(x, y);

    let relPos = this.tryToFindRelativePosInArr(walkableArr, newX, newY);

    if (relPos) return relPos;
    throw "No relative position found for point " + x + " " + y + " and snapped point " + newX + " " + newY;
  }

  static relativePosToRealPosInArea(area, column, row) {
    let x = area.topLeftX + wallPartHalfSize + column * 2 * wallPartHalfSize;
    let y = area.topLeftY + wallPartHalfSize + row * 2 * wallPartHalfSize;
    return { x, y };
  }

  static realPosToRelativePosInEnv(x, y) {
    let row = (y - wallPartHalfSize) / (2 * wallPartHalfSize);
    let column = (x - wallPartHalfSize) / (2 * wallPartHalfSize);
    return { row: row, column: column };
  }

  static getRelativePosOfElements(elements, map) {
    let relativePositions: any[] = [];
    elements.forEach(ele => {
      let pos = PositionService.findCurRelativePosition(map, ele.x, ele.y);
      relativePositions.push(pos);
    });
    return relativePositions;
  }

  static getRelativePosOfElementsAndAroundElements(elements, map, relativeWidth, relativeHeight) {
    let relativePositions: any[] = this.getRelativePosOfElements(elements, map);
    let relativePositionsAround: any[] = [];
    relativePositions.forEach(pos => {
      let posAround = SpawnService.calculateRelativeSpawnPositionsAround(
        pos.column,
        pos.row,
        relativeWidth,
        relativeHeight
      );
      relativePositionsAround = relativePositionsAround.concat(posAround);
    });
    return relativePositions.concat(relativePositionsAround);
  }
}
