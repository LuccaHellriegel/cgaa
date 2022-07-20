import { EventSetup } from "../../config/EventSetup";
import { Gameplay } from "../../scenes/Gameplay";

export class BossBarrier extends Phaser.Physics.Arcade.Image {
  constructor(scene: Gameplay, x, y) {
    super(scene, x, y, "blockade");
    scene.add.existing(this);
    //this.setImmovable(true);
    scene.events.once(EventSetup.conqueredEvent, this.destroy.bind(this));
  }
}
