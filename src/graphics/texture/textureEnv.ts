import { RectGenerator } from "./generator/RectGenerator";
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
}
