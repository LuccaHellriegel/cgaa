import { describe, it, expect, beforeEach, vi } from "vitest";
import { ParticleEffects } from "./ParticleEffects";
import { GraphicsGenerator } from "./GraphicsGenerator";

describe("ParticleEffects", () => {
  let mockScene: any;
  let mockParticles: any;
  let mockGraphics: any;
  let particleEffects: ParticleEffects;

  beforeEach(() => {
    mockGraphics = {
      lineStyle: vi.fn(),
      fillStyle: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      generateTexture: vi.fn(),
      destroy: vi.fn(),
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
    };

    mockParticles = {
      explode: vi.fn(),
      setPosition: vi.fn(),
    };

    mockScene = {
      add: {
        graphics: vi.fn().mockReturnValue(mockGraphics),
        particles: vi.fn().mockReturnValue(mockParticles),
      },
    };

    particleEffects = new ParticleEffects(mockScene as any);
  });

  describe("createExplosion", () => {
    it("should create an explosion effect with default color", () => {
      const emitter = particleEffects.createExplosion(100, 200);

      expect(mockScene.add.graphics).toHaveBeenCalled();
      expect(mockGraphics.generateTexture).toHaveBeenCalledWith(
        "explosion_particle",
        8,
        8
      );
      expect(mockScene.add.particles).toHaveBeenCalledWith(
        0,
        0,
        "explosion_particle",
        expect.objectContaining({
          speed: { min: 50, max: 200 },
          angle: { min: 0, max: 360 },
          lifespan: 800,
          emitting: false,
        })
      );
      expect(mockParticles.explode).toHaveBeenCalledWith(20, 100, 200);
      expect(emitter).toBe(mockParticles);
    });

    it("should create an explosion effect with custom color", () => {
      particleEffects.createExplosion(100, 200, 0x00ff00);

      expect(mockScene.add.graphics).toHaveBeenCalled();
      expect(mockGraphics.fillStyle).toHaveBeenCalledWith(0x00ff00, 1);
      expect(mockScene.add.particles).toHaveBeenCalledWith(
        0,
        0,
        "explosion_particle",
        expect.any(Object)
      );
    });
  });

  describe("createHealEffect", () => {
    it("should create a heal effect", () => {
      const emitter = particleEffects.createHealEffect(100, 200);

      expect(mockScene.add.graphics).toHaveBeenCalled();
      expect(mockGraphics.generateTexture).toHaveBeenCalledWith(
        "heal_particle",
        6,
        6
      );
      expect(mockScene.add.particles).toHaveBeenCalledWith(
        0,
        0,
        "heal_particle",
        expect.objectContaining({
          speed: { min: 30, max: 100 },
          gravityY: -50,
          emitting: true,
        })
      );
      expect(mockParticles.setPosition).toHaveBeenCalledWith(100, 200);
      expect(emitter).toBe(mockParticles);
    });
  });

  describe("createSoulCollectEffect", () => {
    it("should create a soul collect effect", () => {
      const emitter = particleEffects.createSoulCollectEffect(100, 200);

      expect(mockScene.add.graphics).toHaveBeenCalled();
      expect(mockGraphics.generateTexture).toHaveBeenCalledWith(
        "soul_particle",
        4,
        4
      );
      expect(mockScene.add.particles).toHaveBeenCalledWith(
        0,
        0,
        "soul_particle",
        expect.objectContaining({
          speed: { min: 50, max: 150 },
          angle: { min: -30, max: 30 },
          gravityY: -100,
          emitting: false,
        })
      );
      expect(mockParticles.explode).toHaveBeenCalledWith(10, 100, 200);
      expect(emitter).toBe(mockParticles);
    });
  });

  describe("createBuildEffect", () => {
    it("should create a build effect", () => {
      const emitter = particleEffects.createBuildEffect(100, 200);

      expect(mockScene.add.graphics).toHaveBeenCalled();
      expect(mockGraphics.generateTexture).toHaveBeenCalledWith(
        "build_particle",
        6,
        6
      );
      expect(mockScene.add.particles).toHaveBeenCalledWith(
        0,
        0,
        "build_particle",
        expect.objectContaining({
          speed: { min: 20, max: 80 },
          lifespan: 500,
          emitting: false,
        })
      );
      expect(mockParticles.explode).toHaveBeenCalledWith(15, 100, 200);
      expect(emitter).toBe(mockParticles);
    });
  });

  describe("createWaveSpawnEffect", () => {
    it("should create a wave spawn effect", () => {
      const emitter = particleEffects.createWaveSpawnEffect(100, 200);

      expect(mockScene.add.graphics).toHaveBeenCalled();
      expect(mockGraphics.generateTexture).toHaveBeenCalledWith(
        "wave_particle",
        8,
        8
      );
      expect(mockScene.add.particles).toHaveBeenCalledWith(
        0,
        0,
        "wave_particle",
        expect.objectContaining({
          speed: { min: 100, max: 200 },
          scale: { start: 0, end: 1 },
          quantity: 30,
          emitting: false,
        })
      );
      expect(mockParticles.explode).toHaveBeenCalledWith(30, 100, 200);
      expect(emitter).toBe(mockParticles);
    });
  });
});
