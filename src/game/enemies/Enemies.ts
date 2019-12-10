import { EnemyCircle } from "./units/EnemyCircle";
import { getRelativePosOfElements, getRelativePosOfElementsAndAroundElements } from "../base/position";
import { Area } from "../areas/Area";
import { Areas } from "../areas/Areas";
import { Camp } from "./Camp";
import { Gameplay } from "../../scenes/Gameplay";

export class Enemies {
	enemyPhysicGroups = {};
	weaponPhysicGroups = {};
	units: EnemyCircle[] = [];
	camps: Camp[] = [];
	campIndex = 0;
	scene: Gameplay;

	constructor(
		scene,
		areas: Areas,
		spawnManager,
		pathManager,
		enemyPhysicGroups,
		weaponPhysicGroups,
		buildingPhysicGroups
	) {
		this.enemyPhysicGroups = enemyPhysicGroups;
		this.weaponPhysicGroups = weaponPhysicGroups;
		this.setupEventListeners(scene);
		let areasForBuildings = areas.getAreaForBuildings();
		areasForBuildings.forEach((area: Area) => {
			let enemyPhysicGroup = this.enemyPhysicGroups[area.color];
			let weaponPhysicGroup = this.weaponPhysicGroups[area.color];
			let buildingPhysicGroup = buildingPhysicGroups[area.color];
			this.camps.push(
				new Camp(scene, area, spawnManager, pathManager, enemyPhysicGroup, weaponPhysicGroup, buildingPhysicGroup)
			);
		});
		this.scene = scene;
	}

	private setupEventListeners(scene) {
		scene.events.on("enemy-spawned", (enemy: EnemyCircle) => {
			this.units.push(enemy);
		});
		scene.events.on("cooperation-established", (campColor, cooperationColor) =>
			this.establishCooperation(campColor, cooperationColor)
		);
	}

	getRelativeEnemyPositions() {
		return getRelativePosOfElements(this.units);
	}

	getRelativeEnemyPositionsAndAroundEnemyPositions() {
		return getRelativePosOfElementsAndAroundElements(this.units, 1, 1);
	}

	spawnAreaUnits() {
		this.camps.forEach(camp => camp.spawnAreaUnits());
	}

	spawnWaveUnits() {
		if (this.campIndex == this.camps.length) {
			this.campIndex = 0;
		}
		this.camps[this.campIndex].resetWave();
		this.camps[this.campIndex].spawnWaveUnits();
		this.campIndex++;
		this.scene.time.addEvent({
			delay: 15000,
			callback: this.spawnWaveUnits,
			callbackScope: this,
			repeat: 0
		});
	}

	addInteractionUnits() {
		this.camps.forEach(camp => camp.addInteractionUnit());
	}

	establishCooperation(campColor, cooperationColor) {
		this.units.forEach(unit => {
			if (unit.color == campColor) {
				unit.dontAttackList.push(cooperationColor);
			}
		});
		this.camps.forEach(camp => {
			if (camp.color === campColor) camp.establishCooperation(cooperationColor);
		});
	}
}
