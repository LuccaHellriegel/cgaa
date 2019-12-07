import { Gameplay } from "../../../scenes/Gameplay";
import { SpriteWithAnimEvents } from "../../../base/BasePhaser";

export class GhostTower extends SpriteWithAnimEvents {
  constructor(scene: Gameplay, x, y, physicsGroup) {
    super({scene, x, y, texture: "ghostTower", physicsGroup});
    this.on(
      "animationcomplete_invalid-tower-pos",
      function() {
        this.anims.play("idle-" + this.texture.key);
      },
      this
    );
    this.setActive(false).setVisible(false);
  }
}
