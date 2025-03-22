import { Vector2D, Wall } from "./types";
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
    obstacles: Array<{ position: Vector2D; radius: number }>,
    walls: Wall[] = []
  ): void {
    // Add a small buffer for obstacles to prevent entities from getting too close
    const OBSTACLE_BUFFER = 5;

    // Reset all nodes to walkable
    for (let x = 0; x < this.grid.length; x++) {
      for (let y = 0; y < this.grid[x].length; y++) {
        this.grid[x][y].walkable = true;
      }
    }

    // Mark cells containing obstacles as non-walkable
    for (const obstacle of obstacles) {
      const radius = obstacle.radius + OBSTACLE_BUFFER;
      const gridPos = this.worldToGrid(obstacle.position);

      // Calculate the grid cells that the obstacle covers
      const minX = Math.max(
        0,
        Math.floor((obstacle.position.x - radius) / this.gridSize)
      );
      const maxX = Math.min(
        this.grid.length - 1,
        Math.ceil((obstacle.position.x + radius) / this.gridSize)
      );
      const minY = Math.max(
        0,
        Math.floor((obstacle.position.y - radius) / this.gridSize)
      );
      const maxY = Math.min(
        this.grid[0].length - 1,
        Math.ceil((obstacle.position.y + radius) / this.gridSize)
      );

      // Mark cells as non-walkable
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
      // Calculate wall position and size with a small buffer
      const wallBBox = this.getWallBoundingBox(wall, OBSTACLE_BUFFER);

      // Convert to grid coordinates
      const gridMinX = Math.max(0, Math.floor(wallBBox.minX / this.gridSize));
      const gridMaxX = Math.min(
        this.grid.length - 1,
        Math.ceil(wallBBox.maxX / this.gridSize)
      );
      const gridMinY = Math.max(0, Math.floor(wallBBox.minY / this.gridSize));
      const gridMaxY = Math.min(
        this.grid[0].length - 1,
        Math.ceil(wallBBox.maxY / this.gridSize)
      );

      // Mark cells that intersect with the wall as non-walkable
      for (let x = gridMinX; x <= gridMaxX; x++) {
        for (let y = gridMinY; y <= gridMaxY; y++) {
          const cellCenter = this.gridToWorld({ x, y });
          if (this.pointInWall(cellCenter, wall, OBSTACLE_BUFFER)) {
            this.grid[x][y].walkable = false;
          }
        }
      }
    }
  }

  // Get the bounding box of a wall with optional buffer
  private getWallBoundingBox(
    wall: Wall,
    buffer: number = 0
  ): { minX: number; maxX: number; minY: number; maxY: number } {
    const halfWidth = (wall.width + buffer) / 2;
    const halfHeight = (wall.height + buffer) / 2;

    if (wall.rotation === 0) {
      // Simpler case for non-rotated walls
      return {
        minX: wall.position.x - halfWidth,
        maxX: wall.position.x + halfWidth,
        minY: wall.position.y - halfHeight,
        maxY: wall.position.y + halfHeight,
      };
    } else {
      // For rotated walls, calculate corners
      const cosA = Math.cos(wall.rotation);
      const sinA = Math.sin(wall.rotation);

      const corners = [
        {
          x: wall.position.x + cosA * halfWidth - sinA * halfHeight,
          y: wall.position.y + sinA * halfWidth + cosA * halfHeight,
        },
        {
          x: wall.position.x + cosA * halfWidth + sinA * halfHeight,
          y: wall.position.y + sinA * halfWidth - cosA * halfHeight,
        },
        {
          x: wall.position.x - cosA * halfWidth + sinA * halfHeight,
          y: wall.position.y - sinA * halfWidth - cosA * halfHeight,
        },
        {
          x: wall.position.x - cosA * halfWidth - sinA * halfHeight,
          y: wall.position.y - sinA * halfWidth + cosA * halfHeight,
        },
      ];

      // Find mins and maxes
      return {
        minX: Math.min(...corners.map((c) => c.x)),
        maxX: Math.max(...corners.map((c) => c.x)),
        minY: Math.min(...corners.map((c) => c.y)),
        maxY: Math.max(...corners.map((c) => c.y)),
      };
    }
  }

  // Check if a point is inside a wall (with optional buffer)
  private pointInWall(
    point: Vector2D,
    wall: Wall,
    buffer: number = 0
  ): boolean {
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
    // Try 50 random positions
    for (let attempts = 0; attempts < 50; attempts++) {
      const x = Math.random() * this.worldWidth;
      const y = Math.random() * this.worldHeight;

      const gridPos = this.worldToGrid({ x, y });

      // Check if position is within grid and walkable
      if (
        gridPos.x >= 0 &&
        gridPos.x < this.grid.length &&
        gridPos.y >= 0 &&
        gridPos.y < this.grid[0].length &&
        this.grid[gridPos.x][gridPos.y].walkable
      ) {
        // Return the center of the walkable grid cell
        return this.gridToWorld(gridPos);
      }
    }

    return null;
  }

  // Check if a position is walkable
  isPositionWalkable(position: Vector2D): boolean {
    const gridPos = this.worldToGrid(position);

    // Check bounds
    if (
      gridPos.x < 0 ||
      gridPos.x >= this.grid.length ||
      gridPos.y < 0 ||
      gridPos.y >= this.grid[0].length
    ) {
      return false;
    }

    return this.grid[gridPos.x][gridPos.y].walkable;
  }
}
