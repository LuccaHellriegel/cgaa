import { describe, it, expect, vi, beforeEach } from "vitest";
import { MainMenu } from "./MainMenu";
import { Scene } from "phaser";

describe("MainMenu Scene", () => {
  let mainMenu: MainMenu;

  beforeEach(() => {
    mainMenu = new MainMenu();
    mainMenu.add = {
      image: vi.fn().mockReturnValue({
        setOrigin: vi.fn().mockReturnThis(),
      }),
      text: vi.fn().mockReturnValue({
        setOrigin: vi.fn().mockReturnThis(),
      }),
    } as any;
    const sceneSettings = mainMenu.scene.settings;
    mainMenu.input = {
      once: vi.fn(),
    } as any;
    mainMenu.scene = {
      start: vi.fn(),
      settings: sceneSettings,
    } as any;
  });

  it("should be a Phaser Scene", () => {
    expect(mainMenu).toBeInstanceOf(Scene);
  });

  it("should have the correct scene key", () => {
    expect(mainMenu.scene.settings.key).toBe("MainMenu");
  });

  describe("create()", () => {
    beforeEach(() => {
      mainMenu.create();
    });

    it("should create background image", () => {
      expect(mainMenu.add.image).toHaveBeenCalledWith(512, 384, "background");
    });

    it("should create logo image", () => {
      expect(mainMenu.add.image).toHaveBeenCalledWith(512, 300, "logo");
    });

    it("should create title text", () => {
      expect(mainMenu.add.text).toHaveBeenCalledWith(
        512,
        460,
        "Main Menu",
        expect.objectContaining({
          fontFamily: "Arial Black",
          fontSize: 38,
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 8,
          align: "center",
        })
      );
    });

    it("should set up input handler to start game", () => {
      expect(mainMenu.input.once).toHaveBeenCalledWith(
        "pointerdown",
        expect.any(Function)
      );

      // Get the callback function
      const callback = (mainMenu.input.once as any).mock.calls[0][1];

      // Call the callback
      callback();

      // Verify that scene.start was called with 'Game'
      expect(mainMenu.scene.start).toHaveBeenCalledWith("Game");
    });
  });
});
