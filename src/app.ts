import Phaser from "phaser";
import { Gameplay } from "./scenes/Gameplay";
import { HUD } from "./scenes/HUD";

//TODO: on firefox WEBGL produces bad performance
let gameConfig = {
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
	scene: {}
};

let gameConfigWithScene = gameConfig;
gameConfigWithScene.scene = [Gameplay, HUD];

new Phaser.Game(gameConfigWithScene);
