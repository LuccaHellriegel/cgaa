import { Generator } from "./Generator";
import { Gameplay } from "../../../scenes/Gameplay";

export class DiplomatSymbolGenerator extends Generator {
	title: string;
	radius: number;
	hexColor: number;

	constructor(scene: Gameplay, radius: number) {
		super(0xa9a9a9, scene);
		this.title = "diplomat";
		this.radius = radius;
		this.hexColor = 0xa9a9a9;
		this.generate();
	}

	drawFrames() {
		this.graphics.fillStyle(this.hexColor);
		this.graphics.fillCircle(this.radius, this.radius, this.radius);
		this.graphics.fillStyle(0x323232);
		this.graphics.fillCircle(this.radius, this.radius, 2.5 * (this.radius / 3));
	}

	generateTexture() {
		this.graphics.generateTexture(this.title, 4 * this.radius, 2 * this.radius);
	}

	addFrames() {
		this.scene.textures.list[this.title].add(1, 0, 0, 0, 2 * this.radius, 2 * this.radius);
	}
}
