import { Gameplay } from "../../../../../scenes/Gameplay";

export class GhostTower extends Phaser.Physics.Arcade.Sprite {
	constructor(scene: Gameplay, x, y, keyObj) {
		super(scene, x, y, "ghostTower");
		scene.add.existing(this);
		scene.physics.add.staticGroup(this);

		keyObj.on("down", () => {
			this.toggle();
		});

		this.on(
			"animationcomplete",
			function(anim, frame) {
				this.emit("animationcomplete_" + anim.key, anim, frame);
			},
			this
		);
		this.on(
			"animationcomplete_invalid-tower-pos",
			function() {
				this.anims.play("idle-" + this.texture.key);
			},
			this
		);

		this.setActive(false).setVisible(false);
		this.scene.events.on("added-tower", () => {
			this.scene.children.bringToTop(this);
		});
	}

	toggle() {
		let bool = !this.visible;
		this.setActive(bool).setVisible(bool);
	}

	toggleLock() {
		let active = !this.active;
		this.setActive(active);
	}
}
