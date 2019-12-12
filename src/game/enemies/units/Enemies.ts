import { EnemyCircle } from "./EnemyCircle";
import { Area } from "../../areas/Area";
import { Camp } from "./Camp";
import { Gameplay } from "../../../scenes/Gameplay";
import { Building } from "./Building";
import { getRandomCampColorOrder } from "../../../globals/global";
import { EnemySpawnMap } from "../../spawn/EnemySpawnMap";

export class Enemies {
	enemyPhysicGroups = {};
	weaponPhysicGroups = {};
	units: EnemyCircle[];
	camps: Camp[] = [];
	campIndex = 0;
	scene: Gameplay;

	constructor(
		scene,
		areasForBuildings,
		enemySpawnMap: EnemySpawnMap,
		pathManager,
		enemyPhysicGroups,
		weaponPhysicGroups,
		buildingPhysicGroups,
		enemyArr
	) {
		this.units = enemyArr;
		let colors = getRandomCampColorOrder();
		this.enemyPhysicGroups = enemyPhysicGroups;
		this.weaponPhysicGroups = weaponPhysicGroups;
		this.setupEventListeners(scene);
		areasForBuildings.forEach((area: Area) => {
			let color = colors.pop();
			let enemyPhysicGroup = this.enemyPhysicGroups[color];
			let weaponPhysicGroup = this.weaponPhysicGroups[color];
			let buildingPhysicGroup = buildingPhysicGroups[color];
			this.camps.push(
				new Camp(
					scene,
					area,
					enemySpawnMap,
					pathManager,
					color,
					enemyPhysicGroup,
					weaponPhysicGroup,
					buildingPhysicGroup
				)
			);
		});
		this.scene = scene;
	}

	private setupEventListeners(scene) {
		scene.events.on("added-enemy", (enemy: EnemyCircle) => {
			this.units.push(enemy);
		});
		scene.events.on("cooperation-established", (campColor, cooperationColor) =>
			this.establishCooperation(campColor, cooperationColor)
		);
	}

	getBuildings() {
		let buildings: Building[] = [];
		this.camps.forEach(camp => (buildings = buildings.concat(camp.buildings)));
		return buildings;
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

	bringUnitsToTop() {
		this.units.forEach(unit => {
			this.scene.children.bringToTop(unit);
			this.scene.children.bringToTop(unit.weapon);
			this.scene.children.bringToTop(unit.healthbar.bar);
		});
		let buildings = this.getBuildings();
		buildings.forEach(building => {
			this.scene.children.bringToTop(building);
			this.scene.children.bringToTop(building.healthbar.bar);
		});
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
