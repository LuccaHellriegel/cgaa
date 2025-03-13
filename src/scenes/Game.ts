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
import { AudioManager } from "../managers/AudioManager";

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
  private audioManager: AudioManager;

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

    // Set player in registry for other components
    this.registry.set("player", this.player);

    // Configure world bounds and camera (moved after player creation)
    this.configureWorldAndCamera();

    // Manually emit player-ready event in case it wasn't picked up
    this.events.emit("player-ready", this.player);

    // Explicitly set camera to follow player (ensure it works even if event isn't caught)
    if (this.player) {
      this.cameras.main.startFollow(this.player.getSprite(), true);
    }

    // Initialize managers
    this.audioManager = this.registry.get("audioManager");

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

    // Set up screen resize handler
    this.scale.on("resize", this.handleResize, this);
  }

  private configureWorldAndCamera(): void {
    // Set world bounds to be larger than the screen (2x width and height)
    const worldWidth = this.scale.width * 2;
    const worldHeight = this.scale.height * 2;

    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    // Set camera bounds to match world bounds
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

    // We'll still keep this event handler as a fallback
    this.events.once("player-ready", () => {
      if (this.player) {
        this.cameras.main.startFollow(this.player.getSprite(), true);
      }
    });
  }

  private handleResize(): void {
    // Update world and camera bounds when screen is resized
    const worldWidth = this.scale.width * 2;
    const worldHeight = this.scale.height * 2;

    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

    // Re-center camera on player with offset
    if (this.player) {
      // We keep the player centered by NOT setting any offset
    }

    // Make sure UI elements are repositioned after resize
    if (this.buildMenu) {
      this.buildMenu.updatePosition();
    }

    // Force rebuild UI layouts for other components that might need repositioning
    if (this.gameStatusUI) {
      // Recreate or refresh UI layout as needed
    }

    if (this.gameProgressUI) {
      // Update positions explicitly for components where needed
      this.gameProgressUI.updatePositions();
    }
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
          // Convert screen coordinates to world coordinates
          const worldX = this.cameras.main.scrollX + target.x;
          const worldY = this.cameras.main.scrollY + target.y;

          // Simple check to avoid placing towers when clicking on UI at bottom of screen
          const uiSafeZone = 150; // Height of the bottom area where UI elements are
          if (target.y > this.scale.height - uiSafeZone) {
            return; // Don't place tower if clicking in UI area
          }

          this.placeTower(
            selectedTower,
            new Phaser.Math.Vector2(worldX, worldY)
          );
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
        // Try to play wave start sound, but don't crash if missing
        try {
          if (this.audioManager) {
            // Check if the sound exists before trying to play it
            this.audioManager.playSound("wave_start");
          }
        } catch (error) {
          console.warn("Could not play wave_start sound", error);
        }

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
      this.audioManager.playSound("collect");
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
    this.audioManager.playSound("build");

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
    this.towerGroup.add(tower.container);
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
    this.player.update(time, delta);
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

    // Clean up game objects
    this.towerGroup.destroy(true); // true to destroy all children
    this.player.destroy();

    // Clean up event handlers
    this.events.off("playerAttack");
    this.events.off("playerInteract");
    this.events.off("towerSelected");
    this.events.off("sellTower");
    this.events.off("waveUpdate");
    this.events.off("objectivesUpdate");
    this.events.off("waveStart");

    // Clean up keyboard inputs
    if (this.input.keyboard) {
      this.input.keyboard.removeAllKeys(true, true);
    }

    // Clean up registry entries specific to this scene
    this.registry.set("player", null);
    this.registry.set("audioManager", null);
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
