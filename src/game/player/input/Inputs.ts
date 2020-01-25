import { Gameplay } from "../../../scenes/Gameplay";

export class Inputs {
	readonly sceneInput: Phaser.Input.InputPlugin;
	readonly fKey: Phaser.Input.Keyboard.Key;
	readonly eKey: Phaser.Input.Keyboard.Key;
	readonly rKey: Phaser.Input.Keyboard.Key;

	constructor(scene: Gameplay) {
		this.sceneInput = scene.input;
		this.fKey = scene.input.keyboard.addKey("F");
		this.eKey = scene.input.keyboard.addKey("E");
		this.rKey = scene.input.keyboard.addKey("R");
	}
}
