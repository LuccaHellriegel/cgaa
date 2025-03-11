import { describe, it, expect, vi, beforeEach } from "vitest";
import { Game } from "./Game";
import { Player } from "../components/Player";
import { UIController } from "../controllers/UIController";
import { BuildMenu } from "../components/BuildMenu";
import { TowerMenu } from "../components/TowerMenu";
import { GameStatusUI } from "../components/GameStatusUI";
import { Scene } from "phaser";

vi.mock("../components/Player");
vi.mock("../controllers/UIController");
vi.mock("../components/BuildMenu");
vi.mock("../components/TowerMenu");
vi.mock("../components/GameStatusUI");

describe("Game Scene", () => {
  let game: Game;
  let mockInput: any;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Create mock input
    mockInput = {
      keyboard: {
        addKey: vi.fn().mockReturnValue({
          on: vi.fn(),
        }),
        on: vi.fn(),
      },
      on: vi.fn(),
    };

    // Create game instance with mock input
    game = new Game();
    game.input = mockInput;
    game.add = {
      sprite: vi.fn().mockReturnValue({
        setOrigin: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis(),
      }),
    } as any;
    game.cameras = {
      main: {
        setBackgroundColor: vi.fn(),
      },
    } as any;
    game.scale = {
      width: 800,
      height: 600,
    } as any;
    game.scene = {
      key: "Game",
    } as any;
    game.physics = {
      add: {
        sprite: vi.fn().mockReturnValue({
          setCollideWorldBounds: vi.fn().mockReturnThis(),
          setVelocity: vi.fn().mockReturnThis(),
          setOrigin: vi.fn().mockReturnThis(),
          setDepth: vi.fn().mockReturnThis(),
        }),
      },
    } as any;
    game.events = {
      on: vi.fn(),
      emit: vi.fn(),
    } as any;
  });

  it("should be a Phaser Scene", () => {
    expect(game).toBeInstanceOf(Game);
    expect(game.scene.key).toBe("Game");
  });

  it("should initialize player and UI components", () => {
    game.create();

    expect(Player).toHaveBeenCalledWith({
      scene: game,
      x: game.scale.width / 2,
      y: game.scale.height / 2,
      texture: "player",
    });
    expect(UIController).toHaveBeenCalledWith(game);
    expect(BuildMenu).toHaveBeenCalledWith(game);
    expect(TowerMenu).toHaveBeenCalledWith(game);
    expect(GameStatusUI).toHaveBeenCalledWith(game);
  });

  it("should set up input handlers", () => {
    game.create();

    expect(mockInput.keyboard.addKey).toHaveBeenCalledWith("ESC");
    expect(mockInput.on).toHaveBeenCalledWith(
      "pointerdown",
      expect.any(Function)
    );
    expect(mockInput.on).toHaveBeenCalledWith(
      "pointermove",
      expect.any(Function)
    );
  });

  it("should update components in update loop", () => {
    const mockPlayer = {
      update: vi.fn(),
      sprite: { x: 0, y: 0 },
      speed: 200,
      isDead: false,
      setupAnimations: vi.fn(),
      setVelocity: vi.fn(),
      handleInput: vi.fn(),
      attack: vi.fn(),
      interact: vi.fn(),
      takeDamage: vi.fn(),
      die: vi.fn(),
      destroy: vi.fn(),
      getSprite: vi.fn(),
      isCollidingWith: vi.fn(),
      scene: game,
      eventListeners: new Map(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      emit: vi.fn(),
    } as unknown as Player;
    vi.mocked(Player).mockImplementation(() => mockPlayer);

    game.create();
    game.update(16.67, 1);

    expect(mockPlayer.update).toHaveBeenCalled();
  });
});
