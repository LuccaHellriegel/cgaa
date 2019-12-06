import { Image } from "../../base/BasePhaser";
import { HealthBar } from "../../ui/graphics/healthbars/HealthBar";
import { Damageable } from "../Damageable";
import { RectPolygon } from "../../polygons/RectPolygon";
import { towerHalfSize } from "../../globals/globalSizes";

export class Tower extends Image implements Damageable {
  healthbar: HealthBar;
  id: string;
  polygon: RectPolygon;

  constructor(scene, x, y, physicsGroup) {
    super(scene, x, y, "tower", physicsGroup);
    this.setImmovable(true);

    this.polygon = new RectPolygon(
      x + scene.cameras.main.scrollX,
      y + scene.cameras.main.scrollY,
      2 * towerHalfSize,
      2 * towerHalfSize
    );

    this.setSize(this.polygon.width, this.polygon.height);

    this.id =
      "_" +
      Math.random()
        .toString(36)
        .substr(2, 9);
    this.healthbar = new HealthBar(scene, x - 26, y - 38, 46, 12);
  }

  damage(amount: number) {
    if (this.healthbar.decrease(amount)) {
      this.destroy();
    }
  }

  syncPolygon() {
    this.polygon.setPosition(this.x, this.y);
  }

  destroy() {
    super.destroy();
    this.healthbar.destroy();
  }
}
