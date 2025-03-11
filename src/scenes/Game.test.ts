import { describe, it, expect, vi, beforeEach } from "vitest";
import { Game } from "./Game";
import { Scene } from "phaser";

describe("Game Scene", () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
    game.cameras = {
      main: {
        setBackgroundColor: vi.fn(),
      },
    } as any;
    game.add = {
      image: vi.fn().mockReturnValue({
        setAlpha: vi.fn().mockReturnThis(),
      }),
      text: vi.fn().mockReturnValue({
        setOrigin: vi.fn().mockReturnThis(),
      }),
    } as any;
    const sceneSettings = game.scene.settings;
    game.input = {
      once: vi.fn(),
    } as any;
    game.scene = {
      start: vi.fn(),
      settings: sceneSettings,
    } as any;
  });

  it("should be a Phaser Scene", () => {
    expect(game).toBeInstanceOf(Scene);
  });

  it("should have the correct scene key", () => {
    expect(game.scene.settings.key).toBe("Game");
  });

  describe("create()", () => {
    beforeEach(() => {
      game.create();
    });

    it("should set camera background color", () => {
      expect(game.cameras.main.setBackgroundColor).toHaveBeenCalledWith(
        0x00ff00
      );
    });

    it("should create and configure background image", () => {
      expect(game.add.image).toHaveBeenCalledWith(512, 384, "background");
      expect(game.background.setAlpha).toHaveBeenCalledWith(0.5);
    });

    it("should create and configure message text", () => {
      expect(game.add.text).toHaveBeenCalledWith(
        512,
        384,
        "Make something fun!\nand share it with us:\nsupport@phaser.io",
        expect.objectContaining({
          fontFamily: "Arial Black",
          fontSize: 38,
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 8,
          align: "center",
        })
      );
      expect(game.msg_text.setOrigin).toHaveBeenCalledWith(0.5);
    });

    it("should set up input handler to start GameOver scene", () => {
      expect(game.input.once).toHaveBeenCalledWith(
        "pointerdown",
        expect.any(Function)
      );

      // Get the callback function
      const callback = (game.input.once as any).mock.calls[0][1];

      // Call the callback
      callback();

      // Verify that scene.start was called with 'GameOver'
      expect(game.scene.start).toHaveBeenCalledWith("GameOver");
    });
  });
});
