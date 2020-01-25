import Phaser from "phaser";
import { Gameplay } from "./scenes/Gameplay";
import { HUD } from "./scenes/HUD";

export function createGameConfig() {
	return {
		type: Phaser.WEBGL,
		canvas: document.getElementById("game"),
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
}

new Phaser.Game(createGameConfig());
