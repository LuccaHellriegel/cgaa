import { Gameplay } from "../../scenes/Gameplay";

export class Inputs {
	readonly sceneInput: Phaser.Input.InputPlugin;
	readonly fKey: Phaser.Input.Keyboard.Key;
	readonly eKey: Phaser.Input.Keyboard.Key;
	readonly rKey: Phaser.Input.Keyboard.Key;
	readonly qKey: Phaser.Input.Keyboard.Key;
	readonly shiftKey: Phaser.Input.Keyboard.Key;
	readonly oneKey: Phaser.Input.Keyboard.Key;
	readonly twoKey: Phaser.Input.Keyboard.Key;
	readonly threeKey: Phaser.Input.Keyboard.Key;

	constructor(scene: Gameplay) {
		this.sceneInput = scene.input;
		this.fKey = scene.input.keyboard.addKey("F");
		this.rKey = scene.input.keyboard.addKey("R");
		this.qKey = scene.input.keyboard.addKey("Q");
		this.oneKey = scene.input.keyboard.addKey("ONE");
		this.twoKey = scene.input.keyboard.addKey("TWO");
		this.threeKey = scene.input.keyboard.addKey("THREE");
	}
}
