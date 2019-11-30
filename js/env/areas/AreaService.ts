import { AreaPart } from "./AreaPart";

export class AreaService {
  private constructor() {}

  static calculateWalkableArr(
    sizeOfXAxis,
    sizeOfYAxis,
    parts: AreaPart[][],
    furtherProcessingFunc
  ) {
    let walkableMap: number[][] = [];
    for (let i = 0; i < sizeOfYAxis; i++) {
      let row: number[] = [];
      for (let k = 0; k < sizeOfXAxis; k++) {
        let curElement = parts[i][k].isWalkable() ? 0 : 1;
        row.push(curElement);
      }
      walkableMap.push(row);
    }
    return furtherProcessingFunc(walkableMap);
  }
}
