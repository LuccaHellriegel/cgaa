import { WallAreaWithHoles } from "./WallAreaWithHoles";
import { Gameplay } from "../../scenes/Gameplay";
import { Building } from "../Building";
import { rectBuildingHalfWidth, rectBuildinghalfHeight } from "../../global";

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
    let borderObject = this.calculateBorderObject();
    let randX = Phaser.Math.Between(
      borderObject.borderX + rectBuildingHalfWidth,
      borderObject.borderX + borderObject.borderWidth - rectBuildingHalfWidth
    );
    let randY = Phaser.Math.Between(
      borderObject.borderY + rectBuildinghalfHeight,
      borderObject.borderY + borderObject.borderHeight - rectBuildinghalfHeight
    );

    new Building(scene, randX, randY, this.physicsGroup);
  }
}
