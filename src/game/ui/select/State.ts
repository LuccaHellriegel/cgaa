import { Gameplay } from "../../../scenes/Gameplay";
import { BuildBar } from "./BuildBar";
import { TowerSelectBar } from "./TowerSelectBar";
import { SelectorRect } from "../../modi/SelectorRect";
import { UIState } from "./UIState";
export type State = "build" | "attack" | "select";
export class Inputs {
	constructor(
		scene: Gameplay,
		ui: UIState,
		buildBar: BuildBar,
		towerSelectBars: TowerSelectBar[],
		selectorRect: SelectorRect
	) {
		let fKey = scene.input.keyboard.addKey("F");
		fKey.on("down", function() {
			ui.toggle();
			if (buildBar.isOn) selectorRect.turnOff();
			buildBar.toggle();
			let isOn = towerSelectBars.reduce((prev, bar) => prev || bar.isOn, false);
			if (isOn) {
				towerSelectBars.forEach(bar => bar.hide());
			}
			scene.cgaa.player.weapon.toggle();
		});
	}
}
