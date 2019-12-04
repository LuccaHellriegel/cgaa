import { Tower } from "./Tower";
import { Gameplay } from "../../scenes/Gameplay";
import { towerHalfSize } from "../../globals/globalSizes";
import { TowerService } from "./TowerService";
import { CollisionService } from "../../spawn/CollisionService";
import { PhysicalManager } from "../../base/Base";

export class TowerManager extends PhysicalManager {
  constructor(scene: Gameplay) {
    super(scene, "towerManager", "staticGroup");
  }

  private playInvalidTowerPosAnim() {
    this.scene.towerModusManager.ghostTower.anims.play("invalid-tower-pos");
  }

  spawnNewTower(x, y) {
    if (!(x < 0 || y < 0)) {
      let { closestTower, dist } = TowerService.findClosestTower(this.elements, x, y);
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
      if (!CollisionService.checkIfTowerCollidesWithTowers(this.elements, x, y)) {
        this.elements.push(new Tower(this.scene, x, y, this.physicsGroup));
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
