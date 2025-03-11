import { describe, it, expect, vi, beforeEach } from "vitest";
import { Boot } from "./Boot";
import { Scene } from "phaser";

describe("Boot Scene", () => {
  let boot: Boot;

  beforeEach(() => {
    boot = new Boot();
    boot.load = {
      image: vi.fn(),
    } as any;
    const sceneSettings = boot.scene.settings;
    boot.scene = {
      start: vi.fn(),
      settings: sceneSettings,
    } as any;
  });

  it("should be a Phaser Scene", () => {
    expect(boot).toBeInstanceOf(Scene);
  });

  it("should have the correct scene key", () => {
    expect(boot.scene.settings.key).toBe("Boot");
  });

  describe("preload()", () => {
    beforeEach(() => {
      boot.preload();
    });

    it("should load background image", () => {
      expect(boot.load.image).toHaveBeenCalledWith(
        "background",
        "assets/bg.png"
      );
    });
  });

  describe("create()", () => {
    beforeEach(() => {
      boot.create();
    });

    it("should start the Preloader scene", () => {
      expect(boot.scene.start).toHaveBeenCalledWith("Preloader");
    });
  });
});
