import { Annotator } from "./Annotator";

export abstract class Sprite extends Phaser.Physics.Arcade.Sprite {
	constructor(config) {
		super(config.scene, config.x, config.y, config.texture);
		Annotator.annotateConfigBased(this, config, "id");
	}
}

export abstract class SpriteWithAnimEvents extends Phaser.Physics.Arcade.Sprite {
	constructor(config) {
		super(config.scene, config.x, config.y, config.texture);
		Annotator.annotateConfigBased(this, config, "id", "animcomplete");
	}
}

export class Image extends Phaser.Physics.Arcade.Image {
	owner;

	constructor(config) {
		super(config.scene, config.x, config.y, config.texture);
		Annotator.annotateConfigBased(this, config);
	}
}
