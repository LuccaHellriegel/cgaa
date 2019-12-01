import { Gameplay } from "../../scenes/Gameplay";
import { Building } from "../Building";
import {
  rectBuildingHalfWidth,
  rectBuildinghalfHeight,
  wallPartHalfSize
} from "../../global";
import { WallArea } from "./WallArea";
import { BuildingService } from "../BuildingService";

export class WallAreaWithBuildings extends WallArea {
  buildings: Building[];

  constructor(
    scene: Gameplay,
    numberOfXRects,
    numberOfYRects,
    topLeftX,
    topLeftY
  ) {
    super(scene, numberOfXRects, numberOfYRects, topLeftX, topLeftY);

    this.buildings = [];
    this.buildBuilding();
    this.buildBuilding();
    this.buildBuilding();
    this.buildBuilding();
    this.buildBuilding();
    this.buildBuilding();
    this.buildBuilding();
    this.buildBuilding();

  }

  private buildBuilding() {
    let { randX, randY } = this.calculateRandValidSpawnPosition(
      rectBuildingHalfWidth + 2 * wallPartHalfSize,
      rectBuildinghalfHeight + 2 * wallPartHalfSize
    );
    while (
      BuildingService.checkIfOnTopOfOtherBuildingOrSpawnArea(
        this.buildings,
        randX,
        randY
      )
    ) {
      let result = this.calculateRandValidSpawnPosition(
        rectBuildingHalfWidth + 2 * wallPartHalfSize,
        rectBuildinghalfHeight + 2 * wallPartHalfSize
      );
      randX = result.randX;
      randY = result.randY;
    }

    let building = new Building(this.scene, randX, randY, this.scene.areaManager.physicsGroup);
    this.addBuildingToParts(building);
    this.buildings.push(building);
  }

  private addBuildingToParts(building: Building) {
    let x = this.topLeftX;
    let y = this.topLeftY;

    for (let i = 0; i < this.sizeOfYAxis; i++) {
      for (let k = 0; k < this.sizeOfXAxis; k++) {
        if (
          building.x - rectBuildingHalfWidth === x &&
          building.y - rectBuildinghalfHeight === y
        ) {
          //TODO: depends on the fact that the building is 3* the wallpart
          this.parts[i][k].updateContent(building);
          this.parts[i][k+1].updateContent(building);
          this.parts[i][k+2].updateContent(building);
          break;
        }
        x += 2 * wallPartHalfSize;
      }
      y += 2 * wallPartHalfSize;

      x = this.topLeftX;
    }
  }
}
