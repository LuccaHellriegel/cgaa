export class PathMarking extends Phaser.GameObjects.Image {
	constructor(scene, x, y, prevDirection, nextDirection) {
		let texture = "pathMarking-" + prevDirection + "-" + nextDirection;
		super(scene, x, y, texture);

		scene.add.existing(this);
	}
}
