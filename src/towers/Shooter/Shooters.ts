import { Bullets } from "./Bullets";
import { Towers } from "../Tower";
import { TowerSetup } from "../../config/TowerSetup";
import { Shooter } from "./Shooter";

export class Shooters extends Towers {
  constructor(scene, addTowerToPhysics, private bullets: Bullets) {
    super(scene, addTowerToPhysics);

    this.maxSize = TowerSetup.maxShooters;

    this.createMultiple({
      frameQuantity: TowerSetup.maxShooters / 2,
      key: "shooter",
      active: false,
      visible: false,
      classType: Shooter,
    });

    this.getChildren().forEach((child) =>
      (child as Phaser.Physics.Arcade.Sprite).disableBody()
    );
  }

  placeTower(x, y) {
    let shooter = this.getFirstDead(true);
    this.addTowerToPhysics(shooter);
    shooter.place(x, y, this.bullets);
    return shooter;
  }
}
