import { HUD } from "../../scenes/HUD";
import { RectPolygon } from "../0_GameBase/engine/polygons/RectPolygon";

export class Popup {
	graphics: Phaser.GameObjects.Graphics;
	constructor(scene: HUD, x, y, width, height, private textObj: Phaser.GameObjects.Text) {
		this.graphics = scene.add.graphics({});
		let polygon = new RectPolygon(x, y, width, height);
		polygon.draw(this.graphics, 0);
		scene.children.bringToTop(textObj);
		scene.ourGame.input.once("pointerdown", this.close.bind(this));
	}

	close() {
		this.graphics.clear();
		this.textObj.destroy();
	}

	static startPopup(scene: HUD, x, y) {
		let width = 465;
		let height = 150;
		let textObj = scene.add.text(
			x - 230,
			y - 70,
			"Help!\nYour friends are getting ambushed.\nIf they die, all is lost!\nDefeat/Convince the Camps and kill the king!\n(Click to close)",
			{
				font: "25px Verdana ",
				fill: "#ffffff",
				fontWeight: "bold",
			}
		);
		new Popup(scene, x, y, width, height, textObj);
	}

	static winPopup(scene: HUD, x, y) {
		let width = 290;
		let height = 170;
		let textObj = scene.add.text(
			x - 140,
			y - 85,
			"Congratulations!\nYou have defeated the king.\nYou saved your friends.\nNow you are:\nThe King Of The Arena\n(Reload site to restart)",
			{
				font: "25px Verdana ",
				fill: "#ffffff",
				fontWeight: "bold",
			}
		);
		new Popup(scene, x, y, width, height, textObj);
	}

	static losePopup(scene: HUD, x, y) {
		let width = 240;
		let height = 90;
		let textObj = scene.add.text(x - 115, y - 45, "Oh no!\nGame Over Comrades.\n(Reload site to restart)", {
			font: "25px Verdana ",
			fill: "#ffffff",
			fontWeight: "bold",
		});
		new Popup(scene, x, y, width, height, textObj);
	}

	static kingPopup(scene: HUD, x, y) {
		let width = 355;
		let height = 60;
		let textObj = scene.add.text(x - 175, y - 32, "The doors to the king have opened.\n(Click to close)", {
			font: "25px Verdana ",
			fill: "#ffffff",
			fontWeight: "bold",
		});
		new Popup(scene, x, y, width, height, textObj);
	}
}
