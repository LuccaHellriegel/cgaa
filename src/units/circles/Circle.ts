import { CirclePolygon } from "../../polygon/CirclePolygon";
import { BaseSprite } from "../../base/BaseSprite";
import { normalCircleRadius } from "../../globals/globalSizes";
import { debugModus } from "../../globals/globalConfig";
import { Gameplay } from "../../scenes/Gameplay";

export abstract class Circle extends BaseSprite {
  polygon: CirclePolygon;
  graphics: Phaser.GameObjects.Graphics;
  unitType: string;

  constructor(scene: Gameplay, x, y, texture, physicsGroup) {
    super(scene, x, y, texture, physicsGroup);
    this.polygon = new CirclePolygon(
      x + scene.cameras.main.scrollX,
      y + scene.cameras.main.scrollY,
      normalCircleRadius
    );
    this.unitType = "circle";
    this.setCircle(normalCircleRadius);
    this.setupAnimEvents();
  }

  setupAnimEvents() {
    this.on(
      "animationcomplete",
      function(anim, frame) {
        this.emit("animationcomplete_" + anim.key, anim, frame);
      },
      this
    );
    this.on(
      "animationcomplete_damage-" + this.texture.key,
      function() {
        this.anims.play("idle-" + this.texture.key);
      },
      this
    );
  }

  damage(amount) {
    this.anims.play("damage-" + this.texture.key);
    this.scene.events.emit("damage-" + this.unitType, amount);
  }

  syncPolygon() {
    this.polygon.setPosition(this.x, this.y);
  }
}
