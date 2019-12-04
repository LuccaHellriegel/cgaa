import { Tower } from "./Tower";
import { Gameplay } from "../../scenes/Gameplay";
import { towerHalfSize } from "../../globals/globalSizes";
import { TowerService } from "./TowerService";
import { PhysicalManager } from "../../base/Base";

export class TowerManager extends PhysicalManager {
  constructor(scene: Gameplay) {
    super(scene, "towerManager", "staticGroup");
  }

  private playInvalidTowerPosAnim() {
    this.scene.towerModus.ghostTower.anims.play("invalid-tower-pos");
  }

  spawnNewTower(x, y) {
    if (!(x < 0 || y < 0)) {
      let { closestTower, dist } = TowerService.findClosestTower(this.elements, x, y);
      if (dist < 3.5 * towerHalfSize) {
        let resultXY = TowerService.snapTowerPosToClosestTower(closestTower, x, y);
        if (resultXY === null) {
          this.playInvalidTowerPosAnim();
          return;
        }

        let { newX, newY } = resultXY;
        x = newX;
        y = newY;
      }

      //TODO: fire event to alert spawnManager of new Tower pos for updating
      if (this.scene.spawnManager.evaluateRealSpawnPosOfTower(x, y)) {
        this.elements.push(new Tower(this.scene, x, y, this.physicsGroup));
        this.scene.towerModus.bringGhostTowerToTop();
      } else {
        this.playInvalidTowerPosAnim();
      }
    } else {
      this.playInvalidTowerPosAnim();
    }
  }
}
