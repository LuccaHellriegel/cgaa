import { HealthBar } from "../base/classes/HealthBar";

export class PlayerHealthBar extends HealthBar {
	constructor(scene) {
		super(0, 0, { scene, posCorrectionX: 0, posCorrectionY: 0, healthWidth: 46, healthLength: 12, value: 100 });
		this.move(this.calculatehealthBarXWrtScreen(), this.calculatehealthBarYWrtScreen());
	}

	increase(amount) {
		let realAmount = this.value == 100 ? 0 : Math.min(100 - this.value, amount);
		this.value += realAmount;
		this.draw();
	}

	private calculatehealthBarXWrtScreen() {
		let screenWidth = 1280;
		let healthBarWidth = 46;
		let topLeftXHealthBar = screenWidth - healthBarWidth;
		return topLeftXHealthBar;
	}

	private calculatehealthBarYWrtScreen() {
		let screenLength = 720;
		let healthBarLength = 12;
		let topLeftYHealthBar = screenLength - healthBarLength;
		return topLeftYHealthBar;
	}
}
