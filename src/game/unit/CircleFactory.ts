import { Gameplay } from "../../scenes/Gameplay";
import { Enemies } from "./Enemies";
import { HealthBarFactory } from "../ui/healthbar/HealthBarFactory";
import { King } from "./King";
import { DangerousCircle } from "./DangerousCircle";
import { PlayerFriend } from "./PlayerFriend";
import { InteractionCircle } from "./InteractionCircle";
import { CampID } from "../setup/CampSetup";
import { HealthBar } from "../ui/healthbar/HealthBar";
import { ChainWeapon } from "../weapon/chain/weapon";
import { ChainWeapons } from "../weapon/chain/group";
import { UnitSetup } from "../setup/UnitSetup";
import { weaponHeights } from "../weapon/chain/data";

const veloConfigs = { Small: 185, Normal: 160, Big: 150 };

export type EnemySize = "Small" | "Normal" | "Big";

export type WeaponTypes = "chain";

export class CircleConfig {
	scene: Gameplay;
	campID: CampID;
	x: number;
	y: number;
	weapon: ChainWeapon;
	physicsGroup: Phaser.Physics.Arcade.Group;
	polygon: any;
	texture: string;
	radius: number;
}
export interface EnemyConfig extends CircleConfig {
	size: EnemySize;
	healthbar: HealthBar;
}

export class CircleFactory {
	x = 0;
	y = 0;

	constructor(
		private scene: Gameplay,
		private campID: string,
		private addUnit: Function,
		private enemies: Enemies,
		private weaponPools: { [key in EnemySize]: ChainWeapons }
	) {}

	private createWeapon(x: number, y: number, size: EnemySize) {
		console.log(this.weaponPools);
		return this.weaponPools[size].placeWeapon(x, y - UnitSetup.sizeDict[size] - weaponHeights[size].frame2 / 2);
	}

	private afterCreate(circle) {
		this.addUnit(circle);

		circle.weapon.setOwner(circle);
		circle.camp = this.campID;
		this.scene.children.bringToTop(circle.healthbar.bar);
		this.enemies.addEnemy(circle);
	}

	createKing() {
		let size: EnemySize = "Big";
		let weapon = this.createWeapon(this.x, this.y, size);

		let healthbar = HealthBarFactory.createDangerousCircleHealthBar(this.scene, this.x, this.y, size);

		let circle = new King(
			this.scene,
			this.x,
			this.y,
			"kingCircle",
			this.campID as CampID,
			weapon,
			size as EnemySize,
			healthbar,
			veloConfigs[size]
		);
		this.afterCreate(circle);

		return circle;
	}

	createBoss() {
		let size: EnemySize = "Big";
		let weapon = this.createWeapon(this.x, this.y, size);

		let healthbar = HealthBarFactory.createDangerousCircleHealthBar(this.scene, this.x, this.y, size);

		let circle = new DangerousCircle(
			this.scene,
			this.x,
			this.y,
			"bossCircle",
			this.campID as CampID,
			weapon,
			size as EnemySize,
			healthbar,
			veloConfigs[size]
		);
		this.afterCreate(circle);

		return circle;
	}

	createEnemy(size: EnemySize) {
		let weapon = this.createWeapon(this.x, this.y, size);
		let healthbar = HealthBarFactory.createDangerousCircleHealthBar(this.scene, this.x, this.y, size);

		let circle = new DangerousCircle(
			this.scene,
			this.x,
			this.y,
			this.campID + size + "Circle",
			this.campID as CampID,
			weapon,
			size as EnemySize,
			healthbar,
			veloConfigs[size]
		);
		this.afterCreate(circle);

		return circle;
	}

	createFriend(size: EnemySize) {
		let weapon = this.createWeapon(this.x, this.y, size);

		let healthbar = HealthBarFactory.createDangerousCircleHealthBar(this.scene, this.x, this.y, size);

		let circle = new PlayerFriend(
			this.scene,
			this.x,
			this.y,
			this.campID + size + "Circle",
			this.campID as CampID,
			weapon,
			size as EnemySize,
			healthbar,
			veloConfigs[size]
		);
		this.afterCreate(circle);

		return circle;
	}

	createInteractionCircle(config) {
		let { x, y } = config;

		let size: EnemySize = "Normal";
		let healthbar = HealthBarFactory.createDangerousCircleHealthBar(this.scene, x, y, size);

		let circle = new InteractionCircle(
			this.scene,
			x,
			y,
			this.campID + "InteractionCircle",
			this.campID as CampID,
			this.createWeapon(x, y, size),
			size as EnemySize,
			healthbar
		);
		this.afterCreate(circle);

		return circle;
	}
}
