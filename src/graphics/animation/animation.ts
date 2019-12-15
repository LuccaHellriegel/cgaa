import { createTowerAnims } from "./animationTower";
import { createWeaponAnims } from "./animationWeapon";
import { createCircleAnims } from "./animationCircle";

export function createAnims(anims) {
	createWeaponAnims(anims);
	createCircleAnims(anims);
	createTowerAnims(anims);
}
