import { generateUnits } from "./textureUnit";
import { generateEnvironment } from "./textureEnv";
import { CircleGenerator } from "./generator/unit/CircleGenerator";
import { UnitSetup } from "../../game/setup/UnitSetup";

export function generateTextures(scene) {
	generateUnits(scene);
	new CircleGenerator(0xff0000, scene, "bullet", UnitSetup.normalCircleRadius / 4);

	generateEnvironment(scene);
}
