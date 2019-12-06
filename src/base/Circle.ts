import { ChainWeapon } from "./weapons/ChainWeapon";
import { RandWeapon } from "./weapons/RandWeapon";
import { Weapon } from "./weapons/Weapon";
import { CirclePolygon } from "../graphics/polygons/CirclePolygon";
import { normalCircleRadius } from "../globals/globalSizes";
import { SpriteWithAnimEvents } from "./BasePhaser";

export class Circle extends SpriteWithAnimEvents {
  weapon: Weapon;
  polygon: CirclePolygon;
  unitType: string;
  obstacle: any;

  constructor(scene, x, y, texture, physicsGroup, weapon: Weapon) {
    super(scene, x, y, texture, physicsGroup);
    this.polygon = new CirclePolygon(
      x + scene.cameras.main.scrollX,
      y + scene.cameras.main.scrollY,
      normalCircleRadius
    );
    this.unitType = "circle";
    this.setCircle(normalCircleRadius);
    this.setupAnimEvents();
    this.weapon = weapon;
    this.setCollideWorldBounds(true);
  }

  attack() {
    if (!this.weapon.attacking) {
      this.weapon.attacking = true;
      this.weapon.anims.play("attack-" + this.weapon.texture.key);
    }
  }

  rotateWeaponAroundCircle() {
    let point = Phaser.Math.RotateAround(
      new Phaser.Geom.Point(this.x + this.weapon.unitOffSetX, this.y + this.weapon.unitOffSetY),
      this.x,
      this.y,
      this.rotation
    );
    this.weapon.setPosition(point.x, point.y);
    this.weapon.setRotation(this.rotation);
  }

  destroy() {
    super.destroy();
    this.weapon.destroy();
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.rotateWeaponAroundCircle();
  }

  static withChainWeapon(scene, x, y, texture, physicsGroup, weaponGroup) {
    let weapon = new ChainWeapon(scene, x, y, weaponGroup, 5, 2, null);
    let circle = new this(scene, x, y, texture, physicsGroup, weapon);
    weapon.owner = circle;
    return circle;
  }

  static withRandWeapon(scene, x, y, texture, physicsGroup, weaponGroup) {
    let weapon = new RandWeapon(scene, x, y, weaponGroup, null);
    let circle = new this(scene, x, y, texture, physicsGroup, weapon);
    weapon.owner = circle;
    return circle;
  }

  setupAnimEvents() {
    this.on(
      "animationcomplete_damage-" + this.texture.key,
      function() {
        this.anims.play("idle-" + this.texture.key);
      },
      this
    );
  }

  damage(amount) {
    this.anims.play("damage-" + this.texture.key);
    this.scene.events.emit("damage-" + this.unitType, amount);
  }

  syncPolygon() {
    this.polygon.setPosition(this.x, this.y);
  }
}
