import { Gameplay } from "../scenes/Gameplay";
import { initBulletGroupPair } from "./6_GamePhysics/collision-bullet";
import { initBounceGroupPair } from "./6_GamePhysics/collision-bounce";
import { initWeaponGroupPair } from "./6_GamePhysics/overlap-weapon";
import { initNonMovingGroupPair } from "./6_GamePhysics/collision-basic";
import { initSightGroupPair } from "./6_GamePhysics/overlap-sight";
import { Cooperation } from "./0_GameBase/engine/Cooperation";
import { CampSetup, CampID } from "./0_GameBase/setup/CampSetup";
import { Building } from "../buildings/Building";

interface Unit extends Phaser.GameObjects.GameObject {
	campID: CampID;
	weapon;
	weaponPhysics: Phaser.GameObjects.GameObject;
}

export type Physics = {
	addEnv: Function;
	addBuilding: (building: Building) => void;
	addUnit: Function;
	addTower: Function;
	addBullet: Function;
};

export function GamePhysics(scene: Gameplay, cooperation: Cooperation): Physics {
	const collisionPair = initNonMovingGroupPair(scene);

	// overlap between friendly units should be rare (because we reset the physics circle after attacking)
	// so should be more efficient to just have one pair
	const weaponPair = initWeaponGroupPair(scene);

	// dont want units of the same camp to bounce, so need pair for each camp
	const campBouncePairs = {};

	// should not have constant overlaps with own units, so need pair for each camp
	const campSightPairs = {};

	for (const campID of CampSetup.campIDs) {
		campBouncePairs[campID] = initBounceGroupPair(scene, cooperation);
		campSightPairs[campID] = initSightGroupPair(scene, cooperation);
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
			weaponPair.addToWeapon(unit.weaponPhysics);

			for (const campID of CampSetup.campIDs) {
				if (campID === unit.campID) {
					campBouncePairs[campID].addToUnits(unit);
					campSightPairs[campID].addToWeapons(unit.weapon);
				} else {
					campBouncePairs[campID].addToObstacles(unit);
					campSightPairs[campID].addToSightings(unit);
				}
			}

			if (unit.campID !== CampSetup.playerCampID) bulletPair.addToEnemies(unit);
		},

		addTower: function (tower: Phaser.GameObjects.GameObject) {
			weaponPair.addToEnemy(tower);

			for (const campID of CampSetup.campIDs) {
				campBouncePairs[campID].addToObstacles(tower);
				campSightPairs[campID].addToSightings(tower);
			}
		},

		addBullet: bulletPair.addToBullets,
	};
}
