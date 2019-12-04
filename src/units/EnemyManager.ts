import { Gameplay } from "../scenes/Gameplay";
import { Player } from "./Player";
import { AreaPopulator } from "./populators/AreaPopulator";
import { BuildingPopulator } from "./populators/BuildingPopulator";
import { PhysicalManager } from "../base/Base";

export class EnemyManager extends PhysicalManager {
  weaponPhysicsGroup: Phaser.Physics.Arcade.Group;

  constructor(scene: Gameplay) {
    super(scene, "enemyManager", "group");
    this.weaponPhysicsGroup = this.scene.physics.add.group();

    this.spawnUnits();
  }

  spawnUnits() {
    Player.withChainWeapon(this.scene);

    this.scene.EnvManager.elements.forEach(areaRow => {
      areaRow.forEach(area => {
        if (area.buildings[0]) {
          new AreaPopulator(this.scene, this.physicsGroup, this.weaponPhysicsGroup, area).startPopulating();
          area.buildings.forEach(building => {
            new BuildingPopulator(this.scene, this.physicsGroup, this.weaponPhysicsGroup, building).startPopulating();
          });
        }
      });
    });
  }
}
