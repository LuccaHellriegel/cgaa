import { RandWeaponGenerator } from "./generators/weapons/RandWeaponGenerator";
import { CircleGenerator } from "./generators/CircleGenerator";
import { normalCircleRadius, circleSizeNames, gridPartHalfSize } from "../game/base/globals/globalSizes";
import { ChainWeaponGenerator } from "./generators/weapons/ChainWeaponGenerator";
import { BuildingGenerator } from "./generators/BuildingGenerator";
import { RectGenerator } from "./generators/RectGenerator";
import { GhostTowerGenerator } from "./generators/GhostTowerGenerator";
import { campHexColors } from "../game/base/globals/globalColors";
import { circleSizes } from "../game/base/globals/globalSizes";
import { executeOverAllCampsAndSizes } from "../game/base/globals/global";
import { SquareGenerator } from "./generators/SquareGenerator";
import { PathMarkingGenerator } from "./generators/PathMarkingGenerator";

export function generateTextures(scene) {
	new RectGenerator(
		scene,
		0x013220,
		"tower",
		gridPartHalfSize,
		gridPartHalfSize,
		2 * gridPartHalfSize,
		2 * gridPartHalfSize
	);
	new GhostTowerGenerator(scene);
	generateUnits(scene);
	generateWeapons(scene);
	generateEnvironment(scene);
}

function generateWeapons(scene) {
	for (let index = 0; index < circleSizeNames.length; index++) {
		const element = circleSizeNames[index];
		new RandWeaponGenerator(0x6495ed, scene, element);
		new ChainWeaponGenerator(0xff0000, scene, element);
	}

	new CircleGenerator(0x6495ed, scene, "bullet", normalCircleRadius / 4);
}

function generateUnits(scene) {
	new CircleGenerator(0x6495ed, scene, "blueCircle", normalCircleRadius);
	new SquareGenerator(scene);

	executeOverAllCampsAndSizes((color, colorIndex, sizeName, sizeNameIndex) => {
		let title = color + sizeName + "Circle";
		new CircleGenerator(campHexColors[colorIndex], scene, title, circleSizes[sizeNameIndex]);
	});

	executeOverAllCampsAndSizes((color, colorIndex, sizeName, sizeNameIndex) => {
		let title = color + sizeName + "Building";
		new BuildingGenerator(scene, title, campHexColors[colorIndex], sizeName);
	});
}

function generateEnvironment(scene) {
	new RectGenerator(
		scene,
		0xa9a9a9,
		"wallPart",
		gridPartHalfSize,
		gridPartHalfSize,
		2 * gridPartHalfSize,
		2 * gridPartHalfSize
	);

	new PathMarkingGenerator(scene);
}
