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
    this.parts[holePosition].destroy()
    this.parts[numberOfXRects+holePosition-1].destroy()
    this.parts[numberOfXRects+numberOfYRects+holePosition].destroy()
    this.parts[numberOfXRects+numberOfYRects+numberOfXRects+holePosition-1].destroy()
  }
}
