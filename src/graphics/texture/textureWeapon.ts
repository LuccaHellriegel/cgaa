import { circleSizeNames, normalCircleRadius } from "../../game/base/globals/globalSizes";
import { RandWeaponGenerator } from "./generator/weapons/RandWeaponGenerator";
import { ChainWeaponGenerator } from "./generator/weapons/ChainWeaponGenerator";
import { CircleGenerator } from "./generator/unit/CircleGenerator";

export function generateWeapons(scene) {
	for (let index = 0; index < circleSizeNames.length; index++) {
		const element = circleSizeNames[index];
		new RandWeaponGenerator(0x6495ed, scene, element);
		new ChainWeaponGenerator(0xff0000, scene, element);
	}

	new CircleGenerator(0x6495ed, scene, "bullet", normalCircleRadius / 4);
}
