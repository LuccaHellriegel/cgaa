import { Scene } from "phaser";
import { Player } from "../components/Player";
import { UIController, GameMode } from "../controllers/UIController";
import { BuildMenu } from "../components/BuildMenu";
import { TowerMenu, TowerData } from "../components/TowerMenu";
import { GameStatusUI, CampStatus } from "../components/GameStatusUI";
import { WaveManager } from "../managers/WaveManager";

export class Game extends Scene {
  private player: Player;
  private souls: number;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  // UI Components
  private uiController: UIController;
  private buildMenu: BuildMenu;
  private towerMenu: TowerMenu;
  private gameStatusUI: GameStatusUI;

  // Game Managers
  private waveManager: WaveManager;

  constructor() {
    super("Game");
    this.souls = 0;
  }

  create() {
    // Set up keyboard controls
    this.cursors = (
      this.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin
    ).createCursorKeys();

    // Initialize player
    this.player = new Player({
      scene: this,
      x: this.scale.width / 2,
      y: this.scale.height / 2,
      texture: "player",
    });

    // Initialize UI components
    this.uiController = new UIController(this);
    this.buildMenu = new BuildMenu(this);
    this.towerMenu = new TowerMenu(this);
    this.gameStatusUI = new GameStatusUI(this);

    // Initialize wave manager
    this.waveManager = new WaveManager(this);

    // Setup event handlers
    this.setupEventHandlers();

    // Initialize game state
    this.souls = 100; // Start with some souls
    this.updateSouls(this.souls);

    // Initialize camps
    this.initializeCamps();

    // Start game loop
    this.startGameLoop();
  }

  private initializeCamps(): void {
    // Define initial camps
    const camps: CampStatus[] = [
      {
        id: "camp1",
        position: { x: 100, y: 100 },
        isSpawning: true,
        isQuestTarget: false,
        isDestroyed: false,
        isCooperating: false,
      },
      {
        id: "camp2",
        position: { x: 700, y: 100 },
        isSpawning: false,
        isQuestTarget: true,
        isDestroyed: false,
        isCooperating: false,
      },
      {
        id: "camp3",
        position: { x: 400, y: 500 },
        isSpawning: false,
        isQuestTarget: false,
        isDestroyed: false,
        isCooperating: true,
      },
    ];

    // Add camps to wave manager and update UI
    camps.forEach((camp) => {
      this.waveManager.addCamp(camp);
      if (camp.isSpawning) {
        this.waveManager.startWave(camp.id);
      }
    });
    this.gameStatusUI.updateCampStatus(camps);
  }

  private setupEventHandlers(): void {
    // Setup keyboard input
    const escKey = this.input.keyboard?.addKey("ESC");
    if (escKey) {
      escKey.on("down", () => {
        // Handle ESC key press
        this.scene.start("MainMenu");
      });
    }

    // Setup pointer events
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      // Handle pointer down event
      this.events.emit("playerAttack", { x: pointer.x, y: pointer.y });
    });

    this.input.on("pointermove", () => {
      // Handle pointer move event
      // TODO: Implement pointer move handling
    });

    // Player attack event
    this.events.on("playerAttack", (target: Phaser.Math.Vector2) => {
      if (this.uiController.getCurrentMode() === GameMode.ATTACK) {
        // TODO: Implement player attack
        console.log("Player attacking at", target);
      }
    });

    // Player interaction event
    this.events.on("playerInteract", (target: Phaser.Math.Vector2) => {
      if (this.uiController.getCurrentMode() === GameMode.INTERACTION) {
        // Check if we're trying to place a tower
        const selectedTower = this.buildMenu.getSelectedTower();
        if (selectedTower) {
          this.placeTower(selectedTower, target);
          this.buildMenu.clearSelection();
        }
      }
    });

    // Tower selection event
    this.events.on("towerSelected", (tower: TowerData) => {
      if (this.souls >= tower.cost) {
        // Show placement preview or something
        console.log("Selected tower:", tower);
      }
    });

    // Tower sell event
    this.events.on("sellTower", (tower: TowerData) => {
      // TODO: Implement tower selling
      this.updateSouls(this.souls + (tower.sellValue ?? tower.cost / 2));
      console.log("Selling tower:", tower);
    });
  }

  private updateSouls(amount: number): void {
    const oldAmount = this.souls;
    this.souls = amount;
    this.uiController.updateSouls(amount);

    // Play collect sound if souls increased
    if (amount > oldAmount) {
      this.registry.get("audioManager").playSound("collect");
    }
  }

  private placeTower(towerKey: string, position: Phaser.Math.Vector2): void {
    // TODO: Implement actual tower placement
    console.log("Placing tower", towerKey, "at", position);

    // Example tower data
    const towerData: TowerData = {
      key: towerKey,
      name: "Basic Tower",
      level: 1,
      damage: 10,
      range: 150,
      attackSpeed: 1,
      cost: 100,
    };

    // Play build sound
    this.registry.get("audioManager").playSound("build");

    // Update souls
    this.updateSouls(this.souls - towerData.cost);
  }

  private startGameLoop(): void {
    // Game loop is now managed by the update method
    // Wave spawning is handled by WaveManager
  }

  update(time: number, delta: number): void {
    if (!this.player) return;

    // Handle player movement
    const moveX =
      (this.cursors.right.isDown ? 1 : 0) - (this.cursors.left.isDown ? 1 : 0);
    const moveY =
      (this.cursors.down.isDown ? 1 : 0) - (this.cursors.up.isDown ? 1 : 0);

    // Normalize diagonal movement
    if (moveX !== 0 && moveY !== 0) {
      const normalizedX = moveX * Math.SQRT1_2;
      const normalizedY = moveY * Math.SQRT1_2;
      this.player.setVelocity(normalizedX, normalizedY);
    } else {
      this.player.setVelocity(moveX, moveY);
    }

    // Update game objects
    this.player.update();
    this.waveManager.update(time, delta);
    this.checkCollisions();
  }

  private checkCollisions(): void {
    const enemies = this.waveManager.getEnemies();

    // Check collisions between player and enemies
    enemies.forEach((enemy) => {
      if (enemy.isCollidingWith(this.player.getSprite())) {
        // Handle collision
        enemy.attack(this.player);
      }
    });
  }

  public destroy(): void {
    // Clean up UI components
    this.uiController.destroy();
    this.buildMenu.destroy();
    this.towerMenu.destroy();
    this.gameStatusUI.destroy();
    this.waveManager.destroy();

    // Clean up event handlers
    this.events.off("playerAttack");
    this.events.off("playerInteract");
    this.events.off("towerSelected");
    this.events.off("sellTower");
  }
}
