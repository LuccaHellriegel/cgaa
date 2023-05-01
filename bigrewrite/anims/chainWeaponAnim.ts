import { UnitSetup } from "../data/UnitSetup";

export function createChainWeaponAnims(
  anims: Phaser.Animations.AnimationManager
) {
  let speedPerSize = {
    Small: 20,
    Normal: 8,
    Big: 5,
  };

  for (let index = 0; index < UnitSetup.circleSizeNames.length; index++) {
    const element = UnitSetup.circleSizeNames[index];
    anims.create({
      key: "idle-" + element + "chainWeapon",
      frames: anims.generateFrameNumbers(element + "chainWeapon", {
        start: 0,
        end: 0,
      }),
      frameRate: 10,
      repeat: 0,
    });
    anims.create({
      key: "attack-" + element + "chainWeapon",
      frames: anims.generateFrameNumbers(element + "chainWeapon", {
        start: 0,
        end: 2,
      }),
      frameRate: speedPerSize[element],
      repeat: 0,
    });
  }
}
