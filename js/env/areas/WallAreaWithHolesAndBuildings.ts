import { WallAreaWithHoles } from "./WallAreaWithHoles";
import { Gameplay } from "../../scenes/Gameplay";
import { Building } from "../Building";
import {
  rectBuildingHalfWidth,
  rectBuildinghalfHeight,
  wallPartRadius
} from "../../global";

export class WallAreaWithHolesAndBuildings extends WallAreaWithHoles {
  buildings: Building[];

  constructor(
    scene: Gameplay,
    numberOfXRects,
    numberOfYRects,
    topLeftX,
    topLeftY,
    holePosition
  ) {
    super(
      scene,
      numberOfXRects,
      numberOfYRects,
      topLeftX,
      topLeftY,
      holePosition
    );

    //TODO: add buildings to parts instead of here -> easier to reason about
    this.buildings = [];
    this.buildBuilding();
  }

  //TODO: dont spawn ontop of each other
  private buildBuilding() {
    let {randX, randY} = this.calculateRandValidTopLeftSpawnPosition(rectBuildingHalfWidth, rectBuildinghalfHeight)

    this.buildings.push(
      new Building(this.scene, randX, randY, this.physicsGroup)
    );
  }

  private markBuildingPosition(building: Building, map) {
    let topLeftX = this.x - 2 * wallPartRadius * (this.numberOfXRects / 2);
    let topLeftY = this.y - 2 * wallPartRadius * (this.numberOfYRects / 2);

    for (let i = 0; i < this.numberOfYRects + 2; i++) {
      for (let k = 0; k < this.numberOfXRects; k++) {
        if (
          building.x - rectBuildingHalfWidth === topLeftX &&
          building.y - rectBuildinghalfHeight === topLeftY
        ) {
          //TODO: depends on the fact that the building is 3* the wallpart
          map[i][k] = 1;
          map[i][k + 1] = 1;
          map[i][k + 2] = 1;
          //break;
        }
        topLeftX += 2 * wallPartRadius;
      }
      topLeftY += 2 * wallPartRadius;

      topLeftX = this.x - 2 * wallPartRadius * (this.numberOfXRects / 2);
    }
  }

  //TODO: might need to store this for performance reasons (need it all the time -> unit navigation dynamically)
  calculateWalkableArr() {
    let mapWithoutBuilding = super.calculateWalkableArr();
    this.buildings.forEach(building => {
      this.markBuildingPosition(building, mapWithoutBuilding);
    });

    return mapWithoutBuilding;
  }
}
