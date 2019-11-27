import { Gameplay } from "../../scenes/Gameplay";
import { WallPart } from "./WallPart";

export class RectArea {
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

    this.createRects(topLeftX, topLeftY);
  }

  private createRects(topLeftX, topLeftY) {
    let x = topLeftX + 30;
    let y = topLeftY + 30;

    let curRect: WallPart;
    for (let index = 0; index < this.numberOfXRects; index++) {
      let curRect = new WallPart(this.scene, x, y, this.physicsGroup);
      this.rects.push(curRect);
      x += 60;
    }

    let lastRect = this.rects[this.rects.length - 1];
    let lastXRectX = lastRect.x;
    let lastXRectY = lastRect.y;
    x = topLeftX + 30;
    for (let index = 0; index < this.numberOfYRects; index++) {
      y += 60;
      curRect = new WallPart(this.scene, x, y, this.physicsGroup);
      this.rects.push(curRect);
    }

    lastRect = this.rects[this.rects.length - 1];
    let lastYRectX = lastRect.x;
    let lastYRectY = lastRect.y;

    y = lastYRectY + 60;
    for (let index = 0; index < this.numberOfXRects; index++) {
      let curRect = new WallPart(this.scene, x, y, this.physicsGroup);
      this.rects.push(curRect);
      x += 60;
    }
    y = topLeftY + 30;
    x = lastXRectX;
    for (let index = 0; index < this.numberOfYRects; index++) {
      y += 60;
      curRect = new WallPart(this.scene, x, y, this.physicsGroup);
      this.rects.push(curRect);
    }
  }
}
