import { createNonRepeatingAnim } from "./animationBase";
import { executeOverAllCamps, executeOverAllCampsAndSizes } from "../../game/base/globals/global";

function baseIdleDamageAnim(anims, title) {
	createNonRepeatingAnim(anims, "idle-" + title, title, 1, 1, 10);
	createNonRepeatingAnim(anims, "damage-" + title, title, 1, 2, 10);
}

export function createCircleAnims(anims) {
	["blueCircle", "blueBigCircle", "bossCircle", "kingCircle"].forEach(title => {
		baseIdleDamageAnim(anims, title);
	});

	executeOverAllCamps((color, colorIndex) => {
		let title = color + "InteractionCircle";
		baseIdleDamageAnim(anims, title);
	});

	executeOverAllCampsAndSizes((color, colorIndex, sizeName, sizeNameIndex) => {
		let title = color + sizeName + "Circle";
		baseIdleDamageAnim(anims, title);
	});
}
