import { Gameplay } from "../../../scenes/Gameplay";
import { SymmetricCrossPolygon } from "../../polygons/SymmetricCrossPolygon";
import { HUD } from "../../../scenes/HUD";
import { TowerSetup } from "../../setup/TowerSetup";
import { EventSetup } from "../../setup/EventSetup";

export class PlayerSoulCounter {
	value: number;
	startValue: number;
	playerCounterText: Phaser.GameObjects.Text;

	constructor(sceneToUse: HUD, private sceneToListen: Gameplay, x, y) {
		let playerSoulCountGraphic = new SymmetricCrossPolygon(x - 100, y, 40, 15);

		let increaseEvent = "souls-gained";
		let decreaseEvent = "souls-spent";

		this.startValue = 100;
		//this.startValue = 1000000;

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
	}

	setupEventListeners(sceneToListen: Gameplay, increaseEvent, decreaseEvent) {
		sceneToListen.events.on(
			increaseEvent,
			function(amount) {
				this.value += amount;
				this.playerCounterText.setText(this.value.toString());
				if (this.value >= TowerSetup.shooterCost) {
					sceneToListen.events.emit(EventSetup.canBuildShooter);
				}
				if (this.value >= TowerSetup.healerCost) {
					sceneToListen.events.emit(EventSetup.canBuildHealer);
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
					sceneToListen.events.emit(EventSetup.cannotBuildShooter);
				}

				if (this.value < TowerSetup.healerCost) {
					sceneToListen.events.emit(EventSetup.cannotBuildHealer);
				}

				this.playerCounterText.setText(this.value.toString());
			},
			this
		);
	}
}
