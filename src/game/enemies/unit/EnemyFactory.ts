import { EnemyCircle } from "./EnemyCircle";
import { Gameplay } from "../../../scenes/Gameplay";
import { HealthBar } from "../../base/classes/HealthBar";
import { ChainWeapon } from "../../weapons/ChainWeapon";
import { RandWeapon } from "../../weapons/RandWeapon";
import { CirclePolygon } from "../../base/polygons/CirclePolygon";
import { normalCircleRadius, smallCircleRadius, bigCircleRadius } from "../../base/globals/globalSizes";
import { InteractionCircle } from "./InteractionCircle";

const healthBarConfigs = {
	Small: { posCorrectionX: -26, posCorrectionY: -38, healthWidth: 41, healthLength: 8, value: 40, scene: null },
	Normal: { posCorrectionX: -26, posCorrectionY: -38, healthWidth: 46, healthLength: 12, value: 100, scene: null },
	Big: { posCorrectionX: -26, posCorrectionY: -38, healthWidth: 51, healthLength: 17, value: 200, scene: null }
};

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

	static createEnemy(enemyConfig: EnemyConfig) {
		let { scene, color, size, x, y, weaponType, physicsGroup, weaponGroup } = enemyConfig;

		let healthBarConfig = healthBarConfigs[size];
		healthBarConfig["scene"] = scene;

		let healthbar = new HealthBar(x, y, healthBarConfig);

		let radius = radiusConfigs[size];

		let weapon;
		if (weaponType === "chain") {
			weapon = new ChainWeapon(scene, x, y, weaponGroup, null, radius, size);
		} else {
			weapon = new RandWeapon(scene, x, y, weaponGroup, null, radius, size);
		}

		let polygon = new CirclePolygon(x, y, radius);

		let texture = color + size + "Circle";

		let circleConfig = {
			scene,
			color,
			x,
			y,
			weapon,
			polygon,
			texture,
			healthbar,
			radius,
			physicsGroup
		};

		let circle = new EnemyCircle(circleConfig, veloConfigs[size]);
		weapon.owner = circle;
		scene.children.bringToTop(healthbar.bar);

		scene.cgaa.enemyDict[circle.id] = circle;

		return circle;
	}

	static createInteractionCircle(config) {
		let { scene, color, x, y, physicsGroup, weaponGroup } = config;

		let healthBarConfig = healthBarConfigs["Normal"];
		healthBarConfig["scene"] = scene;

		let healthbar = new HealthBar(x, y, healthBarConfig);

		let radius = radiusConfigs["Normal"];

		let weapon = new ChainWeapon(scene, x, y, weaponGroup, null, radius, "Normal");

		let polygon = new CirclePolygon(x, y, radius);

		let texture = color + "InteractionCircle";

		let circleConfig = {
			scene,
			color,
			x,
			y,
			weapon,
			polygon,
			texture,
			healthbar,
			radius,
			physicsGroup
		};

		let circle = new InteractionCircle(circleConfig);
		weapon.owner = circle;
		scene.children.bringToTop(healthbar.bar);

		scene.cgaa.enemyDict[circle.id] = circle;

		return circle;
	}
}
