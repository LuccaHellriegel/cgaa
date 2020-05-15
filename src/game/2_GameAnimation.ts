import { createWeaponAnims } from "./2_GameAnimation/animationWeapon";
import { createCircleAnims } from "./2_GameAnimation/animationCircle";
import { createShooterAnims } from "./2_GameAnimation/animationShooter";

export function GameAnimation(anims: Phaser.Animations.AnimationManager) {
	createWeaponAnims(anims);
	createCircleAnims(anims);
	createShooterAnims(anims);
}
