import { ClosestSelector } from "./Selector";
import { EnvSetup } from "../../setup/EnvSetup";
import { Shooter } from "../../tower/shooter/Shooter";
import { Healer } from "../../tower/healer/Healer";
import { SelectBars } from "./SelectBars";
import { SelectorRect } from "../../modi/SelectorRect";
export class SelectionManager {
	selectedUnit;
	private selectBars: SelectBars;
	constructor(private selector: ClosestSelector, private selectorRect: SelectorRect) {}
	setSelectBars(selectBars: SelectBars) {
		this.selectBars = selectBars;
	}

	down() {
		if (this.selectedUnit) {
			this.selectedUnit = null;
			this.selectorRect.setActive(true);
			this.selectBars.hide();
		} else {
			let result = this.selector.select(this.selectorRect);
			if (result && result[1] < EnvSetup.halfGridPartSize) {
				this.selectBars.hide();

				//Turn on but not active because rect should be fixed on selected unit
				this.selectorRect.setPosition(result[0].x, result[0].y);
				this.selectorRect.setVisible(true).setActive(false);

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
}
