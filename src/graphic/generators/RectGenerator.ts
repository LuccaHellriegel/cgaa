import { Generator } from "./Generator";
import { Gameplay } from "../../scenes/Gameplay";
import { RectPolygon } from "../../polygons/RectPolygon";

export class RectGenerator extends Generator {
  rect: RectPolygon;

  constructor(scene: Gameplay, hexColor, textureName, centerX, centerY, width, height) {
    super(hexColor, scene);
    let rect = new RectPolygon(centerX, centerY, width, height);
    rect.draw(this.graphics, 0);
    this.graphics.generateTexture(textureName, width, height);
    this.destroyUsedObjects();
  }
}
