import { Gameplay } from "../../scenes/Gameplay";
import { executeOverAllCamps } from "../base/globals/global";
import { PhysicGroups } from "./collisionBase";
import { addUnitCollision, addEnvCollider } from "./collisionGeneral";
import { BulletCollision } from "./BulletCollision";
import { SightOverlap } from "./SightOverlap";

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

function getSightAndWeaponCombinatorialArr(physicGroups: PhysicGroups) {
	let result = [];
	result.push([[physicGroups.playerWeapon], getEnemyGroups(physicGroups)]);
	result.push([[...Object.values(physicGroups.enemyWeapons)], [physicGroups.player, physicGroups.towers]]);
	result.push(
		...Object.keys(physicGroups.enemyWeapons).map(color => {
			return [
				[physicGroups.enemyWeapons[color]],
				Object.keys(physicGroups.enemyWeapons)
					.filter(secondColor => secondColor !== color)
					.map(secondColor => physicGroups.enemies[secondColor])
			];
		})
	);
	return result;
}

export function enableCollision(scene: Gameplay) {
	let physicGroups = createPhysicGroups(scene);

	new SightOverlap(scene, getSightAndWeaponCombinatorialArr(physicGroups));
	addUnitCollision(physicGroups);
	addEnvCollider(physicGroups);

	new BulletCollision(scene, physicGroups.towerBulletGroup, getEnemyGroups(physicGroups));

	return physicGroups;
}
