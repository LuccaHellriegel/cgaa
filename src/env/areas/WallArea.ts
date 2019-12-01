import { Gameplay } from "../../scenes/Gameplay";
import { WallPart } from "./WallPart";
import { wallPartHalfSize } from "../../globals/globalSizes";
import { GeometryService } from "../../services/GeometryService";
import { Area } from "./Area";
import { AreaService } from "./AreaService";

export class WallArea extends Area {
  scene: Gameplay;
  constructor(
    scene: Gameplay,
    numberOfXRects,
    numberOfYRects,
    topLeftX,
    topLeftY
  ) {
    super(
      numberOfXRects,
      numberOfYRects,
      topLeftX,
      topLeftY,
      2 * wallPartHalfSize
    );
    this.scene = scene;
    this.createWallSides(topLeftX, topLeftY);
  }

  static withHolesAndBuildings() {}

  private makeHoles(holePosition) {
    this.parts[0][holePosition].deleteContent();
    this.parts[holePosition][0].deleteContent();
    this.parts[this.sizeOfYAxis - 1][holePosition].deleteContent();
    this.parts[holePosition][this.sizeOfXAxis - 1].deleteContent();
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

  private createWallSide(
    topLeftCenterX,
    topLeftCenterY,
    numberOfRects,
    wallSide
  ) {
    let x = topLeftCenterX;
    let y = topLeftCenterY;
    for (let index = 0; index < numberOfRects; index++) {
      if (wallSide === "left" || wallSide === "right") y += 2 * wallPartHalfSize;

      let curRect = new WallPart(
        this.scene,
        x,
        y,
        this.scene.areaManager.physicsGroup
      );
      if (wallSide === "top") {
        this.parts[0][index].updateContent(curRect);
        x += 2 * wallPartHalfSize;
      } else if (wallSide === "bottom") {
        this.parts[this.sizeOfYAxis - 1][index].updateContent(curRect);
        x += 2 * wallPartHalfSize;
      } else if (wallSide === "left") {
        this.parts[index + 1][0].updateContent(curRect);
      } else {
        this.parts[index + 1][this.sizeOfXAxis - 1].updateContent(curRect);
      }
    }
  }

  private createWallSides(topLeftX, topLeftY) {
    let x = topLeftX + wallPartHalfSize;
    let y = topLeftY + wallPartHalfSize;

    this.createWallSide(x, y, this.sizeOfXAxis, "top");

    let lastRect = this.parts[0][this.sizeOfXAxis - 1];
    let lastXRectX = lastRect.x;

    x = topLeftX + wallPartHalfSize;
    this.createWallSide(x, y, this.sizeOfYAxis - 2, "left");

    lastRect = this.parts[this.sizeOfYAxis - 2][0];
    let lastYRectY = lastRect.y;

    y = lastYRectY + 2 * wallPartHalfSize;
    this.createWallSide(x, y, this.sizeOfXAxis, "bottom");

    y = topLeftY + wallPartHalfSize;
    x = lastXRectX;
    this.createWallSide(x, y, this.sizeOfYAxis - 2, "right");
  }

  calculateRandValidSpawnPosition(
    requestedDistanceToWallXAxis,
    requestedDistanceToWallYAxis
  ) {
    let borderObject = this.calculateBorderObject();
    let numberOfRectsInBorder = 2;

    let xMultiplier = Phaser.Math.Between(
      0,
      this.sizeOfXAxis - numberOfRectsInBorder - 1
    );
    let edgeCorrection = 0;

    if (
      wallPartHalfSize + xMultiplier * 2 * wallPartHalfSize <
      requestedDistanceToWallXAxis
    ) {
      edgeCorrection =
        requestedDistanceToWallXAxis -
        (wallPartHalfSize + xMultiplier * 2 * wallPartHalfSize);
    } else if (
      borderObject.borderWidth -
        (wallPartHalfSize + xMultiplier * 2 * wallPartHalfSize) <
      requestedDistanceToWallXAxis
    ) {
      edgeCorrection =
        requestedDistanceToWallXAxis -
        (borderObject.borderHeight -
          (wallPartHalfSize + xMultiplier * 2 * wallPartHalfSize));
      edgeCorrection = -edgeCorrection;
    }
    let randX =
      borderObject.borderX +
      wallPartHalfSize +
      xMultiplier * 2 * wallPartHalfSize +
      edgeCorrection;

    let yMultiplier = Phaser.Math.Between(0, this.sizeOfYAxis - 2);
    edgeCorrection = 0;
    if (
      wallPartHalfSize + yMultiplier * 2 * wallPartHalfSize <
      requestedDistanceToWallYAxis
    ) {
      edgeCorrection =
        requestedDistanceToWallYAxis -
        (wallPartHalfSize + yMultiplier * 2 * wallPartHalfSize);
    } else if (
      borderObject.borderHeight -
        (wallPartHalfSize + yMultiplier * 2 * wallPartHalfSize) <
      requestedDistanceToWallYAxis
    ) {
      edgeCorrection =
        requestedDistanceToWallYAxis -
        (borderObject.borderHeight -
          (wallPartHalfSize + yMultiplier * 2 * wallPartHalfSize));
      edgeCorrection = -edgeCorrection;
    }

    let randY =
      borderObject.borderY +
      wallPartHalfSize +
      yMultiplier * 2 * wallPartHalfSize +
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
