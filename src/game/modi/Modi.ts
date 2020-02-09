import { InteractionModus } from "./interaction/InteractionModus";
import { BuildModus } from "./build/BuildModus";
import { SelectorRect } from "./SelectorRect";
import { Inputs } from "../input/Inputs";
import { ModiState } from "./ModiState";

export class Modi {
	private state = new ModiState();
	private modeMap = { interaction: {}, build: {} };

	constructor(
		inputs: Inputs,
		private buildModus: BuildModus,
		private interactionModus: InteractionModus,
		private selectorRect: SelectorRect
	) {
		this.modeMap.interaction = selectorRect.interactionModusOn.bind(selectorRect);
		this.modeMap.build = selectorRect.buildModusOn.bind(selectorRect);

		this.setupEvents(inputs);
	}

	private setupEvents(inputs: Inputs) {
		inputs.eKey.on("down", this.interactionKeyPress.bind(this));
		inputs.fKey.on("down", this.buildKeyPress.bind(this));
		inputs.rKey.on("down", this.lockKeyPress.bind(this));
		inputs.qKey.on("down", this.buildShift.bind(this));
	}

	private interactionKeyPress() {
		if (this.state.mode === "interaction") {
			this.modeOff();
		} else {
			this.modeOn("interaction");
		}
	}

	private buildKeyPress() {
		if (this.state.mode === "build") {
			this.modeOff();
		} else {
			this.modeOn("build");
		}
	}

	private buildShift() {
		if (this.state.mode === "build") {
			this.selectorRect.buildShift();
			this.state.build = !this.state.build;
		}
	}

	modeOn(mode) {
		this.state.mode = mode;
		this.modeMap[mode]();
		this.lockOff();
	}

	modeOff() {
		this.state.mode = "off";
		this.lockOff();
		this.selectorRect.turnOff();
	}

	private lockKeyPress() {
		if (this.state.mode !== "off") {
			if (this.state.lock) {
				this.lockOff();
			} else {
				this.lockOn();
			}
		}
	}

	lockOff() {
		this.state.lock = false;
		this.selectorRect.lockOff();
	}

	private lockOn() {
		if (this.state.mode === "build") {
			this.buildModus.lockOn(this.selectorRect);
		} else if (this.state.mode === "interaction") {
			this.interactionModus.lockOn(this.selectorRect);
		}
		this.selectorRect.lockOn();
		this.state.lock = true;
	}

	click() {
		if (this.state.mode === "interaction") {
			this.interactionModus.execute(this.selectorRect, this.state);
			this.lockOff();
		} else if (this.state.mode === "build") {
			this.buildModus.execute(this.selectorRect, this.state);
			this.lockOff();
		} else {
			return false;
		}

		return true;
	}
}
