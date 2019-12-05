import { Manager } from "../base/Base";
import { Gameplay } from "../scenes/Gameplay";
import { PositionService } from "../services/PositionService";
import { SpawnService } from "./SpawnService";
import { Area } from "../env/areas/Area";

export class SpawnManager extends Manager {
  spawnableArrForEnemies;
  spawnableArrForTowers;

  constructor(scene: Gameplay) {
    super(scene, "spawnManager");
  }

  private updateSpawnableArrForTowers() {
    this.spawnableArrForTowers = JSON.parse(JSON.stringify(this.scene.pathManager.elements));
    this.addEnemiesToSpawnableArr(true);
    SpawnService.updateBuildingSpawnableArr(this.spawnableArrForTowers);
  }

  private updateSpawnableArrForEnemies() {
    this.spawnableArrForEnemies = JSON.parse(JSON.stringify(this.scene.pathManager.elements));
    this.addEnemiesToSpawnableArr(false);
    this.addTowersToSpawnableArr();
    SpawnService.updateBuildingSpawnableArr(this.spawnableArrForEnemies);
  }

  private addEnemiesToSpawnableArr(isForTower) {
    let spawnableArr = isForTower ? this.spawnableArrForTowers : this.spawnableArrForEnemies;

    this.scene.enemyManager.elements.forEach(enemy => {
      let { row, column } = PositionService.findCurRelativePosition(spawnableArr, enemy.x, enemy.y);
      spawnableArr[row][column] = 4;
      if (isForTower) {
        this.markPosAroundUnit(spawnableArr, row, column, 1, 1);
      }
    });
  }

  private markPosAroundUnit(spawnableArr, row, column, width, height) {
    spawnableArr[row][column] = 5;
    let positions = SpawnService.calculateRelativeSpawnPositionsAround(column, row, width, height);
    positions.forEach(pos => {
      spawnableArr[pos.row][pos.column] = 5;
    });
  }

  private addTowersToSpawnableArr() {
    this.scene.towerManager.elements.forEach(tower => {
      let { row, column } = PositionService.findCurRelativePosition(this.spawnableArrForEnemies, tower.x, tower.y);
      this.markPosAroundUnit(this.spawnableArrForEnemies, row, column, 1, 1);
    });
  }

  evaluateRealSpawnPosOfTower(x, y) {
    this.updateSpawnableArrForTowers();
    let { row, column } = PositionService.findCurRelativePosition(this.spawnableArrForTowers, x, y);
    return this.spawnableArrForTowers[row][column] === 0;
  }

  getValidSpawnPosForTowers() {
    this.updateSpawnableArrForEnemies();
    return SpawnService.extractSpawnPosFromSpawnableArr(this.spawnableArrForEnemies);
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
