import { AreaPosition } from "./AreaPosition";
import { wallPartHalfSize } from "../../globals/globalSizes";

export class AreaService {
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

  static calculateBorderObject(parts, width, height) {
    let borderX = parts[0][0].x + wallPartHalfSize;
    let borderY = parts[0][0].y + wallPartHalfSize;
    let borderWidth = width - 4 * wallPartHalfSize;
    let borderHeight = height - 4 * wallPartHalfSize;
    return { borderX, borderY, borderWidth, borderHeight };
  }
}
