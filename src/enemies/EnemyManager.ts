import { Gameplay } from "../scenes/Gameplay";
import { Player } from "../player/Player";
import { AreaPopulator } from "./populators/AreaPopulator";
import { BuildingPopulator } from "./populators/BuildingPopulator";
import { PhysicalManager } from "../base/Base";
import { PositionService } from "../world/PositionService";
import { Area } from "../world/areas/Area";
import { campColors } from "../globals/globalColors";
import { EnemyConfig } from "./units/EnemyFactory";

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
    this.scene.worldManager.executeWithAreasThatHaveBuilding((area: Area) => {
      let enemyPhysicGroup = this.enemyPhysicGroups[area.color];
      let weaponPhysicGroup = this.weaponPhysicGroups[area.color];
      let enemyConfig: EnemyConfig = {
        scene: this.scene,
        color: area.color,
        size: "Normal",
        x: 0,
        y: 0,
        weaponType: "rand",
        physicsGroup: enemyPhysicGroup,
        weaponGroup: weaponPhysicGroup
      };
      new AreaPopulator(enemyConfig, area).startPopulating();
      area.buildings.forEach(building => {
        new BuildingPopulator(enemyConfig, building).startPopulating();
      });
    });
  }
}
