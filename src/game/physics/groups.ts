import { Gameplay } from "../../scenes/Gameplay";
import { CampSetup } from "../setup/CampSetup";
import { Bullets } from "../tower/shooter/Bullet";
import { Shooters } from "../tower/shooter/Shooter";
import { Healers } from "../tower/healer/Healer";
import { UnitSetup } from "../setup/UnitSetup";
import { ChainWeapons } from "../weapon/chain/group";
import { Sights } from "./Sights";

export type physicsGroups = {
	player: Phaser.Physics.Arcade.Group;
	playerWeapon: ChainWeapons;
	playerFriends: Phaser.Physics.Arcade.Group;
	playerFriendsWeapons: ChainWeapons;

	enemies: {};
	enemyWeapons: {};

	sights: {};

	areas: Phaser.Physics.Arcade.StaticGroup;
	bulletGroup: Bullets;
	shooters: Shooters;
	healers: Healers;
	buildings: {};

	pairs: {};
};

export function createPhysicsGroups(scene: Gameplay) {
	let player = scene.physics.add.group();
	let playerWeaponGroup = scene.physics.add.group();
	let playerWeapon = new ChainWeapons(scene, "Normal", 1, playerWeaponGroup);
	let playerFriends = scene.physics.add.group();
	let playerFriendsWeapons = new ChainWeapons(scene, "Big", 9, playerWeaponGroup);
	let bulletGroup = new Bullets(scene);
	let shooters = new Shooters(scene, bulletGroup);
	let healers = new Healers(scene, shooters);
	let pairs = {};
	let enemies = {};
	let enemyWeapons = {};
	let sights = {};
	let buildings = {};

	CampSetup.campIDs.forEach((id) => {
		enemies[id] = scene.physics.add.group();
		let obj = {};
		let enemyWeaponGroup = scene.physics.add.group();
		for (let size of UnitSetup.circleSizeNames) {
			obj[size] = new ChainWeapons(scene, size, 30, enemyWeaponGroup);
		}
		enemyWeapons[id] = obj;
		sights[id] = new Sights(scene, 30);
		buildings[id] = scene.physics.add.staticGroup();
		pairs[id] = { physicsGroup: enemies[id], weaponGroup: enemyWeapons[id] };
	});

	let areas = scene.physics.add.staticGroup();

	return {
		player,
		playerWeapon,
		playerFriends,
		playerFriendsWeapons,
		bulletGroup,
		healers,
		shooters,
		pairs,
		enemies,
		enemyWeapons,
		sights,
		buildings,
		areas,
	};
}
