import { createNonRepeatingAnim } from "./animationBase";
import { UnitSetup } from "../../game/setup/UnitSetup";

export function createWeaponAnims(anims) {
	let speedPerSize = {
		Small: 20,
		Normal: 8,
		Big: 5
	};

	for (let index = 0; index < UnitSetup.circleSizeNames.length; index++) {
		const element = UnitSetup.circleSizeNames[index];
		createNonRepeatingAnim(anims, "idle-" + element + "chainWeapon", element + "chainWeapon", 1, 1, 10);
		createNonRepeatingAnim(
			anims,
			"attack-" + element + "chainWeapon",
			element + "chainWeapon",
			1,
			3,
			speedPerSize[element]
		);
	}
}
