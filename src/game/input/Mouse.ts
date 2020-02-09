import { Gameplay } from "../../scenes/Gameplay";
import { Player } from "../unit/Player";

export class Mouse {
	constructor(private scene: Gameplay, private player: Player, private selectorRect: SelectorRect, private modi: Modi) {
		this.setupEvents();
	}

	private setupEvents() {
		this.scene.input.on("pointermove", this.move.bind(this));
		this.scene.input.on("pointerdown", this.down.bind(this));
	}

	private rotatePlayerTowardsMouse(newX, newY) {
		let rotation = Phaser.Math.Angle.Between(this.player.x, this.player.y, newX, newY);
		let correctionForPhasersMinus90DegreeTopPostion = (Math.PI / 180) * 90;
		this.player.setRotation(rotation + correctionForPhasersMinus90DegreeTopPostion);
	}

	private move(pointer) {
		let x = pointer.x + this.scene.cameras.main.scrollX;
		let y = pointer.y + this.scene.cameras.main.scrollY;

		this.rotatePlayerTowardsMouse(x, y);

		if (this.selectorRect.active) {
			this.selectorRect.setPosition(x, y);
		}
	}

	private down() {
		if (!this.modi.click()) this.player.attack();
	}
}
