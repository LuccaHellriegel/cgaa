import { Gameplay } from "../../../scenes/Gameplay";

export class WallPart extends Phaser.GameObjects.Image {
	constructor(scene: Gameplay, x, y) {
		super(scene, x, y, "wallPart");
		scene.add.existing(this);
	}
}
