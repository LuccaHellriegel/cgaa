import { InteractionModus } from "./interaction/InteractionModus";
import { TowerModus } from "./tower/TowerModus";
import { GhostTower } from "./GhostTower";

export class Modi {
	private mode = "off";
	private lock = false;
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
		this.setupEvents();
	}

	private setupKeys(input) {
		this.keyObjTower = input.keyboard.addKey("F");
		this.keyObjInteraction = input.keyboard.addKey("E");
		this.keyObjLock = input.keyboard.addKey("R");
	}

	private setupEvents() {
		this.keyObjInteraction.on("down", () => {
			if (this.mode === "off") {
				this.ghostTower.toggle();
				this.ghostTower.interactionModusOn();
				this.mode = "interaction";
			} else if (this.mode === "interaction") {
				this.ghostTower.toggle();
				this.mode = "off";
			} else {
				this.ghostTower.interactionModusOn();
				this.ghostTower.lockOff();
				this.mode = "interaction";
			}
		});

		this.keyObjTower.on("down", () => {
			if (this.mode === "off") {
				this.ghostTower.toggle();
				this.ghostTower.towerModusOn();
				this.mode = "tower";
			} else if (this.mode === "tower") {
				this.ghostTower.toggle();
				this.mode = "off";
			} else {
				this.ghostTower.towerModusOn();
				this.ghostTower.lockOff();
				this.mode = "tower";
			}
		});

		this.keyObjLock.on("down", () => {
			if (this.mode === "tower") {
				this.towerModus.lockOn(this.ghostTower);
			} else {
				this.interactionModus.lockOn(this.ghostTower);
			}
			this.lock = !this.lock;
			this.ghostTower.toggleLock();
		});
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
