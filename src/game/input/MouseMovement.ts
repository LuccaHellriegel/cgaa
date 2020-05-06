import { Gameplay } from "../../scenes/Gameplay";
import { Player } from "../unit/Player";
import { SelectorRect } from "../ui/SelectorRect";

export class MouseMovement {
	constructor(private scene: Gameplay, private player: Player, private selectorRect: SelectorRect) {
		this.setupEvents();
	}

	private setupEvents() {
		this.scene.input.on("pointermove", this.move.bind(this));
	}

	private rotatePlayerTowardsMouseMovement(newX, newY) {
		let correctionForPhasersMinus90DegreeTopPostion = (Math.PI / 180) * 90;
		let rotation =
			Phaser.Math.Angle.Between(this.player.x, this.player.y, newX, newY) + correctionForPhasersMinus90DegreeTopPostion;
		this.player.setRotation(rotation);
	}

	private move(pointer) {
		let x = pointer.x + this.scene.cameras.main.scrollX;
		let y = pointer.y + this.scene.cameras.main.scrollY;

		this.rotatePlayerTowardsMouseMovement(x, y);
		if (this.selectorRect.active || !this.selectorRect.visible) {
			this.selectorRect.setPosition(x, y);
		}
	}
}
