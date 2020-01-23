import { CircleGenerator } from "./generator/unit/CircleGenerator";
import { normalCircleRadius, circleSizes, gridPartHalfSize } from "../../game/base/globals/globalSizes";
import { SquareGenerator } from "./generator/unit/SquareGenerator";
import { executeOverAllCampsAndSizes, executeOverAllCamps } from "../../game/base/globals/global";
import { campHexColors } from "../../game/base/globals/globalColors";
import { InteractionCircleGenerator } from "./generator/unit/InteractionCircleGenerator";
import { BuildingGenerator } from "./generator/unit/BuildingGenerator";
import { RectGenerator } from "./generator/RectGenerator";
import { SelectorRectGenerator } from "./generator/SelectorRectGenerator";

function generatePlayerUnits(scene) {
	new CircleGenerator(0x6495ed, scene, "blueCircle", normalCircleRadius);
	new SquareGenerator(scene);
	new RectGenerator(
		scene,
		0x013220,
		"tower",
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

	executeOverAllCamps((color, index) => {
		let title = color + "InteractionCircle";
		new InteractionCircleGenerator(campHexColors[index], scene, title, circleSizes[0]);
	});

	executeOverAllCampsAndSizes((color, colorIndex, sizeName, sizeNameIndex) => {
		let title = color + sizeName + "Building";
		new BuildingGenerator(scene, title, campHexColors[colorIndex], sizeName);
	});
}

export function generateUnits(scene) {
	generatePlayerUnits(scene);
	generateEnemyUnits(scene);
}
