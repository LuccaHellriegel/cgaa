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
    this.calculateSpawnableArrWithBuildings();
  }

  //TODO: make dependency aparent with events
  private calculateSpawnableArrWithBuildings() {
    this.elements = JSON.parse(JSON.stringify(this.scene.pathManager.elements));
  }

  private updateSpawnableArrForTowers() {
    this.spawnableArrForTowers = JSON.parse(JSON.stringify(this.elements));
    SpawnService.updateBuildingSpawnableArr(this.spawnableArrForTowers);
    this.addEnemiesToSpawnableArr(true);
  }

  private updateSpawnableArrForEnemies() {
    this.spawnableArrForEnemies = JSON.parse(JSON.stringify(this.elements));
    SpawnService.updateBuildingSpawnableArr(this.spawnableArrForEnemies);
    this.addEnemiesToSpawnableArr(false);
    this.addTowersToSpawnableArr();
  }

  private addEnemiesToSpawnableArr(isForTower) {
    let spawnableArr = isForTower ? this.spawnableArrForTowers : this.spawnableArrForEnemies;

    this.scene.enemyManager.elements.forEach(enemy => {
      let { row, column } = PositionService.findCurRelativePosition(spawnableArr, enemy.x, enemy.y);
      spawnableArr[row][column] = 4;
      if (isForTower) {
        this.markPosAroundUnit(spawnableArr, row, column);
      }
    });
  }

  private markPosAroundUnit(spawnableArr, row, column) {
    spawnableArr[row][column] = 5;
    if (spawnableArr[row] && spawnableArr[row][column + 1]) spawnableArr[row][column + 1] = 5;
    if (spawnableArr[row] && spawnableArr[row][column - 1]) spawnableArr[row][column - 1] = 5;

    if (spawnableArr[row - 1] && spawnableArr[row - 1][column - 1]) spawnableArr[row - 1][column - 1] = 5;
    if (spawnableArr[row - 1] && spawnableArr[row - 1][column]) spawnableArr[row - 1][column] = 5;
    if (spawnableArr[row - 1] && spawnableArr[row - 1][column + 1]) spawnableArr[row - 1][column + 1] = 5;

    if (spawnableArr[row + 1] && spawnableArr[row + 1][column - 1]) spawnableArr[row + 1][column - 1] = 5;
    if (spawnableArr[row + 1] && spawnableArr[row + 1][column]) spawnableArr[row + 1][column] = 5;
    if (spawnableArr[row + 1] && spawnableArr[row + 1][column + 1]) spawnableArr[row + 1][column + 1] = 5;
  }

  private addTowersToSpawnableArr() {
    this.scene.towerManager.elements.forEach(tower => {

      let { row, column } = PositionService.findCurRelativePosition(this.spawnableArrForEnemies, tower.x, tower.y);
      this.markPosAroundUnit(this.spawnableArrForEnemies, row, column);
    });
  }

  evaluateRealSpawnPosOfTower(x, y) {

    let { row, column } = PositionService.findCurRelativePosition(this.elements, x, y);
    this.updateSpawnableArrForTowers();

    return this.elements[row][column] === 0;
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
