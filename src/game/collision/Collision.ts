import { Gameplay } from "../../scenes/Gameplay";
import { CampSetup } from "../setup/CampSetup";
import { BulletCollision } from "./BulletCollision";
import { SightOverlap } from "./SightOverlap";
import { BounceCollision } from "./BounceCollision";
import { HealerAura } from "./HealerAura";
import { Cooperation } from "../state/Cooperation";

export interface PhysicGroups {
	player: Phaser.Physics.Arcade.Group;
	playerWeapon: Phaser.Physics.Arcade.Group;
	tower: Phaser.Physics.Arcade.StaticGroup;
	healer: Phaser.Physics.Arcade.StaticGroup;
	enemies: {};
	enemyWeapons: {};
	areas: Phaser.Physics.Arcade.StaticGroup;
	bulletGroup: Phaser.Physics.Arcade.Group;
	buildings: {};
	pairs: {};
}

export class Collision {
	physicGroups: PhysicGroups;

	constructor(scene: Gameplay, cooperation: Cooperation) {
		this.createPhysicGroups(scene);

		new SightOverlap(scene, this.getSightAndWeaponCombinatorialArr(), cooperation);
		new BounceCollision(scene, this.getBounceCombinatorialArr(), cooperation);
		new BulletCollision(scene, this.physicGroups.bulletGroup, this.getEnemyGroups());

		new HealerAura(scene, this.physicGroups.healer, this.physicGroups.tower, this.physicGroups.player);
	}

	private createPhysicGroups(scene: Gameplay) {
		let player = scene.physics.add.group();
		let playerWeapon = scene.physics.add.group();

		let tower = scene.physics.add.staticGroup();
		let bulletGroup = scene.physics.add.group();

		let healer = scene.physics.add.staticGroup();

		let pairs = {};
		let enemies = {};
		let enemyWeapons = {};
		let buildings = {};
		CampSetup.campIDs.forEach(id => {
			enemies[id] = scene.physics.add.group();
			enemyWeapons[id] = scene.physics.add.group();
			buildings[id] = scene.physics.add.staticGroup();
			//TODO: no duplication
			pairs[id] = { physicsGroup: enemies[id], weaponGroup: enemyWeapons[id] };
		});

		// //TODO: color -> camp so "boss" makes sense
		// enemies["boss"] = scene.physics.add.group();
		// enemyWeapons["boss"] = scene.physics.add.group();

		let areas = scene.physics.add.staticGroup();

		this.physicGroups = {
			player,
			playerWeapon,
			tower,
			bulletGroup,
			healer,

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
			[this.physicGroups.player, this.physicGroups.tower]
		]);
		result.push(
			...Object.keys(this.physicGroups.enemyWeapons).map(color => {
				return [
					[this.physicGroups.enemyWeapons[color]],
					Object.keys(this.physicGroups.enemyWeapons)
						.filter(secondColor => secondColor !== color)
						.map(secondColor => this.physicGroups.enemies[secondColor])
				];
			})
		);
		return result;
	}

	private getBounceCombinatorialArr() {
		let result = [];
		result.push([
			[this.physicGroups.player],
			[...this.getEnemyGroups(), this.physicGroups.tower] //TODO: enable again this.physicGroups.areas]
		]);
		result.push([
			[...Object.values(this.physicGroups.enemies)],
			[
				this.physicGroups.player,
				this.physicGroups.tower,
				this.physicGroups.areas,
				...Object.values(this.physicGroups.buildings)
			]
		]);
		result.push(
			...Object.keys(this.physicGroups.enemies).map(color => {
				return [
					[this.physicGroups.enemies[color]],
					Object.keys(this.physicGroups.enemies)
						.filter(secondColor => secondColor !== color)
						.map(secondColor => this.physicGroups.enemies[secondColor])
				];
			})
		);
		return result;
	}
}
