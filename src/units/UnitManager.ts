import { Gameplay } from "../scenes/Gameplay";
import { Player } from "./Player";
import { AreaPopulator } from "./populators/AreaPopulator";
import EasyStar from "easystarjs";
import { BuildingPopulator } from "./populators/BuildingPopulator";
import { EnemyCircle } from "./circles/EnemyCircle";

export class UnitManager {
  scene: Gameplay;
  enemies: EnemyCircle[];
  enemyPhysics: Phaser.Physics.Arcade.Group;
  enemyWeapons: Phaser.Physics.Arcade.Group;
  easyStar: EasyStar.js;

  constructor(scene: Gameplay) {
    this.scene = scene;
    this.enemyPhysics = this.scene.physics.add.group();
    this.enemyWeapons = this.scene.physics.add.group();
    this.easyStar = new EasyStar.js();
  }

  spawnUnits() {
    Player.withChainWeapon(this.scene);

    let enemyPhysics = this.scene.physics.add.group();
    let enemyWeapons = this.scene.physics.add.group();
    this.scene.areaManager.areas.forEach(areaRow => {
      areaRow.forEach(area => {
        console.log(area)
        if (area.buildings[0]) {
          new AreaPopulator(this.scene, enemyPhysics, enemyWeapons, area);
          area.buildings.forEach(building => {
            new BuildingPopulator(this.scene, enemyPhysics, enemyWeapons, building, this.easyStar);
          });
        }
      });
    });

    this.scene.physics.add.collider(this.scene.player.physicsGroup, this.enemies[0].physicsGroup);

    this.scene.physics.add.collider(
      this.scene.player.weapon.weaponGroup,
      this.enemies[0].physicsGroup,
      this.doDamage,
      this.considerDamage
    );

    this.scene.physics.add.collider(
      this.enemies[0].weapon.weaponGroup,
      this.scene.player.physicsGroup,
      this.doDamage,
      this.considerDamage
    );
  }

  private doDamage(weapon, enemy) {
    weapon.alreadyAttacked.push(enemy.id);
    //TODO: amount is saved on weapon
    enemy.damage(50);
  }

  private considerDamage(weapon, enemy) {
    console.log("Collision: " + weapon.polygon.checkForCollision(enemy.polygon));
    console.log("Weapon attacking: " + weapon.attacking);
    console.log("Already attacked: " + weapon.alreadyAttacked.includes(enemy.id));

    return (
      weapon.polygon.checkForCollision(enemy.polygon) && weapon.attacking && !weapon.alreadyAttacked.includes(enemy.id)
    );
  }
}
