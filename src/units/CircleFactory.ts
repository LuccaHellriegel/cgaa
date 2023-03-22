import { DangerousCircle } from "./DangerousCircle";
import { InteractionCircle } from "./InteractionCircle";
import { HealthBar, HealthComponent } from "../healthbar/HealthBar";
import { Gameplay } from "../scenes/Gameplay";
import { weaponHeights } from "../weapons/chain-weapon-data";
import { Enemies } from "./Enemies";
import { King } from "./King";
import { UnitSetup } from "../config/UnitSetup";
import { CampID } from "../config/CampSetup";
import { healthBarDangerousCircleFactoryConfigs } from "../config/HealthbarSetup";
import { veloConfigs } from "../config/VelocitySetup";
import { ChainWeapon } from "../weapons/ChainWeapon";
import { unitAmountConfig } from "../weapons/chain-weapon-base";
import { EntityManager } from "../EntityManager";

export type EnemySize = "Small" | "Normal" | "Big";

export class CircleFactory {
  constructor(
    private entityManager: EntityManager,
    public scene: Gameplay,
    private campID: string,
    private campMask: number,
    private addUnit: Function,
    private enemies: Enemies
  ) {}

  public static createWeapon(
    scene: Gameplay,
    x: number,
    y: number,
    size: EnemySize
  ) {
    let weapon: ChainWeapon = new ChainWeapon(
      scene,
      x,
      y - UnitSetup.sizeDict[size] - weaponHeights[size].frame2 / 2,
      size + "chainWeapon",
      unitAmountConfig[size].amount,
      size
    );
    return weapon;
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

  createKing(x: number, y: number) {
    let size: EnemySize = "Big";
    let weapon = CircleFactory.createWeapon(this.scene, x, y, size);

    const health = new HealthComponent(
      healthBarDangerousCircleFactoryConfigs[size].value,
      healthBarDangerousCircleFactoryConfigs[size].value
    );
    let circle = new King(
      this.scene,
      x,
      y,
      "kingCircle",
      this.campID as CampID,
      this.campMask,
      weapon,
      size as EnemySize,
      CircleFactory.createHealthBar(this.scene, x, y, size, health),
      health,
      veloConfigs[size]
    );
    this.entityManager.registerWeapon(circle, weapon);

    this.afterCreate(circle);

    return circle;
  }

  createBoss(x: number, y: number) {
    let size: EnemySize = "Big";
    let weapon = CircleFactory.createWeapon(this.scene, x, y, size);

    const health = new HealthComponent(
      healthBarDangerousCircleFactoryConfigs[size].value,
      healthBarDangerousCircleFactoryConfigs[size].value
    );
    let circle = new DangerousCircle(
      this.scene,
      x,
      y,
      "bossCircle",
      this.campID as CampID,
      this.campMask,
      weapon,
      size as EnemySize,
      CircleFactory.createHealthBar(this.scene, x, y, size, health),
      health,
      veloConfigs[size]
    );
    this.entityManager.registerWeapon(circle, weapon);
    this.afterCreate(circle);

    return circle;
  }

  createEnemy(size: EnemySize, x: number, y: number) {
    let weapon = CircleFactory.createWeapon(this.scene, x, y, size);
    const health = new HealthComponent(
      healthBarDangerousCircleFactoryConfigs[size].value,
      healthBarDangerousCircleFactoryConfigs[size].value
    );
    let circle = new DangerousCircle(
      this.scene,
      x,
      y,
      this.campID + size + "Circle",
      this.campID as CampID,
      this.campMask,
      weapon,
      size as EnemySize,
      CircleFactory.createHealthBar(this.scene, x, y, size, health),
      health,
      veloConfigs[size]
    );
    this.entityManager.registerWeapon(circle, weapon);
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
    const weapon = CircleFactory.createWeapon(this.scene, x, y, size);
    let circle = new InteractionCircle(
      this.scene,
      x,
      y,
      this.campID + "InteractionCircle",
      this.campID as CampID,
      this.campMask,
      weapon,
      size as EnemySize,
      CircleFactory.createHealthBar(this.scene, x, y, size, health),
      health
    );
    this.entityManager.registerWeapon(circle, weapon);
    this.afterCreate(circle);

    // was overwritten somewhere (I think when adding to the physics groups), so set it here
    circle.setImmovable(true);

    return circle;
  }
}
