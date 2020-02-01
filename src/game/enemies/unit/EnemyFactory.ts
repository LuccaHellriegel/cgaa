import { EnemyCircle } from "./EnemyCircle";
import { Gameplay } from "../../../scenes/Gameplay";
import { ChainWeapon } from "../../weapons/ChainWeapon";
import { RandWeapon } from "../../weapons/RandWeapon";
import { CirclePolygon } from "../../base/polygons/CirclePolygon";
import { normalCircleRadius, smallCircleRadius, bigCircleRadius } from "../../base/globals/globalSizes";
import { InteractionCircle } from "./InteractionCircle";
import { Enemies } from "./Enemies";
import { HealthBarFactory } from "../../base/ui/HealthBarFactory";
import { King } from "../boss/King";
import { CirclePhysics } from "../../base/pool/EnemyPool";

const radiusConfigs = { Small: smallCircleRadius, Normal: normalCircleRadius, Big: bigCircleRadius };

const veloConfigs = { Small: 185, Normal: 160, Big: 150 };

export type EnemySize = "Small" | "Normal" | "Big";

export type WeaponTypes = "rand" | "chain";

export interface EnemyConfig {
	scene: Gameplay;
	color: string;
	size: EnemySize;
	x: number;
	y: number;
	weaponType: WeaponTypes;
	physicsGroup: Phaser.Physics.Arcade.Group;
	weaponGroup: Phaser.Physics.Arcade.Group;
}

export interface CircleConfig {
	size: EnemySize;
	x: number;
	y: number;
	weaponType: WeaponTypes;
}

export class EnemyFactory {
	private baseConfig = {};

	constructor(
		private scene: Gameplay,
		private campID: string,
		private circlePhysics: CirclePhysics,
		private enemies: Enemies
	) {
		this.baseConfig = {
			scene: this.scene,
			color: campID,
			physicsGroup: this.circlePhysics.physicsGroup
		};
	}

	private createWeapon(weaponType: string, x: number, y: number, radius: number, size: string) {
		let weapon;
		if (weaponType === "chain") {
			weapon = new ChainWeapon(this.scene, x, y, this.circlePhysics.weaponGroup, null, radius, size);
		} else {
			weapon = new RandWeapon(this.scene, x, y, this.circlePhysics.weaponGroup, null, radius, size);
		}
		return weapon;
	}

	private afterCreate(circle) {
		circle.weapon.owner = circle;
		this.scene.children.bringToTop(circle.healthbar.bar);
		this.enemies.addEnemy(circle);
	}

	createKing(enemyConfig: CircleConfig) {
		let { x, y, weaponType } = enemyConfig;
		let size = "Big";
		let radius = radiusConfigs[size];
		let weapon = this.createWeapon(weaponType, x, y, radius, size);

		let healthbar = HealthBarFactory.createEnemyCircleHealthBar(this.scene, x, y, size);

		let circleConfig = {
			...this.baseConfig,
			x,
			y,
			weapon,
			polygon: new CirclePolygon(x, y, radius),
			texture: "kingCircle",
			healthbar,
			radius
		};

		let circle = new King(circleConfig, veloConfigs[size]);
		this.afterCreate(circle);

		return circle;
	}

	//TODO: remove duplication
	createBoss(enemyConfig: CircleConfig) {
		let { size, x, y, weaponType } = enemyConfig;
		size = "Big";
		let radius = radiusConfigs[size];
		let weapon = this.createWeapon(weaponType, x, y, radius, size);

		let healthbar = HealthBarFactory.createEnemyCircleHealthBar(this.scene, x, y, size);

		let circleConfig = {
			...this.baseConfig,
			x,
			y,
			weapon,
			polygon: new CirclePolygon(x, y, radius),
			texture: "bossCircle",
			healthbar,
			radius
		};

		let circle = new EnemyCircle(circleConfig, veloConfigs[size]);
		this.afterCreate(circle);

		return circle;
	}

	createEnemy(enemyConfig: CircleConfig) {
		let { size, x, y, weaponType } = enemyConfig;
		let radius = radiusConfigs[size];
		let weapon = this.createWeapon(weaponType, x, y, radius, size);

		let healthbar = HealthBarFactory.createEnemyCircleHealthBar(this.scene, x, y, size);

		let circleConfig = {
			...this.baseConfig,
			x,
			y,
			weapon,
			polygon: new CirclePolygon(x, y, radius),
			texture: this.campID + size + "Circle",
			healthbar,
			radius
		};

		let circle = new EnemyCircle(circleConfig, veloConfigs[size]);
		this.afterCreate(circle);

		return circle;
	}

	createInteractionCircle(config) {
		let { x, y } = config;

		let size = "Normal";

		let radius = radiusConfigs["Normal"];

		let healthbar = HealthBarFactory.createEnemyCircleHealthBar(this.scene, x, y, size);

		let circleConfig = {
			...this.baseConfig,
			x,
			y,
			weapon: new ChainWeapon(this.scene, x, y, this.circlePhysics.weaponGroup, null, radius, size),
			polygon: new CirclePolygon(x, y, radius),
			texture: this.campID + "InteractionCircle",
			healthbar,
			radius
		};

		let circle = new InteractionCircle(circleConfig);
		this.afterCreate(circle);

		return circle;
	}

	static createKing(enemyConfig: EnemyConfig, enemies: Enemies) {
		let { scene, color, size, x, y, weaponType, physicsGroup, weaponGroup } = enemyConfig;
		size = "Big";
		let radius = radiusConfigs[size];
		let weapon;
		if (weaponType === "chain") {
			weapon = new ChainWeapon(scene, x, y, weaponGroup, null, radius, size);
		} else {
			weapon = new RandWeapon(scene, x, y, weaponGroup, null, radius, size);
		}

		let healthbar = HealthBarFactory.createEnemyCircleHealthBar(scene, x, y, size);

		let circleConfig = {
			scene,
			color,
			x,
			y,
			weapon,
			polygon: new CirclePolygon(x, y, radius),
			texture: "kingCircle",
			healthbar,
			radius,
			physicsGroup
		};

		let circle = new King(circleConfig, veloConfigs[size]);
		weapon.owner = circle;
		scene.children.bringToTop(healthbar.bar);
		enemies.addEnemy(circle);

		return circle;
	}

	//TODO: remove duplication
	static createBoss(enemyConfig: EnemyConfig, enemies: Enemies) {
		let { scene, color, size, x, y, weaponType, physicsGroup, weaponGroup } = enemyConfig;
		size = "Big";
		let radius = radiusConfigs[size];

		let weapon;
		if (weaponType === "chain") {
			weapon = new ChainWeapon(scene, x, y, weaponGroup, null, radius, size);
		} else {
			weapon = new RandWeapon(scene, x, y, weaponGroup, null, radius, size);
		}

		let healthbar = HealthBarFactory.createEnemyCircleHealthBar(scene, x, y, size);

		let circleConfig = {
			scene,
			color,
			x,
			y,
			weapon,
			polygon: new CirclePolygon(x, y, radius),
			texture: "bossCircle",
			healthbar,
			radius,
			physicsGroup
		};

		let circle = new EnemyCircle(circleConfig, veloConfigs[size]);
		weapon.owner = circle;
		scene.children.bringToTop(healthbar.bar);

		enemies.addEnemy(circle);

		return circle;
	}

	static createEnemy(enemyConfig: EnemyConfig, enemies: Enemies) {
		let { scene, color, size, x, y, weaponType, physicsGroup, weaponGroup } = enemyConfig;
		let radius = radiusConfigs[size];

		let weapon;
		if (weaponType === "chain") {
			weapon = new ChainWeapon(scene, x, y, weaponGroup, null, radius, size);
		} else {
			weapon = new RandWeapon(scene, x, y, weaponGroup, null, radius, size);
		}

		let healthbar = HealthBarFactory.createEnemyCircleHealthBar(scene, x, y, size);

		let circleConfig = {
			scene,
			color,
			x,
			y,
			weapon,
			polygon: new CirclePolygon(x, y, radius),
			texture: color + size + "Circle",
			healthbar,
			radius,
			physicsGroup
		};

		let circle = new EnemyCircle(circleConfig, veloConfigs[size]);
		weapon.owner = circle;
		scene.children.bringToTop(healthbar.bar);

		enemies.addEnemy(circle);

		return circle;
	}

	static createInteractionCircle(config, enemies: Enemies) {
		let { scene, color, x, y, physicsGroup, weaponGroup } = config;

		let size = "Normal";

		let radius = radiusConfigs["Normal"];

		let healthbar = HealthBarFactory.createEnemyCircleHealthBar(scene, x, y, size);

		let circleConfig = {
			scene,
			color,
			x,
			y,
			weapon: new ChainWeapon(scene, x, y, weaponGroup, null, radius, size),
			polygon: new CirclePolygon(x, y, radius),
			texture: color + "InteractionCircle",
			healthbar,
			radius,
			physicsGroup
		};

		let circle = new InteractionCircle(circleConfig);
		circleConfig.weapon.owner = circle;
		scene.children.bringToTop(healthbar.bar);

		enemies.addEnemy(circle);

		return circle;
	}
}
