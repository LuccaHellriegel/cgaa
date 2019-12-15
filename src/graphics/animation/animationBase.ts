export function createNonRepeatingAnim(anims: Phaser.Animations.AnimationManager, key, texture, start, end, frameRate) {
	anims.create({
		key: key,
		frames: anims.generateFrameNumbers(texture, { start: start, end: end }),
		frameRate: frameRate,
		repeat: 0
	});
}
