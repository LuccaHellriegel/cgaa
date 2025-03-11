import Phaser from "phaser";
import { GraphicsGenerator } from "./GraphicsGenerator";

export class ParticleEffects {
  private scene: Phaser.Scene;
  private graphicsGenerator: GraphicsGenerator;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.graphicsGenerator = new GraphicsGenerator(scene);
  }

  createExplosion(
    x: number,
    y: number,
    color: number = GraphicsGenerator.Colors.WARNING
  ): Phaser.GameObjects.Particles.ParticleEmitter {
    this.graphicsGenerator.generateParticleTexture(
      "explosion_particle",
      4,
      color
    );

    const particles = this.scene.add.particles(0, 0, "explosion_particle", {
      speed: { min: 50, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 800,
      gravityY: 0,
      quantity: 20,
      emitting: false,
    });

    particles.explode(20, x, y);
    return particles;
  }

  createHealEffect(
    x: number,
    y: number
  ): Phaser.GameObjects.Particles.ParticleEmitter {
    this.graphicsGenerator.generateParticleTexture(
      "heal_particle",
      3,
      GraphicsGenerator.Colors.SUCCESS,
      0.8
    );

    const particles = this.scene.add.particles(0, 0, "heal_particle", {
      speed: { min: 30, max: 100 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 1000,
      gravityY: -50,
      quantity: 1,
      frequency: 100,
      emitting: true,
    });

    particles.setPosition(x, y);
    return particles;
  }

  createSoulCollectEffect(
    x: number,
    y: number
  ): Phaser.GameObjects.Particles.ParticleEmitter {
    this.graphicsGenerator.generateParticleTexture(
      "soul_particle",
      2,
      GraphicsGenerator.Colors.UI,
      0.9
    );

    const particles = this.scene.add.particles(0, 0, "soul_particle", {
      speed: { min: 50, max: 150 },
      angle: { min: -30, max: 30 },
      scale: { start: 1, end: 0 },
      alpha: { start: 0.9, end: 0 },
      lifespan: 600,
      gravityY: -100,
      quantity: 10,
      emitting: false,
    });

    particles.explode(10, x, y);
    return particles;
  }

  createBuildEffect(
    x: number,
    y: number
  ): Phaser.GameObjects.Particles.ParticleEmitter {
    this.graphicsGenerator.generateParticleTexture(
      "build_particle",
      3,
      GraphicsGenerator.Colors.NEUTRAL,
      0.7
    );

    const particles = this.scene.add.particles(0, 0, "build_particle", {
      speed: { min: 20, max: 80 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      alpha: { start: 0.7, end: 0 },
      lifespan: 500,
      quantity: 15,
      emitting: false,
    });

    particles.explode(15, x, y);
    return particles;
  }

  createWaveSpawnEffect(
    x: number,
    y: number
  ): Phaser.GameObjects.Particles.ParticleEmitter {
    this.graphicsGenerator.generateParticleTexture(
      "wave_particle",
      4,
      GraphicsGenerator.Colors.WARNING,
      0.6
    );

    const particles = this.scene.add.particles(0, 0, "wave_particle", {
      speed: { min: 100, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 0, end: 1 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 1000,
      quantity: 30,
      emitting: false,
    });

    particles.explode(30, x, y);
    return particles;
  }
}
