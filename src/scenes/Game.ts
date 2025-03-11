import { Scene } from "phaser";
import { Player } from "../components/Player";
import { UIController, GameMode } from "../controllers/UIController";
import { BuildMenu } from "../components/BuildMenu";
import { TowerMenu, TowerData } from "../components/TowerMenu";
import { GameStatusUI, CampStatus } from "../components/GameStatusUI";
import { WaveManager } from "../managers/WaveManager";
import { PlayerStatusUI } from "../components/PlayerStatusUI";
import { Tower, TowerType, TOWER_CONFIGS } from "../components/Tower";
import { GameProgressUI, ObjectiveMarker } from "../components/GameProgressUI";

export class Game extends Scene {
  private player: Player;
  private souls: number;
  private wasdKeys: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };

  // UI Components
  private uiController: UIController;
  private buildMenu: BuildMenu;
  private towerMenu: TowerMenu;
  private gameStatusUI: GameStatusUI;
  private playerStatusUI: PlayerStatusUI;
  private gameProgressUI: GameProgressUI;

  // Game Managers
  private waveManager: WaveManager;
  private towerGroup: Phaser.GameObjects.Group;

  constructor() {
    super("Game");
    this.souls = 0;
  }

  create() {
    // Set up WASD keys
    if (this.input.keyboard) {
      this.wasdKeys = this.input.keyboard.addKeys({
        W: Phaser.Input.Keyboard.KeyCodes.W,
        A: Phaser.Input.Keyboard.KeyCodes.A,
        S: Phaser.Input.Keyboard.KeyCodes.S,
        D: Phaser.Input.Keyboard.KeyCodes.D,
      }) as any;
    }

    // Initialize player
    this.player = new Player({
      scene: this,
      x: this.scale.width / 2,
      y: this.scale.height / 2,
      texture: "player",
    });
    this.registry.set("player", this.player);

    // Initialize UI components
    this.uiController = new UIController(this);
    this.buildMenu = new BuildMenu(this);
    this.towerMenu = new TowerMenu(this);
    this.gameStatusUI = new GameStatusUI(this);
    this.playerStatusUI = new PlayerStatusUI(this);
    this.gameProgressUI = new GameProgressUI(this);

    // Initialize game managers
    this.waveManager = new WaveManager(this);
    this.towerGroup = this.add.group();

    // Setup event handlers
    this.setupEventHandlers();

    // Initialize game state
    this.souls = 100; // Start with some souls
    this.updateSouls(this.souls);
    this.playerStatusUI.updateHealth(100, 100); // Initialize health display

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

    // Wave update events
    this.events.on(
      "waveUpdate",
      (data: { wave: number; timeToNext: number }) => {
        this.gameProgressUI.updateWaveInfo(data.wave, data.timeToNext);
      }
    );

    // Objectives update events
    this.events.on("objectivesUpdate", (objectives: ObjectiveMarker[]) => {
      this.gameProgressUI.updateObjectiveMarkers(objectives);

      // Update minimap positions
      const playerSprite = this.player.getSprite();
      this.gameProgressUI.updateMinimapPositions(
        new Phaser.Math.Vector2(playerSprite.x, playerSprite.y),
        objectives
      );

      // Update offscreen indicators
      objectives.forEach((objective) => {
        this.gameProgressUI.showOffscreenIndicator(objective);
      });
    });

    // Wave start events
    this.events.on(
      "waveStart",
      ({ wave }: { wave: number; camp: CampStatus }) => {
        // Play wave start sound
        this.registry.get("audioManager").playSound("wave_start");

        // Flash wave counter
        this.cameras.main.flash(500, 255, 0, 0, true);
      }
    );
  }

  private updateSouls(amount: number): void {
    const oldAmount = this.souls;
    this.souls = amount;
    this.uiController.updateSouls(amount);
    this.playerStatusUI.updateSouls(amount, amount > oldAmount);

    // Play collect sound if souls increased
    if (amount > oldAmount) {
      this.registry.get("audioManager").playSound("collect");
    }
  }

  private placeTower(
    towerType: TowerType,
    position: Phaser.Math.Vector2
  ): void {
    const config = TOWER_CONFIGS[towerType];
    if (!config || this.souls < config.cost) return;

    // Create the tower
    const tower = new Tower(this, position.x, position.y, towerType);
    this.registry.get("audioManager").playSound("build");

    // Update souls
    this.updateSouls(this.souls - config.cost);

    // Create tower data for menu
    const towerData: TowerData = {
      name: towerType === TowerType.SHOOTER ? "Shooter Tower" : "Healer Tower",
      damage: config.damage,
      range: config.range,
      attackSpeed: config.fireRate / 1000,
      cost: config.cost,
      position: position,
      level: 1,
    };

    // Update UI and add tower to group
    this.towerMenu.show(towerData);
    this.towerGroup.add(tower);
  }

  private startGameLoop(): void {
    // Game loop is now managed by the update method
    // Wave spawning is handled by WaveManager
  }

  update(time: number, delta: number): void {
    if (!this.player || !this.wasdKeys) return;

    // Handle player movement with WASD
    const moveX =
      (this.wasdKeys.D.isDown ? 1 : 0) - (this.wasdKeys.A.isDown ? 1 : 0);
    const moveY =
      (this.wasdKeys.S.isDown ? 1 : 0) - (this.wasdKeys.W.isDown ? 1 : 0);

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
    this.playerStatusUI.destroy();
    this.gameProgressUI.destroy();
    this.waveManager.destroy();

    // Clean up event handlers
    this.events.off("playerAttack");
    this.events.off("playerInteract");
    this.events.off("towerSelected");
    this.events.off("sellTower");
    this.events.off("waveUpdate");
    this.events.off("objectivesUpdate");
    this.events.off("waveStart");
  }

  // Add these new methods for player health management
  public damagePlayer(amount: number): void {
    const currentHealth = this.player.getHealth();
    const maxHealth = this.player.getMaxHealth();
    this.player.takeDamage(amount);
    this.playerStatusUI.updateHealth(currentHealth - amount, maxHealth);
    this.playerStatusUI.showDamageEffect();
  }

  public healPlayer(amount: number): void {
    const currentHealth = this.player.getHealth();
    const maxHealth = this.player.getMaxHealth();
    this.player.heal(amount);
    this.playerStatusUI.updateHealth(
      Math.min(currentHealth + amount, maxHealth),
      maxHealth
    );
    this.playerStatusUI.showHealEffect();
  }
}
