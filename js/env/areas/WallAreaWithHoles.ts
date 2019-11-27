import { WallArea } from "./WallArea";
import { Gameplay } from "../../scenes/Gameplay";

export class WallAreaWithHoles extends WallArea {
  constructor(
    scene: Gameplay,
    numberOfXRects,
    numberOfYRects,
    topLeftX,
    topLeftY, holePosition
  ) {
    super(scene, numberOfXRects, numberOfYRects, topLeftX, topLeftY);
    this.rects[holePosition].destroy()
    this.rects[numberOfXRects+holePosition-1].destroy()
    this.rects[numberOfXRects+numberOfYRects+holePosition].destroy()
    this.rects[numberOfXRects+numberOfYRects+numberOfXRects+holePosition-1].destroy()
  }
}
