import { Populator } from "./Populator";
import { Gameplay } from "../../scenes/Gameplay";
import { Building } from "../../env/Building";

export class BuildingPopulator extends Populator {
    constructor(
        scene: Gameplay,
        enemyPhysics: Phaser.Physics.Arcade.Group,
        enemyWeapons: Phaser.Physics.Arcade.Group,
        building: Building
      ) {
        super(scene, enemyPhysics, enemyWeapons, building);
      }
    }