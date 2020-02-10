import { HUD } from "../../../scenes/HUD";
import { RectPolygon } from "../../polygons/RectPolygon";
import { Inputs } from "../../input/Inputs";

//TODO: bar via numbers (1-5...)

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

export class SelectBar {
	rects: Rect[] = [];
	curSelected = 0;
	showing = false;
	constructor(sceneToUse: HUD, startX: number, startY: number, inputs: Inputs) {
		for (let index = 0; index < 3; index++) {
			let x = startX + 30 + 5 + index * 2 * 30 + index * 10;
			if (index == 0) this.rects.push(new TextRect(sceneToUse, x, startY, 60, 60, 0xffffff, "I"));
			if (index == 1) this.rects.push(new ImageRect(sceneToUse, x, startY, 60, 60, 0xffffff, "healer"));
			if (index == 2) this.rects.push(new ImageRect(sceneToUse, x, startY, 60, 60, 0xffffff, "shooter"));
		}

		this.hide();

		inputs.qKey.on("down", this.shiftSelect.bind(this));
		inputs.fKey.on("down", this.toggle.bind(this));
	}

	toggle() {
		if (this.showing) {
			this.hide();
		} else {
			this.show();
		}

		this.showing = !this.showing;
	}

	shiftSelect() {
		this.rects[this.curSelected].deselect();
		this.curSelected++;
		if (this.curSelected == this.rects.length) this.curSelected = 0;
		this.rects[this.curSelected].select();
	}

	select(index: number) {
		this.rects[this.curSelected].deselect();
		this.rects[index].select();
		this.curSelected = index;
	}

	hide() {
		this.rects.forEach(rect => {
			rect.hide();
		});
	}

	show() {
		this.rects.forEach(rect => {
			rect.show();
		});
		this.select(this.curSelected);
	}
}
