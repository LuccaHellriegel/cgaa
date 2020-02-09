import { RectGenerator } from "./generator/RectGenerator";
import { PathMarkingGenerator } from "./generator/PathMarkingGenerator";
import { EnvSetup } from "../../game/setup/EnvSetup";

export function generateEnvironment(scene) {
	new RectGenerator(
		scene,
		0xa9a9a9,
		"wallPart",
		EnvSetup.halfGridPartSize,
		EnvSetup.halfGridPartSize,
		EnvSetup.gridPartSize,
		EnvSetup.gridPartSize
	);

	new PathMarkingGenerator(scene);
}
