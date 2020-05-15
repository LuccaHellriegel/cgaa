export function addToScene(realObject, scene) {
	scene.add.existing(realObject);
	scene.physics.add.existing(realObject);
}

export function setupCircleBody(circle: Phaser.Physics.Arcade.Image) {
	circle.setCircle(circle.texture.get(0).halfWidth);
}
