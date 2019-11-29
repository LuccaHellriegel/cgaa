import { CirclePolygon } from "../../polygon/CirclePolygon";
import { BaseSprite } from "../../graphic/BaseSprite";
import { normalCircleRadius, wallPartRadius } from "../../global";
import { debugModus } from "../../global";
import { Gameplay } from "../../scenes/Gameplay";
import { WallArea } from "../../env/areas/WallArea";

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

  findClosestsWallArea(wallAreas: WallArea[]) {
    let closesWallArea: WallArea;
    let curDistance: number = -Infinity;
    wallAreas.forEach(wallArea => {
      let newDist = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        wallArea.x,
        wallArea.y
      );
      if (newDist < curDistance) {
        closesWallArea = wallArea;
        curDistance = newDist;
      }
    });
    return closesWallArea;
  }

  findCurRelativePosInWallArea(wallArea){
    let topLeftX = wallArea.x - 2 * wallPartRadius * (wallArea.numberOfXRects / 2);
    let topLeftY = wallArea.y - 2 * wallPartRadius * (wallArea.numberOfYRects / 2);

    for (let i = 0; i < wallArea.numberOfYRects + 2; i++) {
      for (let k = 0; k < wallArea.numberOfXRects; k++) {
        if(i === 1 && k === 1){
        }
        if (
          this.x - wallPartRadius === topLeftX &&
          this.y - wallPartRadius === topLeftY
        ) {
          return {row: i, column: k}
        }
        topLeftX += 2 * wallPartRadius;
      }
      topLeftY += 2 * wallPartRadius;

      topLeftX = wallArea.x - 2 * wallPartRadius * (wallArea.numberOfXRects / 2);
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
