import { CompositePolygon } from "../polygons/CompositePolygon";
import { SpriteWithAnimEvents } from "../base/BasePhaser";

export abstract class Weapon extends SpriteWithAnimEvents {
  polygon: CompositePolygon;
  polygonArr: CompositePolygon[];
  alreadyAttacked: string[];
  attacking: boolean;
  unitOffSetX: number;
  unitOffSetY: number;
  offSetArr: number[][];

  constructor(scene, x, y, texture, weaponGroup, polygonArr, offSetArr) {
    super(scene, x, y, texture, weaponGroup);
    this.setCollideWorldBounds(false);
    this.alreadyAttacked = [];
    this.attacking = false;
    this.setupAnimEvents();
    this.unitOffSetX = offSetArr[0][0];
    this.unitOffSetY = offSetArr[0][1];
    this.offSetArr = offSetArr;
    this.polygon = polygonArr[0];
    this.polygonArr = polygonArr;
  }

  movePolygon() {
    if (this.polygon.centerX !== this.x || this.polygon.centerY !== this.y) {
      this.polygon.setPosition(this.x, this.y);
    }
    if (this.polygon.rotation !== this.rotation) {
      this.polygon.rotate(this.rotation);
    }
  }

  setPolygonForFrame() {
    this.polygon = this.polygonArr[parseInt(this.frame.name) - 1];
  }

  syncPolygon() {
    this.setPolygonForFrame();
    this.movePolygon();
  }

  setupAnimEvents() {
    this.on(
      "animationcomplete_attack-" + this.texture.key,
      function() {
        this.anims.play("idle-" + this.texture.key);
        this.attacking = false;
        this.alreadyAttacked = [];
      },
      this
    );
  }

  setOffSetForFrame() {
    let curFrameIndex = parseInt(this.frame.name) - 1;
    this.unitOffSetX = this.offSetArr[curFrameIndex][0];
    this.unitOffSetY = this.offSetArr[curFrameIndex][1];
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.setOffSetForFrame();
  }
}
