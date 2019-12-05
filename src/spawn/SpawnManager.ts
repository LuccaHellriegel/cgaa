import { Manager } from "../base/Base";
import { Gameplay } from "../scenes/Gameplay";
import { PositionService } from "../services/PositionService";
import { SpawnService } from "./SpawnService";
import { Area } from "../env/areas/Area";
import { Tower } from "../units/towers/Tower";
import { towerSymbol, walkableSymbol, buildingSymbol } from "../globals/globalMarking";
import { MapService } from "../services/MapService";
import { Building } from "../env/buildings/Building";

export class SpawnManager extends Manager {
  spawnableArrForEnemiesBase;
  spawnableArrForEnemies;
  spawnableArrForTowersBase;
  spawnableArrForTowers;

  constructor(scene: Gameplay) {
    super(scene, "spawnManager");
    this.initBaseArrs();
    this.setupEventListeners();
  }

  private initBaseArrs() {
    this.spawnableArrForEnemiesBase = JSON.parse(JSON.stringify(this.scene.pathManager.elements));
    this.spawnableArrForTowersBase = JSON.parse(JSON.stringify(this.scene.pathManager.elements));
    SpawnService.updateBuildingSpawnableArr(this.spawnableArrForTowersBase);
  }

  private updateBaseArrs(element, isTower, removed) {
    let symbol = isTower ? towerSymbol : buildingSymbol;
    let width = isTower ? 1 : 3;
    let height = 1;

    if (isTower) {
      MapService.updateMapWithElementAndAroundElements(
        this.spawnableArrForEnemiesBase,
        element,
        symbol,
        removed,
        width,
        height
      );
      MapService.updateMapWithElement(this.spawnableArrForTowersBase, element, towerSymbol, removed);
    } else {
      //TODO
    }
  }

  private setupEventListeners() {
    this.scene.events.on("added-building", (building: Building) => {
      this.updateBaseArrs(building, false, false);
    });

    this.scene.events.on("removed-building", (building: Building) => {
      this.updateBaseArrs(building, false, true);
    });

    this.scene.events.on("added-tower", (tower: Tower) => {
      this.updateBaseArrs(tower, false, false);
    });

    this.scene.events.on("removed-tower", (tower: Tower) => {
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
      relativePos = this.scene.enemyManager.getRelativeEnemyPositionsAndAroundEnemyPositions();
    } else {
      relativePos = this.scene.enemyManager.getRelativeEnemyPositions();
    }

    relativePos.forEach(pos => {
      spawnableArr[pos.row][pos.column] = 4;
    });
  }

  evaluateRealSpawnPosOfTower(x, y) {
    this.updateSpawnableArrForTowers();
    let { row, column } = PositionService.findCurRelativePosition(this.spawnableArrForTowers, x, y);
    return this.spawnableArrForTowers[row][column] === 0;
  }

  evaluateRealSpawnPosOfEnemy(x, y) {
    //TODO: enemy spawning is to often for always copying?
    this.updateSpawnableArrForEnemies();
    let { row, column } = PositionService.findCurRelativePosition(this.spawnableArrForEnemies, x, y);
    return this.spawnableArrForEnemies[row][column] === 0;
  }

  getValidSpawnPosForEnemiesInArea(area: Area) {
    this.updateSpawnableArrForEnemies();
    return SpawnService.extractSpawnPosFromSpawnableArrForArea(
      area.relativeTopLeftX,
      area.relativeTopLeftY,
      area.relativeWidth,
      area.relativeHeight,
      this.spawnableArrForEnemies
    );
  }
}
