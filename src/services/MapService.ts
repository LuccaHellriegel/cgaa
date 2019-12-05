import { PositionService } from "./PositionService";

import { walkableSymbol } from "../globals/globalMarking";

export class MapService {
  private constructor() {}

  static updateMapWithElementAndAroundElements(map, element, eleSymbol, removed) {
    let positions = PositionService.getRelativePosOfElementsAndAroundElements([element], map, 1, 1);
    positions.forEach(pos => {
      if (removed) {
        map[pos.row][pos.column] = walkableSymbol;
      } else {
        map[pos.row][pos.column] = eleSymbol;
      }
    });
  }

  static updateMapWithElement(map, element, eleSymbol, removed) {
    let { row, column } = PositionService.findCurRelativePosition(map, element.x, element.y);
    if (removed) {
      map[row][column] = walkableSymbol;
    } else {
      map[row][column] = eleSymbol;
    }
  }
}
