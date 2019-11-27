import { Gameplay } from "../../scenes/Gameplay";
import { WallPart } from "./WallPart";

export class WallArea {
  rects: WallPart[] = [];
  physicsGroup: any;
  numberOfXRects: any;
  numberOfYRects: any;
  scene: any;
  constructor(
    scene: Gameplay,
    numberOfXRects,
    numberOfYRects,
    topLeftX,
    topLeftY
  ) {
    this.scene = scene;
    this.physicsGroup = scene.physics.add.staticGroup();
    this.numberOfXRects = numberOfXRects;
    this.numberOfYRects = numberOfYRects;

    this.createWallSides(topLeftX, topLeftY);
  }

  private createWallSide(
    topLeftCenterX,
    topLeftCenterY,
    numberOfRects,
    movingCoordinate
  ) {
    let x = topLeftCenterX;
    let y = topLeftCenterY;
    for (let index = 0; index < numberOfRects; index++) {
      let curRect = new WallPart(this.scene, x, y, this.physicsGroup);
      this.rects.push(curRect);
      if (movingCoordinate === "x") {
        x += 60;
      } else {
        y += 60;
      }
    }
  }

  private createWallSides(topLeftX, topLeftY) {
    let x = topLeftX + 30;
    let y = topLeftY + 30;

    this.createWallSide(x, y, this.numberOfXRects, "x");

    let lastRect = this.rects[this.rects.length - 1];
    let lastXRectX = lastRect.x;

    x = topLeftX + 30;
    this.createWallSide(x, y, this.numberOfYRects, "y");

    lastRect = this.rects[this.rects.length - 1];
    let lastYRectY = lastRect.y;

    y = lastYRectY + 60;
    this.createWallSide(x, y, this.numberOfXRects, "x");

    y = topLeftY + 30;
    x = lastXRectX;
    this.createWallSide(x, y, this.numberOfYRects, "y");
  }
}
