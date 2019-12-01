import { CirclePolygon } from "../../polygon/CirclePolygon";
import { BaseSprite } from "../../graphic/BaseSprite";
import { normalCircleRadius } from "../../global";
import { debugModus } from "../../global";
import { Gameplay } from "../../scenes/Gameplay";

export abstract class Circle extends BaseSprite {
  polygon: CirclePolygon;
  graphics: Phaser.GameObjects.Graphics;
  unitType: string;

  constructor(scene: Gameplay, x, y, texture, physicsGroup) {
    super(scene, x, y, texture, physicsGroup);
    //TODO: polygon has a few pixel offset, screen offset?
    this.polygon = new CirclePolygon(
      x + scene.cameras.main.scrollX,
      y + scene.cameras.main.scrollY,
      normalCircleRadius
    );
    this.unitType = "circle";
    this.setCircle(normalCircleRadius);
    this.setupAnimEvents();

    if (debugModus)
      this.graphics = scene.add.graphics({
        fillStyle: {
          color: 0xff00ff
        }
      });
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

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.polygon.setPosition(this.x, this.y);

    if (debugModus) this.draw();
  }

  draw() {
    this.graphics.clear();
    this.polygon.draw(this.graphics, this.scene.polygonOffset);
  }
}
