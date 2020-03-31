import { Gameplay } from "../../scenes/Gameplay";
import { CampSetup } from "../setup/CampSetup";
import { BulletCollision } from "./BulletCollision";
import { SightOverlap } from "./SightOverlap";
import { BounceCollision } from "./BounceCollision";
import { Cooperation } from "../state/Cooperation";
import { StandardCollision } from "./StandardCollision";
import { Bullets } from "../tower/shooter/Bullet";
import { Shooters } from "../tower/shooter/Shooter";
import { Healers } from "../tower/healer/Healer";

export interface PhysicGroups {
	player: Phaser.Physics.Arcade.Group;
	playerWeapon: Phaser.Physics.Arcade.Group;
	playerFriends: Phaser.Physics.Arcade.Group;
	enemies: {};
	enemyWeapons: {};
	areas: Phaser.Physics.Arcade.StaticGroup;
	bulletGroup: Bullets;
	shooters: Shooters;
	healers: Healers;
	buildings: {};
	pairs: {};
}

export class Collision {
	physicGroups: PhysicGroups;

	constructor(scene: Gameplay, cooperation: Cooperation) {
		this.createPhysicGroups(scene);

		new StandardCollision(scene, this.getStandardCollisionCombArr());

		new SightOverlap(scene, this.getSightAndWeaponCombinatorialArr(), cooperation);
		new BounceCollision(scene, this.getBounceCombinatorialArr(), cooperation);
		new BulletCollision(scene, this.physicGroups.bulletGroup, this.getEnemyGroups());
	}

	private createPhysicGroups(scene: Gameplay) {
		let player = scene.physics.add.group();
		let playerWeapon = scene.physics.add.group();
		let playerFriends = scene.physics.add.group();

		let bulletGroup = new Bullets(scene);
		let shooters = new Shooters(scene, bulletGroup);
		let healers = new Healers(scene, shooters);

		let pairs = {};
		let enemies = {};
		let enemyWeapons = {};
		let buildings = {};
		CampSetup.campIDs.forEach(id => {
			enemies[id] = scene.physics.add.group();
			enemyWeapons[id] = scene.physics.add.group();
			buildings[id] = scene.physics.add.staticGroup();
			pairs[id] = { physicsGroup: enemies[id], weaponGroup: enemyWeapons[id] };
		});

		let areas = scene.physics.add.staticGroup();

		this.physicGroups = {
			player,
			playerWeapon,
			playerFriends,
			bulletGroup,
			healers,
			shooters,

			pairs,
			enemies,
			enemyWeapons,
			buildings,

			areas
		};
	}

	private getEnemyGroups() {
		return [...Object.values(this.physicGroups.buildings), ...Object.values(this.physicGroups.enemies)];
	}

	private getSightAndWeaponCombinatorialArr() {
		let result = [];

		result.push([[this.physicGroups.playerWeapon], this.getEnemyGroups()]);

		result.push([
			[...Object.values(this.physicGroups.enemyWeapons)],
			[this.physicGroups.player, this.physicGroups.shooters, this.physicGroups.healers]
		]);

		result.push(
			...Object.keys(this.physicGroups.enemyWeapons).map(campID => {
				return [
					[this.physicGroups.enemyWeapons[campID]],
					Object.keys(this.physicGroups.enemyWeapons)
						.filter(secondCampID => secondCampID !== campID)
						.map(secondCampID => this.physicGroups.enemies[secondCampID])
				];
			})
		);
		return result;
	}

	private getStandardCollisionCombArr() {
		let result = [];
		result.push([[...Object.values(this.physicGroups.enemies), this.physicGroups.player], [this.physicGroups.areas]]);

		result.push([
			[this.physicGroups.player],
			[...this.getEnemyGroups(), this.physicGroups.shooters, this.physicGroups.healers]
		]);

		return result;
	}

	private getBounceCombinatorialArr() {
		let result = [];
		result.push([
			[...Object.values(this.physicGroups.enemies)],
			[
				this.physicGroups.player,
				this.physicGroups.shooters,
				this.physicGroups.healers,
				...Object.values(this.physicGroups.buildings)
			]
		]);
		result.push(
			...Object.keys(this.physicGroups.enemies).map(campID => {
				return [
					[this.physicGroups.enemies[campID]],
					Object.keys(this.physicGroups.enemies)
						.filter(secondCampID => secondCampID !== campID)
						.map(secondCampID => this.physicGroups.enemies[secondCampID])
				];
			})
		);
		return result;
	}
}
