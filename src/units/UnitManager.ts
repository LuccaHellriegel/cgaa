import { Gameplay } from "../scenes/Gameplay";
import { Player } from "./Player";
import { AreaPopulator } from "./populators/AreaPopulator";
import EasyStar from "easystarjs";
import { BuildingPopulator } from "./populators/BuildingPopulator";
import { EnemyCircle } from "./circles/EnemyCircle";

export class UnitManager {
  scene: Gameplay;
  enemies: EnemyCircle[] = [];
  enemyPhysics: Phaser.Physics.Arcade.Group;
  enemyWeapons: Phaser.Physics.Arcade.Group;
  easyStar: EasyStar.js;

  constructor(scene: Gameplay) {
    this.scene = scene;
    scene.unitManager = this;
    this.enemyPhysics = this.scene.physics.add.group();
    this.enemyWeapons = this.scene.physics.add.group();
    this.easyStar = new EasyStar.js();

    this.spawnUnits();
  }

  spawnUnits() {
    Player.withChainWeapon(this.scene);

    let enemyPhysics = this.scene.physics.add.group();
    let enemyWeapons = this.scene.physics.add.group();
    this.scene.areaManager.areas.forEach(areaRow => {
      areaRow.forEach(area => {
        if (area.buildings[0]) {
          new AreaPopulator(this.scene, enemyPhysics, enemyWeapons, area);
          area.buildings.forEach(building => {
            new BuildingPopulator(this.scene, enemyPhysics, enemyWeapons, building, this.easyStar);
          });
        }
      });
    });

    
  }

  
}
