import { Image } from "../base/classes/BasePhaser";

export class WallPart extends Image {
	constructor(scene, x, y, physicsGroup) {
		super({ scene, x, y, texture: "wallPart", physicsGroup });
		this.setImmovable(true);
	}
}
