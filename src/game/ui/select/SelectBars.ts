import { TowerSelectBar } from "./bars/TowerSelectBar";
import { InteractionSelectBar } from "./bars/InteractionSelectBar";

export class SelectBars {
	constructor(
		private healerSelectBar: TowerSelectBar,
		private shooterSelectBar: TowerSelectBar,
		private interactionSelectBar: InteractionSelectBar
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
