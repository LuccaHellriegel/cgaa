import { Manager } from "../base/Base";
import { Gameplay } from "../scenes/Gameplay";
import { PositionService } from "../services/PositionService";
import { SpawnService } from "./SpawnService";
import { Area } from "../env/areas/Area";
import { Tower } from "../units/towers/Tower";
import { towerSymbol, walkableSymbol } from "../globals/globalMarking";
import { MapService } from "../services/MapService";

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

  private setupEventListeners() {
    //TODO: building add and remove

    this.scene.events.on("added-tower", (tower: Tower) => {
      MapService.updateMapWithElementAndAroundElements(this.spawnableArrForEnemiesBase, tower, towerSymbol, false);
      MapService.updateMapWithElement(this.spawnableArrForTowersBase, tower, towerSymbol, false);
    });

    this.scene.events.on("removed-tower", (tower: Tower) => {
      //TODO
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
