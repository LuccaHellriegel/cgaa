import { AreaPosition } from "./AreaPosition";

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
}
