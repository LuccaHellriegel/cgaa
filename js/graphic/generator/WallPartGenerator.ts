import { Generator } from "./Generator";
import { Gameplay } from "../../scenes/Gameplay";
import { RectPolygon } from "../../polygon/RectPolygon";

export class WallPartGenerator extends Generator {
  wallPart: RectPolygon;

  constructor(scene: Gameplay) {
    super(0xa9a9a9, scene);
    this.wallPart = new RectPolygon(30, 30, 60, 60);
  }

  generate() {
    this.wallPart.draw(this.graphics, 0);
    this.graphics.generateTexture("wallPart", 60, 60);
    this.destroyUsedObjects()
}

}
