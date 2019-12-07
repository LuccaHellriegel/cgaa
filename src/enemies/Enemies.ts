import { Gameplay } from "../scenes/Gameplay";
import { Player } from "../player/Player";
import { AreaPopulator } from "./populators/AreaPopulator";
import { BuildingPopulator } from "./populators/BuildingPopulator";
import { BaseService, BaseManagerConfig } from "../base/Base";
import { PositionService } from "../base/PositionService";
import { Area } from "../world/areas/Area";
import { campColors } from "../globals/globalColors";
import { EnemyConfig } from "./units/EnemyFactory";
import { EnemyCircle } from "./units/EnemyCircle";

export class Enemies {
  scene: Gameplay;
  enemyPhysicGroups = {};
  weaponPhysicGroups = {};
  units: EnemyCircle[] = [];

  constructor(config: BaseManagerConfig) {
    BaseService.applyBaseManagerConfig(this, config);

    for (let index = 0; index < campColors.length; index++) {
      this.enemyPhysicGroups[campColors[index]] = this.scene.physics.add.group();
      this.weaponPhysicGroups[campColors[index]] = this.scene.physics.add.group();
    }

    this.spawnUnits();
  }

  addEnemy(enemy){
    this.units.push(enemy)
  }

  getRelativeEnemyPositions() {
    return PositionService.getRelativePosOfElements(this.units);
  }

  getRelativeEnemyPositionsAndAroundEnemyPositions() {
    return PositionService.getRelativePosOfElementsAndAroundElements(this.units, 1, 1);
  }

  spawnUnits() {
    Player.withChainWeapon(this.scene);
    this.scene.world.executeWithAreasThatHaveBuilding((area: Area) => {
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
