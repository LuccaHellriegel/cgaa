import { Image } from "../../base/BasePhaser";
import { SpawnService } from "../../spawn/SpawnService";
import { Area } from "../areas/Area";

export class Building extends Image {
  validSpawnPositions: any[];
  enemies: any[] = [];
  area: Area;

  constructor(scene, x, y, physicsGroup, area) {
    super(scene, x, y, "rectBuilding", physicsGroup);
    this.area = area;
    this.validSpawnPositions = SpawnService.calculateSpawnPositionsAroundBuilding(this.x, this.y);
  }

}
