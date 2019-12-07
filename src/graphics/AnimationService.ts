
import { executeOverAllCampsAndSizes } from "../globals/global";

export class AnimationService {
  private constructor() {}

  private static createNonRepeatingAnim(anims, key, texture, start, end, frameRate) {
    anims.create({
      key: key,
      frames: anims.generateFrameNumbers(texture, { start: start, end: end }),
      frameRate: frameRate,
      repeat: 0
    });
  }

  private static createWeaponAnims(anims) {
    this.createNonRepeatingAnim(anims, "idle-randWeapon", "randWeapon", 1, 1, 10);
    this.createNonRepeatingAnim(anims, "attack-randWeapon", "randWeapon", 1, 2, 10);
    this.createNonRepeatingAnim(anims, "idle-chainWeapon", "chainWeapon", 1, 1, 10);
    this.createNonRepeatingAnim(anims, "attack-chainWeapon", "chainWeapon", 1, 3, 10);
  }

  private static createCircleAnims(anims) {
    this.createNonRepeatingAnim(anims, "idle-blueCircle", "blueCircle", 1, 1, 10);
    this.createNonRepeatingAnim(anims, "damage-blueCircle", "blueCircle", 1, 2, 10);

    executeOverAllCampsAndSizes((color, colorIndex, sizeName, sizeNameIndex) => {
      let title = color + sizeName + "Circle";
      this.createNonRepeatingAnim(anims, "idle-" + title, title, 1, 1, 10);
      this.createNonRepeatingAnim(anims, "damage-" + title, title, 1, 2, 10);
    });
  }

  static createAnims(anims) {
    this.createWeaponAnims(anims);
    this.createCircleAnims(anims);
    this.createNonRepeatingAnim(anims, "invalid-tower-pos", "ghostTower", 1, 2, 8);
    this.createNonRepeatingAnim(anims, "idle-ghostTower", "ghostTower", 1, 1, 10);
  }
}
