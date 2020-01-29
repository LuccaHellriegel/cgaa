import { Gameplay } from "../../../scenes/Gameplay";
import { Annotator } from "../../base/classes/Annotator";
import { Image } from "../../base/classes/BasePhaser";

export class BossBarrier extends Image {
	constructor(scene: Gameplay, x, y, physicsGroup, spawnUnit, color: string) {
		super({ scene, x, y, texture: color + spawnUnit + "Building", physicsGroup });
		Annotator.annotate(this, "id", "immovable");

		//TODO_ listen
	}
}
