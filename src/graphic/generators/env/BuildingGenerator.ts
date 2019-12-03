import { Generator } from "../Generator";
import { Gameplay } from "../../../scenes/Gameplay";
import { RectPolygon } from "../../../polygons/RectPolygon";
import { rectBuildingHalfWidth, rectBuildinghalfHeight } from "../../../globals/globalSizes";

export class BuildingGenerator extends Generator {
  rectBuilding: RectPolygon;
  rectBuildingInnerRect: RectPolygon;

  constructor(scene: Gameplay) {
    super(0xa9a9a9, scene);
    this.rectBuilding = new RectPolygon(
      rectBuildingHalfWidth,
      rectBuildinghalfHeight,
      rectBuildingHalfWidth * 2,
      rectBuildinghalfHeight * 2
    );
    this.rectBuildingInnerRect = new RectPolygon(
      rectBuildingHalfWidth,
      rectBuildinghalfHeight,
      (rectBuildingHalfWidth - 20) * 2,
      (rectBuildinghalfHeight - 20) * 2
    );
    this.generate();
  }

  drawFrames() {
    this.rectBuilding.draw(this.graphics, 0);
    this.graphics.fillStyle(0x00008b);
    this.rectBuildingInnerRect.draw(this.graphics, 0);
  }
  generateTexture() {
    this.graphics.generateTexture("rectBuilding", rectBuildingHalfWidth * 2, rectBuildinghalfHeight * 2);
  }
  addFrames() {}
}
