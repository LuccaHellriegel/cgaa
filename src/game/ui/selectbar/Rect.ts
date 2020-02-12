import { HUD } from "../../../scenes/HUD";
import { RectPolygon } from "../../polygons/RectPolygon";

export class Rect {
	polygon: RectPolygon;
	innerPolygon: RectPolygon;
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
		this.innerPolygon = new RectPolygon(x, y, 2 * (width / 3), 2 * (height / 3));
		this.redraw(hexColor);
	}
	redraw(hexColor) {
		this.graphics.clear();
		this.graphics.fillStyle(hexColor);
		this.polygon.draw(this.graphics, 0);
	}
	select() {
		this.redraw(0x0000ff);
		this.graphics.fillStyle(this.hexColor);
		this.innerPolygon.draw(this.graphics, 0);
	}
	deselect() {
		this.redraw(this.hexColor);
	}
	hide() {
		this.graphics.clear();
	}
	show() {
		this.deselect();
	}
}
export class TextRect extends Rect {
	textObj: Phaser.GameObjects.Text;
	constructor(
		sceneToUse: HUD,
		private x: number,
		private y: number,
		width: number,
		height: number,
		hexColor: number,
		private text: string
	) {
		super(sceneToUse, x, y, width, height, hexColor);
	}
	redraw(hexColor) {
		super.redraw(hexColor);
		this.textObj = this.sceneToUse.add.text(this.x - 20, this.y - 22, this.text, {
			font: "60px Verdana ",
			fill: "#000000",
			fontWeight: "bold"
		});
	}
	hide() {
		super.hide();
		this.textObj.setVisible(false);
	}
	show() {
		super.show();
		this.textObj.setVisible(true);
	}
}
export class ImageRect extends Rect {
	image: Phaser.Physics.Arcade.Image;
	constructor(sceneToUse: HUD, x: number, y: number, width: number, height: number, hexColor: number, texture: string) {
		super(sceneToUse, x, y, width, height, hexColor);
		this.image = new Phaser.Physics.Arcade.Image(sceneToUse, x, y, texture);
		this.image.setScale(0.5, 0.5);
		sceneToUse.add.existing(this.image);
	}
	hide() {
		super.hide();
		this.image.setVisible(false);
	}
	show() {
		super.show();
		this.image.setVisible(true);
	}
}
