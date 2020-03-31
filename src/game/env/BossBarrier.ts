import { Gameplay } from "../../scenes/Gameplay";
import { EventSetup } from "../setup/EventSetup";

export class BossBarrier extends Phaser.Physics.Arcade.Image {
	constructor(scene: Gameplay, x, y, physicsGroup) {
		super(scene, x, y, "blockade");
		scene.add.existing(this);
		physicsGroup.add(this);
		this.setImmovable(true);
		scene.events.once(EventSetup.conqueredEvent, this.destroy.bind(this));
	}
}
