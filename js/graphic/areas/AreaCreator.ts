import { Gameplay } from "../../scenes/Gameplay";
import { RectArea } from "./RectArea";

export class AreaCreator {
  scene: Gameplay;
  constructor(scene: Gameplay) {
    this.scene = scene;
  }

  //TODO: can push other Sprite into wall
  private bounceCallback(unit, rect) {
    let x = unit.x;
    let y = unit.y;
    let angle = Phaser.Math.Angle.Between(rect.x, rect.y, x, y);

    let bounceBackDistance = 0.5;
    let x1 = x + Math.cos(angle) * bounceBackDistance;
    let y1 = y + Math.sin(angle) * bounceBackDistance;
    unit.setPosition(x1, y1);
    unit.setVelocity(0,0)
  }

  createArea() {
    let ractArea = new RectArea(this.scene, 20, 18, 0, 0);
    this.scene.physics.add.collider(
      this.scene.player.physicsGroup,
      ractArea.rects[0].physicsGroup,
        this.bounceCallback, null, this
    );

    this.scene.physics.add.collider(
      this.scene.unitManager.enemies[0].physicsGroup,
      ractArea.rects[0].physicsGroup,
      this.bounceCallback, null, this)
  }
}
