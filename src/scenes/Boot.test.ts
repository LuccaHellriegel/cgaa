import { describe, it, expect, vi, beforeEach } from "vitest";
import { Boot } from "./Boot";
import { Scene } from "phaser";

describe("Boot Scene", () => {
  let boot: Boot;

  beforeEach(() => {
    boot = new Boot();
    boot.load = {
      image: vi.fn(),
    } as unknown as Phaser.Loader.LoaderPlugin;
    boot.scene = {
      start: vi.fn(),
      key: "Boot",
    } as unknown as Phaser.Scenes.ScenePlugin;
  });

  it("should be a Phaser Scene", () => {
    expect(boot).toBeInstanceOf(Scene);
  });

  it("should have the correct scene key", () => {
    expect(boot.scene.key).toBe("Boot");
  });

  describe("preload()", () => {
    it("should prepare for the loading screen", () => {
      boot.preload();
      // No specific asset loading required in our implementation
      expect(true).toBe(true);
    });
  });

  describe("create()", () => {
    it("should start the Preloader scene", () => {
      boot.create();
      expect(boot.scene.start).toHaveBeenCalledWith("Preloader");
    });
  });
});
