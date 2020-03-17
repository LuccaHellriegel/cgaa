import { HUD } from "../../../scenes/HUD";
import { Rect } from "../Rect";
import { SelectBar } from "./SelectBar";
import { UnitCompositeRect } from "../CompositeRect";
import { TextGUIElement } from "./TextGUIElement";
export class BuildBar extends SelectBar {
	textEle: TextGUIElement;
	constructor(sceneToUse: HUD, x, y) {
		let baseRect = new Rect(sceneToUse, x, y, 80, 230, 0xd3d3d3);

		let healerRect = new UnitCompositeRect(sceneToUse, "healer", x + 5, y + 15);
		let shooterRect = new UnitCompositeRect(sceneToUse, "shooter", x + 5, y + 80);
		super(baseRect, [healerRect, shooterRect]);

		this.textEle = new TextGUIElement(sceneToUse, "Build", x - 30, y - 35, {
			font: "20px Verdana ",
			fill: "#000000",
			fontWeight: "bold"
		});

		this.textEle.hide();
	}

	hide() {
		super.hide();
		this.textEle.hide();
	}

	show() {
		super.show();
		this.textEle.show();
	}
}
