export function calculateRelativeSpawnPositionsAround(column, row, width, height) {
  let validPositions: { column; row }[] = [];

  //TODO: assumes symmetrical objects that fit perfectly on the grid

  let rowSize = Math.floor(height / 2) + 1;
  let columnSize = Math.floor(width / 2) + 1;

  let startRow = row - rowSize;
  let startColumn = column - columnSize;

  for (let rowIndex = 0; rowIndex < height + 2; rowIndex++) {
    for (let columnIndex = 0; columnIndex < width + 2; columnIndex++) {
      let betweenRowEdges = startRow + rowIndex > row - rowSize && startRow + rowIndex < row + rowSize;
      let betweenColumnEdges =
        startColumn + columnIndex > column - columnSize && startColumn + columnIndex < column + columnSize;

      if (!betweenRowEdges || !betweenColumnEdges) {
        validPositions.push({ column: startColumn + columnIndex, row: startRow + rowIndex });
      }
    }
  }
  return validPositions;
}

export function updateBuildingSpawnableArr(partialArr) {
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

export function extractSpawnPosFromSpawnableArr(spawnableArr) {
  let spawnPos = [];
  for (let row = 0; row < spawnableArr.length; row++) {
    for (let column = 0; column < spawnableArr[0].length; column++) {
      if (spawnableArr[row][column] === 0) spawnPos.push({ row: row, column: column });
    }
  }
  return spawnPos;
}

export function extractSpawnPosFromSpawnableArrForArea(
  relativeAreaTopLeftX,
  realtiveAreaTopLeftY,
  relativeAreaWidth,
  relativeAreaHeight,
  spawnableArr: any[]
) {
  let spawnPos = this.extractSpawnPosFromSpawnableArr(spawnableArr);
  let areaSpawnPos = [];
  spawnPos.forEach(pos => {
    if (
      pos.column < relativeAreaTopLeftX + relativeAreaWidth &&
      pos.column >= relativeAreaTopLeftX &&
      pos.row < realtiveAreaTopLeftY + relativeAreaHeight &&
      pos.row >= realtiveAreaTopLeftY
    ) {
      areaSpawnPos.push(pos);
    }
  });
  return areaSpawnPos;
}

export function randomlyTryAllSpawnablePos(spawnablePos, randGenerationCallback, validTestingCallback) {
  let spawnablePosCount = spawnablePos.length - 1;
  let randPos = randGenerationCallback(spawnablePosCount);

  let positionsTried = 0;

  let chosenPosition = spawnablePos[randPos];

  while (!validTestingCallback(chosenPosition.column, chosenPosition.row)) {
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
  }

  return chosenPosition;
}
