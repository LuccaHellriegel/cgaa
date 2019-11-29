import { Gameplay } from "../../scenes/Gameplay";
import { WallPart } from "./WallPart";
import { wallPartRadius } from "../../global";

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

  calculateRandValidTopLeftSpawnPosition(
    additionalMovementWidth,
    additionalMovementHeight
  ) {
    let borderObject = this.calculateBorderObject();

    let xMultiplier = Phaser.Math.Between(0, this.numberOfXRects - 5);
    let edgeCorrection =
      xMultiplier === this.numberOfXRects - 2
        ? -additionalMovementWidth
        : additionalMovementWidth;
    let randX =
      borderObject.borderX + xMultiplier * 2 * wallPartRadius + edgeCorrection;

    let yMultiplier = Phaser.Math.Between(0, this.numberOfYRects - 2);
    edgeCorrection =
      xMultiplier === this.numberOfXRects - 2
        ? -additionalMovementHeight
        : additionalMovementHeight;
    let randY =
      borderObject.borderY + yMultiplier * 2 * wallPartRadius + edgeCorrection;

    return { randX, randY };
  }

  calculateBorderObject() {
    let borderX = this.parts[0][0].x + wallPartRadius;
    let borderY = this.parts[0][0].y + wallPartRadius;
    let borderWidth = this.width - 4 * wallPartRadius;
    let borderHeight = this.height - 4 * wallPartRadius;
    return { borderX, borderY, borderWidth, borderHeight };
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
