import { Generator } from "../engine/Generator";
import { Gameplay } from "../scenes/Gameplay";

export class CircleGenerator extends Generator {
  title: string;
  radius: number;

  constructor(
    hexColor: number,
    scene: Gameplay,
    title: string,
    radius: number
  ) {
    super(hexColor, scene);
    this.title = title;
    this.radius = radius;
    this.generate();
  }

  drawFrames() {
    this.drawCircleIdleFrame();
    this.drawCircleDamageFrame();
  }

  drawCircleIdleFrame() {
    this.graphics.fillCircle(this.radius, this.radius, this.radius);
  }

  drawCircleDamageFrame() {
    this.graphics.fillCircle(3 * this.radius, this.radius, this.radius);
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
