import { HUD } from "../../../../scenes/HUD";
import { Gameplay } from "../../../../scenes/Gameplay";
import { SymmetricCrossPolygon } from "../../../base/polygons/SymmetricCrossPolygon";
import { towerCost } from "../../../base/globals/globalConfig";

export class PlayerSoulCounter {
	value: number;
	startValue: number;
	playerCounterText: Phaser.GameObjects.Text;

	constructor(sceneToUse: HUD, sceneToListen: Gameplay, x, y) {
		let playerSoulCountGraphic = new SymmetricCrossPolygon(x, y, 50, 25);

		let increaseEvent = "souls-gained";
		let decreaseEvent = "souls-spent";

		this.value = 0;
		this.startValue = 0;

		let graphics = sceneToUse.add.graphics({
			fillStyle: {
				color: 0x228b22
			}
		});
		playerSoulCountGraphic.draw(graphics, 0);
		this.playerCounterText = sceneToUse.add.text(x - 17, y - 12, "0", {
			font: "20px Verdana",
			fill: "#ADFF2F"
		});

		this.setupEventListeners(sceneToListen, increaseEvent, decreaseEvent);
	}

	reset() {
		this.value = this.startValue;
		this.playerCounterText.setText(this.value.toString());
	}

	setupEventListeners(sceneToListen: Gameplay, increaseEvent, decreaseEvent) {
		sceneToListen.events.on(
			increaseEvent,
			function(amount) {
				this.value += amount;
				this.playerCounterText.setText(this.value.toString());
				if (this.value >= towerCost) {
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
					if (this.value < towerCost) {
						sceneToListen.events.emit("can-not-build");
					}
				}
				this.playerCounterText.setText(this.value.toString());
			},
			this
		);
	}
}