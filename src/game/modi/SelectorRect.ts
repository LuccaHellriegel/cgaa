import { Gameplay } from "../../scenes/Gameplay";

export class SelectorRect extends Phaser.Physics.Arcade.Sprite {
	constructor(scene: Gameplay, x, y) {
		super(scene, x, y, "selectorRect");
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
		this.scene.events.on("added-shooter", () => {
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
			"animationcomplete_invalid-shooter-pos",
			function() {
				this.anims.play("idle-" + this.texture.key);
			},
			this
		);
	}

	interactionModusOn() {
		this.clearTint();
		this.turnOn();
	}

	buildModusOn() {
		this.setTint(0x013220, 0x013220, 0x013220, 0x013220);
		this.turnOn();
	}

	buildShift() {
		//TODO: magic number from tint math
		if (this.tintBottomLeft === 2109953) {
			this.setTint(0x98fb98, 0x98fb98, 0x98fb98, 0x98fb98);
		} else {
			this.setTint(0x013220, 0x013220, 0x013220, 0x013220);
		}
	}

	turnOn() {
		this.setActive(true).setVisible(true);
	}

	turnOff() {
		this.setActive(false).setVisible(false);
	}

	lockOff() {
		this.setActive(true);
	}

	lockOn() {
		this.setActive(false);
	}
}
