import { describe, it, expect, vi, beforeEach } from "vitest";
import { GameOver } from "./GameOver";
import { Scene } from "phaser";

describe("GameOver Scene", () => {
  let gameOver: GameOver;
  let mockText: any;

  beforeEach(() => {
    mockText = {
      setOrigin: vi.fn().mockReturnThis(),
      setInteractive: vi.fn().mockReturnThis(),
      on: vi.fn().mockReturnThis(),
      setTint: vi.fn().mockReturnThis(),
      clearTint: vi.fn().mockReturnThis(),
    };

    gameOver = new GameOver();
    gameOver.add = {
      text: vi.fn().mockReturnValue(mockText),
    } as unknown as Phaser.GameObjects.GameObjectFactory;
    gameOver.scene = {
      start: vi.fn(),
      key: "GameOver",
    } as unknown as Phaser.Scenes.ScenePlugin;
    gameOver.scale = {
      width: 1024,
      height: 768,
    } as unknown as Phaser.Scale.ScaleManager;
  });

  it("should be a Phaser Scene", () => {
    expect(gameOver).toBeInstanceOf(Scene);
  });

  it("should have the correct scene key", () => {
    expect(gameOver.scene.key).toBe("GameOver");
  });

  describe("create()", () => {
    beforeEach(() => {
      gameOver.create({ score: 100 });
    });

    it("should display game over message", () => {
      expect(gameOver.add.text).toHaveBeenCalledWith(
        512,
        200,
        "Game Over",
        expect.objectContaining({
          fontFamily: "Arial",
          fontSize: "64px",
          color: "#ffffff",
        })
      );
    });

    it("should display the score", () => {
      expect(gameOver.add.text).toHaveBeenCalledWith(
        512,
        300,
        "Score: 100",
        expect.objectContaining({
          fontFamily: "Arial",
          fontSize: "32px",
          color: "#ffffff",
        })
      );
    });

    it("should create menu options", () => {
      // Two menu options + header + score = 4 text elements
      expect(gameOver.add.text).toHaveBeenCalledTimes(4);
      expect(mockText.setInteractive).toHaveBeenCalledTimes(2);
    });

    it("should set up event handlers for menu options", () => {
      expect(mockText.on).toHaveBeenCalledWith(
        "pointerdown",
        expect.any(Function)
      );
    });
  });
});
