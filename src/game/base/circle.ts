export function setupCircle(circle: Phaser.Physics.Arcade.Image) {
	circle.setCircle(circle.texture.get(0).halfWidth);
}
