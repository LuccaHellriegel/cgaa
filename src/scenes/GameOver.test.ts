import { describe, it, expect, vi, beforeEach } from "vitest";
import { GameOver } from "./GameOver";
import { Scene } from "phaser";

describe("GameOver Scene", () => {
  let gameOver: GameOver;

  beforeEach(() => {
    gameOver = new GameOver();
    gameOver.cameras = {
      main: {
        setBackgroundColor: vi.fn(),
      },
    } as any;
    gameOver.add = {
      image: vi.fn().mockReturnValue({
        setAlpha: vi.fn().mockReturnThis(),
      }),
      text: vi.fn().mockReturnValue({
        setOrigin: vi.fn().mockReturnThis(),
      }),
    } as any;
    const sceneSettings = gameOver.scene.settings;
    gameOver.input = {
      once: vi.fn(),
    } as any;
    gameOver.scene = {
      start: vi.fn(),
      settings: sceneSettings,
    } as any;
  });

  it("should be a Phaser Scene", () => {
    expect(gameOver).toBeInstanceOf(Scene);
  });

  it("should have the correct scene key", () => {
    expect(gameOver.scene.settings.key).toBe("GameOver");
  });

  describe("create()", () => {
    beforeEach(() => {
      gameOver.create();
    });

    it("should set camera background color", () => {
      expect(gameOver.cameras.main.setBackgroundColor).toHaveBeenCalledWith(
        0xff0000
      );
    });

    it("should create and configure background image", () => {
      expect(gameOver.add.image).toHaveBeenCalledWith(512, 384, "background");
      expect(gameOver.background.setAlpha).toHaveBeenCalledWith(0.5);
    });

    it("should create and configure game over text", () => {
      expect(gameOver.add.text).toHaveBeenCalledWith(
        512,
        384,
        "Game Over",
        expect.objectContaining({
          fontFamily: "Arial Black",
          fontSize: 64,
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 8,
          align: "center",
        })
      );
      expect(gameOver.gameover_text.setOrigin).toHaveBeenCalledWith(0.5);
    });

    it("should set up input handler to return to MainMenu", () => {
      expect(gameOver.input.once).toHaveBeenCalledWith(
        "pointerdown",
        expect.any(Function)
      );

      // Get the callback function
      const callback = (gameOver.input.once as any).mock.calls[0][1];

      // Call the callback
      callback();

      // Verify that scene.start was called with 'MainMenu'
      expect(gameOver.scene.start).toHaveBeenCalledWith("MainMenu");
    });
  });
});
