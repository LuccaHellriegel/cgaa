import { Generator } from "../Generator";
import { RectPolygon } from "../../../polygons/RectPolygon";
import { Gameplay } from "../../../scenes/Gameplay";
import { wallPartHalfSize } from "../../../globals/globalSizes";

export class GhostTowerGenerator extends Generator {
  rect: RectPolygon;

  constructor(scene: Gameplay) {
    super(0xffffff, scene);
    let rect = new RectPolygon(
      1.5 * wallPartHalfSize,
      1.5 * wallPartHalfSize,
      3 * wallPartHalfSize,
      3 * wallPartHalfSize
    );
    let points = rect.points;
    this.graphics.lineStyle(6, 0xffffff);
    this.graphics.beginPath();
    this.graphics.moveTo(points[0].x, points[0].y);
    for (let index = 0; index < points.length; index++) {
      this.graphics.lineTo(points[index].x, points[index].y);
    }
    this.graphics.closePath();
    this.graphics.strokePath();
    this.graphics.generateTexture("ghostTower", 3 * wallPartHalfSize, 3 * wallPartHalfSize);
    this.destroyUsedObjects();
  }
}
