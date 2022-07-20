import { UnitSetup } from "../../config/UnitSetup";
import { createNonRepeatingAnim } from "../../anim/anim-create";

export function createChainWeaponAnims(anims) {
  let speedPerSize = {
    Small: 20,
    Normal: 8,
    Big: 5,
  };

  for (let index = 0; index < UnitSetup.circleSizeNames.length; index++) {
    const element = UnitSetup.circleSizeNames[index];
    createNonRepeatingAnim(
      anims,
      "idle-" + element + "chainWeapon",
      element + "chainWeapon",
      0,
      0,
      10
    );
    createNonRepeatingAnim(
      anims,
      "attack-" + element + "chainWeapon",
      element + "chainWeapon",
      0,
      2,
      speedPerSize[element]
    );
  }
}
