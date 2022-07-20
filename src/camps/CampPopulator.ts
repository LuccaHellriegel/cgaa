import { GuardComponent } from "../ai/GuardComponent";
import { CampID, CampSetup } from "../config/CampSetup";
import { UnitSetup } from "../config/UnitSetup";
import { DangerousCirclePool } from "../pool/CirclePool";
import { Gameplay } from "../scenes/Gameplay";
import { EnemySpawnObj } from "../spawn/EnemySpawnObj";
import { DangerousCircle } from "../units/DangerousCircle/DangerousCircle";
import { CampsState } from "./CampsState";

export class CampPopulator {
  constructor(
    private campID: CampID,
    private scene: Gameplay,
    private enemyPool: DangerousCirclePool,
    private enemySpawnObj: EnemySpawnObj,
    private maxCampPopulation: number,
    private campsState: CampsState
  ) {
    this.startPopulating();
  }

  //Populates the camp with a single new enemy
  private startPopulating() {
    if (
      this.campID !== CampSetup.bossCampID &&
      !this.campsState.isActive(this.campID)
    ) {
      this.enemyPool.destroy();
      return;
    }

    let areaIsPopulated =
      this.enemyPool.activeIDArr.length === this.maxCampPopulation;
    if (!areaIsPopulated) {
      let leftToSpawn =
        UnitSetup.maxCampPopulation - this.enemyPool.activeIDArr.length;
      this.spawnEnemy(leftToSpawn);
    }

    this.scene.time.addEvent({
      delay: CampSetup.delayForCampPopulation,
      callback: () => {
        this.startPopulating();
      },
      repeat: 0,
    });
  }

  private spawnEnemy(leftToSpawn: number) {
    let spawnPosition = this.enemySpawnObj.getRandomSpawnPosition();
    if (spawnPosition) {
      let enemy = this.enemyPool.pop() as DangerousCircle;

      enemy.stateHandler.setComponents([
        new GuardComponent(enemy, enemy.stateHandler),
      ]);

      enemy.poolActivate(spawnPosition[0], spawnPosition[1]);
      leftToSpawn--;
    }
    if (leftToSpawn > 0) {
      this.scene.time.addEvent({
        delay: 4000,
        callback: () => {
          this.spawnEnemy(leftToSpawn);
        },
        repeat: 0,
      });
    }
  }
}
