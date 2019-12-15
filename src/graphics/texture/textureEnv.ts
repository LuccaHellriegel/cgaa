import { RectGenerator } from "./generator/RectGenerator";
import { gridPartHalfSize } from "../../game/base/globals/globalSizes";
import { PathMarkingGenerator } from "./generator/PathMarkingGenerator";

export function generateEnvironment(scene) {
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
