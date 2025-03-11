import { describe, it, expect, vi, beforeEach } from "vitest";
import { Preloader } from "./Preloader";
import { Scene } from "phaser";

describe("Preloader Scene", () => {
  let preloader: Preloader;
  let progressCallback: (progress: number) => void;
  let progressBar: { width: number };

  beforeEach(() => {
    progressBar = { width: 0 };
    preloader = new Preloader();
    preloader.add = {
      image: vi.fn(),
      rectangle: vi
        .fn()
        .mockImplementation(
          (
            x: number,
            y: number,
            width: number,
            height: number,
            fillColor?: number
          ) => {
            if (x === 512 - 230) {
              return progressBar;
            }
            return {
              setStrokeStyle: vi.fn().mockReturnThis(),
            };
          }
        ),
    } as any;
    const sceneSettings = preloader.scene.settings;
    preloader.load = {
      on: vi
        .fn()
        .mockImplementation(
          (event: string, callback: (progress: number) => void) => {
            if (event === "progress") {
              progressCallback = callback;
            }
          }
        ),
      setPath: vi.fn(),
      image: vi.fn(),
    } as any;
    preloader.scene = {
      start: vi.fn(),
      settings: sceneSettings,
    } as any;
  });

  it("should be a Phaser Scene", () => {
    expect(preloader).toBeInstanceOf(Scene);
  });

  it("should have the correct scene key", () => {
    expect(preloader.scene.settings.key).toBe("Preloader");
  });

  describe("init()", () => {
    beforeEach(() => {
      preloader.init();
    });

    it("should create background image", () => {
      expect(preloader.add.image).toHaveBeenCalledWith(512, 384, "background");
    });

    it("should create progress bar outline", () => {
      expect(preloader.add.rectangle).toHaveBeenCalledWith(512, 384, 468, 32);
      expect(
        (preloader.add.rectangle as any).mock.results[0].value.setStrokeStyle
      ).toHaveBeenCalledWith(1, 0xffffff);
    });

    it("should create progress bar", () => {
      expect(preloader.add.rectangle).toHaveBeenCalledWith(
        512 - 230,
        384,
        4,
        28,
        0xffffff
      );
    });

    it("should set up progress event handler", () => {
      expect(preloader.load.on).toHaveBeenCalledWith(
        "progress",
        expect.any(Function)
      );

      // Test progress callback
      progressCallback(0.5); // 50% progress
      expect(progressBar.width).toBe(4 + 460 * 0.5);
    });
  });

  describe("preload()", () => {
    beforeEach(() => {
      preloader.preload();
    });

    it("should set assets path", () => {
      expect(preloader.load.setPath).toHaveBeenCalledWith("assets");
    });

    it("should load logo image", () => {
      expect(preloader.load.image).toHaveBeenCalledWith("logo", "logo.png");
    });
  });

  describe("create()", () => {
    beforeEach(() => {
      preloader.create();
    });

    it("should start the MainMenu scene", () => {
      expect(preloader.scene.start).toHaveBeenCalledWith("MainMenu");
    });
  });
});
