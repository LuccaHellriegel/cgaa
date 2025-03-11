import { describe, it, expect, vi } from "vitest";
import { Game } from "phaser";
import { Boot } from "./scenes/Boot";
import { Game as MainGame } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";
import game from "./main";

describe("Game Configuration", () => {
  it("should create a Phaser Game instance", () => {
    expect(game).toBeDefined();
    expect(Game).toHaveBeenCalledTimes(1);
  });

  it("should have correct configuration", () => {
    const config = (game as any).config;
    expect(config).toEqual({
      type: "auto",
      width: 1024,
      height: 768,
      parent: "game-container",
      backgroundColor: "#028af8",
      scale: {
        mode: "fit",
        autoCenter: "resize",
      },
      scene: [Boot, Preloader, MainMenu, MainGame, GameOver],
    });
  });

  it("should have all required scenes", () => {
    const config = (game as any).config;
    expect(config.scene).toHaveLength(5);
    expect(config.scene).toContain(Boot);
    expect(config.scene).toContain(Preloader);
    expect(config.scene).toContain(MainMenu);
    expect(config.scene).toContain(MainGame);
    expect(config.scene).toContain(GameOver);
  });

  it("should have correct dimensions", () => {
    const config = (game as any).config;
    expect(config.width).toBe(1024);
    expect(config.height).toBe(768);
  });

  it("should have correct scaling configuration", () => {
    const config = (game as any).config;
    expect(config.scale.mode).toBe("fit");
    expect(config.scale.autoCenter).toBe("resize");
  });
});
