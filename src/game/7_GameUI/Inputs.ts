import { Gameplay } from "../../scenes/Gameplay";
import { BuildBar } from "./build/BuildBar";
import { TowerSelectBar } from "./select/bars/TowerSelectBar";
import { SelectorRect } from "./SelectorRect";
import { UIState } from "./UIState";
import { SelectionManager } from "./select/SelectionManager";
import { IMode, IModes } from "../0_GameBase/engine/ui/modes/IMode";
import { ClickModes } from "../0_GameBase/engine/ui/modes/ClickModes";
export class Inputs {
	static do(
		scene: Gameplay,
		ui: UIState,
		buildBar: BuildBar,
		towerSelectBars: TowerSelectBar[],
		selectorRect: SelectorRect,
		manager: SelectionManager
	) {
		let fKey = scene.input.keyboard.addKey("F");

		const attackMode: IMode = {
			enable: () => {
				scene.cgaa.player.weapon.setVisible(true);
			},
			disable: () => {
				scene.cgaa.player.weapon.setVisible(false);
			},
			execute: () => {},
		};

		const buildAndInteractionMode: IMode = {
			enable: () => {
				buildBar.show();
				ui.setState("select");
			},
			disable: () => {
				selectorRect.turnOff();
				buildBar.hide();
				ui.setState("attack");
				towerSelectBars.forEach((bar) => bar.hide());
			},
			execute: (unit) => {
				manager.select(unit);
			},
		};

		const modes = [attackMode, buildAndInteractionMode];
		return new ClickModes(
			(modes: IModes) => {
				fKey.on("down", () => {
					let index = modes.index + 1;
					if (index == modes.modesLength) index = 0;
					modes.index = index;
					modes.activeMode.disable();
					modes.activeMode = modes.modes[index];
					modes.activeMode.enable();
				});
			},
			0,
			modes
		);
	}
}
