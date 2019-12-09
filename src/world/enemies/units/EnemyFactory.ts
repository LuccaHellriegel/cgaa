import { WeaponTypes } from "../../weapons/WeaponFactory";
import { EnemyCircle, EnemyCircleConfig } from "./EnemyCircle";
import { Gameplay } from "../../../scenes/Gameplay";
import { HealthBar } from "../../base/classes/HealthBar";
import { ChainWeapon } from "../../weapons/ChainWeapon";
import { RandWeapon } from "../../weapons/RandWeapon";
import { CirclePolygon } from "../../base/polygons/CirclePolygon";
import { normalCircleRadius } from "../../../globals/globalSizes";

const healthBarConfigs = {
	Small: { posCorrectionX: -26, posCorrectionY: -38, healthWidth: 46, healthLength: 12, value: 100, scene: null },
	Normal: { posCorrectionX: -26, posCorrectionY: -38, healthWidth: 46, healthLength: 12, value: 100, scene: null },
	Big: { posCorrectionX: -26, posCorrectionY: -38, healthWidth: 46, healthLength: 12, value: 100, scene: null }
};

export type EnemySize = "Small" | "Normal" | "Big";

export interface EnemyConfig {
	scene: Gameplay;
	color: string;
	size: EnemySize;
	x: number;
	y: number;
	weaponType: WeaponTypes;
	physicsGroup;
	weaponGroup;
}

export class EnemyFactory {
	private constructor() {}

	static createEnemy(enemyConfig: EnemyConfig) {
		let { scene, color, size, x, y, weaponType, physicsGroup, weaponGroup } = enemyConfig;

		let healthBarConfig = healthBarConfigs[size];
		healthBarConfig["scene"] = scene;

		let healthbar = new HealthBar(x, y, healthBarConfig);

		let weapon;
		if (weaponType === "chain") {
			weapon = new ChainWeapon(scene, x, y, weaponGroup, null);
		} else {
			weapon = new RandWeapon(scene, x, y, weaponGroup, null);
		}

		let radius = normalCircleRadius;

		let polygon = new CirclePolygon(x, y, radius);

		let texture = color + size + "Circle";

		let circleConfig: EnemyCircleConfig = {
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

		let circle = new EnemyCircle(circleConfig);
		weapon.owner = circle;
		scene.children.bringToTop(healthbar.bar);

		return circle;
	}
}
