import { Gameplay } from "../../scenes/Gameplay";
import { WallPart } from "./WallPart";
import { wallPartRadius } from "../../global";
import { GeometryService } from "../../services/GeometryService";

export class WallArea {
  parts: WallPart[][] = [];
  physicsGroup: any;
  numberOfXRects: any;
  numberOfYRects: any;
  scene: Gameplay;
  width: number;
  height: number;
  x: any;
  y: any;

  constructor(
    scene: Gameplay,
    numberOfXRects,
    numberOfYRects,
    topLeftX,
    topLeftY
  ) {
    let size = numberOfYRects + 2;
    while (size--) this.parts[size] = [];
    //TODO: make empty area for navigation (this x and y are center -> we decide were the unit is)
    this.x = topLeftX + 2 * wallPartRadius * (numberOfXRects / 2);
    this.y = topLeftY + 2 * wallPartRadius * (numberOfYRects / 2);

    this.scene = scene;
    this.physicsGroup = scene.physics.add.staticGroup();
    this.numberOfXRects = numberOfXRects;
    this.numberOfYRects = numberOfYRects;

    this.createWallSides(topLeftX, topLeftY);
    this.width = this.calculateWidth();
    this.height = this.calculateHeight();
  }

  private calculateWidth() {
    return this.numberOfXRects * this.parts[0][0].width;
  }

  private calculateHeight() {
    return (this.numberOfYRects + 1) * this.parts[0][0].height;
  }

  private createWallSide(
    topLeftCenterX,
    topLeftCenterY,
    numberOfRects,
    wallSide
  ) {
    let x = topLeftCenterX;
    let y = topLeftCenterY;
    for (let index = 0; index < numberOfRects; index++) {
      if (wallSide === "left" || wallSide === "right") y += 2 * wallPartRadius;

      let curRect = new WallPart(this.scene, x, y, this.physicsGroup);
      if (wallSide === "top") {
        this.parts[0].push(curRect);
        x += 2 * wallPartRadius;
      } else if (wallSide === "bottom") {
        this.parts[this.numberOfYRects + 1].push(curRect);
        x += 2 * wallPartRadius;
      } else if (wallSide === "left") {
        this.parts[index + 1][0] = curRect;
      } else {
        this.parts[index + 1][this.numberOfXRects - 1] = curRect;
      }
    }
  }

  private createWallSides(topLeftX, topLeftY) {
    let x = topLeftX + wallPartRadius;
    let y = topLeftY + wallPartRadius;

    this.createWallSide(x, y, this.numberOfXRects, "top");

    let lastRect = this.parts[0][this.numberOfXRects - 1];
    let lastXRectX = lastRect.x;

    x = topLeftX + wallPartRadius;
    this.createWallSide(x, y, this.numberOfYRects, "left");

    lastRect = this.parts[this.numberOfYRects][0];
    let lastYRectY = lastRect.y;

    y = lastYRectY + 2 * wallPartRadius;
    this.createWallSide(x, y, this.numberOfXRects, "bottom");

    y = topLeftY + wallPartRadius;
    x = lastXRectX;
    this.createWallSide(x, y, this.numberOfYRects, "right");
  }

  calculateRandValidSpawnPosition(
    requestedDistanceToWallXAxis,
    requestedDistanceToWallYAxis
  ) {
    if (
      requestedDistanceToWallXAxis % wallPartRadius !== 0 ||
      requestedDistanceToWallYAxis % wallPartRadius !== 0
    )
      throw "Requested ditance was not compatible to map grid";

    let borderObject = this.calculateBorderObject();
    let numberOfRectsInBorder = 2;

    let xMultiplier = Phaser.Math.Between(
      0,
      this.numberOfXRects - numberOfRectsInBorder - 1
    );
    let edgeCorrection = 0;

    if (
      wallPartRadius + xMultiplier * 2 * wallPartRadius <
      requestedDistanceToWallXAxis
    ) {
      edgeCorrection =
        requestedDistanceToWallXAxis - 
        (wallPartRadius +
        xMultiplier * 2 * wallPartRadius);
    } else if (
      borderObject.borderWidth -
        (wallPartRadius +
        xMultiplier * 2 * wallPartRadius) <
        requestedDistanceToWallXAxis
    ) {
      edgeCorrection =
      requestedDistanceToWallXAxis -
        (borderObject.borderHeight -
          (wallPartRadius +
          xMultiplier * 2 * wallPartRadius));
      edgeCorrection = -edgeCorrection;
    }
    let randX =
      borderObject.borderX +
      wallPartRadius +
      xMultiplier * 2 * wallPartRadius +
      edgeCorrection;

      //TODO: were are still 2*radius off, probably the edge cases
    let yMultiplier = Phaser.Math.Between(0, this.numberOfYRects-1);
    edgeCorrection = 0;
    if (
      wallPartRadius + yMultiplier * 2 * wallPartRadius <
      requestedDistanceToWallYAxis
    ) {
      edgeCorrection =
        requestedDistanceToWallYAxis -
        (wallPartRadius +
        yMultiplier * 2 * wallPartRadius);
    } else if (
      borderObject.borderHeight -
       ( wallPartRadius +
        yMultiplier * 2 * wallPartRadius) <
      requestedDistanceToWallYAxis
    ) {
      edgeCorrection =
        requestedDistanceToWallYAxis -
        (borderObject.borderHeight -
          (wallPartRadius +
          yMultiplier * 2 * wallPartRadius));
      edgeCorrection = -edgeCorrection;
    }


    let randY =
      borderObject.borderY +
      wallPartRadius +
      yMultiplier * 2 * wallPartRadius +
      edgeCorrection;

    return { randX, randY };
  }

  calculateBorderObject() {
    return GeometryService.calculateBorderObjectFromPartsAndSize(
      this.parts,
      this.width,
      this.height
    );
  }

  calculateWalkableArr() {
    let walkableMap: number[][] = [];
    for (let i = 0; i < this.numberOfYRects + 2; i++) {
      let row: number[] = [];
      for (let k = 0; k < this.numberOfXRects; k++) {
        let curElement = this.parts[i][k] ? 1 : 0;
        row.push(curElement);
      }
      walkableMap.push(row);
    }
    return walkableMap;
  }
}
