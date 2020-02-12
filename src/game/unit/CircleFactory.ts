import { UnitSetup } from "../setup/UnitSetup";
import { Gameplay } from "../../scenes/Gameplay";
import { CirclePhysics } from "../pool/EnemyPool";
import { Enemies } from "./Enemies";
import { ChainWeapon } from "../weapon/ChainWeapon";
import { RandWeapon } from "../weapon/RandWeapon";
import { HealthBarFactory } from "../ui/healthbar/HealthBarFactory";
import { CirclePolygon } from "../polygons/CirclePolygon";
import { King } from "./King";
import { DangerousCircle } from "./DangerousCircle";
import { InteractionCircle } from "./InteractionCircle";
import { CampID } from "../setup/CampSetup";
import { HealthBar } from "../ui/healthbar/HealthBar";
import { Weapon } from "../weapon/Weapon";

const radiusConfigs = {
	Small: UnitSetup.smallCircleRadius,
	Normal: UnitSetup.normalCircleRadius,
	Big: UnitSetup.bigCircleRadius
};

const veloConfigs = { Small: 185, Normal: 160, Big: 150 };

export type EnemySize = "Small" | "Normal" | "Big";

export type WeaponTypes = "rand" | "chain";

export class CircleConfig {
	scene: Gameplay;
	campID: CampID;
	x: number;
	y: number;
	weapon: Weapon;
	physicsGroup: Phaser.Physics.Arcade.Group;
	polygon: any;
	texture: string;
	radius: number;
}
export interface EnemyConfig extends CircleConfig {
	size: EnemySize;
	healthbar: HealthBar;
}

export interface CircleFactoryConfig {
	size: EnemySize;
	x: number;
	y: number;
	weaponType: WeaponTypes;
}

export class CircleFactory {
	private baseConfig = {};

	constructor(
		private scene: Gameplay,
		private campID: string,
		private circlePhysics: CirclePhysics,
		private enemies: Enemies
	) {
		this.baseConfig = {
			scene,
			campID,
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
		circle.camp = this.campID;
		this.scene.children.bringToTop(circle.healthbar.bar);
		this.enemies.addEnemy(circle);
	}

	createKing(enemyConfig: CircleFactoryConfig) {
		let { x, y, weaponType } = enemyConfig;
		let size = "Big";
		let radius = radiusConfigs[size];
		let weapon = this.createWeapon(weaponType, x, y, radius, size);

		let healthbar = HealthBarFactory.createDangerousCircleHealthBar(this.scene, x, y, size);

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

		let circle = new King(circleConfig as EnemyConfig, veloConfigs[size]);
		this.afterCreate(circle);

		return circle;
	}

	//TODO: remove duplication
	createBoss(enemyConfig: CircleFactoryConfig) {
		let { size, x, y, weaponType } = enemyConfig;
		size = "Big";
		let radius = radiusConfigs[size];
		let weapon = this.createWeapon(weaponType, x, y, radius, size);

		let healthbar = HealthBarFactory.createDangerousCircleHealthBar(this.scene, x, y, size);

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

		let circle = new DangerousCircle(circleConfig as EnemyConfig, veloConfigs[size]);
		this.afterCreate(circle);

		return circle;
	}

	createEnemy(enemyConfig: CircleFactoryConfig) {
		let { size, x, y, weaponType } = enemyConfig;
		let radius = radiusConfigs[size];
		let weapon = this.createWeapon(weaponType, x, y, radius, size);

		let healthbar = HealthBarFactory.createDangerousCircleHealthBar(this.scene, x, y, size);

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

		let circle = new DangerousCircle(circleConfig as EnemyConfig, veloConfigs[size]);
		this.afterCreate(circle);

		return circle;
	}

	createInteractionCircle(config) {
		let { x, y } = config;

		let size = "Normal";

		let radius = radiusConfigs["Normal"];

		let healthbar = HealthBarFactory.createDangerousCircleHealthBar(this.scene, x, y, size);

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
}
