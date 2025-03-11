import Phaser from "phaser";

export class GraphicsGenerator {
  private scene: Phaser.Scene;

  static readonly Colors = {
    PLAYER: 0x800080, // Purple
    ALLIES: 0x0000ff, // Blue
    ENEMY: 0xff0000, // Red
    NEUTRAL: 0x808080, // Gray
    WARNING: 0xff0000, // Red
    SUCCESS: 0x00ff00, // Green
    UI: 0x00ffff, // Cyan
    HEAL: 0x00ff00, // Green
    DAMAGE: 0xff0000, // Red
    SOUL: 0x00ffff, // Cyan
  };

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  generatePlayerTexture(key: string = "player"): void {
    // Base player circle
    const graphics = this.scene.add.graphics();
    const radius = 16; // Standard player size
    const diameter = radius * 2;

    // Generate idle frame
    graphics.clear();
    graphics.lineStyle(2, 0x000000);
    graphics.fillStyle(GraphicsGenerator.Colors.PLAYER);
    graphics.beginPath();
    graphics.arc(radius, radius, radius, 0, Math.PI * 2);
    graphics.closePath();
    graphics.fill();
    graphics.stroke();
    graphics.generateTexture(key, diameter, diameter);

    // Generate moving frame (slightly squished)
    graphics.clear();
    graphics.lineStyle(2, 0x000000);
    graphics.fillStyle(GraphicsGenerator.Colors.PLAYER);
    graphics.beginPath();
    graphics.arc(radius, radius + 2, radius * 0.9, 0, Math.PI * 2);
    graphics.closePath();
    graphics.fill();
    graphics.stroke();
    graphics.generateTexture(`${key}_move`, diameter, diameter);

    // Generate attack frame (with indicator)
    graphics.clear();
    graphics.lineStyle(2, 0x000000);
    graphics.fillStyle(GraphicsGenerator.Colors.PLAYER);
    graphics.beginPath();
    graphics.arc(radius, radius, radius, 0, Math.PI * 2);
    graphics.closePath();
    graphics.fill();
    graphics.stroke();

    // Add attack indicator
    graphics.lineStyle(2, GraphicsGenerator.Colors.WARNING);
    graphics.beginPath();
    graphics.moveTo(radius + radius * 0.5, radius);
    graphics.lineTo(radius + radius * 0.8, radius);
    graphics.closePath();
    graphics.stroke();
    graphics.generateTexture(`${key}_attack`, diameter, diameter);

    graphics.destroy();

    // Create animation configurations
    if (this.scene.anims) {
      // Idle animation
      this.scene.anims.create({
        key: "player_idle",
        frames: [{ key: key }],
        frameRate: 1,
        repeat: -1,
      });

      // Moving animation
      this.scene.anims.create({
        key: "player_move",
        frames: [{ key: key }, { key: `${key}_move` }],
        frameRate: 8,
        repeat: -1,
      });

      // Attack animation
      this.scene.anims.create({
        key: "player_attack",
        frames: [{ key: key }, { key: `${key}_attack` }, { key: key }],
        frameRate: 12,
        repeat: 0,
      });
    }
  }

  generateEnemyTexture(key: string = "enemy"): void {
    const graphics = this.scene.add.graphics();
    const radius = 12;
    const diameter = radius * 2;

    // Generate idle frame
    graphics.clear();
    graphics.lineStyle(2, 0x000000);
    graphics.fillStyle(GraphicsGenerator.Colors.ENEMY);
    graphics.beginPath();
    graphics.arc(radius, radius, radius, 0, Math.PI * 2);
    graphics.closePath();
    graphics.fill();
    graphics.stroke();
    graphics.generateTexture(key, diameter, diameter);

    // Generate moving frame
    graphics.clear();
    graphics.lineStyle(2, 0x000000);
    graphics.fillStyle(GraphicsGenerator.Colors.ENEMY);
    graphics.beginPath();
    graphics.arc(radius, radius + 2, radius * 0.9, 0, Math.PI * 2);
    graphics.closePath();
    graphics.fill();
    graphics.stroke();
    graphics.generateTexture(`${key}_move`, diameter, diameter);

    // Generate attack frame
    graphics.clear();
    graphics.lineStyle(2, 0x000000);
    graphics.fillStyle(GraphicsGenerator.Colors.ENEMY);
    graphics.beginPath();
    graphics.arc(radius, radius, radius * 1.2, 0, Math.PI * 2);
    graphics.closePath();
    graphics.fill();
    graphics.stroke();
    graphics.generateTexture(`${key}_attack`, diameter, diameter);

    // Generate death frame
    graphics.clear();
    graphics.lineStyle(2, 0x000000);
    graphics.fillStyle(GraphicsGenerator.Colors.ENEMY);
    graphics.beginPath();
    graphics.arc(radius, radius, radius * 0.5, 0, Math.PI * 2);
    graphics.closePath();
    graphics.fill();
    graphics.stroke();
    graphics.generateTexture(`${key}_death`, diameter, diameter);

    graphics.destroy();

    // Create animations
    if (this.scene.anims) {
      // Idle animation
      this.scene.anims.create({
        key: "enemy_idle",
        frames: [{ key: key }],
        frameRate: 1,
        repeat: -1,
      });

      // Moving animation
      this.scene.anims.create({
        key: "enemy_move",
        frames: [{ key: key }, { key: `${key}_move` }],
        frameRate: 8,
        repeat: -1,
      });

      // Attack animation
      this.scene.anims.create({
        key: "enemy_attack",
        frames: [
          { key: key },
          { key: `${key}_attack` },
          { key: `${key}_attack` },
          { key: key },
        ],
        frameRate: 12,
        repeat: 0,
      });

      // Death animation
      this.scene.anims.create({
        key: "enemy_death",
        frames: [
          { key: key },
          { key: `${key}_death` },
          { key: `${key}_death` },
        ],
        frameRate: 8,
        repeat: 0,
        hideOnComplete: true,
      });
    }
  }

  generateTowerTexture(key: string = "tower"): void {
    const graphics = this.scene.add.graphics();
    const size = 32;

    // Generate base frame
    graphics.clear();
    graphics.lineStyle(2, 0x000000);
    graphics.fillStyle(0x666666);
    graphics.fillRect(0, 0, size, size);
    graphics.strokeRect(0, 0, size, size);
    graphics.generateTexture(key, size, size);

    // Generate building frame
    graphics.clear();
    graphics.lineStyle(2, 0x000000);
    graphics.fillStyle(0x666666);
    graphics.fillRect(0, size * 0.2, size, size * 0.8);
    graphics.strokeRect(0, size * 0.2, size, size * 0.8);
    graphics.generateTexture(`${key}_building`, size, size);

    // Generate shooting frame
    graphics.clear();
    graphics.lineStyle(2, 0x000000);
    graphics.fillStyle(0x666666);
    graphics.fillRect(0, 0, size, size);
    graphics.strokeRect(0, 0, size, size);
    graphics.lineStyle(2, 0xff0000);
    graphics.lineBetween(size / 2, size / 2, size, size / 2);
    graphics.generateTexture(`${key}_shoot`, size, size);

    graphics.destroy();

    // Create animations
    if (this.scene.anims) {
      // Building animation
      this.scene.anims.create({
        key: "tower_build",
        frames: [{ key: `${key}_building` }, { key: key }],
        frameRate: 4,
        repeat: 0,
      });

      // Shooting animation
      this.scene.anims.create({
        key: "tower_shoot",
        frames: [{ key: key }, { key: `${key}_shoot` }, { key: key }],
        frameRate: 12,
        repeat: 0,
      });
    }
  }

  setupParticleEffects(): void {
    // First generate the particle texture
    this.generateParticleTexture("particle", 4, 0xffffff, 1);

    // Create particle managers
    const particles = {
      impact: this.scene.add.particles(0, 0, "particle", {
        speed: { min: 50, max: 100 },
        scale: { start: 1, end: 0 },
        blendMode: Phaser.BlendModes.ADD,
        lifespan: 300,
        maxParticles: 10,
        active: false,
      }),

      soul: this.scene.add.particles(0, 0, "particle", {
        tint: [GraphicsGenerator.Colors.SOUL],
        speed: { min: 20, max: 50 },
        scale: { start: 0.5, end: 0 },
        blendMode: Phaser.BlendModes.ADD,
        lifespan: 500,
        maxParticles: 5,
        active: false,
      }),

      heal: this.scene.add.particles(0, 0, "particle", {
        tint: [GraphicsGenerator.Colors.HEAL],
        speed: { min: 30, max: 60 },
        scale: { start: 0.3, end: 0 },
        blendMode: Phaser.BlendModes.ADD,
        lifespan: 400,
        maxParticles: 8,
        active: false,
      }),
    };

    // Store particle emitters for later use
    this.scene.registry.set("particles", particles);
  }

  public generateParticleTexture(
    key: string,
    radius: number,
    color: number,
    alpha: number = 1
  ): void {
    const size = radius * 2;
    const graphics = this.scene.add.graphics();

    graphics.setAlpha(alpha);
    graphics.fillStyle(color);
    graphics.beginPath();
    graphics.arc(radius, radius, radius, 0, Math.PI * 2);
    graphics.closePath();
    graphics.fill();

    graphics.generateTexture(key, size, size);
    graphics.destroy();
  }

  generateCircleTexture(
    key: string,
    radius: number,
    color: number,
    strokeColor?: number,
    strokeWidth: number = 2
  ): void {
    const graphics = this.scene.add.graphics();
    const diameter = radius * 2;

    if (strokeColor !== undefined) {
      graphics.lineStyle(strokeWidth, strokeColor);
    }
    graphics.fillStyle(color);
    graphics.beginPath();
    graphics.arc(radius, radius, radius, 0, Math.PI * 2);
    graphics.closePath();
    graphics.fill();
    if (strokeColor !== undefined) {
      graphics.stroke();
    }

    graphics.generateTexture(key, diameter, diameter);
    graphics.destroy();
  }

  generateRectangleTexture(
    key: string,
    width: number,
    height: number,
    color: number,
    strokeColor?: number,
    strokeWidth: number = 2
  ): void {
    const graphics = this.scene.add.graphics();

    if (strokeColor !== undefined) {
      graphics.lineStyle(strokeWidth, strokeColor);
    }
    graphics.fillStyle(color);
    graphics.fillRect(0, 0, width, height);
    if (strokeColor !== undefined) {
      graphics.strokeRect(0, 0, width, height);
    }

    graphics.generateTexture(key, width, height);
    graphics.destroy();
  }

  generateTriangleTexture(
    key: string,
    size: number,
    color: number,
    strokeColor?: number,
    strokeWidth: number = 2
  ): void {
    const graphics = this.scene.add.graphics();
    const halfSize = size / 2;

    if (strokeColor !== undefined) {
      graphics.lineStyle(strokeWidth, strokeColor);
    }
    graphics.fillStyle(color);
    graphics.beginPath();
    graphics.moveTo(halfSize, 0);
    graphics.lineTo(size, size);
    graphics.lineTo(0, size);
    graphics.closePath();
    graphics.fill();
    if (strokeColor !== undefined) {
      graphics.stroke();
    }

    graphics.generateTexture(key, size, size);
    graphics.destroy();
  }
}
