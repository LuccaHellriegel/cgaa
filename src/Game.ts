import { assert } from "./utils/assert";
import { Player } from "./Player";
import { Wall } from "./Wall";
import { Enemy } from "./Enemy";
import { PathFinder } from "./PathFinder";

export class Game {
  private ctx: CanvasRenderingContext2D;
  private lastTime: number = 0;
  private isRunning: boolean = false;
  private pressedKeys: Set<string> = new Set();
  private player: Player;
  private cameraX: number = 0;
  private cameraY: number = 0;
  private walls: Wall[] = [];
  private enemies: Enemy[] = [];
  private lastEnemySpawnTime: number = 0;
  private pathFinder: PathFinder;
  private mousePressed: boolean = false;

  // World map dimensions (larger than screen)
  private readonly WORLD_WIDTH = 2000;
  private readonly WORLD_HEIGHT = 2000;

  // Wall generation parameters
  private readonly MIN_CAMP_SIZE = 200;
  private readonly MAX_CAMP_SIZE = 400;
  private readonly NUM_CAMPS = 5;
  private readonly WALL_THICKNESS = 20;
  private readonly MIN_ENTRANCES = 1;
  private readonly MAX_ENTRANCES = 3;
  private readonly ENTRANCE_WIDTH = 60;
  private readonly MIN_CAMP_DISTANCE = 100; // Minimum distance between camps
  private readonly MAX_SECTIONS_PER_CAMP = 3; // Maximum number of rectangular sections per camp

  // Enemy spawning parameters
  private readonly ENEMY_SPAWN_INTERVAL = 5; // Increased from 2 to 5 seconds
  private readonly MAX_ENEMIES = 10; // Reduced from 50 to 10

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = this.canvas.getContext("2d")!;
    assert(ctx !== null, "Failed to get 2D context");
    this.ctx = ctx;

    // Ensure entrance width is always at least 2.5x the player radius
    const PLAYER_RADIUS = 20; // Same as in Player class
    if (this.ENTRANCE_WIDTH < PLAYER_RADIUS * 2.5) {
      console.warn(
        `Entrance width (${this.ENTRANCE_WIDTH}) is too narrow for player radius (${PLAYER_RADIUS}). Adjusting...`
      );
      Object.defineProperty(this, "ENTRANCE_WIDTH", {
        value: Math.ceil(PLAYER_RADIUS * 2.5),
      });
      console.log(`Adjusted entrance width to: ${this.ENTRANCE_WIDTH}`);
    }

    // Generate random walls first
    this.generateWalls();

    // Initialize player in a valid position
    let playerX: number;
    let playerY: number;
    let attempts = 0;
    const maxAttempts = 20;

    do {
      playerX = this.WORLD_WIDTH / 2 + (Math.random() - 0.5) * 200; // Spawn near center
      playerY = this.WORLD_HEIGHT / 2 + (Math.random() - 0.5) * 200;
      attempts++;
    } while (
      this.walls.some((wall) =>
        wall.intersectsCircle(playerX, playerY, PLAYER_RADIUS)
      ) &&
      attempts < maxAttempts
    );

    // Initialize player
    this.player = new Player(
      playerX,
      playerY,
      this.WORLD_WIDTH,
      this.WORLD_HEIGHT
    );

    // Initialize pathfinder
    this.pathFinder = new PathFinder(
      this.WORLD_WIDTH,
      this.WORLD_HEIGHT,
      this.walls
    );

    // Set up keyboard event listeners
    window.addEventListener("keydown", (e) =>
      this.pressedKeys.add(e.key.toLowerCase())
    );
    window.addEventListener("keyup", (e) =>
      this.pressedKeys.delete(e.key.toLowerCase())
    );

    // Add mouse event listeners for chain weapon
    this.canvas.addEventListener("mousedown", (e) => {
      this.mousePressed = true;
      this.player.setMouse(true, e.clientX, e.clientY);
    });

    this.canvas.addEventListener("mouseup", (e) => {
      this.mousePressed = false;
      this.player.setMouse(false, e.clientX, e.clientY);
    });

    this.canvas.addEventListener("mousemove", (e) => {
      this.player.setMouse(this.mousePressed, e.clientX, e.clientY);
    });
  }

  private generateWalls() {
    // Add border walls around the world
    this.addBorderWalls();

    // Create camps at fixed positions around the edges
    const edgeBuffer = 100; // Buffer from the edge
    const campSize = 300; // Fixed camp size

    // Define fixed camp positions (near corners and edges)
    const campPositions = [
      // Top-left corner
      { x: edgeBuffer, y: edgeBuffer },

      // Top-right corner
      { x: this.WORLD_WIDTH - edgeBuffer - campSize, y: edgeBuffer },

      // Bottom-left corner
      { x: edgeBuffer, y: this.WORLD_HEIGHT - edgeBuffer - campSize },

      // Bottom-right corner
      {
        x: this.WORLD_WIDTH - edgeBuffer - campSize,
        y: this.WORLD_HEIGHT - edgeBuffer - campSize,
      },

      // Middle of top edge
      { x: this.WORLD_WIDTH / 2 - campSize / 2, y: edgeBuffer },
    ];

    for (const pos of campPositions) {
      const walls = this.createCampWalls(
        pos.x,
        pos.y,
        campSize,
        campSize,
        [] // No internal entrances
      );
      this.walls.push(...walls);
    }
  }

  private addBorderWalls() {
    const borderThickness = 30;

    // Top border
    this.walls.push(new Wall(0, 0, this.WORLD_WIDTH, borderThickness, false));

    // Right border
    this.walls.push(
      new Wall(
        this.WORLD_WIDTH - borderThickness,
        0,
        borderThickness,
        this.WORLD_HEIGHT,
        false
      )
    );

    // Bottom border
    this.walls.push(
      new Wall(
        0,
        this.WORLD_HEIGHT - borderThickness,
        this.WORLD_WIDTH,
        borderThickness,
        false
      )
    );

    // Left border
    this.walls.push(new Wall(0, 0, borderThickness, this.WORLD_HEIGHT, false));
  }

  private createCampWalls(
    x: number,
    y: number,
    width: number,
    height: number,
    internalEntrances: number[] = []
  ): Wall[] {
    const walls: Wall[] = [];

    // Determine number of entrances for this camp
    const numEntrances =
      Math.floor(
        Math.random() * (this.MAX_ENTRANCES - this.MIN_ENTRANCES + 1)
      ) + this.MIN_ENTRANCES;

    // Create entrance positions (0=top, 1=right, 2=bottom, 3=left)
    const entrancePositions: number[] = [];
    while (entrancePositions.length < numEntrances) {
      const position = Math.floor(Math.random() * 4);
      if (
        !entrancePositions.includes(position) &&
        !internalEntrances.includes(position)
      ) {
        entrancePositions.push(position);
      }
    }

    // Add internal entrances (connections between sections)
    entrancePositions.push(...internalEntrances);

    // Create walls with gaps for entrances
    // Top wall
    if (entrancePositions.includes(0)) {
      // Create entrance in the top wall
      const entranceStart = x + Math.random() * (width - this.ENTRANCE_WIDTH);
      walls.push(new Wall(x, y, entranceStart - x, this.WALL_THICKNESS));
      walls.push(
        new Wall(
          entranceStart + this.ENTRANCE_WIDTH,
          y,
          x + width - (entranceStart + this.ENTRANCE_WIDTH),
          this.WALL_THICKNESS
        )
      );
    } else {
      // No entrance, full wall
      walls.push(new Wall(x, y, width, this.WALL_THICKNESS));
    }

    // Right wall
    if (entrancePositions.includes(1)) {
      // Create entrance in the right wall
      const entranceStart = y + Math.random() * (height - this.ENTRANCE_WIDTH);
      walls.push(
        new Wall(
          x + width - this.WALL_THICKNESS,
          y,
          this.WALL_THICKNESS,
          entranceStart - y
        )
      );
      walls.push(
        new Wall(
          x + width - this.WALL_THICKNESS,
          entranceStart + this.ENTRANCE_WIDTH,
          this.WALL_THICKNESS,
          y + height - (entranceStart + this.ENTRANCE_WIDTH)
        )
      );
    } else {
      // No entrance, full wall
      walls.push(
        new Wall(
          x + width - this.WALL_THICKNESS,
          y,
          this.WALL_THICKNESS,
          height
        )
      );
    }

    // Bottom wall
    if (entrancePositions.includes(2)) {
      // Create entrance in the bottom wall
      const entranceStart = x + Math.random() * (width - this.ENTRANCE_WIDTH);
      walls.push(
        new Wall(
          x,
          y + height - this.WALL_THICKNESS,
          entranceStart - x,
          this.WALL_THICKNESS
        )
      );
      walls.push(
        new Wall(
          entranceStart + this.ENTRANCE_WIDTH,
          y + height - this.WALL_THICKNESS,
          x + width - (entranceStart + this.ENTRANCE_WIDTH),
          this.WALL_THICKNESS
        )
      );
    } else {
      // No entrance, full wall
      walls.push(
        new Wall(
          x,
          y + height - this.WALL_THICKNESS,
          width,
          this.WALL_THICKNESS
        )
      );
    }

    // Left wall
    if (entrancePositions.includes(3)) {
      // Create entrance in the left wall
      const entranceStart = y + Math.random() * (height - this.ENTRANCE_WIDTH);
      walls.push(new Wall(x, y, this.WALL_THICKNESS, entranceStart - y));
      walls.push(
        new Wall(
          x,
          entranceStart + this.ENTRANCE_WIDTH,
          this.WALL_THICKNESS,
          y + height - (entranceStart + this.ENTRANCE_WIDTH)
        )
      );
    } else {
      // No entrance, full wall
      walls.push(new Wall(x, y, this.WALL_THICKNESS, height));
    }

    return walls;
  }

  private spawnEnemy() {
    // Don't spawn if we already have the maximum number of enemies
    if (this.enemies.length >= this.MAX_ENEMIES) {
      return;
    }

    let enemy: Enemy | null = null;
    let attempts = 0;
    const maxAttempts = 10;
    let hasIntersection = false;

    try {
      do {
        const x = Math.random() * this.WORLD_WIDTH;
        const y = Math.random() * this.WORLD_HEIGHT;
        try {
          enemy = new Enemy(
            x,
            y,
            this.WORLD_WIDTH,
            this.WORLD_HEIGHT,
            this.pathFinder,
            this.walls
          );
          attempts++;

          hasIntersection = this.walls.some((wall) =>
            enemy!.intersectsWall(wall)
          );
        } catch (error) {
          console.error(`Error creating enemy at (${x}, ${y}):`, error);
          attempts++;
          hasIntersection = true; // Force retry on error
          continue;
        }
      } while (hasIntersection && attempts < maxAttempts);

      if (!hasIntersection && enemy) {
        this.enemies.push(enemy);
        console.log(`Spawned new enemy at (${enemy.x}, ${enemy.y})`);
      } else {
        console.log(`Failed to spawn enemy after ${attempts} attempts`);
      }
    } catch (error) {
      console.error("Fatal error in spawnEnemy:", error);
    }
  }

  private wallsIntersect(wall1: Wall, wall2: Wall): boolean {
    return !(
      wall1.x + wall1.width < wall2.x ||
      wall2.x + wall2.width < wall1.x ||
      wall1.y + wall1.height < wall2.y ||
      wall2.y + wall2.height < wall1.y
    );
  }

  private checkCollisions(newX: number, newY: number): boolean {
    // Check wall collisions
    if (
      this.walls.some((wall) =>
        wall.intersectsCircle(newX, newY, this.player.RADIUS)
      )
    ) {
      return true;
    }

    // Check enemy collisions
    if (
      this.enemies.some((enemy) =>
        enemy.intersectsPlayer(newX, newY, this.player.RADIUS)
      )
    ) {
      return true;
    }

    return false;
  }

  private checkEnemyHit(x: number, y: number, radius: number): boolean {
    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      // Check for hit with more tolerance using the radius parameter
      const dx = enemy.x - x;
      const dy = enemy.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < enemy.RADIUS + radius) {
        console.log(
          `HIT! Distance: ${distance.toFixed(2)}, Enemy: (${enemy.x.toFixed(
            2
          )}, ${enemy.y.toFixed(2)}), Weapon: (${x.toFixed(2)}, ${y.toFixed(
            2
          )})`
        );
        // Enemy hit - apply damage to it
        if (enemy.takeDamage(this.player.getWeaponDamage())) {
          // Enemy defeated, remove it
          console.log("Enemy defeated!");
          this.enemies.splice(i, 1);
        }
        return true;
      }
    }
    return false;
  }

  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    this.lastEnemySpawnTime = this.lastTime;
    this.gameLoop(performance.now());
  }

  stop() {
    this.isRunning = false;
  }

  private gameLoop(currentTime: number) {
    if (!this.isRunning) return;

    // Calculate delta time in seconds
    const deltaTime = (currentTime - this.lastTime) / 1000;
    // Only log if deltaTime is abnormally large
    if (deltaTime > 0.1) {
      console.log(`Large frameTime detected: deltaTime=${deltaTime}s`);
    }
    this.lastTime = currentTime;

    // Update game state
    this.update(deltaTime);

    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render game state
    this.render();

    // Request next frame
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  private update(deltaTime: number) {
    // Update player position
    this.player.update(
      deltaTime,
      this.pressedKeys,
      (x, y) => this.checkCollisions(x, y),
      (x, y, radius) => this.checkEnemyHit(x, y, radius),
      this.cameraX,
      this.cameraY
    );

    // Spawn enemies periodically
    if (
      this.lastTime - this.lastEnemySpawnTime >=
      this.ENEMY_SPAWN_INTERVAL * 1000
    ) {
      console.log(
        `Spawning enemy: enemies=${this.enemies.length}/${this.MAX_ENEMIES}`
      );
      this.spawnEnemy();
      this.lastEnemySpawnTime = this.lastTime;
    }

    // Update enemies
    this.enemies.forEach((enemy) =>
      enemy.update(
        deltaTime,
        this.lastTime,
        this.enemies,
        this.player.x,
        this.player.y,
        this.player.RADIUS
      )
    );

    // Update camera to follow player
    this.cameraX = this.player.x - this.canvas.width / 2;
    this.cameraY = this.player.y - this.canvas.height / 2;

    // Keep camera within world bounds
    this.cameraX = Math.max(
      0,
      Math.min(this.WORLD_WIDTH - this.canvas.width, this.cameraX)
    );
    this.cameraY = Math.max(
      0,
      Math.min(this.WORLD_HEIGHT - this.canvas.height, this.cameraY)
    );
  }

  private render() {
    // Draw world background
    this.ctx.fillStyle = "#2c3e50";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid
    this.ctx.strokeStyle = "#34495e";
    this.ctx.lineWidth = 1;
    const gridSize = 50;

    // Draw vertical lines
    for (let x = 0; x <= this.canvas.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= this.canvas.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }

    // Draw walls
    this.walls.forEach((wall) =>
      wall.draw(this.ctx, this.cameraX, this.cameraY)
    );

    // Draw enemies
    this.enemies.forEach((enemy) =>
      enemy.draw(this.ctx, this.cameraX, this.cameraY)
    );

    // Draw player
    this.player.draw(this.ctx, this.cameraX, this.cameraY);
  }
}
