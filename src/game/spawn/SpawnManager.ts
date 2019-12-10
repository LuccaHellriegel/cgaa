import { Area } from "../areas/Area";
import { Tower } from "../player/towers/Tower";
import { Building } from "../enemies/units/Building";
import { towerSymbol, buildingSymbol, wallSymbol, exitSymbol } from "../../globals/globalSymbols";
import { realPosToRelativePos } from "../base/position";
import { extractSpawnPosFromSpawnableArrForArea } from "../base/spawn";
import { updateMapWithElementAndAroundElements, updateMapWithElement } from "../base/map";
import { Enemies } from "../enemies/Enemies";

export class SpawnManager {
	spawnableArrForEnemiesBase;
	spawnableArrForEnemies;
	spawnableArrForTowersBase;
	spawnableArrForTowers;
	enemies: Enemies;

	constructor(scene, walkableMap) {
		this.initBaseArrs(walkableMap);
		this.setupEventListeners(scene);
	}

	setEnemies(enemies: Enemies) {
		this.enemies = enemies;
	}

	private initBaseArrs(walkableMap) {
		this.spawnableArrForEnemiesBase = JSON.parse(JSON.stringify(walkableMap));
		this.spawnableArrForTowersBase = JSON.parse(JSON.stringify(walkableMap));
		this.markCampsAsNonTowerSpawn();
		console.log(this.spawnableArrForTowersBase);
	}

	private markCampsAsNonTowerSpawn() {
		let numberOfWallParts = 0;
		for (let row = 0; row < this.spawnableArrForTowersBase.length; row++) {
			for (let column = 0; column < this.spawnableArrForTowersBase[0].length; column++) {
				if (
					this.spawnableArrForTowersBase[row][column] === wallSymbol ||
					this.spawnableArrForTowersBase[row][column] === exitSymbol
				) {
					numberOfWallParts++;
				}
				if (numberOfWallParts === 1) {
					this.spawnableArrForTowersBase[row][column] = wallSymbol;
				}
				if (numberOfWallParts === 2) {
					numberOfWallParts = 0;
				}
			}
		}
	}

	private updateBaseArrs(element, isTower, removed) {
		let symbol = isTower ? towerSymbol : buildingSymbol;
		let width = isTower ? 1 : 3;
		let height = 1;

		if (isTower) {
			updateMapWithElementAndAroundElements(this.spawnableArrForEnemiesBase, element, symbol, removed, width, height);
			updateMapWithElement(this.spawnableArrForTowersBase, element, towerSymbol, removed);
		} else {
			//TODO
		}
	}

	private setupEventListeners(scene) {
		scene.events.on("added-building", (building: Building) => {
			this.updateBaseArrs(building, false, false);
		});

		scene.events.on("removed-building", (building: Building) => {
			this.updateBaseArrs(building, false, true);
		});

		scene.events.on("added-tower", (tower: Tower) => {
			this.updateBaseArrs(tower, false, false);
		});

		scene.events.on("removed-tower", (tower: Tower) => {
			this.updateBaseArrs(tower, false, true);
		});
	}

	private updateSpawnableArrForTowers() {
		this.spawnableArrForTowers = JSON.parse(JSON.stringify(this.spawnableArrForTowersBase));
		this.addEnemiesToSpawnableArr(true);
	}

	private updateSpawnableArrForEnemies() {
		this.spawnableArrForEnemies = JSON.parse(JSON.stringify(this.spawnableArrForEnemiesBase));
		this.addEnemiesToSpawnableArr(false);
	}

	private addEnemiesToSpawnableArr(isForTower) {
		let spawnableArr = isForTower ? this.spawnableArrForTowers : this.spawnableArrForEnemies;

		let relativePos;
		if (isForTower) {
			relativePos = this.enemies.getRelativeEnemyPositionsAndAroundEnemyPositions();
		} else {
			relativePos = this.enemies.getRelativeEnemyPositions();
		}

		relativePos.forEach(pos => {
			spawnableArr[pos.row][pos.column] = 4;
		});
	}

	evaluateRealSpawnPosOfTower(x, y) {
		this.updateSpawnableArrForTowers();
		let { row, column } = realPosToRelativePos(x, y);
		return this.spawnableArrForTowers[row][column] === 0;
	}

	filterForValidEnemySpawnPos(spawnPos) {
		this.updateSpawnableArrForEnemies();
		let validPos: any[] = [];
		spawnPos.forEach(pos => {
			if (this.spawnableArrForEnemies[pos.row][pos.column] === 0) validPos.push(pos);
		});

		return validPos;
	}

	getValidSpawnPosForEnemiesInArea(area: Area): { column: number; row: number }[] {
		this.updateSpawnableArrForEnemies();
		return extractSpawnPosFromSpawnableArrForArea(
			area.relativeTopLeftX,
			area.relativeTopLeftY,
			area.relativeWidth,
			area.relativeHeight,
			this.spawnableArrForEnemies
		);
	}
}
