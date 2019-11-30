import { Gameplay } from "../../scenes/Gameplay";
import { Building } from "../Building";
import {
  rectBuildingHalfWidth,
  rectBuildinghalfHeight,
  wallPartRadius
} from "../../global";
import { PositionService } from "../../services/PositionService";
import { WallArea } from "./WallArea";

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
    this.buildBuilding();
    this.buildBuilding();
    this.buildBuilding();
    this.buildBuilding();
    this.buildBuilding();
  }

  private buildBuilding() {
    let { randX, randY } = this.calculateRandValidSpawnPosition(
      rectBuildingHalfWidth + 2 * wallPartRadius,
      rectBuildinghalfHeight + 2 * wallPartRadius
    );
    while (
      PositionService.checkIfOnTopOfOtherBuildingOrSpawnArea(
        this.buildings,
        randX,
        randY
      )
    ) {
      let result = this.calculateRandValidSpawnPosition(
        rectBuildingHalfWidth + 2 * wallPartRadius,
        rectBuildinghalfHeight + 2 * wallPartRadius
      );
      randX = result.randX;
      randY = result.randY;
    }

    let building = new Building(this.scene, randX, randY, this.physicsGroup);
    this.addBuildingToParts(building);
    this.buildings.push(building);
  }

  private addBuildingToParts(building: Building) {
    let x = this.topLeftX;
    let y = this.topLeftY;

    for (let i = 0; i < this.numberOfYRects + 2; i++) {
      for (let k = 0; k < this.numberOfXRects; k++) {
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
        x += 2 * wallPartRadius;
      }
      y += 2 * wallPartRadius;

      x = this.topLeftX;
    }
  }

  //TODO: might need to store walkable arr for performance reasons (need it all the time -> unit navigation dynamically)
}
