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
    super(
      scene,
      numberOfXRects,
      numberOfYRects,
      topLeftX,
      topLeftY,
    );

    //TODO: add buildings to parts instead of here -> easier to reason about
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

  
  //TODO: dont spawn ontop of each other
  private buildBuilding() {
    let { randX, randY } = this.calculateRandValidSpawnPosition(
      rectBuildingHalfWidth + 2 * wallPartRadius,
      rectBuildinghalfHeight + 2 * wallPartRadius
    );
    while (PositionService.checkIfOnTopOfOtherBuildingOrSpawnArea(this.buildings,randX, randY)) {
      let result = this.calculateRandValidSpawnPosition(
        rectBuildingHalfWidth + 2 * wallPartRadius,
        rectBuildinghalfHeight + 2 * wallPartRadius
      );
      randX = result.randX;
      randY = result.randY;
    }
    this.buildings.push(
      new Building(this.scene, randX, randY, this.physicsGroup)
    );
  }

  markBuildingPositions(map){
    this.buildings.forEach(building => {
      this.markBuildingPosition(building, map);
    });

    return map;
  }

  private markBuildingPosition(building: Building, map) {
    let x = this.topLeftX
    let y = this.topLeftY

    for (let i = 0; i < this.numberOfYRects + 2; i++) {
      for (let k = 0; k < this.numberOfXRects; k++) {
        if (
          building.x - rectBuildingHalfWidth === x &&
          building.y - rectBuildinghalfHeight === y
        ) {
          //TODO: depends on the fact that the building is 3* the wallpart
          map[i][k] = 1;
          map[i][k + 1] = 1;
          map[i][k + 2] = 1;
          break;
        }
        x += 2 * wallPartRadius;
      }
      y += 2 * wallPartRadius;

      x = this.topLeftX
    }
  }

  //TODO: might need to store walkable arr for performance reasons (need it all the time -> unit navigation dynamically)

}
