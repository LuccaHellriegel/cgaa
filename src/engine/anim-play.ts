export interface unitAnims {
	texture: Phaser.Textures.Texture | Phaser.Textures.CanvasTexture;
	anims: Phaser.GameObjects.Components.Animation;
	playIdle: Function;
	playDamage: Function;
}

export function initUnitAnims(gameObject: unitAnims) {
	let idleAnim = "idle-" + gameObject.texture.key;
	gameObject.playIdle = playAnimFunc(gameObject, idleAnim);

	let damageAnim = "damage-" + gameObject.texture.key;
	gameObject.playDamage = playAnimFunc(gameObject, damageAnim);
}

function playAnimFunc(gameObject: unitAnims, anim: string) {
	return function () {
		gameObject.anims.play(anim);
	}.bind(gameObject);
}
