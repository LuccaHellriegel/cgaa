import { createChainWeaponAnims } from "../weapons/ChainWeapon/chain-weapon-anim";
import { createCircleAnims } from "./2_GameAnimation/animationCircle";
import { createShooterAnims } from "./2_GameAnimation/animationShooter";

export function GameAnimation(anims: Phaser.Animations.AnimationManager) {
	createChainWeaponAnims(anims);
	createCircleAnims(anims);
	createShooterAnims(anims);
}
