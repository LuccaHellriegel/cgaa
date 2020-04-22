export class Sights extends Phaser.Physics.Arcade.Group {
	constructor(scene, amount) {
		super(scene.physics.world, scene);
		this.createMultiple({
			frameQuantity: amount,
			key: "",
			active: false,
			visible: false,
			classType: Sight,
		});
		this.getChildren().forEach((child) => (child as Phaser.Physics.Arcade.Sprite).disableBody());
	}
	placeSight(x, y) {
		let sight: Sight = this.getFirstDead(true);
		sight.enable(x, y);
		return sight;
	}
}
export class Sight extends Phaser.Physics.Arcade.Image {
	constructor(scene, x, y) {
		super(scene, x, y, "");
	}
	enable(x, y) {
		this.enableBody(true, x, y, true, false);
		this.setSize(444, 444);
	}
	disable() {
		this.disableBody(true, true);
	}
}
