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
import { EnemyCircle } from "../../units/circles/EnemyCircle";
import { CollisionService } from "../../spawn/CollisionService";

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

  //TODO: needs to be accurate for future spawning
  enemies: EnemyCircle[] = [];
  spawnableArrForEnemies: number[][];
  spawnableArrForBuildings: number[][];

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

      let curRect = new WallPart(this.scene, x, y, this.scene.EnvManager.physicsGroup);
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


  private calculateRandBuildingSpawnPos() {
    if (!this.spawnableArrForBuildings) {
      this.spawnableArrForBuildings = SpawnService.calculateBuildingSpawnableArrForArea(this.parts);
    } else {
      SpawnService.updateBuildingSpawnableArr(this.spawnableArrForBuildings);
    }
    return SpawnService.randomlyTryAllSpawnablePosFromArr(
      this.spawnableArrForBuildings,
      this,
      spawnablePosCount => Phaser.Math.Between(0, spawnablePosCount),
      (x, y) => {
        return false;
      }
    );
  }

  private buildBuilding() {
    let { randX, randY } = this.calculateRandBuildingSpawnPos();
    while (CollisionService.checkIfBuildingCollidesWithBuildings(this.buildings, randX, randY)) {
      let result = this.calculateRandBuildingSpawnPos();
      randX = result.randX;
      randY = result.randY;
    }

    let building = new Building(this.scene, randX, randY, this.scene.EnvManager.physicsGroup, this);
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
