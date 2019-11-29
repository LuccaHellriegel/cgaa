import { Gameplay } from "../scenes/Gameplay";
import { Player } from "../player/Player";
import {
  playerStartX,
  playerStartY,
  playerTextureName,
  wallPartRadius
} from "../global";
import { AreaPopulator } from "../units/populators/AreaPopulator";
import EasyStar from "easystarjs";
import { PathfindingCircle } from "../units/circles/PathfindingCircle";
import { WallAreaWithHolesAndBuildings } from "../env/areas/WallAreaWithHolesAndBuildings";
import { BuildingPopulator } from "../units/populators/BuildingPopulator";

export class UnitManager {
  scene: Gameplay;
  enemies: any[];
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
    Player.withChainWeapon(
      this.scene,
      playerStartX,
      playerStartY,
      playerTextureName,
      this.scene.physics.add.group(),
      this.scene.physics.add.group()
    );

    let enemyPhysics = this.scene.physics.add.group();
    let enemyWeapons = this.scene.physics.add.group();
    this.scene.areaManager.wallAreas.forEach(wallArea => {
      new AreaPopulator(this.scene, enemyPhysics, enemyWeapons, wallArea);
      (wallArea as WallAreaWithHolesAndBuildings).buildings.forEach(
        building => {
          new BuildingPopulator(
            this.scene,
            enemyPhysics,
            enemyWeapons,
            building,
            this.easyStar
          );
        }
      );
    });
    // new BuildingPopulator(
    //   this.scene,
    //   enemyPhysics,
    //   enemyWeapons,
    //   this.scene.areaManager.wallAreas[0].buildings[0],
    //   this.easyStar
    // );

    this.scene.physics.add.collider(
      this.scene.player.physicsGroup,
      this.enemies[0].physicsGroup
    );
  }

  private doDamage(weapon, enemy, amount: number) {
    weapon.alreadyAttacked.push(enemy.id);
    enemy.damage(amount);
  }

  private considerDamage(weapon, enemy) {
    return (
      weapon.polygon.checkForCollision(enemy.polygon) &&
      weapon.attacking &&
      !weapon.alreadyAttacked.includes(enemy.id)
    );
  }

  checkWeaponOverlap() {
    for (let index = 0; index < this.enemies.length; index++) {
      let playerWeapon = this.scene.player.weapon;
      let enemy = this.enemies[index];
      let enemyWeapon = enemy.weapon;
      if (this.considerDamage(playerWeapon, enemy)) {
        this.doDamage(playerWeapon, enemy, 50);
      }
      if (this.considerDamage(enemyWeapon, this.scene.player)) {
        this.doDamage(enemyWeapon, this.scene.player, 20);
      }
    }
  }
}
