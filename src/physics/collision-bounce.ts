import { BitwiseCooperation } from "../engine/BitwiseCooperation";

export function initBounceGroupPair(scene: Phaser.Scene, cooperation: BitwiseCooperation) {
	const units = scene.physics.add.staticGroup();
	const obstacles = scene.physics.add.group();
	scene.physics.add.collider(units, obstacles, (unit, obj) => {
		bounceCallback(unit, obj, cooperation);
	});

	return {
		addToUnits: function (unit: Phaser.GameObjects.GameObject) {
			units.add(unit);
		},
		addToObstacles: function (obstacle: Phaser.GameObjects.GameObject) {
			obstacles.add(obstacle);
		},
	};
}

function bounceCallback(unit, obj, cooperation: BitwiseCooperation) {
	if (unit.campID === obj.campID) {
		unit.stateHandler.moveBack();
	} else {
		if (!cooperation.has(unit.campMask, obj.campMasp)) {
			unit.stateHandler.obstacle = obj;
		}
	}
}
