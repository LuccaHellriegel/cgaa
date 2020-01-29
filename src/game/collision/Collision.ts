import { Gameplay } from "../../scenes/Gameplay";
import { executeOverAllCamps } from "../base/globals/global";
import { BulletCollision } from "./BulletCollision";
import { SightOverlap } from "./SightOverlap";
import { BounceCollision } from "./BounceCollision";
import { HealerAura } from "./HealerAura";

export interface PhysicGroups {
	player: Phaser.Physics.Arcade.Group;
	playerWeapon: Phaser.Physics.Arcade.Group;
	shooter: Phaser.Physics.Arcade.StaticGroup;
	healer: Phaser.Physics.Arcade.StaticGroup;
	enemies: {};
	enemyWeapons: {};
	areas: Phaser.Physics.Arcade.StaticGroup;
	shooterBulletGroup: Phaser.Physics.Arcade.Group;
	buildings: {};
}

export class Collision {
	physicGroups: PhysicGroups;

	constructor(scene: Gameplay) {
		this.createPhysicGroups(scene);

		new SightOverlap(scene, this.getSightAndWeaponCombinatorialArr());
		new BounceCollision(scene, this.getBounceCombinatorialArr());
		new BulletCollision(scene, this.physicGroups.shooterBulletGroup, this.getEnemyGroups());

		new HealerAura(scene, this.physicGroups.healer, this.physicGroups.shooter, this.physicGroups.player);
	}

	private createPhysicGroups(scene: Gameplay) {
		let player = scene.physics.add.group();
		let playerWeapon = scene.physics.add.group();

		//TODO: shooter should be tower, as it is used in Healer too
		let shooter = scene.physics.add.staticGroup();
		let shooterBulletGroup = scene.physics.add.group();

		let healer = scene.physics.add.staticGroup();

		let enemies = {};
		let enemyWeapons = {};
		let buildings = {};
		executeOverAllCamps(color => {
			enemies[color] = scene.physics.add.group();
			enemyWeapons[color] = scene.physics.add.group();
			buildings[color] = scene.physics.add.staticGroup();
		});

		//TODO: color -> camp so "boss" makes sense
		enemies["boss"] = scene.physics.add.group();
		enemyWeapons["boss"] = scene.physics.add.group();

		let areas = scene.physics.add.staticGroup();

		this.physicGroups = {
			player,
			playerWeapon,
			shooter,
			shooterBulletGroup,
			healer,

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
			[this.physicGroups.player, this.physicGroups.shooter]
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
			[...this.getEnemyGroups(), this.physicGroups.shooter] //TODO: enable again this.physicGroups.areas]
		]);
		result.push([
			[...Object.values(this.physicGroups.enemies)],
			[
				this.physicGroups.player,
				this.physicGroups.shooter,
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
