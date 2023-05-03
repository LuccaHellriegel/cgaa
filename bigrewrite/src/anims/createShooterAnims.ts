import { createNonRepeatingAnim } from "./anim-create";

export function createShooterAnims(anims) {
  createNonRepeatingAnim(anims, "invalid-shooter-pos", "selectorRect", 1, 2, 8);
  createNonRepeatingAnim(anims, "idle-selectorRect", "selectorRect", 1, 1, 10);
}
