import { Image } from "../base/BasePhaser";
import { Gameplay } from "../../scenes/Gameplay";
import { Annotator } from "../base/Annotator";

export class BossBarrier extends Image {
	constructor(scene: Gameplay, x, y, physicsGroup) {
		super({ scene, x, y, texture: "healer", physicsGroup });
		Annotator.annotate(this, "immovable");
		scene.events.once("camps-conquered", this.destroy.bind(this));
	}
}
