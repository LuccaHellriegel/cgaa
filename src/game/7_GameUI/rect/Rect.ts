import { HUD } from "../../../scenes/HUD";
import { GUIElement } from "../select/bars/SelectBar";
import { RectPolygon } from "../../0_GameBase/engine/polygons/RectPolygon";

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
