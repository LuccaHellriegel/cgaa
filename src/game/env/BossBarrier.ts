import { Image } from "../base/BasePhaser";
import { Gameplay } from "../../scenes/Gameplay";
import { Annotator } from "../base/Annotator";
import { EventSetup } from "../setup/EventSetup";

export class BossBarrier extends Image {
	constructor(scene: Gameplay, x, y, physicsGroup) {
		super({ scene, x, y, texture: "blockade", physicsGroup });
		Annotator.annotate(this, "immovable");
		scene.events.once(EventSetup.conqueredEvent, this.destroy.bind(this));
	}
}
