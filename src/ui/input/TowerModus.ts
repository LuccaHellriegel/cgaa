import { Gameplay } from "../../scenes/Gameplay";
import { GhostTower } from "../graphics/GhostTower";

export class TowerModus {
  scene: Gameplay;
  ghostTower: GhostTower;
  physicsGroup: Phaser.Physics.Arcade.StaticGroup;
  isOn: Boolean = false;

  constructor(scene: Gameplay) {
    this.scene = scene;
    scene.towerModus = this;

    this.physicsGroup = scene.physics.add.staticGroup();
    this.ghostTower = new GhostTower(scene, 0, 0, this.physicsGroup);

    this.scene.events.on("added-tower", () => {
      this.bringGhostTowerToTop();
    });

    let keyObj = scene.input.keyboard.addKey("F");
    keyObj.on("down", () => {
      this.isOn = !this.isOn;

      let active = false;
      let visible = false;
      if (this.isOn) {
        //TODO not perfect :P
        this.ghostTower.setPosition(this.scene.input.mousePointer.x, this.scene.input.mousePointer.y);
        active = true;
        visible = true;
      }
      this.ghostTower.setActive(active).setVisible(visible);
    });
  }

  syncGhostTowerWithMouse(x, y) {
    if (this.isOn) this.ghostTower.setPosition(x, y);
  }

  private bringGhostTowerToTop() {
    this.scene.children.bringToTop(this.ghostTower);
  }
}
