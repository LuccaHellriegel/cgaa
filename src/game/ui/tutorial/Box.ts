import { Content } from "./Tutorial";
import { displayable } from "./TutorialStep";
import { RectPolygon } from "../../polygons/RectPolygon";
import { HUD } from "../../../scenes/HUD";

export class Box implements displayable {
	private polygon: RectPolygon;
	private container: Phaser.GameObjects.Text;

	constructor(x: number, y: number, private graphics: Phaser.GameObjects.Graphics, sceneToUse: HUD) {
		this.polygon = new RectPolygon(x, y, 2 * 200, 2 * 30);
		this.polygon.draw(this.graphics, 0);
		this.container = sceneToUse.add.text(x, y, "", {
			font: "20px Verdana",
			fill: "#ADFF2F"
		});
	}

	display(content: Content) {
		this.container.setPosition(content.position.x, content.position.y);
		this.container.setText(content.text);
	}

	destroy() {
		this.container.destroy();
		this.graphics.destroy();
	}
}
