import { Gameplay } from "../../scenes/Gameplay";
import { WallPart } from "./WallPart";
import { wallPartRadius } from "../../global";
import { GeometryService } from "../../services/GeometryService";
import { Area } from "./Area";
import { AreaPart } from "./AreaPart";

export class WallArea extends Area{
  numberOfXRects: any;
  numberOfYRects: any;
  width: number;
  height: number;

  constructor(
    scene: Gameplay,
    numberOfXRects,
    numberOfYRects,
    topLeftX,
    topLeftY
  ) {
    super(scene,numberOfXRects, numberOfYRects +2, topLeftX, topLeftY, 2*wallPartRadius)

    this.numberOfXRects = numberOfXRects;
    this.numberOfYRects = numberOfYRects;

    this.createWallSides(topLeftX, topLeftY);
    this.width = this.calculateWidth();
    this.height = this.calculateHeight();
  }

  static withHolesAndBuildings() {}

  private makeHoles(holePosition) {
    this.parts[0][holePosition].deleteContent();
    //this.parts[0][holePosition] = 0
    this.parts[holePosition][0].deleteContent();
    this.parts[this.numberOfYRects + 1][holePosition].deleteContent();
    this.parts[holePosition][this.numberOfXRects - 1].deleteContent();
  }

  static withHoles(
    scene,
    numberOfXRects,
    numberOfYRects,
    topLeftX,
    topLeftY,
    holePosition
  ) {
    let wallArea = new this(
      scene,
      numberOfXRects,
      numberOfYRects,
      topLeftX,
      topLeftY
    );
    wallArea.makeHoles(holePosition);
    return wallArea;
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
        this.parts[0].push(new AreaPart(curRect,curRect.width,curRect.height));
        x += 2 * wallPartRadius;
      } else if (wallSide === "bottom") {
        this.parts[this.numberOfYRects + 1].push(new AreaPart(curRect,curRect.width,curRect.height));
        x += 2 * wallPartRadius;
      } else if (wallSide === "left") {
        this.parts[index + 1][0] = new AreaPart(curRect,curRect.width,curRect.height);
      } else {
        this.parts[index + 1][this.numberOfXRects - 1] = new AreaPart(curRect,curRect.width,curRect.height);
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
      throw "Requested distance was not compatible to map grid";

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
        (wallPartRadius + xMultiplier * 2 * wallPartRadius);
    } else if (
      borderObject.borderWidth -
        (wallPartRadius + xMultiplier * 2 * wallPartRadius) <
      requestedDistanceToWallXAxis
    ) {
      edgeCorrection =
        requestedDistanceToWallXAxis -
        (borderObject.borderHeight -
          (wallPartRadius + xMultiplier * 2 * wallPartRadius));
      edgeCorrection = -edgeCorrection;
    }
    let randX =
      borderObject.borderX +
      wallPartRadius +
      xMultiplier * 2 * wallPartRadius +
      edgeCorrection;

    //TODO: were are still 2*radius off, probably the edge cases
    let yMultiplier = Phaser.Math.Between(0, this.numberOfYRects - 1);
    edgeCorrection = 0;
    if (
      wallPartRadius + yMultiplier * 2 * wallPartRadius <
      requestedDistanceToWallYAxis
    ) {
      edgeCorrection =
        requestedDistanceToWallYAxis -
        (wallPartRadius + yMultiplier * 2 * wallPartRadius);
    } else if (
      borderObject.borderHeight -
        (wallPartRadius + yMultiplier * 2 * wallPartRadius) <
      requestedDistanceToWallYAxis
    ) {
      edgeCorrection =
        requestedDistanceToWallYAxis -
        (borderObject.borderHeight -
          (wallPartRadius + yMultiplier * 2 * wallPartRadius));
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

}
