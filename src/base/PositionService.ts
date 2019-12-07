import { wallPartHalfSize } from "../globals/globalSizes";
import { SpawnService } from "../world/enemies/spawn/SpawnService";

export class PositionService {
  private constructor() {}

  static snapCoordinateToGrid(coordinate) {
    let ceil = Math.ceil(coordinate / wallPartHalfSize) * wallPartHalfSize;
    let floor = Math.floor(coordinate / wallPartHalfSize) * wallPartHalfSize;

    if ((ceil / wallPartHalfSize) % 2 === 0) ceil = Infinity;
    if ((floor / wallPartHalfSize) % 2 === 0) floor = Infinity;

    let diffCeil = Math.abs(ceil - coordinate);
    let diffFloor = Math.abs(floor - coordinate);

    if (ceil === Infinity && floor === Infinity) {
      return coordinate - wallPartHalfSize;
    } else if (diffCeil < diffFloor) {
      return ceil;
    } else {
      return floor;
    }
  }

  static snapXYToGrid(x, y) {
    let needToSnapX = (x - wallPartHalfSize) % (2 * wallPartHalfSize) !== 0;
    let needToSnapY = (y - wallPartHalfSize) % (2 * wallPartHalfSize) !== 0;

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

  static relativePosToRealPos(column, row) {
    let x = 0 + wallPartHalfSize + column * 2 * wallPartHalfSize;
    let y = 0 + wallPartHalfSize + row * 2 * wallPartHalfSize;
    return { x, y };
  }

  static realPosToRelativePos(x, y) {
    let { newX, newY } = this.snapXYToGrid(x, y);
    let row = (newY - wallPartHalfSize) / (2 * wallPartHalfSize);
    let column = (newX - wallPartHalfSize) / (2 * wallPartHalfSize);
    return { row: row, column: column };
  }

  static getRelativePosOfElements(elements) {
    let relativePositions: any[] = [];
    elements.forEach(ele => {
      let pos = PositionService.realPosToRelativePos(ele.x, ele.y);
      relativePositions.push(pos);
    });
    return relativePositions;
  }

  static getRelativePosOfElementsAndAroundElements(elements, width, height) {
    let relativePositions: any[] = this.getRelativePosOfElements(elements);
    let relativePositionsAround: any[] = [];
    relativePositions.forEach(pos => {
      let posAround = SpawnService.calculateRelativeSpawnPositionsAround(pos.column, pos.row, width, height);
      relativePositionsAround = relativePositionsAround.concat(posAround);
    });
    return relativePositions.concat(relativePositionsAround);
  }
}
