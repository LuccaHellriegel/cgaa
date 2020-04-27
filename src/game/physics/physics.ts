import { Gameplay } from "../../scenes/Gameplay";
import { initBulletGroupPair } from "./collision-bullet";
import { initBounceGroupPair } from "./collision-bounce";
import { initWeaponGroupPair } from "./overlap-weapon";
import { initNonMovingGroupPair } from "./collision-basic";
import { Cooperation } from "../state/Cooperation";
import { CampSetup, CampID } from "../setup/CampSetup";

export function initCollision(scene: Gameplay, cooperation: Cooperation) {
	const collisionPair = initNonMovingGroupPair(scene);

	// overlap between friendly units should be rare (because we reset the physics circle after attacking)
	// so should be more efficient to just have one pair
	const weaponPair = initWeaponGroupPair(scene);

	// dont want units of the same camp to bounce, so need pair for each camp
	const campBouncePairs = {};
	for (const campID of CampSetup.campIDs) {
		campBouncePairs[campID] = initBounceGroupPair(scene, cooperation);
	}

	const bulletPair = initBulletGroupPair(scene);

	//TODO: sightPairs

	return {
		addEnv: collisionPair.addToNonMoving,

		addBuilding: function (building: Phaser.GameObjects.GameObject) {
			collisionPair.addToNonMoving(building);

			weaponPair.addToStaticEnemy(building);
		},

		addUnit: function (unit: Unit) {
			collisionPair.addToUnits(unit);

			weaponPair.addToEnemy(unit);
			console.log(unit.weaponPhysics);
			weaponPair.addToWeapon(unit.weaponPhysics);

			for (const campID of CampSetup.campIDs) {
				if (campID === unit.campID) {
					campBouncePairs[campID].addToUnits(unit);
				} else {
					campBouncePairs[campID].addToObstacles(unit);
				}
			}

			if (unit.campID !== CampSetup.playerCampID) bulletPair.addToEnemies(unit);
		},

		addTower: function (tower: Phaser.GameObjects.GameObject) {
			weaponPair.addToEnemy(tower);

			for (const campID of CampSetup.campIDs) {
				campBouncePairs[campID].addToObstacles(tower);
			}
		},

		addBullet: bulletPair.addToBullets,
	};
}

interface Unit extends Phaser.GameObjects.GameObject {
	campID: CampID;
	weaponPhysics: Phaser.GameObjects.GameObject;
}
