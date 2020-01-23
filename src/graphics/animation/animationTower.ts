import { createNonRepeatingAnim } from "./animationBase";

export function createTowerAnims(anims) {
	createNonRepeatingAnim(anims, "invalid-tower-pos", "selectorRect", 1, 2, 8);
	createNonRepeatingAnim(anims, "idle-selectorRect", "selectorRect", 1, 1, 10);
}
