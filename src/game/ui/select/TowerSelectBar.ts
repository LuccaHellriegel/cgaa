import { ImageRect, ClickableImageRect } from "../DoubleRect";
import { HUD } from "../../../scenes/HUD";
import { Rect } from "../Rect";
import { SelectBar } from "./SelectBar";
export class TowerSelectBar extends SelectBar {
	constructor(sceneToUse: HUD, x, y, textureBase: string) {
		let baseRect = new Rect(sceneToUse, x, y, 180, 80, 0xd3d3d3);
		let sell = "sell" + textureBase;
		//let upgrade = "upgrade" + textureBase;
		let sellRect = new ClickableImageRect(sceneToUse, x - 60, y, 60, 60, 0xffffff, sell);
		//	let upgradeRect = new ClickableImageRect(sceneToUse, x + 30, y, 60, 60, 0xffffff, upgrade, funcs[1]);
		super(baseRect, [sellRect]);
	}
}
