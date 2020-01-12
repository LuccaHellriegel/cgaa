import { addCollider, PhysicGroups } from "./collisionBase";
import { executeOverAllCamps } from "../base/globals/global";
import { EnemyCircle } from "../enemies/camp/unit/EnemyCircle";

function bounceCallback(unit: EnemyCircle, obj) {
	if (unit.color !== "blue") {
		let dontAttackList = unit.scene.cgaa.camps[unit.color].dontAttackList;
		if (dontAttackList && !dontAttackList.includes(obj.color)) {
			unit.barrier = obj;
			unit.state = "obstacle";
		}
	}
}

function addBounceCollider(unit, secondUnit) {
	addCollider(unit, secondUnit, bounceCallback, null);
}

export function addUnitCollision(physicGroups: PhysicGroups) {
	addBounceCollider(physicGroups.player, physicGroups.towers);

	let func = color => {
		addBounceCollider(physicGroups.player, physicGroups.enemies[color]);
		addBounceCollider(physicGroups.enemies[color], physicGroups.player);
		addBounceCollider(physicGroups.enemies[color], physicGroups.towers);
		let secondFunc = secondColor => {
			if (secondColor !== color) addBounceCollider(physicGroups.enemies[color], physicGroups.enemies[secondColor]);
		};
		executeOverAllCamps(secondFunc);
	};
	executeOverAllCamps(func);
}

export function addEnvCollider(physicGroups: PhysicGroups) {
	addBounceCollider(physicGroups.player, physicGroups.areas);

	let func = color => {
		addBounceCollider(physicGroups.enemies[color], physicGroups.areas);
	};

	executeOverAllCamps(func);

	func = color => {
		addBounceCollider(physicGroups.player, physicGroups.buildings[color]);
		executeOverAllCamps(secondColor => {
			addBounceCollider(physicGroups.enemies[color], physicGroups.buildings[secondColor]);
		});
	};
	executeOverAllCamps(func);
}
