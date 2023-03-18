import { Towers } from "./Tower";
import { Shooters } from "./Shooters";
import { TowerSetup } from "../config/TowerSetup";
import { Healer } from "./Healer";

export class Healers extends Towers {
  constructor(
    scene,
    addTowerToPhysics,
    private shooters: Shooters,
    private player
  ) {
    super(scene, addTowerToPhysics);

    this.maxSize = TowerSetup.maxHealers;

    this.createMultiple({
      frameQuantity: TowerSetup.maxHealers / 2,
      key: "healer",
      active: false,
      visible: false,
      classType: Healer,
    });

    this.getChildren().forEach((child) =>
      (child as Phaser.Physics.Arcade.Sprite).disableBody()
    );
  }

  placeTower(x, y) {
    let healer = this.getFirstDead(true);
    this.addTowerToPhysics(healer);
    healer.setPlayer(this.player);
    healer.place(x, y, [this.shooters, this]);
    return healer;
  }
}
