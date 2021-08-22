export class WASD {
	private left: any;
	private right: any;
	private up: any;
	private down: any;

	constructor(scene) {
		let cursors = scene.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D
		});
		this.left = cursors.left;
		this.right = cursors.right;
		this.up = cursors.up;
		this.down = cursors.down;
	}

	getState() {
		return { left: this.left.isDown, right: this.right.isDown, up: this.up.isDown, down: this.down.isDown };
	}
}
