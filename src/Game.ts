import { Entity } from "./Entity";
import { assertValue } from "./utils/assert";
import { EffectsSystem } from "./EffectsSystem";
import { PlayerManager } from "./PlayerManager";
import { EnemyManager } from "./EnemyManager";
import { Camera } from "./Camera";

export class Game {
  public canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private playerManager: PlayerManager | null = null;
  private enemyManager: EnemyManager | null = null;
  public effects: EffectsSystem;
  public camera: Camera;

  // World dimensions - much larger than the viewport
  public readonly WORLD_WIDTH = 2400;
  public readonly WORLD_HEIGHT = 1800;

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

    // Handle canvas resize
    window.addEventListener("resize", () => {
      this.camera.viewportWidth = this.canvas.width;
      this.camera.viewportHeight = this.canvas.height;
    });
  }

  update(): void {
    this.effects.update();
    this.checkWeaponCollisions();
  }

  // Detect collisions between player and enemies or bullets
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
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Save the context state
    this.ctx.save();

    // Apply camera transformation
    this.ctx.translate(-this.camera.position.x, -this.camera.position.y);

    // Draw world boundaries and grid
    this.drawWorldBoundaries();

    // Delegate rendering to managers
    if (this.playerManager) {
      this.playerManager.render(this.ctx);
    }

    if (this.enemyManager) {
      this.enemyManager.render(this.ctx);
    }

    // Draw effects
    this.effects.render(this.ctx);

    // Restore the context state
    this.ctx.restore();

    // Draw UI elements that should stay fixed on screen
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

  // Accessor for effects system
  getEffectsSystem(): EffectsSystem {
    return this.effects;
  }
}
