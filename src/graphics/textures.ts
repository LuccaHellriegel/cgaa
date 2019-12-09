import { RandWeaponGenerator } from "./generators/weapons/RandWeaponGenerator";
import { CircleGenerator } from "./generators/CircleGenerator";
import { normalCircleRadius, wallPartHalfSize } from "../globals/globalSizes";
import { ChainWeaponGenerator } from "./generators/weapons/ChainWeaponGenerator";
import { BuildingGenerator } from "./generators/BuildingGenerator";
import { RectGenerator } from "./generators/RectGenerator";
import { GhostTowerGenerator } from "./generators/GhostTowerGenerator";
import { campHexColors } from "../globals/globalColors";
import { circleSizes } from "../globals/globalSizes";
import { executeOverAllCampsAndSizes, executeOverAllCamps } from "../globals/global";

export function generateTextures(scene) {
	new RectGenerator(
		scene,
		0x013220,
		"tower",
		1.5 * wallPartHalfSize,
		1.5 * wallPartHalfSize,
		3 * wallPartHalfSize,
		3 * wallPartHalfSize
	);
	new GhostTowerGenerator(scene);
	generateUnits(scene);
	generateWeapons(scene);
	generateEnvironment(scene);
}

function generateWeapons(scene) {
	new RandWeaponGenerator(0x6495ed, scene);
	new ChainWeaponGenerator(0xff0000, scene);
	new CircleGenerator(0x6495ed, scene, "bullet", normalCircleRadius / 4);
}

function generateUnits(scene) {
	new CircleGenerator(0x6495ed, scene, "blueCircle", normalCircleRadius);

	executeOverAllCampsAndSizes((color, colorIndex, sizeName, sizeNameIndex) => {
		let title = color + sizeName + "Circle";
		new CircleGenerator(campHexColors[colorIndex], scene, title, circleSizes[sizeNameIndex]);
	});

	executeOverAllCamps((color, colorIndex) => {
		new BuildingGenerator(scene, color + "Building", campHexColors[colorIndex]);
	});
}

function generateEnvironment(scene) {
	new RectGenerator(
		scene,
		0xa9a9a9,
		"wallPart",
		wallPartHalfSize,
		wallPartHalfSize,
		2 * wallPartHalfSize,
		2 * wallPartHalfSize
	);
}
