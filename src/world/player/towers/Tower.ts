import { Image } from "../../../base/BasePhaser";
import { HealthBar } from "../../../base/HealthBar";
import { Damageable } from "../../../base/Damageable";
import { RectPolygon } from "../../../base/polygons/RectPolygon";
import { towerHalfSize, wallPartHalfSize } from "../../../globals/globalSizes";
import { Bullet } from "./Bullet";
import { BaseService } from "../../../base/Base";

export class Tower extends Image implements Damageable {
  healthbar: HealthBar;
  id: string;
  polygon: RectPolygon;
  sightElement: Image;
  bulletGroup: any;

  constructor(scene, x, y, physicsGroup, sightGroup, bulletGroup) {
    super({ scene, x, y, texture: "tower", physicsGroup });
    this.setImmovable(true);

    this.polygon = new RectPolygon(
      x + scene.cameras.main.scrollX,
      y + scene.cameras.main.scrollY,
      2 * towerHalfSize,
      2 * towerHalfSize
    );

    this.setSize(this.polygon.width, this.polygon.height);

    BaseService.extendWithNewId(this);
    this.healthbar = new HealthBar(x, y, {
      scene,
      posCorrectionX: -26,
      posCorrectionY: -38,
      healthWidth: 46,
      healthLength: 12,
      value: 100
    });

    //TODO: bullet firing as events with delay!
    //TODO: only one target at a time
    //TODO: just make camps offlimit for towers in general
    //TODO: sometimes I cant pace any tower and no error
    this.bulletGroup = bulletGroup;
    this.sightElement = new Image({ scene, x: this.x, y: this.y, texture: "", physicsGroup: sightGroup });
    this.sightElement.setVisible(false);
    this.sightElement.owner = this;
    this.sightElement.setSize(12 * wallPartHalfSize, 12 * wallPartHalfSize);
  }

  damage(amount: number) {
    if (this.healthbar.decrease(amount)) {
      this.destroy();
    }
  }

  fire(target) {
    new Bullet(this.scene, this.x, this.y, this.scene.towerManager.bulletGroup, target.x, target.y);
  }

  syncPolygon() {
    this.polygon.setPosition(this.x, this.y);
  }

  destroy() {
    super.destroy();
    this.healthbar.destroy();
  }
}
