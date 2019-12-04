import { Manager } from "../base/Base";
import { Gameplay } from "../scenes/Gameplay";
import EasyStar from "easystarjs";
import { PositionService } from "../services/PositionService";

export class PathManager extends Manager {
  easyStar: EasyStar.js;
  relativeGoalPositionRow: number = 29;
  realtiveGoalPositionColumn: number = 29;

  constructor(scene: Gameplay) {
    super(scene, "pathManager");

    this.calculateWalkAbleArr();
    this.easyStar = new EasyStar.js();
  }

  private rowOfAreaToWalkableRow(rowOfArea) {
    let row: number[] = [];
    for (let k = 0; k < rowOfArea.length; k++) {
      let notWalkableSymbol = rowOfArea[k].contentType === "building" ? 2 : 1;

      row.push(rowOfArea[k].isWalkable() ? 0 : notWalkableSymbol);
    }
    return row;
  }

  private calculateWalkAbleArr() {
    //TODO: assummption that all areas have the same number of rows, and that the input arr is symmetric

    let areas = this.scene.EnvManager.elements;

    for (let rowIndexArea = 0; rowIndexArea < areas.length; rowIndexArea++) {
      for (let rowIndex = 0; rowIndex < areas[0][0].parts.length; rowIndex++) {
        let cumulativeRow = [];

        for (let columnIndexArea = 0; columnIndexArea < areas[0].length; columnIndexArea++) {
          cumulativeRow = cumulativeRow.concat(
            this.rowOfAreaToWalkableRow(areas[rowIndexArea][columnIndexArea].parts[rowIndex])
          );
        }
        this.elements.push(cumulativeRow);
      }
    }
  }

  calculatePath(unit, x, y) {
    let map = this.elements;
    this.easyStar.setGrid(map);
    this.easyStar.setAcceptableTiles([0]);
    let { row, column } = PositionService.findCurRelativePosition(this.elements, x, y);
    this.easyStar.findPath(
      column,
      row,
      this.realtiveGoalPositionColumn,
      this.relativeGoalPositionRow,
      function(path) {
        if (path === null) {
          console.log("Path was not found.");
        } else {
          unit.path = path;
        }
      }.bind(this)
    );
    this.easyStar.calculate();
  }
}
