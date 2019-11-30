import { AreaPart } from "./AreaPart";

export class AreaService {
  private constructor() {}

  static updateWalkableArr(
    sizeOfXAxis,
    sizeOfYAxis,
    parts: AreaPart[][],
    walkableMap
  ) {
    for (let i = 0; i < sizeOfYAxis; i++) {
      for (let k = 0; k < sizeOfXAxis; k++) {
        walkableMap[i][k] = parts[i][k].isWalkable() ? 0 : 1;
      }
    }
  }
}
