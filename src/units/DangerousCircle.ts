import { unitAnims } from "../anim/anim-play";
import { Point } from "../engine/Point";
import { CircleControl } from "../ai/CircleControl";
import { HealthBar, HealthComponent } from "../healthbar/HealthBar";
import { Gameplay } from "../scenes/Gameplay";
import { ChainWeapon } from "../weapons/ChainWeapon";
import { EnemySize } from "./CircleFactory";
import { CircleUnit } from "./CircleUnit";
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
    this.healthbar.move(this.x, this.y);
    this.stateHandler.tick();
  }
}
