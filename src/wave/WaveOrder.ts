import { CampsState } from "../camps/CampsState";

import { randomizeArr } from "../engine/randomizeArr";
import { CampID, CampSetup } from "../config/CampSetup";
import { removeEle } from "../engine/removeEle";

export class WaveOrder {
  order: CampID[];
  index = 0;

  constructor(private state: CampsState) {
    this.order = randomizeArr(CampSetup.ordinaryCampIDs);
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
