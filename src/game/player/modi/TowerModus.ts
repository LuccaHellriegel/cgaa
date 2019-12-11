import { Gameplay } from "../../../scenes/Gameplay";
import { GhostTower } from "./GhostTower";
import { InteractionModus } from "./InteractionModus";

export class TowerModus {
	scene: Gameplay;
	ghostTower: GhostTower;
	physicsGroup: Phaser.Physics.Arcade.StaticGroup;
	isOn: Boolean = false;
	locked: Boolean = false;
	interactionModus: InteractionModus;

	constructor(scene) {
		this.scene = scene;

		this.physicsGroup = scene.physics.add.staticGroup();
		this.ghostTower = new GhostTower(scene, 0, 0, this.physicsGroup);

		this.scene.events.on("added-tower", () => {
			this.bringGhostTowerToTop();
		});

		let keyObj = scene.input.keyboard.addKey("F");
		keyObj.on("down", () => {
			this.isOn = !this.isOn;
			if (!this.isOn && this.interactionModus.isOn) {
				this.unlockGhostTower();
				this.interactionModus.isOn = false;
			}
			let active = false;
			let visible = false;
			if (this.isOn) {
				this.ghostTower.setPosition(this.scene.input.mousePointer.x, this.scene.input.mousePointer.y);
				active = true;
				visible = true;
			}
			this.ghostTower.setActive(active).setVisible(visible);
		});
	}

	setInteractionModus(interactionModus) {
		this.interactionModus = interactionModus;
	}

	syncGhostTowerWithMouse(x, y) {
		if (this.isOn && !this.locked) this.ghostTower.setPosition(x, y);
	}

	lockGhostTower(x, y) {
		this.locked = true;
		this.ghostTower.setPosition(x, y);
	}

	unlockGhostTower() {
		this.locked = false;
	}

	private bringGhostTowerToTop() {
		this.scene.children.bringToTop(this.ghostTower);
	}
}
