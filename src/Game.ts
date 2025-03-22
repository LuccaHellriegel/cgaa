import { Entity } from "./Entity";
import { assertValue } from "./utils/assert";
import { EffectsSystem } from "./EffectsSystem";
import { PlayerManager } from "./PlayerManager";
import { EnemyManager } from "./EnemyManager";

export class Game {
  public canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private playerManager: PlayerManager | null = null;
  private enemyManager: EnemyManager | null = null;
  public effects: EffectsSystem;

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
    this.ctx = canvas.getContext("2d")!;

    // Initialize effects system
    this.effects = new EffectsSystem();
  }

  update(): void {
    // Only update effects system directly
    this.effects.update();

    // Collision detection between player weapons and enemies
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

    // Delegate rendering to managers
    if (this.playerManager) {
      this.playerManager.render(this.ctx);
    }

    if (this.enemyManager) {
      this.enemyManager.render(this.ctx);
    }

    // Draw effects
    this.effects.render(this.ctx);
  }

  // Accessor for effects system
  getEffectsSystem(): EffectsSystem {
    return this.effects;
  }
}
