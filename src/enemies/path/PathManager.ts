import { BaseManagerConfig, BaseService } from "../../base/Base";
import { Gameplay } from "../../scenes/Gameplay";
import EasyStar from "easystarjs";
import { PathContainer } from "./PathContainer";
import { Area } from "../../world/areas/Area";
import { PositionService } from "../../world/PositionService";
import { SpawnService } from "../spawn/SpawnService";

export class PathManager {
  scene: Gameplay;
  easyStar: EasyStar.js;
  relativeGoalPositionRow: number = 14;
  realtiveGoalPositionColumn: number = 14;
  buildingSpecificPaths: PathContainer[] = [];

  constructor(config: BaseManagerConfig) {
    BaseService.applyBaseManagerConfig(this, config);
    this.easyStar = new EasyStar.js();
    this.calculateBuildingSpecificPaths();
  }

  calculateAllBuildingSpecificPaths(building) {
    let { column, row } = PositionService.realPosToRelativePos(building.x, building.y);

    let validSpawnPositions = SpawnService.calculateRelativeSpawnPositionsAround(column, row, 3, 1);
    let containers: PathContainer[] = [];

    validSpawnPositions.forEach(pos => {
      let saveReference = new PathContainer(pos.column, pos.row);
      this.scene.worldManager.setMapAsGrid(this.easyStar);
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
    this.scene.worldManager.executeWithAreasThatHaveBuilding((area: Area) => {
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
