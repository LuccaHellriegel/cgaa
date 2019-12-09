import { BasePhysicalPositionConfig } from "../config";
import { Gameplay } from "../../../scenes/Gameplay";
import { applyBasePhysicsConfig } from "../apply";
import { extendWithNewId } from "../extend";
import { makePhysical } from "../make";

export interface BasePhaser extends BasePhysicalPositionConfig {
	texture: string;
}

export abstract class Sprite extends Phaser.Physics.Arcade.Sprite {
	physicsGroup: Phaser.Physics.Arcade.Group;
	id: string;
	scene: Gameplay;

	constructor(config: BasePhaser) {
		super(config.scene, config.x, config.y, config.texture);
		applyBasePhysicsConfig(this, config);
		extendWithNewId(this);
		makePhysical(this, config);
	}
}

export abstract class SpriteWithAnimEvents extends Sprite {
	constructor(config: BasePhaser) {
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
	physicsGroup: Phaser.Physics.Arcade.Group;
	scene: Gameplay;
	owner;

	constructor(config: BasePhaser) {
		super(config.scene, config.x, config.y, config.texture);
		applyBasePhysicsConfig(this, config);
		makePhysical(this, config);
	}
}
