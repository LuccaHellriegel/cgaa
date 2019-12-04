import { Manager } from "../base/Base";
import { Gameplay } from "../scenes/Gameplay";
import { AreaService } from "../env/areas/AreaService";
import EasyStar from "easystarjs";
import { PositionService } from "../services/PositionService";

export class PathManager extends Manager {
  easyStar: EasyStar.js;
  relativeGoalPositionRow: number = 29;
  realtiveGoalPositionColumn: number = 29;

  constructor(scene: Gameplay) {
    super(scene, "pathManager");

    this.calculateCumulativeWalkAbleArr();
    this.easyStar = new EasyStar.js();
  }

  private calculateCumulativeWalkAbleArr() {
    let walkableArrArr: number[][][][] = [];
    this.scene.areaManager.executeForEachAreaRow(areaRow => {
      let row: number[][][] = [];
      areaRow.forEach(area => {
        row.push(AreaService.createWalkableArr(area.parts));
      });
      walkableArrArr.push(row);
    });
    this.elements = AreaService.createCumulativeWalkableArr(walkableArrArr);
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
