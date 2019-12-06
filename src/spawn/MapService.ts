import { PositionService } from "../services/PositionService";
import { walkableSymbol } from "../globals/globalMarking";

export class MapService {
  private constructor() {}

  //TODO: assumes element is one long (gets correct around but not correct in element)
  static updateMapWithElementAndAroundElements(map, element, eleSymbol, removed, width, height) {
    let positions = PositionService.getRelativePosOfElementsAndAroundElements([element], map.length, map[0].length, width, height);
    positions.forEach(pos => {
      if (removed) {
        map[pos.row][pos.column] = walkableSymbol;
      } else {
        map[pos.row][pos.column] = eleSymbol;
      }
    });
  }

  static updateMapWithElement(map, element, eleSymbol, removed) {
    let { row, column } = PositionService.realPosToRelativePos(element.x, element.y);

    if (removed) {
      map[row][column] = walkableSymbol;
    } else {
      map[row][column] = eleSymbol;
    }
  }
}
