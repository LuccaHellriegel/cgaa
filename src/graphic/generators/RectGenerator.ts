import { Generator } from "./Generator";
import { Gameplay } from "../../scenes/Gameplay";
import { RectPolygon } from "../../polygon/RectPolygon";

export class RectGenerator extends Generator {
  rect: RectPolygon;

  constructor(scene: Gameplay, textureName, centerX, centerY, width, height) {
    super(0xa9a9a9, scene);
    let rect = new RectPolygon(centerX, centerY, width, height);
    rect.draw(this.graphics, 0);
    this.graphics.generateTexture(textureName, width, height);
    this.destroyUsedObjects();
  }
}
