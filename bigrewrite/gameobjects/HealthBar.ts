export class HealthBar {
  public bar: Phaser.GameObjects.Graphics;
  public p: number;

  constructor(
    public x: number,
    public y: number,
    public scene: Phaser.Scene,
    public healthWidth: number,
    public healthLength: number,
    public posCorrectionX: number, //used to position relative to unit
    public posCorrectionY: number,
    public initialHealth: number
  ) {
    this.bar = scene.add.graphics();

    this.healthWidth = healthWidth;
    this.healthLength = healthLength;
    this.p = healthWidth / initialHealth;

    this.posCorrectionX = posCorrectionX;
    this.posCorrectionY = posCorrectionY;

    this.draw(x, y, initialHealth);
  }

  draw(x: number, y: number, health: number) {
    this.x = x + this.posCorrectionX;
    this.y = y + this.posCorrectionY;

    this.bar.clear();
    // draw background
    this.bar.fillStyle(0x000000);
    this.bar.fillRect(
      this.x,
      this.y,
      this.healthWidth + 4,
      this.healthLength + 4
    );
    // draw health
    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(
      this.x + 2,
      this.y + 2,
      this.healthWidth,
      this.healthLength
    );

    // draw red part
    if (health < 30) {
      this.bar.fillStyle(0xff0000);
    } else {
      this.bar.fillStyle(0x00ff00);
    }
    let d = Math.floor(this.p * health);
    this.bar.fillRect(this.x + 2, this.y + 2, d, this.healthLength);
  }
}
