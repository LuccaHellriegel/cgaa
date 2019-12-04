import { rectBuildinghalfHeight, wallPartHalfSize, rectBuildingHalfWidth } from "../globals/globalSizes";
import { PositionService } from "../services/PositionService";
import { AreaPosition } from "../env/areas/AreaPosition";

export class SpawnService {
  private constructor() {}

  static createWalkableArr(parts: AreaPosition[][]) {
    let walkabkleArr: number[][] = [];
    for (let i = 0; i < parts.length; i++) {
      let row: number[] = [];
      for (let k = 0; k < parts[0].length; k++) {
        let notWalkableSymbol = parts[i][k].contentType === "building" ? 2 : 1;

        row.push(parts[i][k].isWalkable() ? 0 : notWalkableSymbol);
      }
      walkabkleArr.push(row);
    }
    return walkabkleArr;
  }

  static calculateRelativeSpawnPositionsAround(column, row, width, height) {
    let validPositions: any[] = [];

    //TODO: assumes symmetrical objects

    let rowSize = Math.floor(height / 2) + 1;
    let columnSize = Math.floor(width / 2) + 1;

    for (let rowIndex = 0; rowIndex < rowSize + 1; rowIndex++) {
      for (let columnIndex = 0; columnIndex + 1 < columnSize; columnIndex++) {
        if (rowIndex > Math.floor(height / 2) || columnIndex > Math.floor(width / 2)) {
          validPositions.push({ column: column + columnIndex, row: row + rowIndex });
          validPositions.push({ column: column - columnIndex, row: row - rowIndex });
        }
      }
    }

    return validPositions;
  }

  static calculateSpawnPositionsAround(x, y, width, height) {
    //TODO: assumes grid position and width and height being grid multiple
    let topLeftX = x - width / 2;
    let topLeftY = y - height / 2;
    let startXForRow = topLeftX - wallPartHalfSize;
    let startYForRow = topLeftY - wallPartHalfSize;

    let rowAbove: number[] = [];
    for (let index = 0; index < 2 + width / (2 * wallPartHalfSize); index++) {
      rowAbove.push(index);
    }
    let rowBelow = rowAbove;

    let rowLeft: number[] = [];
    for (let index = 0; index < height / (2 * wallPartHalfSize); index++) {
      rowLeft.push(index);
    }

    let rowRight = rowLeft;

    let mapFuncForXRow = numb => {
      let randX = startXForRow + numb * 2 * wallPartHalfSize;
      let randY = startYForRow;
      return { randX, randY };
    };

    let mapFuncForYRow = numb => {
      let randX = startXForRow;
      let randY = startYForRow + numb * 2 * wallPartHalfSize;
      return { randX, randY };
    };

    let validPositions = rowAbove.map(mapFuncForXRow);

    startYForRow += height + 2 * wallPartHalfSize;

    validPositions = validPositions.concat(rowBelow.map(mapFuncForXRow));

    startYForRow = topLeftY + wallPartHalfSize;
    startXForRow = topLeftX - wallPartHalfSize;

    validPositions = validPositions.concat(rowLeft.map(mapFuncForYRow));

    startXForRow = x + width / 2 + wallPartHalfSize;

    validPositions = validPositions.concat(rowRight.map(mapFuncForYRow));

    return validPositions;
  }

  static calculateSpawnPositionsAroundBuilding(x, y) {
    return this.calculateSpawnPositionsAround(x, y, 2 * rectBuildingHalfWidth, 2 * rectBuildinghalfHeight);
  }

  static updateBuildingSpawnableArr(partialArr) {
    for (let row = 0; row < partialArr.length; row++) {
      for (let column = 0; column < partialArr[0].length; column++) {
        let isNotWalkable = !(partialArr[row][column] === 0);
        if (isNotWalkable) {
          let isBuilding = partialArr[row][column] === 2;
          if (isBuilding) {
            //TODO: shape of building and surrounding is hardcoded, only positions where we can place the middle of the building are 0
            //TODO: assumption that we have at least 2x2 positions inside the area walls
            //TODO: double for is bad

            //middle row
            partialArr[row][column - 2] = 3;
            partialArr[row][column - 1] = 3;
            partialArr[row][column] = 3;
            partialArr[row][column + 1] = 3;
            partialArr[row][column + 2] = 3;
            partialArr[row][column + 3] = 3;
            partialArr[row][column + 4] = 3;

            //upper row
            partialArr[row - 1][column - 2] = 3;
            partialArr[row - 1][column - 1] = 3;
            partialArr[row - 1][column] = 3;
            partialArr[row - 1][column + 1] = 3;
            partialArr[row - 1][column + 2] = 3;
            partialArr[row - 1][column + 3] = 3;
            partialArr[row - 1][column + 4] = 3;

            //lower row
            partialArr[row + 1][column - 2] = 3;
            partialArr[row + 1][column - 1] = 3;
            partialArr[row + 1][column] = 3;
            partialArr[row + 1][column + 1] = 3;
            partialArr[row + 1][column + 2] = 3;
            partialArr[row + 1][column + 3] = 3;
            partialArr[row + 1][column + 4] = 3;
          }
        }
      }
    }

    for (let row = 0; row < partialArr.length; row++) {
      for (let column = 0; column < partialArr[0].length; column++) {
        let isNotWalkable = !(partialArr[row][column] === 0);
        if (isNotWalkable) {
          let topLeftEdge = column === 0 && row === 0;
          let topRightEdge = column === partialArr[0].length - 1 && row === 0;

          let bottomLeftEdge = column === 0 && row === partialArr.length - 1;
          let bottomRightEdge = column === partialArr[0].length - 1 && row === partialArr.length - 1;

          let isEdgePoint = topLeftEdge || topRightEdge || bottomLeftEdge || bottomRightEdge;

          if (!isEdgePoint) {
            let isTopWall = row === 0;
            if (isTopWall) {
              partialArr[row + 1][column] = 3;
            } else {
              let isBottomWall = row === partialArr.length - 1;

              if (isBottomWall) {
                partialArr[row - 1][column] = 3;
              } else {
                let isRightWall = column === partialArr[0].length - 1;
                if (isRightWall) {
                  partialArr[row][column - 1] = 3;
                  partialArr[row][column - 2] = 3;
                } else {
                  let isLeftWall = column === 0;
                  if (isLeftWall) {
                    partialArr[row][column + 1] = 3;
                    partialArr[row][column + 2] = 3;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  static extractSpawnPosFromSpawnableArr(spawnableArr) {
    let spawnPos = [];
    for (let row = 0; row < spawnableArr.length; row++) {
      for (let column = 0; column < spawnableArr[0].length; column++) {
        if (spawnableArr[row][column] === 0) spawnPos.push({ row: row, column: column });
      }
    }
    return spawnPos;
  }

  static extractSpawnPosFromSpawnableArrForArea(relativeAreaWidth, relativeAreaHeight, spawnableArr) {
    let spawnPos = this.extractSpawnPosFromSpawnableArr(spawnableArr);
    let areaSpawnPos = [];
    spawnPos.forEach(pos => {
      if (pos.row < relativeAreaWidth && pos.column < relativeAreaHeight) {
        areaSpawnPos.push(pos);
      }
    });

    return areaSpawnPos;
  }

  static calculateBuildingSpawnableArrForArea(parts) {
    let spawnableArr = SpawnService.createWalkableArr(parts);
    this.updateBuildingSpawnableArr(spawnableArr);
    return spawnableArr;
  }

  static randomlyTryAllSpawnablePosFromArr(spawnableArr, area, randGenerationCallback, validTestingCallback) {
    let spawnablePos = this.extractSpawnPosFromSpawnableArr(spawnableArr);
    return this.randomlyTryAllSpawnablePos(spawnablePos, area, randGenerationCallback, validTestingCallback);
  }

  static randomlyTryAllSpawnablePos(spawnablePos, area, randGenerationCallback, validTestingCallback) {
    let spawnablePosCount = spawnablePos.length - 1;
    let randPos = randGenerationCallback(spawnablePosCount);

    let positionsTried = 0;

    let chosenPosition = spawnablePos[randPos];

    let realPos = PositionService.relativePosToRealPosInArea(area, chosenPosition.column, chosenPosition.row);

    while (validTestingCallback(realPos.x, realPos.y)) {
      positionsTried++;
      if (positionsTried === spawnablePosCount + 1) {
        return null;
      }

      let reachedLastPos = randPos === spawnablePosCount;
      if (!reachedLastPos) {
        randPos++;
      } else {
        randPos = 0;
      }
      chosenPosition = spawnablePos[randPos];
      realPos = PositionService.relativePosToRealPosInArea(area, chosenPosition.column, chosenPosition.row);
    }

    return { randX: realPos.x, randY: realPos.y };
  }
}
