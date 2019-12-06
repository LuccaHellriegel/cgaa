import { Gameplay } from "../scenes/Gameplay";
import { Player } from "../units/Player";
import { AreaPopulator } from "../units/populators/AreaPopulator";
import { BuildingPopulator } from "../units/populators/BuildingPopulator";
import { PhysicalManager } from "../base/Base";
import { PositionService } from "../services/PositionService";
import { campColors } from "../globals/globalColors";
import { Area } from "../env/areas/Area";

export class EnemyManager extends PhysicalManager {
  enemyPhysicGroups = {};
  weaponPhysicGroups = {};

  constructor(scene: Gameplay) {
    super(scene, "enemyManager", "group");

    for (let index = 0; index < campColors.length; index++) {
      this.enemyPhysicGroups[campColors[index]] = this.scene.physics.add.group();
      this.weaponPhysicGroups[campColors[index]] = this.scene.physics.add.group();
    }
    this.spawnUnits();
  }

  getRelativeEnemyPositions() {
    return PositionService.getRelativePosOfElements(this.elements);
  }

  getRelativeEnemyPositionsAndAroundEnemyPositions() {
    return PositionService.getRelativePosOfElementsAndAroundElements(this.elements, 1, 1);
  }

  spawnUnits() {
    Player.withChainWeapon(this.scene);
    this.scene.envManager.executeWithAreasThatHaveBuilding((area: Area) => {
      let enemyPhysicGroup = this.enemyPhysicGroups[area.color];
      let weaponPhysicGroup = this.weaponPhysicGroups[area.color];

      new AreaPopulator(this.scene, enemyPhysicGroup, weaponPhysicGroup, area).startPopulating();
      area.buildings.forEach(building => {
        new BuildingPopulator(this.scene, enemyPhysicGroup, weaponPhysicGroup, building).startPopulating();
      });
    });
  }
}
