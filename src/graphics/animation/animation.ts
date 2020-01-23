import { createShooterAnims } from "./animationShooter";
import { createWeaponAnims } from "./animationWeapon";
import { createCircleAnims } from "./animationCircle";

export function createAnims(anims) {
	createWeaponAnims(anims);
	createCircleAnims(anims);
	createShooterAnims(anims);
}
