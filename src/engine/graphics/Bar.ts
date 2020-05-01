import { Health } from "../status/Health";

const green = 0x00ff00;
const red = 0xff0000;
const black = 0x000000;

export class HealthBarTwo {
	health: Health;
	greenBar: Phaser.GameObjects.Rectangle;
	redBar: Phaser.GameObjects.Rectangle;
	blackBar: Phaser.GameObjects.Rectangle;

	constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, value: number) {
		this.health = new Health(value);
		this.greenBar = scene.add.rectangle(x, y, width, height, green);
		this.redBar = scene.add.rectangle(x, y, width, height, red);
        this.redBar.

		let blackBarOffset = 4;
		this.blackBar = scene.add.rectangle(x, y, width + blackBarOffset, height + blackBarOffset, black);
	}
}
