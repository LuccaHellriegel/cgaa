import { Gameplay } from "../../scenes/Gameplay";

export class Inputs {
	readonly sceneInput: Phaser.Input.InputPlugin;
	readonly fKey: Phaser.Input.Keyboard.Key;
	readonly eKey: Phaser.Input.Keyboard.Key;
	readonly rKey: Phaser.Input.Keyboard.Key;
	readonly qKey: Phaser.Input.Keyboard.Key;
	readonly shiftKey: Phaser.Input.Keyboard.Key;

	constructor(scene: Gameplay) {
		this.sceneInput = scene.input;
		this.fKey = scene.input.keyboard.addKey("F");
		this.eKey = scene.input.keyboard.addKey("E");
		this.rKey = scene.input.keyboard.addKey("R");
		this.qKey = scene.input.keyboard.addKey("Q");

		//TODO: find out why this does not capture
		this.shiftKey = scene.input.keyboard.addKey("SHIFT", true);
	}
}
