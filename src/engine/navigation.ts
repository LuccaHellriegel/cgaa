import { array2DFind, array2DApply } from "./array";
import { RelPos } from "./RelPos";

export function posAround2DPosition(startRow, startColumn, posShape) {
  // assumes 2D grid with (0,0) topLeft

  // allow 1D row-shape, but always work with 2D
  if (!posShape[0].length) posShape = [posShape];

  const startPosSymbol = 0;
  const addPosSymbol = 1;

  const [row, column] = array2DFind(
    posShape,
    (posSymbol) => posSymbol === startPosSymbol
  );

  const transformShapePosToPos = (posSymbol, shapeRow, shapeColumn) => {
    if (posSymbol === addPosSymbol) {
      const rowToAdd = shapeRow - row;
      const columnToAdd = shapeColumn - column;
      return { row: startRow + rowToAdd, column: startColumn + columnToAdd };
    } else {
      return null;
    }
  };

  return array2DApply(posShape, transformShapePosToPos);
}

export function posAround2DPositionRelPos(startRow, startColumn, posShape) {
  return posAround2DPosition(startRow, startColumn, posShape).map(
    (pos) => new RelPos(pos.row, pos.column)
  );
}

export function equal2DPositions(
  firstPos: { row: number; column: number },
  secondPos: { row: number; column: number }
) {
  return firstPos.row === secondPos.row && firstPos.column === secondPos.column;
}
