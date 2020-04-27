import { Cooperation } from "../state/Cooperation";
import { CampID } from "../setup/CampSetup";

export function initBounceGroupPair(scene: Phaser.Scene, cooperation: Cooperation) {
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

function bounceCallback(unit, obj, cooperation: Cooperation) {
	if (unit.campID === obj.campID) {
		unit.stateHandler.moveBack();
	} else {
		let cooperationSet = cooperation.dict[unit.campID] as Set<CampID>;
		if (!cooperationSet.has(obj.campID)) {
			unit.stateHandler.obstacle = obj;
		}
	}
}
