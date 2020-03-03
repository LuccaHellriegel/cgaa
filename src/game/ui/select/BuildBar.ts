import { ClickableImageRect } from "../DoubleRect";
import { HUD } from "../../../scenes/HUD";
import { Rect } from "../Rect";
import { SelectBar } from "./SelectBar";
export class BuildBar extends SelectBar {
	constructor(sceneToUse: HUD, x, y) {
		let baseRect = new Rect(sceneToUse, x, y, 80, 230, 0xd3d3d3);
		let healerRect = new ClickableImageRect(sceneToUse, x + 5, y, 60, 60, 0xffffff, "healer");
		let shooterRect = new ClickableImageRect(sceneToUse, x + 5, y + 80, 60, 60, 0xffffff, "shooter");
		super(baseRect, [healerRect, shooterRect]);
	}
}
