import { WeaponTypes } from "../../base/weapons/WeaponFactory";
import { EnemyCircle } from "./EnemyCircle";
import { Gameplay } from "../../scenes/Gameplay";
import { HealthBar } from "../../base/HealthBar";
import { ChainWeapon } from "../../base/weapons/ChainWeapon";
import { RandWeapon } from "../../base/weapons/RandWeapon";

const healthBarConfigs = {
  Small: { posCorrectionX: 0, posCorrectionY: 0 },
  Normal: { posCorrectionX: -26, posCorrectionY: -38, healthWidth: 46, healthLength: 12 },
  Big: { posCorrectionX: 0, posCorrectionY: 0 }
};

export type EnemySize = "Small" | "Normal" | "Big";

export interface EnemyConfig {
  scene: Gameplay;
  color: string;
  size: EnemySize;
  x: number;
  y: number;
  weaponType: WeaponTypes;
  physicsGroup;
  weaponGroup;
}

export class EnemyFactory {
  private constructor() {}

  static createEnemy(enemyConfig: EnemyConfig) {
    let { scene, color, size, x, y, weaponType, physicsGroup, weaponGroup } = enemyConfig;

    let healthBarConfig = healthBarConfigs[size];

    let healthBar = new HealthBar(scene, x, y, healthBarConfig);

    let weapon;
    if (weaponType === "chain") {
      weapon = new ChainWeapon(scene, x, y, weaponGroup, null);
    } else {
      weapon = new RandWeapon(scene, x, y, weaponGroup, null);
    }
    let circle = new EnemyCircle(scene, x, y, physicsGroup, weapon, color, size, healthBar);
    weapon.owner = circle;
    scene.children.bringToTop(healthBar.bar);

    return circle;
  }
}
