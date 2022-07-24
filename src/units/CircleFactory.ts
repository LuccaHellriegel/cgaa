import { DangerousCircle } from "./DangerousCircle/DangerousCircle";
import { InteractionCircle } from "./InteractionCircle/InteractionCircle";
import { HealthBar } from "../healthbar/HealthBar";
import { Gameplay } from "../scenes/Gameplay";
import { weaponHeights } from "../weapons/ChainWeapon/chain-weapon-data";
import { ChainWeapons } from "../weapons/ChainWeapon/ChainWeapons";
import { Enemies } from "./Enemies";
import { King } from "./King/King";
import { UnitSetup } from "../config/UnitSetup";
import { CampID } from "../config/CampSetup";

export const veloConfigs = { Small: 185, Normal: 160, Big: 150 };

const healthBarDangerousCircleFactoryConfigs = {
  Small: {
    posCorrectionX: -26,
    posCorrectionY: -38,
    healthWidth: 41,
    healthLength: 8,
    value: 40,
    scene: null,
  },
  Normal: {
    posCorrectionX: -26,
    posCorrectionY: -38,
    healthWidth: 46,
    healthLength: 12,
    value: 100,
    scene: null,
  },
  Big: {
    posCorrectionX: -26,
    posCorrectionY: -38,
    healthWidth: 51,
    healthLength: 17,
    value: 200,
    scene: null,
  },
};

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

  public static createHealthBar(scene, x, y, size) {
    return new HealthBar(x, y, {
      ...healthBarDangerousCircleFactoryConfigs[size],
      scene,
    });
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

    let circle = new King(
      this.scene,
      this.x,
      this.y,
      "kingCircle",
      this.campID as CampID,
      this.campMask,
      weapon,
      size as EnemySize,
      CircleFactory.createHealthBar(this.scene, this.x, this.y, size),
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

    let circle = new DangerousCircle(
      this.scene,
      this.x,
      this.y,
      "bossCircle",
      this.campID as CampID,
      this.campMask,
      weapon,
      size as EnemySize,
      CircleFactory.createHealthBar(this.scene, this.x, this.y, size),
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
    let circle = new DangerousCircle(
      this.scene,
      this.x,
      this.y,
      this.campID + size + "Circle",
      this.campID as CampID,
      this.campMask,
      weapon,
      size as EnemySize,
      CircleFactory.createHealthBar(this.scene, this.x, this.y, size),
      veloConfigs[size]
    );
    this.afterCreate(circle);

    return circle;
  }

  createInteractionCircle(config) {
    let { x, y } = config;

    let size: EnemySize = "Normal";

    let circle = new InteractionCircle(
      this.scene,
      x,
      y,
      this.campID + "InteractionCircle",
      this.campID as CampID,
      this.campMask,
      CircleFactory.createWeapon(this.weaponPools, x, y, size),
      size as EnemySize,
      CircleFactory.createHealthBar(this.scene, x, y, size)
    );
    this.afterCreate(circle);

    // was overwritten somewhere (I think when adding to the physics groups), so set it here
    circle.setImmovable(true);

    return circle;
  }
}
