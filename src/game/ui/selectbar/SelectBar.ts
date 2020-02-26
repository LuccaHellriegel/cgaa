import { HUD } from "../../../scenes/HUD";
import { Inputs } from "../../input/Inputs";
import { TextRect, ImageRect, DoubleRect } from "../DoubleRect";
import { SelectBarState } from "./SelectBarState";

//TODO: maybe show selected option in SelectorRect?

export class SelectBar {
	rects: DoubleRect[] = [];
	curSelected = 0;
	showing = false;
	constructor(sceneToUse: HUD, startX: number, startY: number, inputs: Inputs, private state: SelectBarState) {
		for (let index = 0; index < 3; index++) {
			let x = startX + 30 + 5 + index * 2 * 30 + index * 10;
			if (index == 0) this.rects.push(new TextRect(sceneToUse, x, startY, 60, 60, 0xffffff, "I"));
			if (index == 1) this.rects.push(new ImageRect(sceneToUse, x, startY, 60, 60, 0xffffff, "healer"));
			if (index == 2) this.rects.push(new ImageRect(sceneToUse, x, startY, 60, 60, 0xffffff, "shooter"));
		}

		this.hide();

		inputs.qKey.on("down", this.shiftSelect.bind(this));
		inputs.fKey.on("down", this.toggle.bind(this));

		let numberFuncGen = numb => {
			return function() {
				this.select(numb);
			}.bind(this);
		};

		inputs.oneKey.on("down", numberFuncGen(0));
		inputs.twoKey.on("down", numberFuncGen(1));
		inputs.threeKey.on("down", numberFuncGen(2));
	}

	toggle() {
		if (this.showing) {
			this.state.deactivate();
			this.hide();
			this.showing = false;
		} else {
			this.showing = true;
			this.state.activate();
			this.show();
		}
	}

	shiftSelect() {
		if (this.showing) {
			this.rects[this.curSelected].deselect();
			this.curSelected++;
			if (this.curSelected == this.rects.length) this.curSelected = 0;
			this.rects[this.curSelected].select();
		}
	}

	select(index: number) {
		if (this.showing) {
			this.rects[this.curSelected].deselect();
			this.rects[index].select();
			this.state.select(index);
			this.curSelected = index;
		}
	}

	hide() {
		this.rects.forEach(rect => {
			rect.hide();
		});
	}

	show() {
		this.rects.forEach(rect => {
			rect.show();
		});
		this.select(this.curSelected);
	}
}
