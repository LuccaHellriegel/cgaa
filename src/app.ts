import Phaser from "phaser";
import { Gameplay } from "./scenes/Gameplay";
import { HUD } from "./scenes/HUD";
import { Develop } from "./scenes/Develop";

const devMode = false;
const debugMode = devMode || false;

function createGameConfig() {
	let scene;
	if (devMode) {
		scene = [Develop];
	} else {
		scene = [Gameplay, HUD];
	}
	return {
		type: Phaser.WEBGL,
		canvas: document.getElementById("game") as HTMLCanvasElement,
		width: 1280,
		height: 720,
		physics: {
			default: "arcade",
			arcade: {
				debug: debugMode,
			},
		},
		scale: {
			autoCenter: Phaser.Scale.CENTER_BOTH,
		},
		scene,
	};
}

new Phaser.Game(createGameConfig());
//TODO: make layout random too -> just need to make sure the exits are valid, then I am good to go?
//TODO: find something to do in the empty areas -> creeps? -> boss units?
//TODO: randomize position of areas (maybe also shape? maybe also shape of complete map?)
//TODO: number of camps adjustable? -> Game Menu
//TODO: upgraden wenn shift gehalten
//TODO unit producing towers?
//TODO: dynamich pathfinding on Web Worker?
//TODO: actualize map when buildings are destroyed?

//TODO: make interaction circle invincible and destroy it when buildings are destroyed
