import { Gameplay } from "../../scenes/Gameplay";
import { Cooperation } from "../0_GameBase/engine/Cooperation";
import { ChainWeapon } from "../4_GameUnit/weapon/ChainWeapon";
import { DangerousCircle } from "../4_GameUnit/unit/DangerousCircle";
import { Shooter } from "../4_GameUnit/tower/Shooter";

export function initSightGroupPair(scene: Gameplay, cooperation: Cooperation) {
	const weapons = scene.physics.add.staticGroup();
	const sightings = scene.physics.add.group();
	scene.physics.add.overlap(weapons, sightings, (weapon, obj) => {
		sight(weapon as ChainWeapon, obj, cooperation);
	});

	return {
		addToWeapons: function (weapon: Phaser.GameObjects.GameObject) {
			weapons.add(weapon);
		},
		addToSightings: function (obstacle: Phaser.GameObjects.GameObject) {
			sightings.add(obstacle);
		},
	};
}

function sight(chainWeapon: ChainWeapon, enemy, cooperation) {
	let isNotInCooperation = !cooperation.hasCooperation((chainWeapon.owner as DangerousCircle).campID, enemy.campID);

	if (isNotInCooperation) {
		if (enemy instanceof Shooter) {
			enemy.fire(chainWeapon.owner);
		} else {
			(chainWeapon.owner as DangerousCircle).stateHandler.spotted = enemy;
		}

		return false;
	}
}
