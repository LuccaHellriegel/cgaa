import { EnemyCircle } from "./EnemyCircle";
import { Gameplay } from "../../../scenes/Gameplay";
import { ChainWeapon } from "../../weapons/ChainWeapon";
import { RandWeapon } from "../../weapons/RandWeapon";
import { CirclePolygon } from "../../base/polygons/CirclePolygon";
import { normalCircleRadius, smallCircleRadius, bigCircleRadius } from "../../base/globals/globalSizes";
import { InteractionCircle } from "./InteractionCircle";
import { Enemies } from "./Enemies";
import { HealthBarFactory } from "../../base/ui/HealthBarFactory";

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

export class EnemyFactory {
	private constructor() {}

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
