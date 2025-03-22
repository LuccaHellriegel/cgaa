import { Game } from "./Game";
import { Vector2D, Wall } from "./types";

interface PathNode {
  x: number;
  y: number;
  f: number; // Total cost (g + h)
  g: number; // Cost from start to this node
  h: number; // Estimated cost to goal
  walkable: boolean;
  parent: PathNode | null;
}

export class Pathfinding {
  private grid: PathNode[][];
  private gridSize: number;
  private cellSize: number;
  private game: Game;

  constructor(game: Game, gridSize: number = 50) {
    this.gridSize = gridSize;
    this.cellSize = gridSize;
    this.game = game;

    // Initialize grid
    this.grid = Array(this.gridSize)
      .fill(null)
      .map((_, x) =>
        Array(this.gridSize)
          .fill(null)
          .map((_, y) => ({
            x,
            y,
            f: 0,
            g: 0,
            h: 0,
            walkable: true,
            parent: null,
          }))
      );

    this.updateObstacleGrid();
  }

  // Convert world position to grid position
  private worldToGrid(pos: Vector2D): Vector2D {
    return {
      x: Math.floor(pos.x / this.cellSize),
      y: Math.floor(pos.y / this.cellSize),
    };
  }

  // Convert grid position to world position
  private gridToWorld(pos: Vector2D): Vector2D {
    return {
      x: pos.x * this.cellSize + this.cellSize / 2,
      y: pos.y * this.cellSize + this.cellSize / 2,
    };
  }

  // Calculate heuristic (estimated cost from this node to target)
  private calculateHeuristic(node: PathNode, targetNode: PathNode): number {
    const dx = node.x - targetNode.x;
    const dy = node.y - targetNode.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Find path using A* algorithm
  findPath(startPos: Vector2D, targetPos: Vector2D): Vector2D[] {
    // Convert world positions to grid positions
    const gridStart = this.worldToGrid(startPos);
    const gridTarget = this.worldToGrid(targetPos);

    // Ensure positions are within grid bounds
    if (
      gridStart.x < 0 ||
      gridStart.x >= this.gridSize ||
      gridStart.y < 0 ||
      gridStart.y >= this.gridSize ||
      gridTarget.x < 0 ||
      gridTarget.x >= this.gridSize ||
      gridTarget.y < 0 ||
      gridTarget.y >= this.gridSize
    ) {
      return [];
    }

    // Check if start or target is not walkable
    if (!this.grid[gridStart.x][gridStart.y].walkable) {
      return [];
    }

    if (!this.grid[gridTarget.x][gridTarget.y].walkable) {
      return [];
    }

    const startNode = this.grid[gridStart.x][gridStart.y];
    const targetNode = this.grid[gridTarget.x][gridTarget.y];

    const openList: PathNode[] = [];
    const closedList = new Set<PathNode>();

    // Reset nodes
    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        const node = this.grid[x][y];
        node.f = 0;
        node.g = 0;
        node.h = 0;
        node.parent = null;
      }
    }

    openList.push(startNode);

    while (openList.length > 0) {
      // Find node with lowest f value
      let currentNode = openList[0];
      let currentIndex = 0;

      for (let i = 1; i < openList.length; i++) {
        if (openList[i].f < currentNode.f) {
          currentNode = openList[i];
          currentIndex = i;
        }
      }

      // Remove current node from open list and add to closed list
      openList.splice(currentIndex, 1);
      closedList.add(currentNode);

      // Found the goal
      if (currentNode === targetNode) {
        const path: Vector2D[] = [];
        let current: PathNode | null = currentNode;

        while (current) {
          path.push(this.gridToWorld({ x: current.x, y: current.y }));
          current = current.parent;
        }

        return path.reverse();
      }

      // Generate neighbors
      const neighbors: PathNode[] = [];

      // Adjacent squares
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          // Skip center square
          if (dx === 0 && dy === 0) continue;

          const newX = currentNode.x + dx;
          const newY = currentNode.y + dy;

          // Make sure within range
          if (
            newX >= 0 &&
            newX < this.gridSize &&
            newY >= 0 &&
            newY < this.gridSize
          ) {
            neighbors.push(this.grid[newX][newY]);
          }
        }
      }

      // Loop through neighbors
      for (const neighbor of neighbors) {
        // Skip if in closed list or not walkable
        if (!neighbor.walkable || closedList.has(neighbor)) {
          continue;
        }

        // Calculate g score
        const gScore =
          currentNode.g +
          (neighbor.x - currentNode.x === 0 || neighbor.y - currentNode.y === 0
            ? 1
            : Math.SQRT2);

        if (!openList.includes(neighbor) || gScore < neighbor.g) {
          neighbor.g = gScore;
          neighbor.h = this.calculateHeuristic(neighbor, targetNode);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.parent = currentNode;

          if (!openList.includes(neighbor)) {
            openList.push(neighbor);
          }
        }
      }
    }

    // No path found
    return [];
  }

  // Update obstacles in the grid
  updateObstacles(
    obstacles: Array<{ position: Vector2D; radius: number }>,
    walls: Wall[]
  ): void {
    // Reset grid
    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        this.grid[x][y].walkable = true;
      }
    }

    // Mark cells around obstacles as blocked
    for (const obstacle of obstacles) {
      const radius = obstacle.radius + 5; // Add small buffer
      const minX = Math.max(
        0,
        Math.floor((obstacle.position.x - radius) / this.cellSize)
      );
      const maxX = Math.min(
        this.grid.length - 1,
        Math.ceil((obstacle.position.x + radius) / this.cellSize)
      );
      const minY = Math.max(
        0,
        Math.floor((obstacle.position.y - radius) / this.cellSize)
      );
      const maxY = Math.min(
        this.grid[0].length - 1,
        Math.ceil((obstacle.position.y + radius) / this.cellSize)
      );

      // Check each cell in the bounding box
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          const cellCenter = this.gridToWorld({ x, y });
          const dx = cellCenter.x - obstacle.position.x;
          const dy = cellCenter.y - obstacle.position.y;
          if (dx * dx + dy * dy < radius * radius) {
            this.grid[x][y].walkable = false;
          }
        }
      }
    }

    // Mark cells containing walls as non-walkable
    for (const wall of walls) {
      this.markWallCells(wall);
    }
  }

  private markWallCells(wall: Wall): void {
    const OBSTACLE_BUFFER = 5;

    // Calculate wall bounding box
    const wallBBox = {
      minX: wall.position.x - wall.width / 2 - OBSTACLE_BUFFER,
      maxX: wall.position.x + wall.width / 2 + OBSTACLE_BUFFER,
      minY: wall.position.y - wall.height / 2 - OBSTACLE_BUFFER,
      maxY: wall.position.y + wall.height / 2 + OBSTACLE_BUFFER,
    };

    // Convert to grid coordinates
    const gridMinX = Math.max(0, Math.floor(wallBBox.minX / this.cellSize));
    const gridMaxX = Math.min(
      this.grid.length - 1,
      Math.ceil(wallBBox.maxX / this.cellSize)
    );
    const gridMinY = Math.max(0, Math.floor(wallBBox.minY / this.cellSize));
    const gridMaxY = Math.min(
      this.grid[0].length - 1,
      Math.ceil(wallBBox.maxY / this.cellSize)
    );

    // Check each cell in the bounding box
    for (let x = gridMinX; x <= gridMaxX; x++) {
      for (let y = gridMinY; y <= gridMaxY; y++) {
        const cellCenter = this.gridToWorld({ x, y });
        if (this.pointInWall(cellCenter, wall, OBSTACLE_BUFFER)) {
          this.grid[x][y].walkable = false;
        }
      }
    }
  }

  private pointInWall(point: Vector2D, wall: Wall, buffer: number): boolean {
    if (wall.rotation === 0) {
      // Fast check for axis-aligned walls
      const halfWidth = (wall.width + buffer) / 2;
      const halfHeight = (wall.height + buffer) / 2;

      return (
        point.x >= wall.position.x - halfWidth &&
        point.x <= wall.position.x + halfWidth &&
        point.y >= wall.position.y - halfHeight &&
        point.y <= wall.position.y + halfHeight
      );
    } else {
      // Transform point to wall's local space for rotated walls
      const dx = point.x - wall.position.x;
      const dy = point.y - wall.position.y;
      const cosA = Math.cos(-wall.rotation);
      const sinA = Math.sin(-wall.rotation);

      const localX = dx * cosA - dy * sinA;
      const localY = dx * sinA + dy * cosA;

      // Check if point is inside rectangle in local space
      return (
        Math.abs(localX) <= (wall.width + buffer) / 2 &&
        Math.abs(localY) <= (wall.height + buffer) / 2
      );
    }
  }

  // Find a random walkable position in the world
  findRandomWalkablePosition(): Vector2D | null {
    const maxAttempts = 100;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const x = Math.floor(Math.random() * this.gridSize);
      const y = Math.floor(Math.random() * this.gridSize);

      if (this.grid[x][y].walkable) {
        const worldPos = this.gridToWorld({ x, y });
        return worldPos;
      }

      attempts++;
    }

    return null;
  }

  // Check if a position is walkable
  isWalkable(position: Vector2D): boolean {
    const gridPos = this.worldToGrid(position);
    if (
      gridPos.x < 0 ||
      gridPos.x >= this.gridSize ||
      gridPos.y < 0 ||
      gridPos.y >= this.gridSize
    ) {
      return false;
    }

    return this.grid[gridPos.x][gridPos.y].walkable;
  }

  private updateObstacleGrid(): void {
    // Reset grid
    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        this.grid[x][y].walkable = true;
      }
    }

    // Add walls from all camps
    const camps = this.game.getCampManager().getCamps();
    for (const camp of camps) {
      for (const wall of camp.walls) {
        this.markWallCells(wall);
      }
    }
  }
}
