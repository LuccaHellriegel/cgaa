import { Generator } from "./Generator";
import { RectPolygon } from "../../world/base/polygons/RectPolygon";
import { Gameplay } from "../../scenes/Gameplay";
import { towerHalfSize } from "../../globals/globalSizes";

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
			4 * towerHalfSize + 4 * this.lineWidth,
			2 * towerHalfSize + 4 * this.lineWidth
		);
	}
	addFrames() {
		this.scene.textures.list[this.title].add(
			1,
			0,
			0,
			0,
			2 * towerHalfSize + 2 * this.lineWidth,
			2 * towerHalfSize + 2 * this.lineWidth
		);
		this.scene.textures.list[this.title].add(
			2,
			0,
			2 * towerHalfSize + 2 * this.lineWidth,
			0,
			2 * towerHalfSize + 2 * this.lineWidth,
			2 * towerHalfSize + 2 * this.lineWidth
		);
	}

	private drawFristRect() {
		let rect = new RectPolygon(
			towerHalfSize + this.lineWidth,
			towerHalfSize + this.lineWidth,
			2 * towerHalfSize,
			2 * towerHalfSize
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
			3 * towerHalfSize + 3 * this.lineWidth,
			towerHalfSize + this.lineWidth,
			2 * towerHalfSize,
			2 * towerHalfSize
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
