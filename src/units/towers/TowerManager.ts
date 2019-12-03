import { Tower } from "./Tower";
import { Gameplay } from "../../scenes/Gameplay";
import { towerHalfSize } from "../../globals/globalSizes";
import { TowerService } from "./TowerService";
import { SpawnService } from "../../services/SpawnService";

export class TowerManager {
  towers: Tower[] = [];
  physicsGroup: Phaser.Physics.Arcade.StaticGroup;
  scene: Gameplay;

  constructor(scene: Gameplay) {
    this.scene = scene;
    scene.towerManager = this;
    this.physicsGroup = scene.physics.add.staticGroup();
  }

  private playInvalidTowerPosAnim() {
    this.scene.towerModusManager.ghostTower.anims.play("invalid-tower-pos");
  }

  spawnNewTower(x, y) {
    if (!(x < 0 || y < 0)) {
      let { closestTower, dist } = TowerService.findClosestTower(this.towers, x, y);
      if (dist < 3.5 * towerHalfSize) {
        console.log("here");

        let resultXY = TowerService.snapTowerPosToClosestTower(closestTower, x, y);
        if (resultXY === null) {
          console.log("here1");
          this.playInvalidTowerPosAnim();
          return;
        }

        let { newX, newY } = resultXY;
        x = newX;
        y = newY;
      }
      if (!SpawnService.checkIfTowerCollidesWithTowers(this.towers, x, y)) {
        this.towers.push(new Tower(this.scene, x, y, this.physicsGroup));
        this.scene.towerModusManager.bringGhostTowerToTop();
      } else {
        console.log("here2");

        this.playInvalidTowerPosAnim();
      }
    } else {
      console.log("here3");

      this.playInvalidTowerPosAnim();
    }
  }
}
