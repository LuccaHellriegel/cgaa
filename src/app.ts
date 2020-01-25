import Phaser from "phaser";
import { Gameplay } from "./scenes/Gameplay";
import { HUD } from "./scenes/HUD";

export const gameConfig = {
	type: Phaser.WEBGL,
	width: 1280,
	height: 720,
	physics: {
		default: "arcade",
		arcade: {
			debug: false
		}
	},
	scale: {
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	scene: [Gameplay, HUD]
};

new Phaser.Game(gameConfig);
