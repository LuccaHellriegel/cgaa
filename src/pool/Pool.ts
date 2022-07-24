import { poolable } from "../engine/poolable";

import { Gameplay } from "../scenes/Gameplay";
import { removeEle } from "../utils/removeEle";

export abstract class Pool {
  activeIDArr: string[] = [];
  inactiveIDArr: string[] = [];
  dict = new Map();

  constructor(
    protected scene: Gameplay,
    private numberOfUnits: number,
    protected unitGroup?:
      | Phaser.Physics.Arcade.StaticGroup
      | Phaser.Physics.Arcade.Group
  ) {}

  init() {
    this.initPool();
    this.listenForInactiveUnits();
  }

  private listenForInactiveUnits() {
    this.dict.forEach((_, key) => {
      this.scene.events.on("inactive-" + key, (id) => {
        removeEle(id, this.activeIDArr);
        this.inactiveIDArr.push(id);
      });
    });
  }

  protected abstract createNewUnit(): poolable;

  private initPool() {
    console.log(
      "Init Pool",
      this.constructor.name,
      this.numberOfUnits,
      this.inactiveIDArr.length
    );

    for (let index = 0; index < this.numberOfUnits; index++) {
      const newUnit = this.createNewUnit();
      newUnit.poolDestroy();
      this.dict.set(newUnit.id, newUnit);
      this.inactiveIDArr.push(newUnit.id);
    }
  }

  pop(): poolable {
    if (this.inactiveIDArr.length < this.numberOfUnits / 3) {
      this.initPool();
    }
    const id = this.inactiveIDArr.pop();
    this.activeIDArr.push(id);
    return this.dict.get(id);
  }

  getActiveUnits() {
    return this.activeIDArr.map((id) => this.dict.get(id));
  }
}
