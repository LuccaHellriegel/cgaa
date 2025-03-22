import { Entity } from "./Entity";
import { assertValue } from "./utils/assert";
import { EffectsSystem } from "./EffectsSystem";
import { PlayerManager } from "./PlayerManager";
import { EnemyManager } from "./EnemyManager";
import { Camera } from "./Camera";
import { CampManager } from "./CampManager";
import { Vector2D } from "./types";

export class Game {
  public canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private playerManager: PlayerManager | null = null;
  private enemyManager: EnemyManager | null = null;
  public effects: EffectsSystem;
  public camera: Camera;
  private campManager: CampManager;
  private lastTime: number = 0;

  // World dimensions - much larger than the viewport
  public readonly WORLD_WIDTH = 4800; // Doubled from 2400
  public readonly WORLD_HEIGHT = 3600; // Doubled from 1800

  setPlayerManager(manager: PlayerManager): void {
    this.playerManager = manager;
  }

  setEnemyManager(manager: EnemyManager): void {
    this.enemyManager = manager;
  }

  getPlayer(): Entity | null {
    return this.playerManager?.getActivePlayer() || null;
  }

  getEnemies(): Entity[] {
    return this.enemyManager?.getEnemies() || [];
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = assertValue(
      canvas.getContext("2d"),
      "2D context must be available"
    );

    // Initialize camera with viewport size and world size
    this.camera = new Camera(
      this.canvas.width,
      this.canvas.height,
      this.WORLD_WIDTH,
      this.WORLD_HEIGHT
    );

    this.effects = new EffectsSystem();
    this.campManager = new CampManager(this);
    this.initializeGame();

    // Handle canvas resize
    window.addEventListener("resize", () => {
      this.camera.viewportWidth = this.canvas.width;
      this.camera.viewportHeight = this.canvas.height;
    });
  }

  private initializeGame(): void {
    // Generate initial camps
    this.campManager.generateCamps(3);
  }

  restart(): void {
    // Reset game state
    this.initializeGame();

    // Reset player
    if (this.playerManager) {
      // Clear existing players
      this.playerManager.clearPlayers();
      // Find a safe spawn position for the player
      const spawnPosition = this.findSafeSpawnPosition(20);
      const player = this.playerManager.createPlayer(spawnPosition);
      // Reset camera to follow new player
      this.camera.followEntity(player);
    }

    // Reset enemy manager and regenerate enemies
    if (this.enemyManager) {
      this.enemyManager = new EnemyManager(this, false);
      this.enemyManager.generateEnemies();
    }

    // Clear effects
    this.effects = new EffectsSystem();
  }

  private findSafeSpawnPosition(radius: number): Vector2D {
    const maxAttempts = 50;
    let attempts = 0;

    while (attempts < maxAttempts) {
      // Try positions in the center area of the map
      const x = this.WORLD_WIDTH * (0.4 + Math.random() * 0.2); // 40-60% of width
      const y = this.WORLD_HEIGHT * (0.4 + Math.random() * 0.2); // 40-60% of height

      // Check if position collides with any camp walls
      if (!this.campManager.entityCollidesWithWalls({ x, y, radius })) {
        return { x, y };
      }
      attempts++;
    }

    // Fallback to a position far from the center if no safe spot found
    return {
      x: this.WORLD_WIDTH * 0.25,
      y: this.WORLD_HEIGHT * 0.25,
    };
  }

  update(deltaTime: number): void {
    // Check if player is dead and trigger restart
    const player = this.getPlayer();
    if (player?.isDead) {
      // Add a small delay before restart
      setTimeout(() => this.restart(), 1000);
      return;
    }

    // Update player
    this.playerManager?.update(deltaTime);

    // Update enemies
    this.enemyManager?.update(deltaTime);

    // Update effects
    this.effects.update();

    // Update camera to follow player
    if (player) {
      this.camera.followEntity(player);
    }

    // Check collisions
    this.checkWeaponCollisions();
  }

  private checkWeaponCollisions(): void {
    const player = this.getPlayer();
    if (!player) return;

    const playerCombat = assertValue(
      player.combat,
      "Player must have combat component"
    );
    if (!playerCombat.weapon) return;

    const weapon = playerCombat.weapon;
    if (weapon.getState() !== "EXTENDED") return;

    const enemies = this.getEnemies();

    // Use the weapon's full collision detection
    const hitEnemyIndices = weapon.checkCollisions(enemies);

    // Handle hits
    if (hitEnemyIndices.length > 0) {
      for (const index of hitEnemyIndices) {
        const hitEnemy = enemies[index];
        if (!hitEnemy) continue;

        const enemyPosition = assertValue(
          hitEnemy.position,
          "Enemy must have position"
        );
        const enemyRender = assertValue(
          hitEnemy.render,
          "Enemy must have render component"
        );
        const enemyHealth = assertValue(
          hitEnemy.health,
          "Enemy must have health component"
        );

        // Create hit effect
        this.effects.createHitEffect(
          enemyPosition.x,
          enemyPosition.y,
          enemyRender.color
        );

        // Damage enemy
        enemyHealth.current = Math.max(0, enemyHealth.current - 20);
        if (enemyHealth.current <= 0) {
          hitEnemy.isDead = true;
          if (this.enemyManager) {
            this.enemyManager.spawnNewEnemy();
          }
        }
      }
    }
  }

  render(): void {
    // Clear the entire canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Apply camera transform
    this.ctx.save();
    this.ctx.translate(-this.camera.position.x, -this.camera.position.y);

    // Draw world boundaries
    this.drawWorldBoundaries();

    // Draw camps and walls
    this.campManager.render(this.ctx);

    // Draw enemies
    this.enemyManager?.render(this.ctx);

    // Draw player
    this.playerManager?.render(this.ctx);

    // Draw effects
    this.effects.render(this.ctx);

    // Restore camera transform
    this.ctx.restore();

    // Draw UI elements (not affected by camera)
    this.drawUI();
  }

  private drawWorldBoundaries(): void {
    // Draw a border around the world
    this.ctx.strokeStyle = "#333";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(0, 0, this.WORLD_WIDTH, this.WORLD_HEIGHT);

    // Draw grid
    this.ctx.strokeStyle = "#222";
    this.ctx.lineWidth = 0.5;

    const gridSize = 200;
    for (let x = 0; x < this.WORLD_WIDTH; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.WORLD_HEIGHT);
      this.ctx.stroke();
    }

    for (let y = 0; y < this.WORLD_HEIGHT; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.WORLD_WIDTH, y);
      this.ctx.stroke();
    }
  }

  private drawUI(): void {
    // Draw mini-map
    const miniMapSize = 150;
    const padding = 10;
    const scale = miniMapSize / this.WORLD_WIDTH;

    // Mini-map background
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(
      this.canvas.width - miniMapSize - padding,
      padding,
      miniMapSize,
      miniMapSize * (this.WORLD_HEIGHT / this.WORLD_WIDTH)
    );

    // Player position on mini-map
    const player = this.getPlayer();
    if (player) {
      this.ctx.fillStyle = player.render.color;
      this.ctx.beginPath();
      this.ctx.arc(
        this.canvas.width - miniMapSize - padding + player.position.x * scale,
        padding + player.position.y * scale,
        3,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
    }

    // Viewport rectangle on mini-map
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(
      this.canvas.width -
        miniMapSize -
        padding +
        this.camera.position.x * scale,
      padding + this.camera.position.y * scale,
      this.camera.viewportWidth * scale,
      this.camera.viewportHeight * scale
    );
  }

  getCampManager(): CampManager {
    return this.campManager;
  }

  // Accessor for effects system
  getEffectsSystem(): EffectsSystem {
    return this.effects;
  }

  start(): void {
    this.lastTime = performance.now();
    this.gameLoop();
  }

  private gameLoop(): void {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Cap maximum delta time to prevent large jumps when tab is inactive
    const maxDeltaTime = 16.67; // Cap at ~16.67ms (60 fps)
    const cappedDeltaTime = Math.min(deltaTime, maxDeltaTime);

    // Update game components
    this.update(cappedDeltaTime);

    // Render everything
    this.render();

    // Continue game loop
    requestAnimationFrame(() => this.gameLoop());
  }
}
