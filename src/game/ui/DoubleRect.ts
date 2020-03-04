import { HUD } from "../../scenes/HUD";
import { RectPolygon } from "../polygons/RectPolygon";
import { SelectableGUIElement } from "./select/SelectBar";
export class DoubleRect implements SelectableGUIElement {
	polygon: RectPolygon;
	innerPolygon: RectPolygon;
	graphics: Phaser.GameObjects.Graphics;
	selected = false;
	constructor(
		protected sceneToUse: HUD,
		public x: number,
		public y: number,
		protected width: number,
		protected height: number,
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
		this.selected = true;
		this.redraw(0x0000ff);
		this.graphics.fillStyle(this.hexColor);
		this.innerPolygon.draw(this.graphics, 0);
	}

	deselect() {
		this.selected = false;
		this.redraw(this.hexColor);
	}
	hide() {
		this.graphics.clear();
	}
	show() {
		this.deselect();
	}
	toggle() {
		if (this.selected) {
			this.deselect();
		} else {
			this.select();
		}
	}
}
export class TextRect extends DoubleRect {
	textObj: Phaser.GameObjects.Text;
	constructor(
		sceneToUse: HUD,
		x: number,
		y: number,
		width: number,
		height: number,
		hexColor: number,
		private text: string,
		textOptions
	) {
		super(sceneToUse, x, y, width, height, hexColor);
		this.textObj = this.sceneToUse.add.text(this.x - 20, this.y - 22, this.text, textOptions);
		this.hide();
	}

	hide() {
		super.hide();
		this.textObj.setText("");
	}

	show() {
		super.show();
		this.textObj.setText(this.text);
	}
}

export class ClickableTextRect extends TextRect {
	mouseOver = false;

	constructor(sceneToUse: HUD, x: number, y: number, width: number, height: number, hexColor: number, text: string) {
		super(sceneToUse, x, y, width, height, hexColor, text, {
			font: "20px Verdana ",
			fill: "#000000",
			fontWeight: "bold"
		});
		this.graphics.once("pointerover", this.pointerOver.bind(this));
	}

	pointerOver() {
		this.mouseOver = true;
		this.graphics.once("pointerout", this.pointerOut.bind(this));
	}

	pointerOut() {
		this.mouseOver = false;
		this.graphics.once("pointerover", this.pointerOver.bind(this));
	}

	setInteractive(event, func) {
		this.graphics.setInteractive(
			new Phaser.Geom.Rectangle(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height),
			Phaser.Geom.Rectangle.Contains
		);
		this.graphics.on(event, func);
	}

	hide() {
		super.hide();
		this.graphics.disableInteractive();
	}

	show() {
		super.show();
		this.graphics.setInteractive();
	}
}

export class ImageRect extends DoubleRect {
	image: Phaser.Physics.Arcade.Image;
	constructor(sceneToUse: HUD, x: number, y: number, width: number, height: number, hexColor: number, texture: string) {
		super(sceneToUse, x, y, width, height, hexColor);
		this.image = new Phaser.Physics.Arcade.Image(sceneToUse, x, y, texture);
		this.image.setScale(0.5, 0.5);
		sceneToUse.add.existing(this.image);
		this.hide();
	}
	hide() {
		super.hide();
		this.image.setVisible(false).setActive(false);
	}
	show() {
		super.show();
		this.image.setVisible(true).setActive(true);
	}
}

export class ClickableImageRect extends ImageRect {
	mouseOver = false;

	constructor(sceneToUse: HUD, x: number, y: number, width: number, height: number, hexColor: number, texture: string) {
		super(sceneToUse, x, y, width, height, hexColor, texture);
		this.image.setInteractive();
		this.image.once("pointerover", this.pointerOver.bind(this));
	}

	pointerOver() {
		this.mouseOver = true;
		this.image.once("pointerout", this.pointerOut.bind(this));
	}

	pointerOut() {
		this.mouseOver = false;
		this.image.once("pointerover", this.pointerOver.bind(this));
	}

	setInteractive(event, func) {
		this.image.on(event, func);
		this.graphics.setInteractive(
			new Phaser.Geom.Rectangle(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height),
			Phaser.Geom.Rectangle.Contains
		);
		this.graphics.on(event, func);
	}
}
