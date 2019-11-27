import { Gameplay } from "../../scenes/Gameplay";
import { WallArea } from "./WallArea";
import { WallAreaWithHoles } from "./WallAreaWithHoles";

export class AreaManager {
  scene: Gameplay;
  wallAreas: WallArea[];
  constructor(scene: Gameplay) {
    this.scene = scene;
    this.wallAreas = []

    this.createWallAreas()
    this.setupAreaColliders();
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
    unit.setVelocity(0, 0);
  }

  private createWallAreas() {
    this.wallAreas.push(new WallAreaWithHoles(this.scene, 20, 19, 0, 0, 9));
    this.wallAreas.push(new WallAreaWithHoles(this.scene, 20, 19, this.wallAreas[0].getWidth()*2, 0, 9));
    this.wallAreas.push(new WallAreaWithHoles(this.scene, 20, 19, 0, this.wallAreas[0].getHeight()*2, 9));
    this.wallAreas.push(new WallAreaWithHoles(this.scene, 20, 19, this.wallAreas[0].getWidth()*2, this.wallAreas[0].getHeight()*2, 9));
    
    this.wallAreas.push(new WallArea(this.scene, 62, 61, -80, -80));

  }

  private setupAreaColliders() {
    this.wallAreas.forEach(wallArea => {
      this.scene.physics.add.collider(
        this.scene.player.physicsGroup,
        wallArea.rects[0].physicsGroup,
        this.bounceCallback,
        null,
        this
      );
      this.scene.physics.add.collider(
        this.scene.unitManager.enemies[0].physicsGroup,
        wallArea.rects[0].physicsGroup,
        this.bounceCallback,
        null,
        this
      );
    })

  }

}
