interface HealthBarConfig {
  scene;
  healthWidth;
  healthLength;
  posCorrectionX;
  posCorrectionY;
  value: number;
}

export class HealthComponent {
  constructor(public health: number, public healthDefault: number) {}

  reset() {
    this.health = this.healthDefault;
  }

  decrease(amount: number) {
    this.health = Math.max(0, this.health - amount);
    return this.health === 0;
  }

  increase(amount: number) {
    this.health = Math.min(this.healthDefault, this.health + amount);
  }
}

export class HealthBar {
  bar: Phaser.GameObjects.Graphics;
  healthWidth: number;
  healthLength: number;
  p: number;
  posCorrectionX: number;
  posCorrectionY: number;

  constructor(
    public x: number,
    public y: number,
    config: HealthBarConfig,
    public health: HealthComponent
  ) {
    this.bar = (config.scene as Phaser.Scene).add.graphics();

    let { healthWidth, healthLength, posCorrectionX, posCorrectionY, value } =
      config;

    this.healthWidth = healthWidth;
    this.healthLength = healthLength;
    this.p = healthWidth / value;

    this.posCorrectionX = posCorrectionX;
    this.posCorrectionY = posCorrectionY;

    this.move(x, y);
    this.reset();
  }

  reset() {
    this.health.reset();
    this.draw();
  }

  decrease(amount) {
    const res = this.health.decrease(amount);
    this.draw();
    return res;
  }

  increase(amount) {
    this.health.increase(amount);
    this.draw();
  }

  drawBackground() {
    this.bar.fillStyle(0x000000);
    this.bar.fillRect(
      this.x,
      this.y,
      this.healthWidth + 4,
      this.healthLength + 4
    );
  }

  drawHealth() {
    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(
      this.x + 2,
      this.y + 2,
      this.healthWidth,
      this.healthLength
    );

    // draw red part
    if (this.health.health < 30) {
      this.bar.fillStyle(0xff0000);
    } else {
      this.bar.fillStyle(0x00ff00);
    }
    let d = Math.floor(this.p * this.health.health);
    this.bar.fillRect(this.x + 2, this.y + 2, d, this.healthLength);
  }

  draw() {
    this.bar.clear();
    this.drawBackground();
    this.drawHealth();
  }

  move(x, y) {
    this.x = x + this.posCorrectionX;
    this.y = y + this.posCorrectionY;
    this.draw();
  }

  destroy() {
    this.bar.destroy();
  }

  enable(x, y) {
    this.bar.setActive(true).setVisible(true);
    this.move(x, y);
  }

  disable() {
    this.bar.setActive(false).setVisible(false);
    this.health.reset();
  }
}
