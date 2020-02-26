import { Gameplay } from "../../../scenes/Gameplay";
import { SymmetricCrossPolygon } from "../../polygons/SymmetricCrossPolygon";
import { HUD } from "../../../scenes/HUD";
import { TowerSetup } from "../../setup/TowerSetup";

export class PlayerSoulCounter {
	value: number;
	startValue: number;
	playerCounterText: Phaser.GameObjects.Text;

	constructor(sceneToUse: HUD, private sceneToListen: Gameplay, x, y) {
		let playerSoulCountGraphic = new SymmetricCrossPolygon(x, y, 50, 25);

		let increaseEvent = "souls-gained";
		let decreaseEvent = "souls-spent";

		//this.startValue = 1000000;
		this.startValue = 100;

		let graphics = sceneToUse.add.graphics({
			fillStyle: {
				color: 0x228b22
			}
		});
		playerSoulCountGraphic.draw(graphics, 0);
		this.playerCounterText = sceneToUse.add.text(x - 17, y - 12, this.startValue.toString(), {
			font: "20px Verdana",
			fill: "#ADFF2F"
		});

		this.reset();

		this.setupEventListeners(sceneToListen, increaseEvent, decreaseEvent);
	}

	reset() {
		this.value = this.startValue;
		this.playerCounterText.setText(this.value.toString());
		this.sceneToListen.events.emit("can-build");
	}

	setupEventListeners(sceneToListen: Gameplay, increaseEvent, decreaseEvent) {
		sceneToListen.events.on(
			increaseEvent,
			function(amount) {
				this.value += amount;
				this.playerCounterText.setText(this.value.toString());
				if (this.value >= TowerSetup.shooterCost) {
					sceneToListen.events.emit("can-build");
				}
			},
			this
		);
		sceneToListen.events.on(
			decreaseEvent,
			function(amount) {
				if (this.value - amount <= 0) {
					this.value = 0;
				} else {
					this.value -= amount;
				}

				if (this.value < TowerSetup.shooterCost) {
					sceneToListen.events.emit("can-not-build");
				}

				this.playerCounterText.setText(this.value.toString());
			},
			this
		);
	}
}
