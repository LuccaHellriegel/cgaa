import { EnemyCircle } from "./units/EnemyCircle";
import { getRelativePosOfElements, getRelativePosOfElementsAndAroundElements } from "../base/position";
import { Area } from "../areas/Area";
import { Areas } from "../areas/Areas";
import { Camp } from "./Camp";

export class Enemies {
	enemyPhysicGroups = {};
	weaponPhysicGroups = {};
	units: EnemyCircle[] = [];
	camps: Camp[] = [];

	constructor(scene, areas: Areas, spawnManager, pathManager, enemyPhysicGroups, weaponPhysicGroups) {
		this.enemyPhysicGroups = enemyPhysicGroups;
		this.weaponPhysicGroups = weaponPhysicGroups;
		this.setupEventListeners(scene);
		let areasForBuildings = areas.getAreaForBuildings();
		areasForBuildings.forEach((area: Area) => {
			let enemyPhysicGroup = this.enemyPhysicGroups[area.color];
			let weaponPhysicGroup = this.weaponPhysicGroups[area.color];
			this.camps.push(new Camp(scene, area, spawnManager, pathManager, enemyPhysicGroup, weaponPhysicGroup));
		});
	}

	private setupEventListeners(scene) {
		scene.events.on("enemy-spawned", (enemy: EnemyCircle) => {
			this.units.push(enemy);
		});
	}

	getRelativeEnemyPositions() {
		return getRelativePosOfElements(this.units);
	}

	getRelativeEnemyPositionsAndAroundEnemyPositions() {
		return getRelativePosOfElementsAndAroundElements(this.units, 1, 1);
	}

	spawnUnits() {
		this.camps.forEach(camp => camp.spawnUnits());
	}
}
