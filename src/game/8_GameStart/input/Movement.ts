import { WASD } from "./WASD";
import { Player } from "../../4_GameUnit/units/Player";

const playerVelocity = 500;

export class Movement {
	constructor(private wasd: WASD, private player: Player) {}

	update() {
		let { left, right, up, down } = this.wasd.getState();

		if (left) {
			this.player.setVelocityX(-playerVelocity);
		}

		if (right) {
			this.player.setVelocityX(playerVelocity);
		}

		if (up) {
			this.player.setVelocityY(-playerVelocity);
		}

		if (down) {
			this.player.setVelocityY(playerVelocity);
		}

		let noButtonDown = !left && !right && !up && !down;
		if (noButtonDown) {
			this.player.setVelocityX(0);
			this.player.setVelocityY(0);
		}
	}
}
