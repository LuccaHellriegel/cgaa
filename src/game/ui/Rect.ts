import { HUD } from "../../scenes/HUD";
import { RectPolygon } from "../polygons/RectPolygon";
import { notifyWithVal } from "./Observer";

export class Rect {
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
		this.redraw(hexColor);
	}

	redraw(hexColor) {
		this.graphics.clear();
		this.graphics.fillStyle(hexColor);
		this.polygon.draw(this.graphics, 0);
	}
}

export class CounterRect extends Rect implements notifyWithVal {
	textObj: Phaser.GameObjects.Text;
	count = "0";

	constructor(
		sceneToUse: HUD,
		private x: number,
		private y: number,
		width: number,
		height: number,
		private prefixText: string
	) {
		super(sceneToUse, x, y, width, height, 0x0000ff);
		this.textObj = this.sceneToUse.add.text(this.x - 20, this.y - 22, prefixText + this.count, {
			font: "40px Verdana ",
			fill: "#000000",
			fontWeight: "bold"
		});
	}

	notify(val: number) {
		this.count = val.toString();
		this.textObj.setText(this.prefixText + this.count);
	}
}
