export function initNonMovingGroupPair(scene: Phaser.Scene) {
	const nonmoving = scene.physics.add.staticGroup();
	const units = scene.physics.add.group();
	scene.physics.add.collider(units, nonmoving);

	return {
		addToNonMoving: function (nonMoving: Phaser.GameObjects.GameObject) {
			nonmoving.add(nonMoving);
		},
		addToUnits: function (unit: Phaser.GameObjects.GameObject) {
			//units.add(unit);
		},
	};
}
