import { PathFinder } from "./PathFinder";
import { Wall } from "./Wall";

export class Enemy {
  private readonly SPEED = 300; // pixels per second
  readonly RADIUS = 15;
  private path: { x: number; y: number }[] = [];
  private currentPathIndex: number = 0;
  private lastPathUpdateTime: number = 0;
  private readonly PATH_UPDATE_INTERVAL = 2; // seconds
  private targetX: number = 0;
  private targetY: number = 0;
  private hasValidTarget: boolean = false;
  private health: number = 100; // Add health for enemies

  // Stuck detection
  private stuckTime: number = 0;
  private lastPosition: { x: number; y: number } = { x: 0, y: 0 };
  private readonly STUCK_THRESHOLD = 1.0; // If not moving for 1 second, consider stuck

  constructor(
    public x: number,
    public y: number,
    private readonly worldWidth: number,
    private readonly worldHeight: number,
    private readonly pathFinder: PathFinder,
    private readonly walls: Wall[]
  ) {
    // Set initial position as last position for stuck detection
    this.lastPosition = { x, y };

    // Set initial target and update path
    this.updateTarget();

    try {
      this.updatePath();
    } catch (error) {
      console.error("Failed to initialize enemy path:", error);
      // Set an empty path if initialization fails
      this.path = [];
    }

    this.lastPathUpdateTime = performance.now(); // Initialize with current time

    console.log(
      `Enemy created at (${x}, ${y}), path length: ${this.path.length}`
    );
  }

  update(
    deltaTime: number,
    currentTime: number,
    otherEnemies: Enemy[],
    playerX: number,
    playerY: number,
    playerRadius: number
  ) {
    // Store old position
    const oldX = this.x;
    const oldY = this.y;

    // Check if stuck by comparing current position to last position
    const distanceMoved = Math.sqrt(
      Math.pow(this.x - this.lastPosition.x, 2) +
        Math.pow(this.y - this.lastPosition.y, 2)
    );

    if (distanceMoved < 1) {
      // Not moving, accumulate stuck time
      this.stuckTime += deltaTime;
      if (this.stuckTime > this.STUCK_THRESHOLD) {
        console.log(
          `Enemy stuck for ${this.stuckTime.toFixed(2)}s - forcing new path`
        );
        // Force path recalculation
        this.path = [];
        this.currentPathIndex = 0;
        this.hasValidTarget = false;
        this.stuckTime = 0; // Reset stuck time
      }
    } else {
      // Moving, reset stuck time
      this.stuckTime = 0;
      this.lastPosition = { x: this.x, y: this.y };
    }

    // Update path only if we need a new one
    const needsNewPath =
      currentTime - this.lastPathUpdateTime >=
        this.PATH_UPDATE_INTERVAL * 1000 || // Convert seconds to ms
      this.path.length === 0 ||
      !this.hasValidTarget ||
      (this.path.length > 0 && this.currentPathIndex >= this.path.length);

    if (needsNewPath) {
      console.log(
        `Updating enemy path: currentTime=${currentTime}, lastPathUpdateTime=${
          this.lastPathUpdateTime
        }, timeDiff=${currentTime - this.lastPathUpdateTime}ms`
      );
      // Reset path-related variables
      this.path = [];
      this.currentPathIndex = 0;
      this.hasValidTarget = false;

      // Get a new target and path
      this.updateTarget();
      this.updatePath();
      this.lastPathUpdateTime = currentTime;
    }

    // Move along path
    if (this.path.length > 0 && this.currentPathIndex < this.path.length) {
      const target = this.path[this.currentPathIndex];
      const dx = target.x - this.x;
      const dy = target.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 5) {
        this.currentPathIndex++;
        // Only log when reaching the end or at 10% intervals to reduce spam
        if (
          this.currentPathIndex >= this.path.length ||
          this.currentPathIndex %
            Math.max(1, Math.floor(this.path.length * 0.1)) ===
            0
        ) {
          console.log(
            `Enemy at point ${this.currentPathIndex}/${this.path.length} of path`
          );
        }
        if (this.currentPathIndex >= this.path.length) {
          console.log(
            "Enemy COMPLETED full path, will need new path next update"
          );
          // Don't reset path here, let the needsNewPath logic handle it
          // This way we avoid thrashing between path completion and recalculation
        }
      } else {
        const moveDistance = this.SPEED * deltaTime;
        const ratio = moveDistance / distance;
        const newX = this.x + dx * ratio;
        const newY = this.y + dy * ratio;

        // Check if new position would collide with walls
        const wouldCollide = this.walls.some((wall) => {
          const closestX = Math.max(
            wall.x,
            Math.min(newX, wall.x + wall.width)
          );
          const closestY = Math.max(
            wall.y,
            Math.min(newY, wall.y + wall.height)
          );
          const distanceX = newX - closestX;
          const distanceY = newY - closestY;
          return (
            distanceX * distanceX + distanceY * distanceY <
            this.RADIUS * this.RADIUS
          );
        });

        if (!wouldCollide) {
          // Don't log every movement to reduce spam
          this.x = newX;
          this.y = newY;
        } else {
          // Try sliding along walls when collision occurs
          // First try moving horizontally
          const newXOnly = this.x + dx * ratio;
          const wouldCollideX = this.walls.some((wall) => {
            const closestX = Math.max(
              wall.x,
              Math.min(newXOnly, wall.x + wall.width)
            );
            const closestY = Math.max(
              wall.y,
              Math.min(this.y, wall.y + wall.height)
            );
            const distanceX = newXOnly - closestX;
            const distanceY = this.y - closestY;
            return (
              distanceX * distanceX + distanceY * distanceY <
              this.RADIUS * this.RADIUS
            );
          });

          if (!wouldCollideX) {
            this.x = newXOnly;
            console.log(`Enemy sliding horizontally along wall`);
          } else {
            // Try moving vertically
            const newYOnly = this.y + dy * ratio;
            const wouldCollideY = this.walls.some((wall) => {
              const closestX = Math.max(
                wall.x,
                Math.min(this.x, wall.x + wall.width)
              );
              const closestY = Math.max(
                wall.y,
                Math.min(newYOnly, wall.y + wall.height)
              );
              const distanceX = this.x - closestX;
              const distanceY = newYOnly - closestY;
              return (
                distanceX * distanceX + distanceY * distanceY <
                this.RADIUS * this.RADIUS
              );
            });

            if (!wouldCollideY) {
              this.y = newYOnly;
              console.log(`Enemy sliding vertically along wall`);
            } else {
              console.log(
                `Enemy stuck at wall corner (${this.x.toFixed(
                  2
                )}, ${this.y.toFixed(2)})`
              );

              // If we're stuck for too long, force-skip to next path point
              if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
                this.currentPathIndex++;
                console.log("Stuck at corner - skipping to next path point");
              }
            }
          }

          console.log(
            `Enemy movement blocked by wall collision at (${newX.toFixed(
              2
            )}, ${newY.toFixed(2)})`
          );
        }
      }
    } else {
      if (this.path.length === 0) {
        console.log(`Enemy has no path to follow`);
      }
    }

    // Keep enemy within world bounds
    this.x = Math.max(
      this.RADIUS,
      Math.min(this.worldWidth - this.RADIUS, this.x)
    );
    this.y = Math.max(
      this.RADIUS,
      Math.min(this.worldHeight - this.RADIUS, this.y)
    );

    // Check collisions with other enemies
    for (const other of otherEnemies) {
      if (other !== this && this.intersectsEnemy(other)) {
        // Revert position if collision detected
        this.x = oldX;
        this.y = oldY;
        break;
      }
    }

    // Check collision with player
    if (this.intersectsPlayer(playerX, playerY, playerRadius)) {
      // Revert position if collision detected
      this.x = oldX;
      this.y = oldY;
    }
  }

  private updateTarget() {
    let attempts = 0;
    const maxAttempts = 20;
    let hasIntersection = false;

    do {
      this.targetX = Math.random() * this.worldWidth;
      this.targetY = Math.random() * this.worldHeight;
      attempts++;

      hasIntersection = this.walls.some((wall) => {
        // Check if target position intersects with any wall
        const closestX = Math.max(
          wall.x,
          Math.min(this.targetX, wall.x + wall.width)
        );
        const closestY = Math.max(
          wall.y,
          Math.min(this.targetY, wall.y + wall.height)
        );
        const distanceX = this.targetX - closestX;
        const distanceY = this.targetY - closestY;
        return (
          distanceX * distanceX + distanceY * distanceY <
          this.RADIUS * this.RADIUS
        );
      });
    } while (hasIntersection && attempts < maxAttempts);

    this.hasValidTarget = !hasIntersection;
  }

  private updatePath() {
    if (!this.hasValidTarget) {
      this.path = [];
      console.log("Enemy has no valid target, path is empty");
      return;
    }

    try {
      this.path = this.pathFinder.findPath(
        this.x,
        this.y,
        this.targetX,
        this.targetY
      );
      this.currentPathIndex = 0;

      console.log(
        `Enemy path calculated: ${this.path.length} points, from (${this.x}, ${this.y}) to (${this.targetX}, ${this.targetY})`
      );
      if (this.path.length === 0) {
        console.log("Path finding failed - empty path returned");
      }
    } catch (error) {
      console.error("Path finding error:", error);
      this.path = [];
      this.currentPathIndex = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    // Draw path for debugging
    if (this.path.length > 0) {
      ctx.beginPath();
      ctx.moveTo(this.x - cameraX, this.y - cameraY);

      for (let i = this.currentPathIndex; i < this.path.length; i++) {
        const point = this.path[i];
        ctx.lineTo(point.x - cameraX, point.y - cameraY);
      }

      ctx.strokeStyle = "rgba(255, 255, 0, 0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw target
    if (this.hasValidTarget) {
      ctx.beginPath();
      ctx.arc(
        this.targetX - cameraX,
        this.targetY - cameraY,
        5,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "yellow";
      ctx.fill();
    }

    // Draw enemy health bar
    const healthBarWidth = 30;
    const healthBarHeight = 4;
    const healthBarX = this.x - healthBarWidth / 2 - cameraX;
    const healthBarY = this.y - this.RADIUS - 10 - cameraY;

    // Health bar background
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

    // Health bar fill
    ctx.fillStyle =
      this.health > 50 ? "green" : this.health > 25 ? "orange" : "red";
    ctx.fillRect(
      healthBarX,
      healthBarY,
      healthBarWidth * (this.health / 100),
      healthBarHeight
    );

    // Draw enemy
    ctx.beginPath();
    ctx.arc(this.x - cameraX, this.y - cameraY, this.RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.stroke();
  }

  // Check if a point is inside the enemy
  containsPoint(x: number, y: number): boolean {
    const dx = x - this.x;
    const dy = y - this.y;
    return dx * dx + dy * dy <= this.RADIUS * this.RADIUS;
  }

  // Check if enemy intersects with a wall
  intersectsWall(wall: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): boolean {
    // Find the closest point on the wall to the enemy center
    const closestX = Math.max(wall.x, Math.min(this.x, wall.x + wall.width));
    const closestY = Math.max(wall.y, Math.min(this.y, wall.y + wall.height));

    // Calculate the distance between the enemy center and the closest point
    const distanceX = this.x - closestX;
    const distanceY = this.y - closestY;

    // If the distance is less than the radius, there's a collision
    return (
      distanceX * distanceX + distanceY * distanceY < this.RADIUS * this.RADIUS
    );
  }

  // Check if enemy intersects with another enemy
  intersectsEnemy(other: Enemy): boolean {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const minDistance = this.RADIUS + other.RADIUS;
    return dx * dx + dy * dy < minDistance * minDistance;
  }

  // Check if enemy intersects with player
  intersectsPlayer(
    playerX: number,
    playerY: number,
    playerRadius: number
  ): boolean {
    const dx = this.x - playerX;
    const dy = this.y - playerY;
    const minDistance = this.RADIUS + playerRadius;
    return dx * dx + dy * dy < minDistance * minDistance;
  }

  // Add takeDamage method to handle weapon hits
  takeDamage(amount: number): boolean {
    this.health -= amount;
    console.log(`Enemy took ${amount} damage, health now: ${this.health}`);
    // Return true if enemy is defeated
    return this.health <= 0;
  }
}
