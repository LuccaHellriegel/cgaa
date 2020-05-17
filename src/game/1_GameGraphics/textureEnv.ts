import { RectGenerator } from "./generator/RectGenerator";
import { EnvSetup } from "../0_GameBase/setup/EnvSetup";

export function generateEnvironment(scene) {
	RectGenerator(
		scene,
		0xa9a9a9,
		"wallPart",
		EnvSetup.halfGridPartSize,
		EnvSetup.halfGridPartSize,
		EnvSetup.gridPartSize,
		EnvSetup.gridPartSize
	);
}
