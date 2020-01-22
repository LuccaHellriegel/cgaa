import { InteractionModus } from "./interaction/InteractionModus";
import { TowerModus } from "./tower/TowerModus";
import { GhostTower } from "./GhostTower";

export class Modi {
	private mode = "off";
	private lock = false;
	private modeMap = { interaction: {}, tower: {} };

	public keyObjInteraction;
	public keyObjTower;
	public keyObjLock;

	constructor(
		input,
		private towerModus: TowerModus,
		private interactionModus: InteractionModus,
		private ghostTower: GhostTower
	) {
		this.setupKeys(input);

		this.modeMap.interaction = ghostTower.interactionModusOn.bind(ghostTower);
		this.modeMap.tower = ghostTower.towerModusOn.bind(ghostTower);

		this.setupEvents();
	}

	private setupKeys(input) {
		this.keyObjTower = input.keyboard.addKey("F");
		this.keyObjInteraction = input.keyboard.addKey("E");
		this.keyObjLock = input.keyboard.addKey("R");
	}

	private setupEvents() {
		this.keyObjInteraction.on("down", this.interactionKeyPress.bind(this));
		this.keyObjTower.on("down", this.towerKeyPress.bind(this));
		this.keyObjLock.on("down", this.lockKeyPress.bind(this));
	}

	private interactionKeyPress() {
		if (this.mode === "interaction") {
			this.modeOff();
		} else {
			this.modeOn("interaction");
		}
	}

	private towerKeyPress() {
		if (this.mode === "tower") {
			this.modeOff();
		} else {
			this.modeOn("tower");
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
		this.ghostTower.turnOff();
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
		this.ghostTower.lockOff();
	}

	private lockOn() {
		if (this.mode === "tower") {
			this.towerModus.lockOn(this.ghostTower);
		} else if (this.mode === "interaction") {
			this.interactionModus.lockOn(this.ghostTower);
		}
		this.ghostTower.lockOn();
		this.lock = true;
	}

	click() {
		if (this.mode === "interaction") {
			this.interactionModus.execute(this.ghostTower, this.lock);
		} else if (this.mode === "tower") {
			this.towerModus.execute(this.ghostTower, this.lock);
		} else {
			return false;
		}

		return true;
	}
}
