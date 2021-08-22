import { HealthBar } from "../../healthbar/HealthBar";

export class PlayerHealthBar extends HealthBar {
	constructor(scene) {
		super(0, 0, { scene, posCorrectionX: 0, posCorrectionY: 0, healthWidth: 200, healthLength: 12, value: 100 });
		this.move(this.calculatehealthBarXWrtScreen(), this.calculatehealthBarYWrtScreen());
	}

	private calculatehealthBarXWrtScreen() {
		let screenWidth = 1280;
		let healthBarWidth = 200;
		let topLeftXHealthBar = screenWidth - healthBarWidth - 10;
		return topLeftXHealthBar;
	}

	private calculatehealthBarYWrtScreen() {
		let screenLength = 720;
		let healthBarLength = 12;
		let topLeftYHealthBar = screenLength - healthBarLength - 10;
		return topLeftYHealthBar;
	}
}
