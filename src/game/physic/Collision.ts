import { Gameplay } from "../../scenes/Gameplay";
import { CampSetup } from "../setup/CampSetup";
import { BulletCollision } from "./collision-bullet";
import { SightOverlap } from "./overlap-sight";
import { BounceCollision } from "./collision-bounce";
import { Cooperation } from "../state/Cooperation";
import { Bullets } from "../tower/shooter/Bullet";
import { Shooters } from "../tower/shooter/Shooter";
import { Healers } from "../tower/healer/Healer";
import { UnitSetup } from "../setup/UnitSetup";
import { ChainWeapons } from "../weapon/chain/group";
import { addWeaponOverlap } from "./overlap-weapon";
import { Sights } from "./Sights";
import { addBasicCollision } from "./collision-basic";

export type PhysicsGroups = {
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

export function addCombinatorialOverlap(scene: Gameplay, combinatorialArr, collideCallback, processCallback) {
	for (let arr of combinatorialArr) {
		let firstsArr = arr[0];
		let secondsArr = arr[1];
		for (let first of firstsArr) {
			for (let second of secondsArr) {
				scene.physics.add.overlap(first, second, collideCallback, processCallback);
			}
		}
	}
}

export function addCombinatorialCollider(scene: Gameplay, combinatorialArr, collideCallback, processCallback) {
	for (let arr of combinatorialArr) {
		let firstsArr = arr[0];
		let secondsArr = arr[1];
		for (let first of firstsArr) {
			for (let second of secondsArr) {
				scene.physics.add.collider(first, second, collideCallback, processCallback);
			}
		}
	}
}

function createPhysicsGroups(scene: Gameplay): PhysicsGroups {
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

export class Collision {
	PhysicsGroups: PhysicsGroups;

	constructor(scene: Gameplay, cooperation: Cooperation) {
		this.createPhysicsGroups(scene);

		addBasicCollision(scene, this.PhysicsGroups);

		new SightOverlap(scene, this.getSightArr(), cooperation);
		new BounceCollision(scene, this.getBounceCombinatorialArr(), cooperation);
		new BulletCollision(scene, this.PhysicsGroups.bulletGroup, this.getEnemyGroups());

		addWeaponOverlap(scene, this.getWeaponArr());
	}

	private createPhysicsGroups(scene: Gameplay) {
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

		this.PhysicsGroups = {
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

	private getEnemyGroups() {
		return [...Object.values(this.PhysicsGroups.buildings), ...Object.values(this.PhysicsGroups.enemies)];
	}

	private getSightArr() {
		let result = [];
		result.push(
			...Object.keys(this.PhysicsGroups.sights).map((campID) => {
				return [
					[this.PhysicsGroups.sights[campID]],
					Object.keys(this.PhysicsGroups.sights)
						.filter((secondCampID) => secondCampID !== campID)
						.map((secondCampID) => this.PhysicsGroups.sights[secondCampID]),
				];
			})
		);
		return result;
	}

	private getWeaponArr() {
		let result = [];

		let playerWeaponVsEnemyUnits = [[this.PhysicsGroups.playerWeapon.weaponGroup], this.getEnemyGroups()];
		result.push(playerWeaponVsEnemyUnits);

		let allWeaponGroups = [];
		for (let enemyWeapon of Object.values(this.PhysicsGroups.enemyWeapons)) {
			allWeaponGroups = allWeaponGroups.concat(
				Object.values(enemyWeapon).map((enemyWeapon) => (enemyWeapon as ChainWeapons).weaponGroup)
			);
		}
		let enemyWeaponsVsPlayerUnits = [
			allWeaponGroups,
			[this.PhysicsGroups.player, this.PhysicsGroups.shooters, this.PhysicsGroups.healers],
		];
		result.push(enemyWeaponsVsPlayerUnits);

		let enemyWeaponsVsOtherUnits = [];
		let campIDs = Object.keys(this.PhysicsGroups.enemyWeapons);
		// this is so nested because we have three types per camp
		for (let campID of campIDs) {
			let curEnemyWeapon = this.PhysicsGroups.enemyWeapons[campID];
			let curGroups = Object.values(curEnemyWeapon).map((enemyWeapon) => (enemyWeapon as ChainWeapons).weaponGroup);
			let otherIDs = campIDs.filter((id) => id !== campID);
			let otherEnemyWeapons = otherIDs.map((id) => this.PhysicsGroups.enemyWeapons[id]);
			let otherGroups = [];
			for (let enemyWeapon of otherEnemyWeapons) {
				otherGroups = otherGroups.concat(
					Object.values(enemyWeapon).map((enemyWeapon) => (enemyWeapon as ChainWeapons).weaponGroup)
				);
			}

			enemyWeaponsVsOtherUnits.push([curGroups, otherGroups]);
		}
		result.push(...enemyWeaponsVsOtherUnits);

		return result;
	}

	private getBounceCombinatorialArr() {
		let result = [];
		result.push([
			[...Object.values(this.PhysicsGroups.enemies)],
			[
				this.PhysicsGroups.player,
				this.PhysicsGroups.shooters,
				this.PhysicsGroups.healers,
				...Object.values(this.PhysicsGroups.buildings),
			],
		]);
		result.push(
			...Object.keys(this.PhysicsGroups.enemies).map((campID) => {
				return [
					[this.PhysicsGroups.enemies[campID]],
					Object.keys(this.PhysicsGroups.enemies)
						.filter((secondCampID) => secondCampID !== campID)
						.map((secondCampID) => this.PhysicsGroups.enemies[secondCampID]),
				];
			})
		);
		return result;
	}
}
