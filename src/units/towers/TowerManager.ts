import { Tower } from "./Tower";
import { Gameplay } from "../../scenes/Gameplay";
import { towerHalfSize } from "../../globals/globalSizes";
import { TowerService } from "./TowerService";
import { PhysicalManager } from "../../base/Base";
import { PositionService } from "../../services/PositionService";

export class TowerManager extends PhysicalManager {
  constructor(scene: Gameplay) {
    super(scene, "towerManager", "staticGroup");
  }

  getRelativeTowerPositionsAndAroundTowerPositions() {
    return PositionService.getRelativePosOfElementsAndAroundElements(
      this.elements,
      this.scene.pathManager.elements,
      1,
      1
    );
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

      if (this.scene.spawnManager.evaluateRealSpawnPosOfTower(x, y)) {
        let tower = new Tower(this.scene, x, y, this.physicsGroup);
        this.scene.events.emit("added-tower", tower);
        this.elements.push(tower);
      } else {
        this.playInvalidTowerPosAnim();
      }
    } else {
      this.playInvalidTowerPosAnim();
    }
  }
}
