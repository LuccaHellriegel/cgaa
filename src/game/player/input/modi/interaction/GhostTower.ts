import { Gameplay } from "../../../../../scenes/Gameplay";

export class GhostTower extends Phaser.Physics.Arcade.Sprite {
	constructor(scene: Gameplay, x, y, keyObj) {
		super(scene, x, y, "ghostTower");
		this.setupSceneInteraction();
		this.setupAnims();
		this.setupEvents(keyObj);
		this.setActive(false).setVisible(false);
	}

	private setupSceneInteraction() {
		this.scene.add.existing(this);
		this.scene.physics.add.staticGroup(this);
	}

	private setupEvents(keyObj) {
		keyObj.on("down", () => {
			this.toggle();
		});
		this.scene.events.on("added-tower", () => {
			this.scene.children.bringToTop(this);
		});
	}

	private setupAnims() {
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
