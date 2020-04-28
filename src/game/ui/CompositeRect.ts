import { HUD } from "../../scenes/HUD";
import { SelectableGUIElement, GUIElement, selectable } from "./select/SelectBar";
import { TextGUIElement } from "./select/TextGUIElement";
import { ClickableImageRect } from "./DoubleRect";
class CompositeRect implements SelectableGUIElement {
	selected = false;

	constructor(protected sele: selectable, public rects: GUIElement[]) {}
	show() {
		this.rects.forEach((rect) => rect.show());
	}
	hide() {
		this.rects.forEach((rect) => rect.hide());
	}
	select() {
		this.selected = true;
		this.sele.select();
	}
	deselect() {
		this.selected = false;
		this.sele.deselect();
	}

	toggle() {
		if (this.selected) {
			this.deselect();
		} else {
			this.select();
		}
	}
}
export class UnitCompositeRect extends CompositeRect {
	constructor(sceneToUse: HUD, title: string, x, y) {
		let unitRect = new ClickableImageRect(sceneToUse, x, y, 70, 70, 0xffffff, title);
		unitRect.image.setScale(0.5, 0.5);
		unitRect.image.setPosition(unitRect.image.x, unitRect.image.y + 8);
		unitRect.hide();
		let titleEle = new TextGUIElement(sceneToUse, title[0].toUpperCase() + title.slice(1), x - 29, y - 30, {
			font: "20px Verdana ",
			fill: "#000000",
			fontWeight: "bold",
		});
		super(unitRect, [unitRect, titleEle]);
	}

	setInteractive(event, func) {
		(this.sele as ClickableImageRect).setInteractive(event, func);
	}
}
