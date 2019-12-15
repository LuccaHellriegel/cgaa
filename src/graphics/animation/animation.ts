import { executeOverAllCampsAndSizes, executeOverAllCamps } from "../../game/base/globals/global";
import { circleSizeNames } from "../../game/base/globals/globalSizes";

function createNonRepeatingAnim(anims: Phaser.Animations.AnimationManager, key, texture, start, end, frameRate) {
	anims.create({
		key: key,
		frames: anims.generateFrameNumbers(texture, { start: start, end: end }),
		frameRate: frameRate,
		repeat: 0
	});
}

function createWeaponAnims(anims) {
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

function createCircleAnims(anims) {
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
}

export function createAnims(anims) {
	createWeaponAnims(anims);
	createCircleAnims(anims);
	createNonRepeatingAnim(anims, "invalid-tower-pos", "ghostTower", 1, 2, 8);
	createNonRepeatingAnim(anims, "idle-ghostTower", "ghostTower", 1, 1, 10);
}
