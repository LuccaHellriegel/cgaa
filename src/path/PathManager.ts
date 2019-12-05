import { Manager } from "../base/Base";
import { Gameplay } from "../scenes/Gameplay";
import EasyStar from "easystarjs";
import { PositionService } from "../services/PositionService";

export class PathManager extends Manager {
  areaMaps: any[] = [];
  easyStar: EasyStar.js;
  relativeStartPositionRow: number = 9;
  relativeStartPositionColumn: number = 19;
  relativeGoalPositionRow: number = 9;
  realtiveGoalPositionColumn: number = 29;
  mainPath;

  constructor(scene: Gameplay) {
    super(scene, "pathManager");

    //TODO: listen to building destroyed
    this.elements = this.scene.envManager.calculateWalkAbleArr();
    this.areaMaps = this.scene.envManager.calculateAreaMaps();
    console.log(this.areaMaps);
    this.easyStar = new EasyStar.js();
    this.calculateMainPath();
  }

  private calculateMainPath() {
    console.log(this.elements);
    this.easyStar.setGrid(this.elements);
    this.easyStar.setAcceptableTiles([0]);
    this.easyStar.findPath(
      this.relativeStartPositionColumn,
      this.relativeStartPositionRow,
      this.realtiveGoalPositionColumn,
      this.relativeGoalPositionRow,
      function(path) {
        if (path === null) {
          console.log("Path was not found.");
        } else {
          this.mainPath = path;
        }
      }.bind(this)
    );
    this.easyStar.calculate();
  }

  calculatePath(unit, x, y) {
    let { rowInAreaArr, columnInAreaArr } = this.scene.envManager.findClosestArea(x, y);
    let map = this.areaMaps[rowInAreaArr][columnInAreaArr];
    this.easyStar.setGrid(map);
    this.easyStar.setAcceptableTiles([0]);
    let { row, column } = PositionService.findCurRelativePositionInArea(
      map,
      x,
      y,
      this.scene.envManager.elements[rowInAreaArr][columnInAreaArr]
    );
    this.easyStar.findPath(
      column,
      row,
      this.relativeStartPositionColumn,
      this.relativeStartPositionRow,
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
