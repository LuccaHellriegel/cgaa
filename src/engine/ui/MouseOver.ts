import { IEventHandler } from "../events/IEventHandler";

export interface IMouseOver {
	mouseOver: boolean;
}

export class MouseOver {
	constructor(private boolObj: IMouseOver, private eventObj: IEventHandler) {
		eventObj.once("pointerover", this.pointerOver.bind(this));
	}

	pointerOver() {
		this.boolObj.mouseOver = true;
		this.eventObj.once("pointerout", this.pointerOut.bind(this));
	}

	pointerOut() {
		this.boolObj.mouseOver = false;
		this.eventObj.once("pointerover", this.pointerOver.bind(this));
	}
}
