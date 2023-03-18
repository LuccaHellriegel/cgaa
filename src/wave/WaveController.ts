import { CampsState } from "../camps/CampsState";
import { CampID, CampSetup } from "../config/CampSetup";
import { EventSetup } from "../config/EventSetup";
import { WaveSetup } from "../config/WaveSetup";
import { randomizeArr } from "../engine/randomizeArr";
import { removeEle } from "../engine/removeEle";
import { Gameplay } from "../scenes/Gameplay";

export class WaveController {
  private activeCampColor: CampID | boolean;
  order: CampID[];
  index = 0;

  constructor(private scene: Gameplay, private state: CampsState) {
    this.order = randomizeArr(CampSetup.ordinaryCampIDs);
    this.activeCampColor = this.order[0];
  }

  public spawnWave() {
    EventSetup.endWave(this.scene, this.activeCampColor as CampID);

    this.activeCampColor = this.getNextCampID();
    if (this.activeCampColor !== false) {
      EventSetup.startWave(this.scene, this.activeCampColor as CampID);
      this.increment();
      this.scene.time.addEvent({
        delay: WaveSetup.timeBetweenWaves,
        callback: () => {
          this.spawnWave();
        },
        repeat: 0,
      });
    }
  }

  increment() {
    this.index++;

    if (this.index > this.order.length - 1) {
      this.index = 0;
    }
  }

  private shouldHaveWave(campID: CampID) {
    return this.state.isActive(campID);
  }

  getNextCampID(): CampID | boolean {
    let id = this.order[this.index];

    while (!this.shouldHaveWave(id)) {
      removeEle(id, this.order);
      if (this.order.length === 0) return false;
      if (this.index > this.order.length - 1) this.index = 0;
      id = this.order[this.index];
    }
    return id;
  }
}
