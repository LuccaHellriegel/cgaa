import { Manager } from "../base/Base";
import { Gameplay } from "../scenes/Gameplay";
import EasyStar from "easystarjs";
import { PathContainer } from "../path/PathContainer";
import { Area } from "../env/areas/Area";
import { PositionService } from "../services/PositionService";
import { SpawnService } from "../spawn/SpawnService";

export class PathManager extends Manager {
  easyStar: EasyStar.js;
  relativeGoalPositionRow: number = 9;
  realtiveGoalPositionColumn: number = 29;
  mainPath;
  buildingSpecificPaths: PathContainer[] = [];
  get: any;

  constructor(scene: Gameplay) {
    super(scene, "pathManager");
    this.easyStar = new EasyStar.js();
    this.calculateBuildingSpecificPaths();
  }

  calculateAllBuildingSpecificPaths(building) {
    let { column, row } = PositionService.realPosToRelativePos(building.x, building.y);

    let validSpawnPositions = SpawnService.calculateRelativeSpawnPositionsAround(column, row, 3, 1);
    let containers: PathContainer[] = [];

    validSpawnPositions.forEach(pos => {
      let saveReference = new PathContainer(pos.column, pos.row);
      this.scene.envManager.setMapAsGrid(this.easyStar);
      this.easyStar.setAcceptableTiles([0]);
      this.easyStar.findPath(
        pos.column,
        pos.row,
        this.realtiveGoalPositionColumn,
        this.relativeGoalPositionRow,
        function(path) {
          if (path === null) {
            console.log("Path was not found.");
          } else {
            saveReference.updatePath(path);
          }
        }.bind(this)
      );
      this.easyStar.calculate();
      containers.push(saveReference);
    });
    return containers;
  }

  private calculateBuildingSpecificPaths() {
    this.scene.envManager.executeWithAreasThatHaveBuilding((area: Area) => {
      area.buildings.forEach(building => {
        this.buildingSpecificPaths = this.buildingSpecificPaths.concat(
          this.calculateAllBuildingSpecificPaths(building)
        );
      });
    });
  }

  getSpecificPathForSpawnPos(column, row) {
    for (const container in this.buildingSpecificPaths) {
      if (this.buildingSpecificPaths[container].id === [column, row].join(""))
        return this.buildingSpecificPaths[container];
    }
  }
}
