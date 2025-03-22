import { Enemy, Player } from "./types";
import { ChainWeapon } from "./ChainWeapon";
import { EffectsSystem } from "./EffectsSystem";

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private player: Player;
  private enemies: Enemy[];
  private chainWeapon: ChainWeapon;
  private effects: EffectsSystem;
  private keys: { [key: string]: boolean };
  private mouseX: number;
  private mouseY: number;
  private lastClickTime: number;
  private readonly clickCooldown: number;
  private readonly enemyCount: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.keys = {};
    this.mouseX = 0;
    this.mouseY = 0;
    this.lastClickTime = 0;
    this.clickCooldown = 200;
    this.enemyCount = 15;

    // Initialize player
    this.player = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 20,
      color: "#3498db",
      speed: 5,
      direction: { x: 0, y: 0 },
    };

    // Initialize game objects
    this.enemies = [];
    this.chainWeapon = new ChainWeapon(this.player.x, this.player.y, 15);
    this.effects = new EffectsSystem();

    // Set up event listeners
    this.setupEventListeners();

    // Generate initial enemies
    this.generateEnemies();
  }

  private setupEventListeners(): void {
    window.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
    });

    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });

    this.canvas.addEventListener("mousedown", (e) => {
      const now = Date.now();
      if (now - this.lastClickTime < this.clickCooldown) return;
      this.lastClickTime = now;

      const angle = Math.atan2(
        this.mouseY - this.player.y,
        this.mouseX - this.player.x
      );

      if (this.chainWeapon.getState() === "IDLE") {
        this.chainWeapon.fire(this.player.x, this.player.y, angle);
      } else if (
        this.chainWeapon.getState() === "EXTENDING" ||
        this.chainWeapon.getState() === "EXTENDED"
      ) {
        this.chainWeapon.forceRetract();
      }
    });
  }

  private generateEnemies(): void {
    for (let i = 0; i < this.enemyCount; i++) {
      this.spawnNewEnemy();
    }
  }

  private spawnNewEnemy(): void {
    let x: number, y: number;
    let validPosition: boolean;

    do {
      validPosition = true;
      x = Math.random() * (this.canvas.width - 60) + 30;
      y = Math.random() * (this.canvas.height - 60) + 30;

      const dx = x - this.player.x;
      const dy = y - this.player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        validPosition = false;
      }
    } while (!validPosition);

    const radius = Math.random() * 10 + 15;
    this.enemies.push({
      x,
      y,
      radius,
      color: `hsl(${Math.random() * 60 + 340}, 80%, 60%)`,
    });
  }

  private updatePlayer(): void {
    this.player.direction.x = 0;
    this.player.direction.y = 0;

    if (this.keys["ArrowUp"] || this.keys["w"] || this.keys["W"])
      this.player.direction.y = -1;
    if (this.keys["ArrowDown"] || this.keys["s"] || this.keys["S"])
      this.player.direction.y = 1;
    if (this.keys["ArrowLeft"] || this.keys["a"] || this.keys["A"])
      this.player.direction.x = -1;
    if (this.keys["ArrowRight"] || this.keys["d"] || this.keys["D"])
      this.player.direction.x = 1;

    const length = Math.sqrt(
      this.player.direction.x * this.player.direction.x +
        this.player.direction.y * this.player.direction.y
    );

    if (length > 0) {
      this.player.direction.x /= length;
      this.player.direction.y /= length;
    }

    this.player.x += this.player.direction.x * this.player.speed;
    this.player.y += this.player.direction.y * this.player.speed;

    // Keep player within bounds
    this.player.x = Math.max(
      this.player.radius,
      Math.min(this.canvas.width - this.player.radius, this.player.x)
    );
    this.player.y = Math.max(
      this.player.radius,
      Math.min(this.canvas.height - this.player.radius, this.player.y)
    );
  }

  update(): void {
    this.updatePlayer();
    this.chainWeapon.update(this.player.x, this.player.y);
    this.effects.update();

    const hitEnemyIndices = this.chainWeapon.checkCollisions(this.enemies);

    if (hitEnemyIndices.length > 0) {
      hitEnemyIndices.sort((a, b) => b - a);

      for (const index of hitEnemyIndices) {
        const hitEnemy = this.enemies[index];
        this.effects.createHitEffect(hitEnemy.x, hitEnemy.y, hitEnemy.color);
        this.enemies.splice(index, 1);
        this.spawnNewEnemy();
      }
    }
  }

  render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw enemies
    for (const enemy of this.enemies) {
      this.ctx.beginPath();
      this.ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = enemy.color;
      this.ctx.fill();
      this.ctx.closePath();
    }

    // Draw player
    this.ctx.beginPath();
    this.ctx.arc(
      this.player.x,
      this.player.y,
      this.player.radius,
      0,
      Math.PI * 2
    );
    this.ctx.fillStyle = this.player.color;
    this.ctx.fill();
    this.ctx.closePath();

    // Draw aiming line when weapon is not active
    if (this.chainWeapon.getState() === "IDLE") {
      const angle = Math.atan2(
        this.mouseY - this.player.y,
        this.mouseX - this.player.x
      );
      this.ctx.beginPath();
      this.ctx.moveTo(this.player.x, this.player.y);
      this.ctx.lineTo(
        this.player.x + Math.cos(angle) * 30,
        this.player.y + Math.sin(angle) * 30
      );
      this.ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      this.ctx.closePath();
    }

    // Draw chain weapon
    this.chainWeapon.render(this.ctx);

    // Draw effects
    this.effects.render(this.ctx);
  }
}
