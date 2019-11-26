import { CirclePolygon } from "../../polygon/CirclePolygon";
import { BaseSprite } from "../../graphic/BaseSprite";
import { normalCircleRadius } from "../../app/sizes";
import { debugModus } from "../../app/config";
import { Gameplay } from "../../scenes/Gameplay";

export class Circle extends BaseSprite {
  polygon: CirclePolygon;
  graphics: Phaser.GameObjects.Graphics

  constructor(scene: Gameplay, x, y, texture, physicsGroup) {
    super(scene, x, y, texture, physicsGroup);
    //TODO: polygon has a few pixel offset, screen offset?
    this.polygon = new CirclePolygon(
      x + scene.cameras.main.scrollX,
      y + scene.cameras.main.scrollY,
      normalCircleRadius
    );
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

    let isPlayer = this.id === this.scene.player.id;

    if (isPlayer) {
      this.scene.events.emit("playerDamaged");
    }
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    //TODO: make radius as option
    this.polygon.setPosition(this.x, this.y);

    if (debugModus) this.draw();
  }

  draw() {
    this.graphics.clear();
    this.polygon.draw(this.graphics, this.scene.polygonOffset);
  }
}
