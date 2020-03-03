import { ClickableImageRect } from "../DoubleRect";
import { HUD } from "../../../scenes/HUD";
import { Rect } from "../Rect";
import { SelectBar } from "./SelectBar";
export class InteractionSelectBar extends SelectBar {
	constructor(sceneToUse: HUD, x, y) {
		let baseRect = new Rect(sceneToUse, x, y, 180, 80, 0xd3d3d3);
		//TODO: Interaction Button
		let sell = "sell" + "healer";
		let sellRect = new ClickableImageRect(sceneToUse, x - 60, y, 60, 60, 0xffffff, sell);
		super(baseRect, [sellRect]);
	}
}
