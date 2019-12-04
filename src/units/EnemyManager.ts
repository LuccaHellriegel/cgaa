import { Gameplay } from "../scenes/Gameplay";
import { Player } from "./Player";
import { AreaPopulator } from "./populators/AreaPopulator";
import EasyStar from "easystarjs";
import { BuildingPopulator } from "./populators/BuildingPopulator";
import { EnemyCircle } from "./circles/EnemyCircle";
import { PhysicalManager } from "../base/Base";

export class EnemyManager extends PhysicalManager{
  enemies: EnemyCircle[] = [];
  weaponPhysicsGroup: Phaser.Physics.Arcade.Group;
  easyStar: EasyStar.js;

  constructor(scene: Gameplay) {
    super(scene,"enemyManager", "group")
    this.weaponPhysicsGroup = this.scene.physics.add.group();
    this.easyStar = new EasyStar.js();

    this.spawnUnits();
  }

  spawnUnits() {
    Player.withChainWeapon(this.scene);

    this.scene.areaManager.elements.forEach(areaRow => {
      areaRow.forEach(area => {
        if (area.buildings[0]) {
          new AreaPopulator(this.scene, this.physicsGroup, this.weaponPhysicsGroup, area).startPopulating();
          area.buildings.forEach(building => {
            new BuildingPopulator(
              this.scene,
              this.physicsGroup,
              this.weaponPhysicsGroup,
              building,
              this.easyStar
            ).startPopulating();
          });
        }
      });
    });
  }
}
