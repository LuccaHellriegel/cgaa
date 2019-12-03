import { Tower } from "./Tower";
import { Gameplay } from "../../scenes/Gameplay";
import { towerHalfSize } from "../../globals/globalSizes";
import { TowerService } from "./TowerService";

export class TowerManager {
  towers: Tower[] = [];
  physicsGroup: Phaser.Physics.Arcade.StaticGroup;
  scene: Gameplay;

  constructor(scene: Gameplay) {
    this.scene = scene;
    scene.towerManager = this;
    this.physicsGroup = scene.physics.add.staticGroup();
  }

  spawnNewTower(x, y) {
    if (!(x < 0 || y < 0)) {
      let { closestTower, dist } = TowerService.findClosestTower(this.towers, x, y);
      if (dist < 3.5 * towerHalfSize) {
        let resultXY = TowerService.snapTowerPosToClosestTower(closestTower, x, y);
        if (resultXY === null) return;
        
        let { newX, newY } = resultXY;
        x = newX;
        y = newY;
      }

      this.towers.push(new Tower(this.scene, x, y, this.physicsGroup));
    }
  }
}
