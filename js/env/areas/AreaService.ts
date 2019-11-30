export class AreaService {
  private constructor() {}

  static calculateWalkableArr(sizeOfXAxis, sizeOfYAxis, parts, furtherProcessingFunc) {
    let walkableMap: number[][] = [];
    for (let i = 0; i < sizeOfYAxis; i++) {
      let row: number[] = [];
      for (let k = 0; k < sizeOfXAxis; k++) {
        let curElement = parts[i][k] ? 1 : 0;

        let wasDeleted = parts[i][k] && parts[i][k].content === null;
        if (wasDeleted) {
          curElement = 0;
        }
        row.push(curElement);
      }
      walkableMap.push(row);
    }
    return furtherProcessingFunc(walkableMap);
  }
}
