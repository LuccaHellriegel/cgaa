import { RandWeaponGenerator } from "./generator/weapons/RandWeaponGenerator";
import { ChainWeaponGenerator } from "./generator/weapons/ChainWeaponGenerator";
import { CircleGenerator } from "./generator/unit/CircleGenerator";
import { UnitSetup } from "../../game/setup/UnitSetup";

export function generateWeapons(scene) {
	for (let index = 0; index < UnitSetup.circleSizeNames.length; index++) {
		const element = UnitSetup.circleSizeNames[index];
		new RandWeaponGenerator(0x6495ed, scene, element);
		new ChainWeaponGenerator(0xff0000, scene, element);
	}

	new CircleGenerator(0x6495ed, scene, "bullet", UnitSetup.normalCircleRadius / 4);
}
