import { Generator } from "./Generator";
import { Gameplay } from "../../../scenes/Gameplay";
import { EnvSetup } from "../../0_GameBase/setup/EnvSetup";
import { RectPolygon } from "../../0_GameBase/engine/polygons/RectPolygon";

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
		let rect = new RectPolygon(
			EnvSetup.halfGridPartSize + this.lineWidth,
			EnvSetup.halfGridPartSize + this.lineWidth,
			EnvSetup.gridPartSize,
			EnvSetup.gridPartSize
		);
		let points = rect.points;
		this.graphics.lineStyle(this.lineWidth, 0xffffff);
		this.graphics.beginPath();
		this.graphics.moveTo(points[0].x, points[0].y);
		for (let index = 0; index < points.length; index++) {
			this.graphics.lineTo(points[index].x, points[index].y);
		}
		this.graphics.closePath();
		this.graphics.strokePath();
	}

	private drawErrorRect() {
		let rect = new RectPolygon(
			3 * EnvSetup.halfGridPartSize + 3 * this.lineWidth,
			EnvSetup.halfGridPartSize + this.lineWidth,
			EnvSetup.gridPartSize,
			EnvSetup.gridPartSize
		);
		let points = rect.points;
		this.graphics.lineStyle(this.lineWidth, 0xcc0000);
		this.graphics.beginPath();
		this.graphics.moveTo(points[0].x, points[0].y);
		for (let index = 0; index < points.length; index++) {
			this.graphics.lineTo(points[index].x, points[index].y);
		}
		this.graphics.closePath();
		this.graphics.strokePath();
	}
}
