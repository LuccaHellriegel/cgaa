import { Gameplay } from "../../scenes/Gameplay";
import { WallArea } from "../../env/areas/WallArea";
import { Populator } from "./Populator";

export class AreaPopulator extends Populator {
  constructor(
    scene: Gameplay,
    enemyPhysics: Phaser.Physics.Arcade.Group,
    enemyWeapons: Phaser.Physics.Arcade.Group,
    wallArea: WallArea
  ) {
    super(scene, enemyPhysics, enemyWeapons, wallArea);
    this.onEvent();
  }
}
