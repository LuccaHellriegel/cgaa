import { EnvSetup } from "../../config/EnvSetup";
import { Generator } from "../../engine/Generator";
import { Gameplay } from "../../scenes/Gameplay";

export class SelectorRectGenerator extends Generator {
	title: string;
	lineWidth: number;

	constructor(scene: Gameplay) {
		super(0xffffff, scene);
		this.title = "selectorRect";
		this.lineWidth = 6;
		this.generate();
	}

	drawFrames() {
		this.drawFristRect();
		this.drawErrorRect();
	}
	generateTexture() {
		this.graphics.generateTexture(
			this.title,
			2 * EnvSetup.gridPartSize + 4 * this.lineWidth,
			EnvSetup.gridPartSize + 4 * this.lineWidth
		);
	}
	addFrames() {
		this.scene.textures.list[this.title].add(
			1,
			0,
			0,
			0,
			EnvSetup.gridPartSize + 2 * this.lineWidth,
			EnvSetup.gridPartSize + 2 * this.lineWidth
		);
		this.scene.textures.list[this.title].add(
			2,
			0,
			EnvSetup.gridPartSize + 2 * this.lineWidth,
			0,
			EnvSetup.gridPartSize + 2 * this.lineWidth,
			EnvSetup.gridPartSize + 2 * this.lineWidth
		);
	}

	private drawFristRect() {
		this.graphics.lineStyle(this.lineWidth, 0xffffff);
		this.graphics.strokeRect(0 + this.lineWidth, 0 + this.lineWidth, EnvSetup.gridPartSize, EnvSetup.gridPartSize);
	}

	private drawErrorRect() {
		this.graphics.lineStyle(this.lineWidth, 0xcc0000);
		this.graphics.strokeRect(
			EnvSetup.gridPartSize + 2 * this.lineWidth,
			this.lineWidth,
			EnvSetup.gridPartSize,
			EnvSetup.gridPartSize
		);
	}
}
