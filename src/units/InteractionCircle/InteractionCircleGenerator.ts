import { Generator } from "../../engine/Generator";
import { Gameplay } from "../../scenes/Gameplay";

export class InteractionCircleGenerator extends Generator {
  title: string;
  radius: number;
  hexColor: number;

  constructor(
    hexColor: number,
    scene: Gameplay,
    title: string,
    radius: number
  ) {
    super(hexColor, scene);
    this.title = title;
    this.radius = radius;
    this.hexColor = hexColor;
    this.generate();
  }

  drawFrames() {
    this.drawCircleIdleFrame();
    this.drawCircleDamageFrame();
  }

  drawCircleIdleFrame() {
    this.graphics.fillStyle(this.hexColor);
    this.graphics.fillCircle(this.radius, this.radius, this.radius);
    this.graphics.fillStyle(0x323232);
    this.graphics.fillCircle(this.radius, this.radius, 2.5 * (this.radius / 3));
  }

  drawCircleDamageFrame() {
    this.graphics.fillStyle(this.hexColor);
    this.graphics.fillCircle(3 * this.radius, this.radius, this.radius);
    this.graphics.fillStyle(0x323232);
    this.graphics.fillCircle(
      3 * this.radius,
      this.radius,
      2.5 * (this.radius / 3)
    );
    this.graphics.fillStyle(0xf08080);
    this.graphics.fillCircle(
      3 * this.radius,
      this.radius,
      2 * (this.radius / 3)
    );
  }

  generateTexture() {
    this.graphics.generateTexture(this.title, 4 * this.radius, 2 * this.radius);
  }

  addFrames() {
    this.scene.textures.list[this.title].add(
      1,
      0,
      0,
      0,
      2 * this.radius,
      2 * this.radius
    );
    this.scene.textures.list[this.title].add(
      2,
      0,
      2 * this.radius,
      0,
      2 * this.radius,
      2 * this.radius
    );
  }
}
