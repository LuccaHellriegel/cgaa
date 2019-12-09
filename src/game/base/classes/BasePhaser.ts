import { extendWithNewId } from "../extend";

export abstract class Sprite extends Phaser.Physics.Arcade.Sprite {
	id: string;

	constructor(config) {
		super(config.scene, config.x, config.y, config.texture);
		extendWithNewId(this);
		config.scene.add.existing(this);
		config.physicsGroup.add(this);
	}
}

export abstract class SpriteWithAnimEvents extends Sprite {
	constructor(config) {
		super(config);
		this.on(
			"animationcomplete",
			function(anim, frame) {
				this.emit("animationcomplete_" + anim.key, anim, frame);
			},
			this
		);
	}
}

export class Image extends Phaser.Physics.Arcade.Image {
	owner;

	constructor(config) {
		super(config.scene, config.x, config.y, config.texture);
		config.scene.add.existing(this);
		config.physicsGroup.add(this);
	}
}
