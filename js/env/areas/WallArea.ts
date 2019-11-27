import { Gameplay } from "../../scenes/Gameplay";
import { WallPart } from "./WallPart";
import { wallPartRadius } from "../../global";

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

  getWidth(){
    return this.numberOfXRects*this.rects[0].width
  }

  getHeight(){
    return (this.numberOfYRects+1)*this.rects[0].height
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
        x += 2*wallPartRadius;
      } else {
        y += 2*wallPartRadius;
      }
    }
  }

  private createWallSides(topLeftX, topLeftY) {
    let x = topLeftX + wallPartRadius;
    let y = topLeftY + wallPartRadius;

    this.createWallSide(x, y, this.numberOfXRects, "x");

    let lastRect = this.rects[this.rects.length - 1];
    let lastXRectX = lastRect.x;

    x = topLeftX + wallPartRadius;
    this.createWallSide(x, y, this.numberOfYRects, "y");

    lastRect = this.rects[this.rects.length - 1];
    let lastYRectY = lastRect.y;

    y = lastYRectY + 2*wallPartRadius;
    this.createWallSide(x, y, this.numberOfXRects, "x");

    y = topLeftY + wallPartRadius;
    x = lastXRectX;
    this.createWallSide(x, y, this.numberOfYRects, "y");
  }
}
