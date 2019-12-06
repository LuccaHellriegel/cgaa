import { Gameplay } from "../scenes/Gameplay";
import { Player } from "../units/Player";
import { AreaPopulator } from "../units/populators/AreaPopulator";
import { BuildingPopulator } from "../units/populators/BuildingPopulator";
import { PhysicalManager } from "../base/Base";
import { PositionService } from "../services/PositionService";

export class EnemyManager extends PhysicalManager {
  weaponPhysicsGroup: Phaser.Physics.Arcade.Group;

  constructor(scene: Gameplay) {
    super(scene, "enemyManager", "group");
    this.weaponPhysicsGroup = this.scene.physics.add.group();

    this.spawnUnits();
  }

  getRelativeEnemyPositions() {
    return PositionService.getRelativePosOfElements(
      this.elements
    );
  }

  getRelativeEnemyPositionsAndAroundEnemyPositions() {
    return PositionService.getRelativePosOfElementsAndAroundElements(
      this.elements,
      1,
      1
    );
  }

  spawnUnits() {
    Player.withChainWeapon(this.scene);
    this.scene.envManager.executeWithAreasThatHaveBuilding(area => {
      new AreaPopulator(this.scene, this.physicsGroup, this.weaponPhysicsGroup, area).startPopulating();
      area.buildings.forEach(building => {
        new BuildingPopulator(this.scene, this.physicsGroup, this.weaponPhysicsGroup, building).startPopulating();
      });
    });
  }
}
