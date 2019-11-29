import { WallArea } from "./WallArea";
import { Gameplay } from "../../scenes/Gameplay";

export class WallAreaWithHoles extends WallArea {
  constructor(
    scene: Gameplay,
    numberOfXRects,
    numberOfYRects,
    topLeftX,
    topLeftY,
    holePosition
  ) {
    super(scene, numberOfXRects, numberOfYRects, topLeftX, topLeftY);
    this.parts[0][holePosition].destroy();
    this.parts[holePosition][0].destroy();
    this.parts[numberOfYRects+1][holePosition].destroy();
    this.parts[holePosition][numberOfXRects-1].destroy();
  }

  calculateWalkableArr() {
    let mapWithoutHoles = super.calculateWalkableArr();
    for (let i = 0; i < this.numberOfYRects + 2; i++) {
      for (let k = 0; k < this.numberOfXRects; k++) {
        if (this.parts[i][k]&&this.parts[i][k].scene === undefined) {
          mapWithoutHoles[i][k] = 0;
        }
      }
    }
    return mapWithoutHoles;
  }
}
