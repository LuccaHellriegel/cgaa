import { AreaPart } from "./AreaPart";
import { wallPartHalfSize } from "../../globals/globalSizes";

export class AreaService {
  private constructor() {}

  static createCumulativeWalkableArr(arrOfWalkAbleArrs) {
    //TODO: assummption that all areas have the same number of rows, and that the input arr is symmetric

    let cumulativeWalkableArr: number[][] = [];

    for (
      let rowIndexArea = 0;
      rowIndexArea < arrOfWalkAbleArrs.length;
      rowIndexArea++
    ) {
      for (
        let rowIndex = 0;
        rowIndex < arrOfWalkAbleArrs[0][0].length;
        rowIndex++
      ) {
        let cumulativeRow = [];

        for (
          let columnIndexArea = 0;
          columnIndexArea < arrOfWalkAbleArrs[0].length;
          columnIndexArea++
        ) {
          cumulativeRow = cumulativeRow.concat(
            arrOfWalkAbleArrs[rowIndexArea][columnIndexArea][rowIndex]
          );
        }
        cumulativeWalkableArr.push(cumulativeRow);
      }
    }

    return cumulativeWalkableArr;
  }

  static createWalkableArr(parts: AreaPart[][]) {
    let walkabkleArr: number[][] = [];
    for (let i = 0; i < parts.length; i++) {
      let row: number[] = [];
      for (let k = 0; k < parts[0].length; k++) {
        row.push(parts[i][k].isWalkable() ? 0 : 1);
      }
      walkabkleArr.push(row);
    }
    return walkabkleArr;
  }

  static calculateBorderObjectFromPartsAndSize(parts,width,height){
    let borderX = parts[0][0].x + wallPartHalfSize;
    let borderY = parts[0][0].y + wallPartHalfSize;
    let borderWidth = width - 4 * wallPartHalfSize;
    let borderHeight = height - 4 * wallPartHalfSize;
    return { borderX, borderY, borderWidth, borderHeight };
  } 
}
