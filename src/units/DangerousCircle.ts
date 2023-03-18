import { unitAnims } from "../anim/anim-play";
import { Point } from "../engine/Point";
import { CircleControl } from "../ai/CircleControl";
import { HealthBar, HealthComponent } from "../healthbar/HealthBar";
import { Gameplay } from "../scenes/Gameplay";
import { weaponHeights } from "../weapons/ChainWeapon/chain-weapon-data";
import { ChainWeapon } from "../weapons/ChainWeapon/ChainWeapon";
import { EnemySize } from "./CircleFactory";
import { CircleUnit } from "./CircleUnit";
import { UnitSetup } from "../config/UnitSetup";
import { CampID } from "../config/CampSetup";

export class DangerousCircle extends CircleUnit implements unitAnims {
  pathArr: Point[];
  stateHandler: CircleControl = new CircleControl(this);

  attack: Function;

  constructor(
    scene: Gameplay,
    x: number,
    y: number,
    texture: string,
    campID: CampID,
    campMask: number,
    weapon: ChainWeapon,
    size: EnemySize,
    healthbar: HealthBar,
    health: HealthComponent,
    public velo: number
  ) {
    super(
      scene,
      x,
      y,
      texture,
      campID,
      campMask,
      weapon,
      size,
      healthbar,
      health
    );
    this.setCircle(this.texture.get(0).halfWidth);
    this.attack = this.weapon.attack.bind(this.weapon);
  }

  heal(amount: number) {
    this.healthbar.increase(amount);
  }

  disable() {
    this.scene.events.emit("inactive-" + this.id, this.id);
    this.disableBody(true, true);
    this.setPosition(-1000, -1000);
  }

  enable(x, y) {
    this.enableBody(true, x, y, true, true);
    this.stateHandler.lastPositions.push({ x, y });
  }

  damage(amount) {
    const res = this.health.decrease(amount);
    this.healthbar.draw();
    if (res) {
      this.poolDestroy();
      return true;
    } else {
      this.playDamage();
      return false;
    }
  }

  poolDestroy() {
    this.disable();
    this.healthbar.disable();
    this.weapon.disable();
  }

  poolActivate(x, y) {
    this.enable(x, y);
    this.healthbar.enable(x, y);
    this.weapon.enable(
      x,
      y - UnitSetup.sizeDict[this.type] - weaponHeights[this.type].frame2 / 2
    );
  }

  setVelocityX(velo) {
    this.weapon.setVelocityX(velo);
    return super.setVelocityX(velo);
  }

  setVelocityY(velo) {
    this.weapon.setVelocityY(velo);
    return super.setVelocityY(velo);
  }

  setVelocity(x, y) {
    this.weapon.setVelocity(x, y);
    return super.setVelocity(x, y);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.weapon.setRotationAroundOwner();
    this.healthbar.move(this.x, this.y);
    this.stateHandler.tick();
  }
}
