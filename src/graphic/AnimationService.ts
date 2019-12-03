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
    this.createNonRepeatingAnim(anims, "idle-redCircle", "redCircle", 1, 1, 10);
    this.createNonRepeatingAnim(anims, "damage-redCircle", "redCircle", 1, 2, 10);
    this.createNonRepeatingAnim(anims, "idle-blueCircle", "blueCircle", 1, 1, 10);
    this.createNonRepeatingAnim(anims, "damage-blueCircle", "blueCircle", 1, 2, 10);
  }

  static createAnims(anims) {
    this.createWeaponAnims(anims);
    this.createCircleAnims(anims);
  }
}