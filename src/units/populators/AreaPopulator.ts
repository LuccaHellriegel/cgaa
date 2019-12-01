import { Gameplay } from "../../scenes/Gameplay";
import { Populator } from "./Populator";
import { Area } from "../../env/areas/Area";

export class AreaPopulator extends Populator {
  constructor(
    scene: Gameplay,
    enemyPhysics: Phaser.Physics.Arcade.Group,
    enemyWeapons: Phaser.Physics.Arcade.Group,
    area: Area
  ) {
    super(scene, enemyPhysics, enemyWeapons, area);
    //TODO: dont spawn on top of other enemies or buildings if Area with building
    this.onEvent();
  }
}
