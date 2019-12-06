import { AreaPosition } from "./AreaPosition";
import { SpawnService } from "../../spawn/SpawnService";
import {
  wallPartHalfSize,
  rectBuildingHalfWidth,
  rectBuildinghalfHeight,
  rectBuildingInWallParts
} from "../../globals/globalSizes";
import { WallPart } from "./WallPart";
import { Building } from "../buildings/Building";
import { AreaService } from "./AreaService";
import { PositionService } from "../../services/PositionService";

export class Area {
  parts: AreaPosition[][] = [];
  sizeOfXAxis: number;
  sizeOfYAxis: number;
  topLeftX: any;
  topLeftY: any;
  width: number;
  height: number;
  scene: any;
  buildings: Building[] = [];
  spawnableArrForBuildings: number[][];
  relativeWidth: number;
  relativeHeight: number;
  relativeTopLeftX: number;
  relativeTopLeftY: number;

  constructor(sizeOfXAxis: number, sizeOfYAxis: number, topLeftX, topLeftY, unitForPart) {
    for (let row = 0; row < sizeOfYAxis; row++) {
      this.parts[row] = [];
      for (let column = 0; column < sizeOfXAxis; column++) {
        this.parts[row].push(new AreaPosition(null));
      }
    }

    this.sizeOfXAxis = sizeOfXAxis;
    this.sizeOfYAxis = sizeOfYAxis;

    this.topLeftX = topLeftX;
    this.topLeftY = topLeftY;

    this.width = sizeOfXAxis * unitForPart;
    this.height = sizeOfYAxis * unitForPart;

    this.relativeWidth = this.width / (2 * wallPartHalfSize);
    this.relativeHeight = this.height / (2 * wallPartHalfSize);

    this.relativeTopLeftX = topLeftX / (2 * wallPartHalfSize);
    this.relativeTopLeftY = topLeftY / (2 * wallPartHalfSize);
  }

  makeHoles(holePosition) {
    this.parts[0][holePosition].deleteContent();
    this.parts[holePosition][0].deleteContent();
    this.parts[this.sizeOfYAxis - 1][holePosition].deleteContent();
    this.parts[holePosition][this.sizeOfXAxis - 1].deleteContent();
  }

  private createWallSide(topLeftCenterX, topLeftCenterY, numberOfRects, wallSide) {
    let x = topLeftCenterX;
    let y = topLeftCenterY;
    for (let index = 0; index < numberOfRects; index++) {
      if (wallSide === "left" || wallSide === "right") y += 2 * wallPartHalfSize;

      let curRect = new WallPart(this.scene, x, y, this.scene.envManager.physicsGroup);
      if (wallSide === "top") {
        this.parts[0][index].updateContent(curRect, "wall");
        x += 2 * wallPartHalfSize;
      } else if (wallSide === "bottom") {
        this.parts[this.sizeOfYAxis - 1][index].updateContent(curRect, "wall");
        x += 2 * wallPartHalfSize;
      } else if (wallSide === "left") {
        this.parts[index + 1][0].updateContent(curRect, "wall");
      } else {
        this.parts[index + 1][this.sizeOfXAxis - 1].updateContent(curRect, "wall");
      }
    }
  }

  buildWalls() {
    let x = this.topLeftX + wallPartHalfSize;
    let y = this.topLeftY + wallPartHalfSize;

    this.createWallSide(x, y, this.sizeOfXAxis, "top");

    let lastRect = this.parts[0][this.sizeOfXAxis - 1];
    let lastXRectX = lastRect.x;

    x = this.topLeftX + wallPartHalfSize;
    this.createWallSide(x, y, this.sizeOfYAxis - 2, "left");

    lastRect = this.parts[this.sizeOfYAxis - 2][0];
    let lastYRectY = lastRect.y;

    y = lastYRectY + 2 * wallPartHalfSize;
    this.createWallSide(x, y, this.sizeOfXAxis, "bottom");

    y = this.topLeftY + wallPartHalfSize;
    x = lastXRectX;
    this.createWallSide(x, y, this.sizeOfYAxis - 2, "right");
  }

  private calculateBuildingSpawnableArrForArea(parts) {
    let spawnableArr = AreaService.createWalkableArr(parts);
    SpawnService.updateBuildingSpawnableArr(spawnableArr);
    return spawnableArr;
  }

  private calculateRandBuildingSpawnPos() {
    if (!this.spawnableArrForBuildings) {
      this.spawnableArrForBuildings = this.calculateBuildingSpawnableArrForArea(this.parts);
    } else {
      SpawnService.updateBuildingSpawnableArr(this.spawnableArrForBuildings);
    }
    let spawnablePos = SpawnService.extractSpawnPosFromSpawnableArr(this.spawnableArrForBuildings);
    let pos = spawnablePos[Phaser.Math.Between(0, spawnablePos.length - 1)];
    return PositionService.relativePosToRealPos(pos.column + this.relativeTopLeftX, pos.row + this.relativeTopLeftY);
  }

  private checkIfBuildingCollidesWithBuildings(buildings, randX, randY) {
    let checkDiffCallback = (diffX, diffY) => {
      let inRowsOverOrUnderBuilding = diffY >= 2 * rectBuildinghalfHeight + 2 * wallPartHalfSize;
      let leftOrRightFromBuilding = diffX >= 2 * rectBuildingHalfWidth + 2 * wallPartHalfSize;
      if (!inRowsOverOrUnderBuilding && !leftOrRightFromBuilding) return true;
      return false;
    };
    for (let index = 0; index < buildings.length; index++) {
      const otherObject = buildings[index];
      let diffX = Math.abs(otherObject.x - randX);
      let diffY = Math.abs(otherObject.y - randY);
      if (checkDiffCallback(diffX, diffY)) return true;
    }
    return false;
  }
  private buildBuilding() {
    let { x, y } = this.calculateRandBuildingSpawnPos();
    while (this.checkIfBuildingCollidesWithBuildings(this.buildings, x, y)) {
      let result = this.calculateRandBuildingSpawnPos();
      x = result.x;
      y = result.y;
    }

    let building = new Building(this.scene, x, y, this.scene.envManager.physicsGroup);
    this.addBuildingToParts(building);
    this.buildings.push(building);
  }

  private addBuildingToParts(building: Building) {
    let x = this.topLeftX;
    let y = this.topLeftY;

    for (let i = 0; i < this.sizeOfYAxis; i++) {
      for (let k = 0; k < this.sizeOfXAxis; k++) {
        if (building.x - rectBuildingHalfWidth === x && building.y - rectBuildinghalfHeight === y) {
          for (let index = 0; index < rectBuildingInWallParts; index++) {
            this.parts[i][k + index].updateContent(building, "building");
          }
          break;
        }
        x += 2 * wallPartHalfSize;
      }
      y += 2 * wallPartHalfSize;

      x = this.topLeftX;
    }
  }

  buildBuildings(numbOfBuildings) {
    for (let index = 0; index < numbOfBuildings; index++) {
      this.buildBuilding();
    }
  }
}
