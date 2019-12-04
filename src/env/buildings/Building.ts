import { Image } from "../../base/BasePhaser";
import { SpawnService } from "../../spawn/SpawnService";
import { Area } from "../areas/Area";
import { PositionService } from "../../services/PositionService";

export class Building extends Image {
  validSpawnPositions: any[];
  enemies: any[] = [];
  area: Area;

  constructor(scene, x, y, physicsGroup, area) {
    super(scene, x, y, "rectBuilding", physicsGroup);
    this.area = area;
    let { column, row } = PositionService.realPosToRelativePosInEnv(this.x, this.y);
    this.validSpawnPositions = SpawnService.calculateRelativeSpawnPositionsAround(column, row, 3, 1);
  }
}
