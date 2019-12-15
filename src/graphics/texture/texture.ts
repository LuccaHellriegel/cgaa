import { generateUnits } from "./textureUnit";
import { generateWeapons } from "./textureWeapon";
import { generateEnvironment } from "./textureEnv";

export function generateTextures(scene) {
	generateUnits(scene);
	generateWeapons(scene);
	generateEnvironment(scene);
}
