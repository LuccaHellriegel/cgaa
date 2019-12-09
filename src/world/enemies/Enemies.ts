import { Gameplay } from "../../scenes/Gameplay";
import { EnemyCircle } from "./units/EnemyCircle";
import { BaseManagerConfig } from "../base/config";
import { applyBaseManagerConfig } from "../base/apply";
import { executeOverAllCamps } from "../../globals/global";
import { getRelativePosOfElements, getRelativePosOfElementsAndAroundElements } from "../base/position";
import { Player } from "../player/Player";
import { Area } from "../areas/Area";
import { EnemyConfig } from "./units/EnemyFactory";
import { AreaPopulator } from "./populators/AreaPopulator";
import { BuildingPopulator } from "./populators/BuildingPopulator";

export class Enemies {
	scene: Gameplay;
	enemyPhysicGroups = {};
	weaponPhysicGroups = {};
	units: EnemyCircle[] = [];

	constructor(config: BaseManagerConfig) {
		applyBaseManagerConfig(this, config);

		executeOverAllCamps(color => {
			this.enemyPhysicGroups[color] = this.scene.physics.add.group();
			this.weaponPhysicGroups[color] = this.scene.physics.add.group();
		});

		this.spawnUnits();
	}

	addEnemy(enemy) {
		this.units.push(enemy);
	}

	getRelativeEnemyPositions() {
		return getRelativePosOfElements(this.units);
	}

	getRelativeEnemyPositionsAndAroundEnemyPositions() {
		return getRelativePosOfElementsAndAroundElements(this.units, 1, 1);
	}

	spawnUnits() {
		Player.withChainWeapon(this.scene);
		this.scene.world.executeWithAreasThatHaveBuilding((area: Area) => {
			let enemyPhysicGroup = this.enemyPhysicGroups[area.color];
			let weaponPhysicGroup = this.weaponPhysicGroups[area.color];
			let enemyConfig: EnemyConfig = {
				scene: this.scene,
				color: area.color,
				size: "Normal",
				x: 0,
				y: 0,
				weaponType: "rand",
				physicsGroup: enemyPhysicGroup,
				weaponGroup: weaponPhysicGroup
			};
			new AreaPopulator(enemyConfig, area).startPopulating();
			area.buildings.forEach(building => {
				new BuildingPopulator(enemyConfig, building).startPopulating();
			});
		});
	}
}
