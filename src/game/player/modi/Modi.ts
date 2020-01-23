import { InteractionModus } from "./interaction/InteractionModus";
import { BuildModus } from "./build/BuildModus";
import { SelectorRect } from "./SelectorRect";

export class Modi {
	private mode = "off";
	private lock = false;
	private modeMap = { interaction: {}, shooter: {} };

	public keyObjInteraction;
	public keyObjShooter;
	public keyObjLock;

	constructor(
		input,
		private buildModus: BuildModus,
		private interactionModus: InteractionModus,
		private selectorRect: SelectorRect
	) {
		this.setupKeys(input);

		this.modeMap.interaction = selectorRect.interactionModusOn.bind(selectorRect);
		this.modeMap.shooter = selectorRect.buildModusOn.bind(selectorRect);

		this.setupEvents();
	}

	private setupKeys(input) {
		this.keyObjShooter = input.keyboard.addKey("F");
		this.keyObjInteraction = input.keyboard.addKey("E");
		this.keyObjLock = input.keyboard.addKey("R");
	}

	private setupEvents() {
		this.keyObjInteraction.on("down", this.interactionKeyPress.bind(this));
		this.keyObjShooter.on("down", this.shooterKeyPress.bind(this));
		this.keyObjLock.on("down", this.lockKeyPress.bind(this));
	}

	private interactionKeyPress() {
		if (this.mode === "interaction") {
			this.modeOff();
		} else {
			this.modeOn("interaction");
		}
	}

	private shooterKeyPress() {
		if (this.mode === "shooter") {
			this.modeOff();
		} else {
			this.modeOn("shooter");
		}
	}

	private modeOn(mode) {
		this.mode = mode;
		this.modeMap[mode]();
		this.lockOff();
	}

	private modeOff() {
		this.mode = "off";
		this.lockOff();
		this.selectorRect.turnOff();
	}

	private lockKeyPress() {
		if (this.mode !== "off") {
			if (this.lock) {
				this.lockOff();
			} else {
				this.lockOn();
			}
		}
	}

	private lockOff() {
		this.lock = false;
		this.selectorRect.lockOff();
	}

	private lockOn() {
		if (this.mode === "shooter") {
			this.buildModus.lockOn(this.selectorRect);
		} else if (this.mode === "interaction") {
			this.interactionModus.lockOn(this.selectorRect);
		}
		this.selectorRect.lockOn();
		this.lock = true;
	}

	click() {
		if (this.mode === "interaction") {
			this.interactionModus.execute(this.selectorRect, this.lock);
			this.lockOff();
		} else if (this.mode === "shooter") {
			this.buildModus.execute(this.selectorRect, this.lock);
			this.lockOff();
		} else {
			return false;
		}

		return true;
	}
}
