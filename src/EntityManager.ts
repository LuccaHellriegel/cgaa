import { UnitSetup } from "./config/UnitSetup";
import { CircleUnit } from "./units/CircleUnit";
import { weaponHeights } from "./weapons/chain-weapon-data";
import { ChainWeapon } from "./weapons/ChainWeapon";

export class EntityManager {
  owners: CircleUnit[] = [];
  weapons: ChainWeapon[] = [];

  registerWeapon(owner: CircleUnit, weapon: ChainWeapon) {
    this.owners.push(owner);
    this.weapons.push(weapon);
    weapon.owner = owner;
    weapon.circle.owner = owner;
    weapon.circle.unitType = owner.unitType;
    weapon.circle.campID = owner.campID;
  }

  update() {
    for (let index = 0; index < this.weapons.length; index++) {
      const weapon = this.weapons[index];
      const owner = this.owners[index];
      EntityManager.setRotationAroundOwner(owner, weapon);
    }
  }

  static setRotationAroundOwner(owner: CircleUnit, weapon: ChainWeapon) {
    // always calculate new rotation base point from current position of owner
    // this way we catch position changes of owner
    // We still need to use velocity, because it seems velocity changes are updated after preUpdate
    let point = Phaser.Math.RotateAround(
      new Phaser.Geom.Point(
        owner.x,
        owner.y -
          UnitSetup.sizeDict[owner.type] -
          weaponHeights[owner.type].frame2 / 2
      ),
      owner.x,
      owner.y,
      owner.rotation
    );
    weapon.setPhysicsPosition(point.x, point.y);
    weapon.setPosition(point.x, point.y);
    const radians = owner.rotation;
    // setRotation starts always at 0, rotate around starts at the last value
    // so we need to only rotate the difference
    for (let point of [weapon.circle, weapon.circleFrame1, weapon.circleFrame2])
      Phaser.Math.RotateAround(
        point,
        weapon.x,
        weapon.y,
        radians - weapon.rotation
      );
    weapon.setRotation(owner.rotation);
  }
}
