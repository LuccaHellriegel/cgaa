import { DangerousCircle } from "./DangerousCircle";
import { InteractionCircle } from "./InteractionCircle";
import { HealthBar, HealthComponent } from "../healthbar/HealthBar";
import { Gameplay } from "../scenes/Gameplay";
import { weaponHeights } from "../weapons/chain-weapon-data";
import { ChainWeapons } from "../weapons/ChainWeapons";
import { Enemies } from "./Enemies";
import { King } from "./King";
import { UnitSetup } from "../config/UnitSetup";
import { CampID } from "../config/CampSetup";
import { healthBarDangerousCircleFactoryConfigs } from "../config/HealthbarSetup";
import { veloConfigs } from "../config/VelocitySetup";

export type EnemySize = "Small" | "Normal" | "Big";

export class CircleFactory {
  x = 0;
  y = 0;

  constructor(
    public scene: Gameplay,
    private campID: string,
    private campMask: number,
    private addUnit: Function,
    private enemies: Enemies,
    private weaponPools: { [key in EnemySize]: ChainWeapons }
  ) {
    console.log(campID, campMask);
  }

  public static createWeapon(
    weaponPools: { [key in EnemySize]: ChainWeapons },
    x: number,
    y: number,
    size: EnemySize
  ) {
    return weaponPools[size].placeWeapon(
      x,
      y - UnitSetup.sizeDict[size] - weaponHeights[size].frame2 / 2
    );
  }

  public static createHealthBar(scene, x, y, size, health: HealthComponent) {
    return new HealthBar(
      x,
      y,
      {
        ...healthBarDangerousCircleFactoryConfigs[size],
        scene,
      },
      health
    );
  }

  private afterCreate(circle) {
    this.addUnit(circle);

    circle.weapon.setOwner(circle);
    this.scene.children.bringToTop(circle.healthbar.bar);
    this.enemies.addEnemy(circle);
  }

  createKing() {
    let size: EnemySize = "Big";
    let weapon = CircleFactory.createWeapon(
      this.weaponPools,
      this.x,
      this.y,
      size
    );

    const health = new HealthComponent(
      healthBarDangerousCircleFactoryConfigs[size].value,
      healthBarDangerousCircleFactoryConfigs[size].value
    );
    let circle = new King(
      this.scene,
      this.x,
      this.y,
      "kingCircle",
      this.campID as CampID,
      this.campMask,
      weapon,
      size as EnemySize,
      CircleFactory.createHealthBar(this.scene, this.x, this.y, size, health),
      health,
      veloConfigs[size]
    );
    this.afterCreate(circle);

    return circle;
  }

  createBoss() {
    let size: EnemySize = "Big";
    let weapon = CircleFactory.createWeapon(
      this.weaponPools,
      this.x,
      this.y,
      size
    );

    const health = new HealthComponent(
      healthBarDangerousCircleFactoryConfigs[size].value,
      healthBarDangerousCircleFactoryConfigs[size].value
    );
    let circle = new DangerousCircle(
      this.scene,
      this.x,
      this.y,
      "bossCircle",
      this.campID as CampID,
      this.campMask,
      weapon,
      size as EnemySize,
      CircleFactory.createHealthBar(this.scene, this.x, this.y, size, health),
      health,
      veloConfigs[size]
    );
    this.afterCreate(circle);

    return circle;
  }

  createEnemy(size: EnemySize) {
    let weapon = CircleFactory.createWeapon(
      this.weaponPools,
      this.x,
      this.y,
      size
    );
    const health = new HealthComponent(
      healthBarDangerousCircleFactoryConfigs[size].value,
      healthBarDangerousCircleFactoryConfigs[size].value
    );
    let circle = new DangerousCircle(
      this.scene,
      this.x,
      this.y,
      this.campID + size + "Circle",
      this.campID as CampID,
      this.campMask,
      weapon,
      size as EnemySize,
      CircleFactory.createHealthBar(this.scene, this.x, this.y, size, health),
      health,
      veloConfigs[size]
    );
    this.afterCreate(circle);

    return circle;
  }

  createInteractionCircle(config) {
    let { x, y } = config;

    let size: EnemySize = "Normal";

    const health = new HealthComponent(
      healthBarDangerousCircleFactoryConfigs[size].value,
      healthBarDangerousCircleFactoryConfigs[size].value
    );
    let circle = new InteractionCircle(
      this.scene,
      x,
      y,
      this.campID + "InteractionCircle",
      this.campID as CampID,
      this.campMask,
      CircleFactory.createWeapon(this.weaponPools, x, y, size),
      size as EnemySize,
      CircleFactory.createHealthBar(this.scene, x, y, size, health),
      health
    );
    this.afterCreate(circle);

    // was overwritten somewhere (I think when adding to the physics groups), so set it here
    circle.setImmovable(true);

    return circle;
  }
}
