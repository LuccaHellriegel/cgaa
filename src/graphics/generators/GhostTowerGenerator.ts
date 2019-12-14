import { Generator } from "./Generator";
import { RectPolygon } from "../../game/base/polygons/RectPolygon";
import { Gameplay } from "../../scenes/Gameplay";
import { gridPartHalfSize } from "../../game/base/globals/globalSizes";

export class GhostTowerGenerator extends Generator {
	title: string;
	lineWidth: number;

	constructor(scene: Gameplay) {
		super(0xffffff, scene);
		this.title = "ghostTower";
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
			4 * gridPartHalfSize + 4 * this.lineWidth,
			2 * gridPartHalfSize + 4 * this.lineWidth
		);
	}
	addFrames() {
		this.scene.textures.list[this.title].add(
			1,
			0,
			0,
			0,
			2 * gridPartHalfSize + 2 * this.lineWidth,
			2 * gridPartHalfSize + 2 * this.lineWidth
		);
		this.scene.textures.list[this.title].add(
			2,
			0,
			2 * gridPartHalfSize + 2 * this.lineWidth,
			0,
			2 * gridPartHalfSize + 2 * this.lineWidth,
			2 * gridPartHalfSize + 2 * this.lineWidth
		);
	}

	private drawFristRect() {
		let rect = new RectPolygon(
			gridPartHalfSize + this.lineWidth,
			gridPartHalfSize + this.lineWidth,
			2 * gridPartHalfSize,
			2 * gridPartHalfSize
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
			3 * gridPartHalfSize + 3 * this.lineWidth,
			gridPartHalfSize + this.lineWidth,
			2 * gridPartHalfSize,
			2 * gridPartHalfSize
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
