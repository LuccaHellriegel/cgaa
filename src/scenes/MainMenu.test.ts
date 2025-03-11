import { describe, it, expect, vi, beforeEach } from "vitest";
import { MainMenu } from "./MainMenu";
import { Scene } from "phaser";

describe("MainMenu Scene", () => {
  let mainMenu: MainMenu;
  let mockText: any;

  beforeEach(() => {
    mockText = {
      setOrigin: vi.fn().mockReturnThis(),
      setInteractive: vi.fn().mockReturnThis(),
      on: vi.fn().mockReturnThis(),
      setTint: vi.fn().mockReturnThis(),
      clearTint: vi.fn().mockReturnThis(),
    };

    mainMenu = new MainMenu();
    mainMenu.add = {
      text: vi.fn().mockReturnValue(mockText),
    } as unknown as Phaser.GameObjects.GameObjectFactory;
    mainMenu.scene = {
      start: vi.fn(),
      key: "MainMenu",
    } as unknown as Phaser.Scenes.ScenePlugin;
    mainMenu.scale = {
      width: 1024,
      height: 768,
    } as unknown as Phaser.Scale.ScaleManager;
  });

  it("should be a Phaser Scene", () => {
    expect(mainMenu).toBeInstanceOf(Scene);
  });

  it("should have the correct scene key", () => {
    expect(mainMenu.scene.key).toBe("MainMenu");
  });

  describe("create()", () => {
    beforeEach(() => {
      mainMenu.create();
    });

    it("should create the title text", () => {
      expect(mainMenu.add.text).toHaveBeenCalledWith(
        512,
        100,
        "Circle Gladiator Army Arena",
        expect.objectContaining({
          fontFamily: "Arial",
          fontSize: "48px",
          color: "#ffffff",
        })
      );
    });

    it("should create menu items", () => {
      // Three menu items
      expect(mainMenu.add.text).toHaveBeenCalledTimes(4);
      expect(mockText.setInteractive).toHaveBeenCalledTimes(3);
      expect(mockText.on).toHaveBeenCalledTimes(9);
    });

    it("should set up event handlers for menu items", () => {
      // Start Game option
      expect(mockText.on).toHaveBeenCalledWith(
        "pointerdown",
        expect.any(Function)
      );
    });
  });
});
