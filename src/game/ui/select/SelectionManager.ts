import { ClosestSelector } from "./Selector";
import { EnvSetup } from "../../setup/EnvSetup";
import { Shooter } from "../../tower/shooter/Shooter";
import { Healer } from "../../tower/healer/Healer";
import { SelectBars } from "./SelectBars";
import { SelectorRect } from "../../modi/SelectorRect";
export class SelectionManager {
	selectedUnit;
	private selectBars: SelectBars;
	constructor(private selector: ClosestSelector, private selectorRect: SelectorRect) {
		//TODO: close when click somewhere else or on other unit
	}
	setSelectBars(selectBars: SelectBars) {
		this.selectBars = selectBars;
	}
	down() {
		let result = this.selector.select(this.selectorRect);
		if (result && result[1] < EnvSetup.halfGridPartSize) {
			this.selectBars.hide();
			this.selectorRect.setPosition(result[0].x, result[0].y);
			this.selectorRect.setVisible(true);
			this.selectedUnit = result[0];
			if (this.selectedUnit instanceof Shooter) {
				this.selectBars.showShooterBar();
			} else if (this.selectedUnit instanceof Healer) {
				this.selectBars.showHealerBar();
			} else {
				this.selectBars.showInteractionBar();
			}
		}
	}
}
