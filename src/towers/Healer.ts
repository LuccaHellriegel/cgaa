import { Tower, Towers } from "./Tower";
import { Gameplay } from "../scenes/Gameplay";
import { RectPolygon } from "../engine/polygons/RectPolygon";
import { TowerSetup } from "../config/TowerSetup";

class HollowRectPoylgon extends RectPolygon {
  draw(graphics, offset) {
    graphics.beginPath();
    graphics.moveTo(this.points[0].x + offset, this.points[0].y + offset);
    for (let index = 0; index < this.points.length; index++) {
      graphics.lineTo(
        this.points[index].x + offset,
        this.points[index].y + offset
      );
    }
    graphics.closePath();
    graphics.strokePath();
  }
}

export class Healer extends Tower {
  healIntervalID: number;
  graphics: Phaser.GameObjects.Graphics;
  auraPolygon: HollowRectPoylgon;
  pools: Towers[];
  player: any;

  constructor(scene: Gameplay, x, y) {
    super(scene, x, y, "healer");
    this.graphics = scene.add.graphics({});
    this.auraPolygon = new HollowRectPoylgon(
      x,
      y,
      TowerSetup.towerDistance,
      TowerSetup.towerDistance
    );
    this.type = "Healer";
  }

  setPlayer(player) {
    this.player = player;
  }

  place(x, y, pools) {
    this.scene.children.sendToBack(this);
    this.pools = pools;
    super.place(x, y, null);
    this.activate();
    this.auraPolygon.setPosition(x, y);
    this.redraw();
  }

  damage(amount: number) {
    if (this.healthbar.decrease(amount)) {
      this.poolDestroy();
    }
  }

  inDistance(unit) {
    return (
      Phaser.Math.Distance.Between(this.x, this.y, unit.x, unit.y) <
      TowerSetup.towerDistance
    );
  }

  healUnits() {
    this.pools.forEach((pool) =>
      pool.getActiveUnits().forEach((unit) => {
        if (this.inDistance(unit)) {
          unit.heal(TowerSetup.singleHealAmount);
        }
      })
    );
    if (this.inDistance(this.player))
      this.player.heal(TowerSetup.singleHealAmount);
  }

  deactivate() {
    if (this.healIntervalID) clearInterval(this.healIntervalID);
  }

  activate() {
    this.healIntervalID = setInterval(this.healUnits.bind(this), 1500);
  }

  redraw() {
    this.graphics.lineStyle(4, 0xa9a9a9);
    this.auraPolygon.draw(this.graphics, 0);
  }

  poolDestroy() {
    this.disableBody(true, true);
    this.healthbar.disable();
    this.deactivate();
    this.graphics.clear();
  }
}
