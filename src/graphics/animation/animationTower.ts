import { createNonRepeatingAnim } from "./animationBase";

export function createTowerAnims(anims) {
	createNonRepeatingAnim(anims, "invalid-tower-pos", "ghostTower", 1, 2, 8);
	createNonRepeatingAnim(anims, "idle-ghostTower", "ghostTower", 1, 1, 10);
}
