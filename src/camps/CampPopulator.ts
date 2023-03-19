import { GuardComponent } from "../ai/GuardComponent";
import { CampID, CampSetup } from "../config/CampSetup";
import { UnitSetup } from "../config/UnitSetup";
import { Gameplay } from "../scenes/Gameplay";
import { EnemySpawnObj } from "../spawn/EnemySpawnObj";
import { DangerousCircle } from "../units/DangerousCircle";
import { CampsState } from "./CampsState";

export class CampPopulator {
  active: number = 0;

  constructor(
    private campID: CampID,
    private scene: Gameplay,
    private create: (x: number, y: number) => DangerousCircle,
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
      return;
    }

    let areaIsPopulated = this.active === this.maxCampPopulation;
    if (!areaIsPopulated) {
      let leftToSpawn = UnitSetup.maxCampPopulation - this.active;
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
      let enemy = this.create(spawnPosition[0], spawnPosition[1]);
      this.active++;

      enemy.stateHandler.setComponents([
        new GuardComponent(enemy, enemy.stateHandler),
      ]);
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
