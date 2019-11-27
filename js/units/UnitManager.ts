import { Gameplay } from "../scenes/Gameplay";
import { Player } from "../player/Player";
import { playerStartX, playerStartY, playerTextureName } from "../global";
import { AreaPopulator } from "./AreaPopulator";

export class UnitManager {
  scene: Gameplay;
  enemies: any[];
  enemyPhysics: Phaser.Physics.Arcade.Group;
  enemyWeapons: Phaser.Physics.Arcade.Group;

  constructor(scene: Gameplay) {
    this.scene = scene;
    this.enemyPhysics = this.scene.physics.add.group();
    this.enemyWeapons = this.scene.physics.add.group();
  }

  spawnUnits() {
    Player.withChainWeapon(this.scene, playerStartX, playerStartY, playerTextureName,  
    this.scene.physics.add.group(), this.scene.physics.add.group())
    

    let enemyPhysics = this.scene.physics.add.group()
    let enemyWeapons = this.scene.physics.add.group()
    this.scene.areaManager.wallAreas.forEach(wallArea => {
      new AreaPopulator(this.scene, enemyPhysics, enemyWeapons, wallArea.calculateBorderObject());
    })

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
