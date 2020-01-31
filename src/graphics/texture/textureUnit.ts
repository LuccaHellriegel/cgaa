import { CircleGenerator } from "./generator/unit/CircleGenerator";
import {
	normalCircleRadius,
	circleSizes,
	gridPartHalfSize,
	bigCircleRadius
} from "../../game/base/globals/globalSizes";
import { HealerGenerator } from "./generator/unit/HealerGenerator";
import { executeOverAllCampsAndSizes, executeOverAllCamps } from "../../game/base/globals/global";
import { campHexColors } from "../../game/base/globals/globalColors";
import { InteractionCircleGenerator } from "./generator/unit/InteractionCircleGenerator";
import { BuildingGenerator } from "./generator/unit/BuildingGenerator";
import { RectGenerator } from "./generator/RectGenerator";
import { SelectorRectGenerator } from "./generator/SelectorRectGenerator";
import { BossGenerator } from "./generator/unit/BossGenerator";
import { KingGenerator } from "./generator/unit/KingGenerator";

function generatePlayerUnits(scene) {
	new CircleGenerator(0x6495ed, scene, "blueCircle", normalCircleRadius);
	new HealerGenerator(scene);
	new RectGenerator(
		scene,
		0x013220,
		"shooter",
		gridPartHalfSize,
		gridPartHalfSize,
		2 * gridPartHalfSize,
		2 * gridPartHalfSize
	);
	new SelectorRectGenerator(scene);
}

function generateEnemyUnits(scene) {
	executeOverAllCampsAndSizes((color, colorIndex, sizeName, sizeNameIndex) => {
		let title = color + sizeName + "Circle";
		new CircleGenerator(campHexColors[colorIndex], scene, title, circleSizes[sizeNameIndex]);
	});

	//PlayerFriends
	new CircleGenerator(0x6495ed, scene, "blueBigCircle", bigCircleRadius);

	executeOverAllCamps((color, index) => {
		let title = color + "InteractionCircle";
		new InteractionCircleGenerator(campHexColors[index], scene, title, circleSizes[0]);
	});

	executeOverAllCampsAndSizes((color, colorIndex, sizeName, sizeNameIndex) => {
		let title = color + sizeName + "Building";
		new BuildingGenerator(scene, title, campHexColors[colorIndex], sizeName);
	});

	let title = "bossCircle";
	new BossGenerator(scene, title);

	title = "kingCircle";
	new KingGenerator(scene, title);
}

export function generateUnits(scene) {
	generatePlayerUnits(scene);
	generateEnemyUnits(scene);
}
