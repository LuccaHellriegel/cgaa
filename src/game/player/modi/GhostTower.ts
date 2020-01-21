import { Gameplay } from "../../../scenes/Gameplay";

export class GhostTower extends Phaser.Physics.Arcade.Sprite {
	constructor(scene: Gameplay, x, y) {
		super(scene, x, y, "ghostTower");
		this.setupSceneInteraction();
		this.setupAnims();
		this.setupEvents();
		this.setActive(false).setVisible(false);
	}

	private setupSceneInteraction() {
		this.scene.add.existing(this);
		this.scene.physics.add.staticGroup(this);
	}

	private setupEvents() {
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

	interactionModusOn() {
		this.clearTint();
	}

	towerModusOn() {
		this.setTint(0x013220, 0x013220, 0x013220, 0x013220);
	}

	toggle() {
		let bool = !this.visible;
		this.setActive(bool).setVisible(bool);
	}

	lockOff() {
		this.setActive(true);
	}

	toggleLock() {
		let active = !this.active;
		this.setActive(active);
	}
}
