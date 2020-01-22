import { Gameplay } from "../../scenes/Gameplay";
import { executeOverAllCamps } from "../base/globals/global";
import { PhysicGroups } from "./collisionBase";
import { addWeaponCollision } from "./collisionWeapon";
import { addUnitCollision, addEnvCollider } from "./collisionGeneral";
import { BulletCollision } from "./BulletCollision";

function createPhysicGroups(scene: Gameplay): PhysicGroups {
	let player = scene.physics.add.group();
	let playerWeapon = scene.physics.add.group();

	let towers = scene.physics.add.staticGroup();
	let towerBulletGroup = scene.physics.add.group();

	let enemies = {};
	let enemyWeapons = {};
	let buildings = {};
	executeOverAllCamps(color => {
		enemies[color] = scene.physics.add.group();
		enemyWeapons[color] = scene.physics.add.group();
		buildings[color] = scene.physics.add.staticGroup();
	});

	let areas = scene.physics.add.staticGroup();

	return {
		player,
		playerWeapon,
		towers,
		towerBulletGroup,

		enemies,
		enemyWeapons,
		buildings,

		areas
	};
}

function getEnemyGroups(physicGroups: PhysicGroups) {
	return [...Object.values(physicGroups.buildings), ...Object.values(physicGroups.enemies)];
}

export function enableCollision(scene: Gameplay) {
	let physicGroups = createPhysicGroups(scene);
	addWeaponCollision(physicGroups);
	addUnitCollision(physicGroups);
	addEnvCollider(physicGroups);

	new BulletCollision(scene, physicGroups.towerBulletGroup, getEnemyGroups(physicGroups));
	//addBulletCollision(physicGroups);

	return physicGroups;
}
