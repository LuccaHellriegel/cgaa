import { Wall } from "./Wall";

interface Node {
  x: number;
  y: number;
  g: number; // Cost from start to current node
  h: number; // Estimated cost from current node to end
  f: number; // Total cost (g + h)
  parent: Node | null;
}

export class PathFinder {
  private readonly NODE_SIZE = 20; // Reduced from 50 to 20 for more precise paths
  private readonly DIAGONAL_COST = Math.sqrt(2);
  private readonly STRAIGHT_COST = 1;
  private readonly MAX_ITERATIONS = 5000; // Add max iterations to prevent infinite loops
  private readonly pathCache = new Map<string, { x: number; y: number }[]>();

  constructor(
    private readonly worldWidth: number,
    private readonly worldHeight: number,
    private readonly walls: Wall[]
  ) {}

  findPath(
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): { x: number; y: number }[] {
    // Check if start or end point is inside a wall
    if (
      this.walls.some((wall) => this.intersectsWall(startX, startY, wall)) ||
      this.walls.some((wall) => this.intersectsWall(endX, endY, wall))
    ) {
      console.warn(
        `Cannot find path: Start (${startX}, ${startY}) or end (${endX}, ${endY}) is inside a wall`
      );
      return [{ x: startX, y: startY }]; // Return only start point if no valid path
    }

    // Calculate direct distance between start and end
    const dx = endX - startX;
    const dy = endY - startY;
    const directDistance = Math.sqrt(dx * dx + dy * dy);

    // If target is close, just return direct path without pathfinding
    // This helps avoid expensive calculations for nearby targets
    if (directDistance < this.NODE_SIZE * 5) {
      return [
        { x: startX, y: startY },
        { x: endX, y: endY },
      ];
    }

    // Round coordinates to grid size for caching
    const startGridX = Math.floor(startX / this.NODE_SIZE);
    const startGridY = Math.floor(startY / this.NODE_SIZE);
    const endGridX = Math.floor(endX / this.NODE_SIZE);
    const endGridY = Math.floor(endY / this.NODE_SIZE);

    const cacheKey = `${startGridX},${startGridY}-${endGridX},${endGridY}`;

    // Check cache first
    if (this.pathCache.has(cacheKey)) {
      const cachedPath = this.pathCache.get(cacheKey)!;
      return this.adjustPath(cachedPath, startX, startY, endX, endY);
    }

    const startNode = this.createNode(startX, startY);
    const endNode = this.createNode(endX, endY);

    const openSet: Node[] = [startNode];
    const closedSet = new Set<string>();

    // Add iteration counter to prevent infinite loops
    let iterations = 0;

    while (openSet.length > 0 && iterations < this.MAX_ITERATIONS) {
      iterations++;

      // Find node with lowest f cost in open set
      let currentNode = openSet[0];
      let currentIndex = 0;
      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].f < currentNode.f) {
          currentNode = openSet[i];
          currentIndex = i;
        }
      }

      // Check if we reached the end
      if (this.nodesEqual(currentNode, endNode)) {
        const path = this.reconstructPath(currentNode);
        // Cache the path
        this.pathCache.set(cacheKey, path);
        return this.adjustPath(path, startX, startY, endX, endY);
      }

      // Move current node from open to closed set
      openSet.splice(currentIndex, 1);
      closedSet.add(this.nodeKey(currentNode));

      // Check all neighbors
      const neighbors = this.getNeighbors(currentNode);

      for (const neighbor of neighbors) {
        const neighborKey = this.nodeKey(neighbor);
        if (closedSet.has(neighborKey)) continue;

        const gCost = currentNode.g + this.getDistance(currentNode, neighbor);

        // Check if this path to neighbor is better than any previous one
        const existingNeighbor = openSet.find((n) =>
          this.nodesEqual(n, neighbor)
        );
        if (!existingNeighbor) {
          neighbor.g = gCost;
          neighbor.h = this.getDistance(neighbor, endNode);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.parent = currentNode;
          openSet.push(neighbor);
        } else if (gCost < existingNeighbor.g) {
          existingNeighbor.g = gCost;
          existingNeighbor.f = existingNeighbor.g + existingNeighbor.h;
          existingNeighbor.parent = currentNode;
        }
      }
    }

    // If we exceed max iterations, log warning and return a direct path
    if (iterations >= this.MAX_ITERATIONS) {
      console.warn(
        `PathFinder: Max iterations (${this.MAX_ITERATIONS}) reached for path from (${startX}, ${startY}) to (${endX}, ${endY})`
      );
      // Return direct path as fallback
      return [
        { x: startX, y: startY },
        { x: endX, y: endY },
      ];
    }

    return [];
  }

  private adjustPath(
    path: { x: number; y: number }[],
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): { x: number; y: number }[] {
    if (path.length === 0) return [];

    // Adjust first point to match actual start position
    path[0] = { x: startX, y: startY };

    // Adjust last point to match actual end position
    path[path.length - 1] = { x: endX, y: endY };

    return path;
  }

  private createNode(x: number, y: number): Node {
    return {
      x: Math.floor(x / this.NODE_SIZE) * this.NODE_SIZE,
      y: Math.floor(y / this.NODE_SIZE) * this.NODE_SIZE,
      g: 0,
      h: 0,
      f: 0,
      parent: null,
    };
  }

  private getNeighbors(node: Node): Node[] {
    const neighbors: Node[] = [];
    const directions = [
      { dx: 0, dy: this.NODE_SIZE, cost: this.STRAIGHT_COST },
      { dx: this.NODE_SIZE, dy: 0, cost: this.STRAIGHT_COST },
      { dx: 0, dy: -this.NODE_SIZE, cost: this.STRAIGHT_COST },
      { dx: -this.NODE_SIZE, dy: 0, cost: this.STRAIGHT_COST },
      { dx: this.NODE_SIZE, dy: this.NODE_SIZE, cost: this.DIAGONAL_COST },
      { dx: this.NODE_SIZE, dy: -this.NODE_SIZE, cost: this.DIAGONAL_COST },
      { dx: -this.NODE_SIZE, dy: this.NODE_SIZE, cost: this.DIAGONAL_COST },
      { dx: -this.NODE_SIZE, dy: -this.NODE_SIZE, cost: this.DIAGONAL_COST },
    ];

    for (const dir of directions) {
      const newX = node.x + dir.dx;
      const newY = node.y + dir.dy;

      // Check if within world bounds
      if (
        newX < 0 ||
        newX >= this.worldWidth ||
        newY < 0 ||
        newY >= this.worldHeight
      ) {
        continue;
      }

      // Check if intersects with any wall
      if (this.walls.some((wall) => this.intersectsWall(newX, newY, wall))) {
        continue;
      }

      const neighbor = this.createNode(newX, newY);

      // Add a small random factor to create path variety
      // This prevents all enemies from taking exactly the same path
      const randomJitter = Math.random() * 0.1; // 10% random variation
      neighbor.g = node.g + dir.cost + randomJitter;
      neighbors.push(neighbor);
    }

    return neighbors;
  }

  private intersectsWall(x: number, y: number, wall: Wall): boolean {
    // Add a buffer zone around walls (50% larger than the actual NODE_SIZE)
    const WALL_BUFFER = (this.NODE_SIZE / 2) * 1.5;

    const closestX = Math.max(wall.x, Math.min(x, wall.x + wall.width));
    const closestY = Math.max(wall.y, Math.min(y, wall.y + wall.height));
    const distanceX = x - closestX;
    const distanceY = y - closestY;
    return (
      distanceX * distanceX + distanceY * distanceY < WALL_BUFFER * WALL_BUFFER
    );
  }

  private getDistance(a: Node, b: Node): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private nodesEqual(a: Node, b: Node): boolean {
    return a.x === b.x && a.y === b.y;
  }

  private nodeKey(node: Node): string {
    return `${node.x},${node.y}`;
  }

  private reconstructPath(node: Node): { x: number; y: number }[] {
    const path: { x: number; y: number }[] = [];
    let current: Node | null = node;

    while (current !== null) {
      path.unshift({ x: current.x, y: current.y });
      current = current.parent;
    }

    return path;
  }
}
