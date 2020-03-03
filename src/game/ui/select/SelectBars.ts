import { TowerSelectBar } from "./TowerSelectBar";
import { SelectBar } from "./SelectBar";

export class SelectBars {
	constructor(
		private healerSelectBar: TowerSelectBar,
		private shooterSelectBar: TowerSelectBar,
		private interactionSelectBar: SelectBar
	) {}
	showHealerBar() {
		this.healerSelectBar.show();
	}
	hideHealerBar() {
		this.healerSelectBar.hide();
	}
	showShooterBar() {
		this.shooterSelectBar.show();
	}
	hideShooterBar() {
		this.shooterSelectBar.hide();
	}
	showInteractionBar() {
		this.interactionSelectBar.show();
	}
	hideInteractionBar() {
		this.interactionSelectBar.hide();
	}
	hide() {
		this.shooterSelectBar.hide();
		this.healerSelectBar.hide();
		this.hideInteractionBar();
	}
}
