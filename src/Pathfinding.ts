import { Vector2D } from "./types";
import { assertValue } from "./utils/assert";

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
  private worldWidth: number;
  private worldHeight: number;
  private gridSize: number;
  private grid: PathNode[][];

  constructor(worldWidth: number, worldHeight: number, gridSize: number = 30) {
    this.worldWidth = assertValue(worldWidth, "World width must be provided");
    this.worldHeight = assertValue(
      worldHeight,
      "World height must be provided"
    );
    this.gridSize = gridSize;

    const cols = Math.ceil(worldWidth / gridSize);
    const rows = Math.ceil(worldHeight / gridSize);

    // Initialize grid
    this.grid = [];
    for (let x = 0; x < cols; x++) {
      this.grid[x] = [];
      for (let y = 0; y < rows; y++) {
        this.grid[x][y] = {
          x,
          y,
          f: 0,
          g: 0,
          h: 0,
          walkable: true,
          parent: null,
        };
      }
    }
  }

  // Convert world position to grid position
  private worldToGrid(pos: Vector2D): Vector2D {
    return {
      x: Math.floor(pos.x / this.gridSize),
      y: Math.floor(pos.y / this.gridSize),
    };
  }

  // Convert grid position to world position (center of cell)
  private gridToWorld(pos: Vector2D): Vector2D {
    return {
      x: pos.x * this.gridSize + this.gridSize / 2,
      y: pos.y * this.gridSize + this.gridSize / 2,
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

    // Bounds checking
    const cols = this.grid.length;
    const rows = this.grid[0].length;

    if (
      gridStart.x < 0 ||
      gridStart.x >= cols ||
      gridStart.y < 0 ||
      gridStart.y >= rows ||
      gridTarget.x < 0 ||
      gridTarget.x >= cols ||
      gridTarget.y < 0 ||
      gridTarget.y >= rows
    ) {
      return [];
    }

    // Reset grid nodes for new pathfinding calculation
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const node = this.grid[x][y];
        node.f = 0;
        node.g = 0;
        node.h = 0;
        node.parent = null;
      }
    }

    const openList: PathNode[] = [];
    const closedList: Set<PathNode> = new Set();

    const startNode = this.grid[gridStart.x][gridStart.y];
    const targetNode = this.grid[gridTarget.x][gridTarget.y];

    // Add start node to open list
    openList.push(startNode);

    // Main A* loop
    while (openList.length > 0) {
      // Find the node with lowest f cost
      let currentIndex = 0;
      for (let i = 1; i < openList.length; i++) {
        if (openList[i].f < openList[currentIndex].f) {
          currentIndex = i;
        }
      }

      const currentNode = openList[currentIndex];

      // Remove current node from open list
      openList.splice(currentIndex, 1);
      closedList.add(currentNode);

      // If we reached the target, reconstruct the path
      if (currentNode === targetNode) {
        const path: Vector2D[] = [];
        let current: PathNode | null = currentNode;

        while (current) {
          path.push(this.gridToWorld({ x: current.x, y: current.y }));
          current = current.parent;
        }

        // Reverse to get path from start to target
        return path.reverse();
      }

      // Check all adjacent nodes
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          // Skip center (current node)
          if (x === 0 && y === 0) continue;

          const checkX = currentNode.x + x;
          const checkY = currentNode.y + y;

          // Skip out of bounds
          if (checkX < 0 || checkX >= cols || checkY < 0 || checkY >= rows) {
            continue;
          }

          const neighbor = this.grid[checkX][checkY];

          // Skip unwalkable or closed
          if (!neighbor.walkable || closedList.has(neighbor)) {
            continue;
          }

          // Calculate g score
          const isDiagonal = Math.abs(x) === 1 && Math.abs(y) === 1;
          const moveCost = isDiagonal ? 1.4 : 1;
          const gScore = currentNode.g + moveCost;

          // If this path is better than a previous one
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
    }

    // No path found
    return [];
  }

  // Update obstacles in the grid
  updateObstacles(
    obstacles: Array<{ position: Vector2D; radius: number }>
  ): void {
    // Reset walkability
    for (let x = 0; x < this.grid.length; x++) {
      for (let y = 0; y < this.grid[0].length; y++) {
        this.grid[x][y].walkable = true;
      }
    }

    // Mark obstacles as unwalkable
    for (const obstacle of obstacles) {
      const gridPos = this.worldToGrid(obstacle.position);
      const radius = Math.ceil(obstacle.radius / this.gridSize);

      // Mark the obstacle and surrounding cells based on radius
      for (let x = -radius; x <= radius; x++) {
        for (let y = -radius; y <= radius; y++) {
          const checkX = gridPos.x + x;
          const checkY = gridPos.y + y;

          if (
            checkX >= 0 &&
            checkX < this.grid.length &&
            checkY >= 0 &&
            checkY < this.grid[0].length
          ) {
            // Only mark as unwalkable if within the actual radius
            const worldPos = this.gridToWorld({ x: checkX, y: checkY });
            const dx = worldPos.x - obstacle.position.x;
            const dy = worldPos.y - obstacle.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < obstacle.radius) {
              this.grid[checkX][checkY].walkable = false;
            }
          }
        }
      }
    }
  }

  // Find a random walkable position in the world
  findRandomWalkablePosition(): Vector2D {
    const cols = this.grid.length;
    const rows = this.grid[0].length;

    // Try to find a walkable position (max 20 attempts)
    for (let i = 0; i < 20; i++) {
      const x = Math.floor(Math.random() * cols);
      const y = Math.floor(Math.random() * rows);

      if (this.grid[x][y].walkable) {
        return this.gridToWorld({ x, y });
      }
    }

    // Fallback - linear scan for any walkable tile
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        if (this.grid[x][y].walkable) {
          return this.gridToWorld({ x, y });
        }
      }
    }

    // Last resort - return center of world
    return {
      x: this.worldWidth / 2,
      y: this.worldHeight / 2,
    };
  }
}
