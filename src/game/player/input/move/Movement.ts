import { Player } from "../../unit/Player";
import { WASD } from "./WASD";

export class Movement {
	constructor(private wasd: WASD, private player: Player) {}

	update() {
		let { left, right, up, down } = this.wasd.getState();

		if (left) {
			this.player.setVelocityX(-180);
		}

		if (right) {
			this.player.setVelocityX(180);
		}

		if (up) {
			this.player.setVelocityY(-180);
		}

		if (down) {
			this.player.setVelocityY(180);
		}

		let noButtonDown = !left && !right && !up && !down;
		if (noButtonDown) {
			this.player.setVelocityX(0);
			this.player.setVelocityY(0);
		}
	}
}
