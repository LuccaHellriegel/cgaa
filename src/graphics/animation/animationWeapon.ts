import { circleSizeNames } from "../../game/base/globals/globalSizes";
import { createNonRepeatingAnim } from "./animationBase";

export function createWeaponAnims(anims) {
	let speedPerSize = {
		Small: 20,
		Normal: 8,
		Big: 5
	};

	for (let index = 0; index < circleSizeNames.length; index++) {
		const element = circleSizeNames[index];
		createNonRepeatingAnim(anims, "idle-" + element + "randWeapon", element + "randWeapon", 1, 1, 10);
		createNonRepeatingAnim(
			anims,
			"attack-" + element + "randWeapon",
			element + "randWeapon",
			1,
			2,
			speedPerSize[element]
		);
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
