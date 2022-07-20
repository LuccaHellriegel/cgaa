import { CampSetup } from "../config/CampSetup";
import { UnitSetup } from "../config/UnitSetup";
import { createNonRepeatingAnim } from "../anim/anim-create";

function baseIdleDamageAnim(anims, title) {
  createNonRepeatingAnim(anims, "idle-" + title, title, 1, 1, 10);
  createNonRepeatingAnim(anims, "damage-" + title, title, 1, 2, 10);
}

export function createCircleAnims(anims) {
  ["bossCircle", "kingCircle"].forEach((title) => {
    baseIdleDamageAnim(anims, title);
  });

  CampSetup.campIDs.forEach((id) => {
    if (id !== CampSetup.bossCampID) {
      UnitSetup.circleSizeNames.forEach((circleSizeName) => {
        let title = id + circleSizeName + "Circle";
        baseIdleDamageAnim(anims, title);
      });
      let title = id + "InteractionCircle";
      baseIdleDamageAnim(anims, title);
    }
  });
}
