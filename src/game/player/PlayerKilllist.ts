import { RectPolygon } from "../base/polygons/RectPolygon";
import { Gameplay } from "../../scenes/Gameplay";
import { HUD } from "../../scenes/HUD";

export class PlayerKilllist {
	playerKilllistText: Phaser.GameObjects.Text;
	colors: string[] = [];

	constructor(x, y, sceneToUse: HUD, sceneToListen: Gameplay) {
		let listBackground = new RectPolygon(x, y, 60, 120);

		let graphics = sceneToUse.add.graphics({
			fillStyle: {
				color: 0x228b22
			}
		});

		listBackground.draw(graphics, 0);
		this.playerKilllistText = sceneToUse.add.text(x - 25, y - 55, "", {
			font: "20px Verdana",
			fill: "#ADFF2F"
		});
		sceneToListen.events.on("added-to-killlist", color => {
			//TODO: multiple colors
			this.colors.push(color);
			this.redrawList();
		});

		sceneToListen.events.on("cooperation-established", color => {
			let index = this.colors.indexOf(color);
			this.colors.splice(index, 1);
			this.redrawList();
		});
	}

	reset() {
		this.colors = [];
		this.redrawList();
	}

	private redrawList() {
		let colorStr = "";
		this.colors.forEach(col => {
			colorStr += col + " \n ";
		});
		this.playerKilllistText.setText(colorStr);
	}
}
