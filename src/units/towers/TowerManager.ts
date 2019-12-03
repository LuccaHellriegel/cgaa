import { Tower } from "./Tower";
import { Gameplay } from "../../scenes/Gameplay";
import { towerHalfSize } from "../../globals/globalSizes";

export class TowerManager {
  towers: Tower[] = [];
  physicsGroup: Phaser.Physics.Arcade.StaticGroup;
  scene: Gameplay;

  constructor(scene: Gameplay) {
    this.scene = scene;
    scene.towerManager = this;
    this.physicsGroup = scene.physics.add.staticGroup();
  }

  private findClosestTower(x, y) {
    let dist = Infinity;
    let closestTower: Tower;
    this.towers.forEach(tower => {
      let newDist = Phaser.Math.Distance.Between(tower.x, tower.y, x, y);
      if (dist > newDist) {
        dist = newDist;
        closestTower = tower;
      }
    });
    if (!closestTower) dist = Infinity;
    return { closestTower, dist };
  }

  spawnNewTower(x, y) {
    let { closestTower, dist } = this.findClosestTower(x, y);
    if (dist < 3.5*towerHalfSize) {
      let isRightOfClosestTower = x > closestTower.x;
      let isOverTheClosestTower = y < closestTower.y;
      let isMoreThanHalfTowerSizeFromCenterX = Math.abs(x - closestTower.x) > towerHalfSize;
      let isMoreThanQuarterFromTheCenterX = Math.abs(x - closestTower.x) > towerHalfSize / 2;

      let isMoreThanHalfTowerSizeFromCenterY = Math.abs(y - closestTower.y) > towerHalfSize;
      let isMoreThanQuarterFromTheCenterY = Math.abs(y - closestTower.y) > towerHalfSize / 2;

      let changeX = 0;
      let changeY = 0;

      let getsSameX = !isMoreThanQuarterFromTheCenterX && isMoreThanHalfTowerSizeFromCenterY;
      let getsSameY = !isMoreThanQuarterFromTheCenterY && isMoreThanHalfTowerSizeFromCenterX;

      if (getsSameX) {
        if (isOverTheClosestTower) {
          changeY = -2 * towerHalfSize;
        } else {
          changeY = 2 * towerHalfSize;
        }
      } else if (getsSameY) {
        if (isRightOfClosestTower) {
          changeX = 2 * towerHalfSize;
        } else {
          changeX = -2 * towerHalfSize;
        }
      } else if (isRightOfClosestTower) {
        changeX = 2 * towerHalfSize;
        if (isOverTheClosestTower) {
          changeY = -2 * towerHalfSize;
        } else {
          changeY = 2 * towerHalfSize;
        }
      } else {
        changeX = -2 * towerHalfSize;
        if (isOverTheClosestTower) {
          changeY = -2 * towerHalfSize;
        } else {
          changeY = 2 * towerHalfSize;
        }
      }

      x = closestTower.x + changeX;
      y = closestTower.y + changeY;
    }

    this.towers.push(new Tower(this.scene, x, y, this.physicsGroup));
  }
}
