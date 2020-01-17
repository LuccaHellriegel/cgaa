import { Gameplay } from "../../../../scenes/Gameplay";
import { Modi } from "../modi/Modi";
import { Player } from "../../unit/Player";
import { GhostTower } from "../modi/interaction/GhostTower";

export class Mouse {
	constructor(private scene: Gameplay, private player: Player, private ghostTower: GhostTower, private modi: Modi) {
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

		if (this.ghostTower.active) {
			this.ghostTower.setPosition(x, y);
		}
	}

	private down() {
		if (!this.modi.checkModi()) this.player.attack();
	}
}
