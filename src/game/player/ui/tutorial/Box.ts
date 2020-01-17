import { RectPolygon } from "../../../base/polygons/RectPolygon";
import { HUD } from "../../../../scenes/HUD";

export class Box {
	private xContentOffset = 0;
	private yContentOffset = 0;
	private polygon: RectPolygon;
	private container: Phaser.GameObjects.Text;

	constructor(private x: number, private y: number, private graphics: Phaser.GameObjects.Graphics, sceneToUse: HUD) {
		this.polygon = new RectPolygon(x, y, 2 * 200, 2 * 30);
		this.polygon.draw(this.graphics, 0);
		this.container = sceneToUse.add.text(x - this.xContentOffset, y - this.yContentOffset, "", {
			font: "20px Verdana",
			fill: "#ADFF2F"
		});
	}

	draw(content) {
		this.container.setText(content);
	}

	destroy() {
		this.container.destroy();
		this.graphics.destroy();
	}
}
