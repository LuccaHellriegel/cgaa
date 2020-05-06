import { HUD } from "../../../scenes/HUD";
import { RectPolygon } from "../../polygons/RectPolygon";
import { GUIElement } from "../select/bars/SelectBar";

export class Rect implements GUIElement {
	polygon: RectPolygon;
	graphics: Phaser.GameObjects.Graphics;
	constructor(
		protected sceneToUse: HUD,
		x: number,
		y: number,
		width: number,
		height: number,
		protected hexColor: number
	) {
		this.graphics = sceneToUse.add.graphics({});
		this.polygon = new RectPolygon(x, y, width, height);
		this.show();
	}

	show() {
		this.graphics.fillStyle(this.hexColor);
		this.polygon.draw(this.graphics, 0);
	}

	hide() {
		this.graphics.clear();
	}
}
