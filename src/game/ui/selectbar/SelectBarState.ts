import { Inputs } from "../../input/Inputs";
import { SelectorRect } from "../../modi/SelectorRect";

export class SelectBarState {
	curSelected = 0;
	isActive = false;
	isLocked = false;

	constructor(
		private funcs: Function[],
		private lockedFuncs: Function[],
		private lockFuncs: Function[],
		inputs: Inputs,
		private selectorRect: SelectorRect
	) {
		inputs.rKey.on("down", this.toogleLock.bind(this));

		//Switching between modes turns lock off
		inputs.qKey.on("down", this.lockOff.bind(this));
		inputs.oneKey.on("down", this.lockOff.bind(this));
		inputs.twoKey.on("down", this.lockOff.bind(this));
		inputs.threeKey.on("down", this.lockOff.bind(this));
	}

	lockOff() {
		this.isLocked = false;
	}

	select(index: number) {
		this.curSelected = index;
	}

	toogleLock() {
		this.isLocked = !this.isLocked;
		if (this.isLocked) {
			this.lockFuncs[this.curSelected]();
		} else {
			this.selectorRect.lockOff();
		}
	}

	execute() {
		console.log(this.isLocked);
		if (this.isLocked) {
			this.lockedFuncs[this.curSelected]();
		} else {
			this.funcs[this.curSelected]();
		}
	}

	activate() {
		this.isActive = true;
		this.isLocked = false;
	}

	deactivate() {
		this.isActive = false;
	}
}
