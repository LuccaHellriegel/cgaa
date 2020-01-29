import { createNonRepeatingAnim } from "./animationBase";
import { executeOverAllCamps, executeOverAllCampsAndSizes } from "../../game/base/globals/global";

export function createCircleAnims(anims) {
	createNonRepeatingAnim(anims, "idle-blueCircle", "blueCircle", 1, 1, 10);
	createNonRepeatingAnim(anims, "damage-blueCircle", "blueCircle", 1, 2, 10);

	executeOverAllCamps((color, colorIndex) => {
		let title = color + "InteractionCircle";
		createNonRepeatingAnim(anims, "idle-" + title, title, 1, 1, 10);
		createNonRepeatingAnim(anims, "damage-" + title, title, 1, 2, 10);
	});

	executeOverAllCampsAndSizes((color, colorIndex, sizeName, sizeNameIndex) => {
		let title = color + sizeName + "Circle";
		createNonRepeatingAnim(anims, "idle-" + title, title, 1, 1, 10);
		createNonRepeatingAnim(anims, "damage-" + title, title, 1, 2, 10);
	});

	let title = "bossCircle";
	createNonRepeatingAnim(anims, "idle-" + title, title, 1, 1, 10);
	createNonRepeatingAnim(anims, "damage-" + title, title, 1, 2, 10);

	title = "kingCircle";
	createNonRepeatingAnim(anims, "idle-" + title, title, 1, 1, 10);
	createNonRepeatingAnim(anims, "damage-" + title, title, 1, 2, 10);
}
