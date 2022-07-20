export interface unitAnims {
  texture: Phaser.Textures.Texture | Phaser.Textures.CanvasTexture;
  anims: Phaser.GameObjects.Components.Animation;
  playIdle: Function;
  playDamage: Function;
}

export function initUnitAnims(gameObject: unitAnims) {
  let idleAnim = "idle-" + gameObject.texture.key;
  gameObject.playIdle = gameObject.anims.play(idleAnim).bind(gameObject);

  let damageAnim = "damage-" + gameObject.texture.key;
  gameObject.playDamage = gameObject.anims.play(damageAnim).bind(gameObject);
}
