import { ClickableTextRect } from "../../DoubleRect";
import { HUD } from "../../../../scenes/HUD";
import { Rect } from "../../Rect";
import { SelectBar } from "../SelectBar";
import { UnitCompositeRect } from "../../CompositeRect";
export class InteractionSelectBar extends SelectBar {
	constructor(sceneToUse: HUD, x, y) {
		let baseRect = new Rect(sceneToUse, x, y, 180, 80, 0xd3d3d3);

		super(baseRect, [
			new ClickableTextRect(sceneToUse, x - 50, y, 60, 60, 0xffffff, "Accept\nQuest"),
			new UnitCompositeRect(sceneToUse, "healer", x + 40, y)
		]);
	}
}
//TODO: change text rect if quest fullfilled!
