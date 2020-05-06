import { Shooter } from "../../tower/shooter/Shooter";
import { Healer } from "../../tower/healer/Healer";
import { SelectorRect } from "../../modi/SelectorRect";
import { TowerSelectBar } from "./bars/TowerSelectBar";
import { InteractionSelectBar } from "./bars/InteractionSelectBar";
export class SelectionManager {
	selectedUnit;
	healerSelectBar: TowerSelectBar;
	shooterSelectBar: TowerSelectBar;
	interactionSelectBar: InteractionSelectBar;

	constructor(private selectorRect: SelectorRect) {}
	setSelectBars(
		healerSelectBar: TowerSelectBar,
		shooterSelectBar: TowerSelectBar,
		interactionSelectBar: InteractionSelectBar
	) {
		this.healerSelectBar = healerSelectBar;
		this.shooterSelectBar = shooterSelectBar;
		this.interactionSelectBar = interactionSelectBar;
	}

	select(unit) {
		this.selectedUnit = unit;
		this.lockOn();

		if (unit instanceof Shooter) {
			this.shooterSelectBar.show();
		} else if (unit instanceof Healer) {
			this.healerSelectBar.show();
		} else {
			this.interactionSelectBar.show();
		}
	}

	lockOn() {
		this.selectorRect.setPosition(this.selectedUnit.x, this.selectedUnit.y);
		this.selectorRect.setVisible(true).setActive(false);
	}
}
