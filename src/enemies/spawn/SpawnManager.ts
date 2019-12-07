import { BaseManagerConfig, BaseService } from "../../base/Base";
import { Gameplay } from "../../scenes/Gameplay";
import { PositionService } from "../../world/PositionService";
import { SpawnService } from "./SpawnService";
import { Area } from "../../world/areas/Area";
import { Tower } from "../../player/towers/Tower";
import { MapService } from "./MapService";
import { Building } from "../buildings/Building";
import { towerSymbol, buildingSymbol } from "../../globals/globalSymbols";

export class SpawnManager  {
  scene: Gameplay;
  spawnableArrForEnemiesBase;
  spawnableArrForEnemies;
  spawnableArrForTowersBase;
  spawnableArrForTowers;

  constructor(config: BaseManagerConfig) {
    BaseService.applyBaseManagerConfig(this, config);
    this.initBaseArrs();
    this.setupEventListeners();
  }

  private initBaseArrs() {
    this.spawnableArrForEnemiesBase = this.scene.worldManager.getCopyOfMap();
    this.spawnableArrForTowersBase = this.scene.worldManager.getCopyOfMap();
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
    let { row, column } = PositionService.realPosToRelativePos(x, y);
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
    return SpawnService.extractSpawnPosFromSpawnableArrForArea(
      area.relativeTopLeftX,
      area.relativeTopLeftY,
      area.relativeWidth,
      area.relativeHeight,
      this.spawnableArrForEnemies
    );
  }
}
