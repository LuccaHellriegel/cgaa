import { Image } from "../../base/BasePhaser";

export class Building extends Image {
  id: string;
  color: string;
  constructor(scene, x, y, physicsGroup, color: string) {
    super({scene, x, y, texture: color + "Building", physicsGroup});
    this.color = color;
    this.setImmovable(true);
  }
}
