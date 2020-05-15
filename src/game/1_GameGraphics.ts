import { generateUnits } from "./1_GameGraphics/textureUnit";
import { generateEnvironment } from "./1_GameGraphics/textureEnv";
import { CircleGenerator } from "./1_GameGraphics/generator/unit/CircleGenerator";
import { UnitSetup } from "./0_GameBase/setup/UnitSetup";
import { weaponTextures } from "./1_GameGraphics/chain-weapon-texture";

export function GameGraphics(scene) {
	generateUnits(scene);
	new CircleGenerator(0xff0000, scene, "bullet", UnitSetup.normalCircleRadius / 4);

	generateEnvironment(scene);

	weaponTextures(scene);
}
