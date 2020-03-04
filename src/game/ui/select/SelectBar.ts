import { Point } from "../../base/types";

export interface GUIElement {
	x?: number;
	y?: number;
	show();
	hide();
	move?(x: number, y: number);
}

export interface selectable {
	select();
	deselect();
}

export interface SelectableGUIElement extends GUIElement, selectable {}

export type Arrangement = Point[];

export abstract class SelectBar implements GUIElement {
	x: number;
	y: number;
	isOn = false;

	constructor(private baseElement: GUIElement, public contentElements: GUIElement[]) {
		this.x = baseElement.x;
		this.y = baseElement.y;
	}

	show() {
		this.isOn = true;
		this.baseElement.show();
		this.contentElements.forEach(ele => ele.show());
	}

	hide() {
		this.isOn = false;
		this.baseElement.hide();
		this.contentElements.forEach(ele => ele.hide());
	}

	move(x: number, y: number) {
		let diffX = x - this.baseElement.x;
		let diffY = y - this.baseElement.y;

		this.baseElement.move(x, y);
		this.x = x;
		this.y = y;

		this.contentElements.forEach(ele => {
			let newX = ele.x + diffX;
			let newY = ele.y + diffY;
			ele.move(newX, newY);
		});
	}

	toggle() {
		if (this.isOn) {
			this.hide();
		} else {
			this.show();
		}
	}
}
