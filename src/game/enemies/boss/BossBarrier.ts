import { Gameplay } from "../../../scenes/Gameplay";
import { Annotator } from "../../base/classes/Annotator";
import { Image } from "../../base/classes/BasePhaser";

export class BossBarrier extends Image {
	constructor(scene: Gameplay, x, y, physicsGroup) {
		super({ scene, x, y, texture: "healer", physicsGroup });
		Annotator.annotate(this, "immovable");
		scene.events.once("all-camps-conquered", this.destroy.bind(this));
	}
	//TODO: emit event from somewhere
}
