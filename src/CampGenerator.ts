import { Wall } from "./Wall";
import { assert } from "./utils/assert";

interface GridCell {
  x: number;
  y: number;
  occupied: boolean;
  type: "wall" | "space" | "entrance";
}

interface CampSpace {
  id: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  sections: CampSection[];
  entrances: Entrance[];
  walls: Wall[];
}

interface CampSection {
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  type: "main" | "courtyard" | "wing";
}

interface Entrance {
  x: number;
  y: number;
  width: number;
  height: number;
  direction: "horizontal" | "vertical";
}

export class CampGenerator {
  private readonly GRID_SIZE = 20; // Reduced grid size
  private readonly WALL_THICKNESS = 20;
  private readonly ENTRANCE_WIDTH = 60;
  private readonly MIN_SECTION_SIZE = 10; // Increased minimum size
  private readonly MAX_SECTION_SIZE = 15; // Increased maximum size
  private readonly MIN_CAMP_DISTANCE = 100; // Reduced minimum distance
  private readonly COURTYARD_SIZE = 4;
  private grid: GridCell[][] = [];
  private camps: CampSpace[] = [];

  constructor(
    private readonly worldWidth: number,
    private readonly worldHeight: number
  ) {
    this.initializeGrid();
  }

  private initializeGrid() {
    const cols = Math.floor(this.worldWidth / this.GRID_SIZE);
    const rows = Math.floor(this.worldHeight / this.GRID_SIZE);

    this.grid = Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map(() => ({
            x: 0,
            y: 0,
            occupied: false,
            type: "space" as const,
          }))
      );

    // Initialize cell coordinates
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        this.grid[y][x].x = x * this.GRID_SIZE;
        this.grid[y][x].y = y * this.GRID_SIZE;
      }
    }
  }

  generateCamps(numCamps: number): CampSpace[] {
    console.log(`Starting to generate ${numCamps} camps...`);
    console.log(`World dimensions: ${this.worldWidth}x${this.worldHeight}`);
    console.log(
      `Grid size: ${this.GRID_SIZE}, Grid dimensions: ${this.grid[0].length}x${this.grid.length}`
    );

    this.camps = [];

    for (let i = 0; i < numCamps; i++) {
      console.log(`\nAttempting to generate camp ${i + 1}/${numCamps}`);
      const camp = this.generateSingleCamp();
      if (camp) {
        this.camps.push(camp);
        console.log(`Successfully added camp ${i + 1}`);
      } else {
        console.log(`Failed to generate camp ${i + 1}`);
      }
    }

    console.log(
      `\nFinished generation. Created ${this.camps.length}/${numCamps} camps`
    );
    return this.camps;
  }

  private generateSingleCamp(): CampSpace | null {
    // Find a valid position for the camp
    const position = this.findValidCampPosition();
    if (!position) {
      console.log("Could not find valid position for camp");
      return null;
    }

    // Randomly choose a camp type
    const campType = Math.random();
    let sections: CampSection[];

    if (campType < 0.3) {
      sections = this.generateLShapedCamp(position);
      console.log("Generated L-shaped camp");
    } else if (campType < 0.6) {
      sections = this.generateCourtyardCamp(position);
      console.log("Generated courtyard camp");
    } else {
      sections = this.generateUShapedCamp(position);
      console.log("Generated U-shaped camp");
    }

    // Calculate overall bounds
    const bounds = this.calculateCampBounds(sections);

    // Validate bounds are within world
    if (
      bounds.x < 0 ||
      bounds.y < 0 ||
      bounds.x + bounds.width > this.worldWidth ||
      bounds.y + bounds.height > this.worldHeight
    ) {
      console.log("Camp bounds outside world limits");
      return null;
    }

    // Create camp space
    const camp: CampSpace = {
      id: `camp_${this.camps.length}`,
      bounds,
      sections,
      entrances: [],
      walls: [],
    };

    // Mark grid cells as occupied
    this.occupyCampSpace(camp);

    // Add entrances
    this.addEntrances(camp);

    // Generate walls
    this.generateWalls(camp);

    console.log(`Successfully generated camp ${camp.id}`);
    return camp;
  }

  private findValidCampPosition(): { x: number; y: number } | null {
    const maxAttempts = 100;
    let attempts = 0;

    const maxSize = this.MAX_SECTION_SIZE * this.GRID_SIZE;
    console.log(
      `Looking for position. Max size: ${maxSize}, Available space: ${this.worldWidth}x${this.worldHeight}`
    );

    while (attempts < maxAttempts) {
      // Pick a random position
      const x = Math.floor(Math.random() * (this.worldWidth - maxSize - 100));
      const y = Math.floor(Math.random() * (this.worldHeight - maxSize - 100));

      // Check if position is valid
      if (this.isValidCampPosition(x, y)) {
        console.log(
          `Found valid camp position at (${x}, ${y}) after ${
            attempts + 1
          } attempts`
        );
        return { x, y };
      }

      attempts++;
      if (attempts % 10 === 0) {
        console.log(`Made ${attempts} attempts to find valid position...`);
      }
    }

    console.log(
      `Failed to find valid camp position after ${maxAttempts} attempts`
    );
    return null;
  }

  private isValidCampPosition(x: number, y: number): boolean {
    const maxSize = this.MAX_SECTION_SIZE * this.GRID_SIZE;

    // Check if within world bounds
    if (
      x < 0 ||
      y < 0 ||
      x + maxSize > this.worldWidth ||
      y + maxSize > this.worldHeight
    ) {
      console.log(`Position (${x}, ${y}) rejected: outside world bounds`);
      return false;
    }

    // Check distance from other camps with a smaller minimum distance
    for (const camp of this.camps) {
      const dx = x - camp.bounds.x;
      const dy = y - camp.bounds.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.MIN_CAMP_DISTANCE / 2) {
        console.log(
          `Position (${x}, ${y}) rejected: too close to existing camp (distance: ${distance})`
        );
        return false;
      }
    }

    return true;
  }

  private occupyCampSpace(camp: CampSpace) {
    const startX = Math.floor(camp.bounds.x / this.GRID_SIZE);
    const startY = Math.floor(camp.bounds.y / this.GRID_SIZE);
    const endX = Math.floor(
      (camp.bounds.x + camp.bounds.width) / this.GRID_SIZE
    );
    const endY = Math.floor(
      (camp.bounds.y + camp.bounds.height) / this.GRID_SIZE
    );

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        if (y < this.grid.length && x < this.grid[0].length) {
          this.grid[y][x].occupied = true;
          this.grid[y][x].type = "space";
        }
      }
    }
  }

  private addEntrances(camp: CampSpace) {
    // Add 1-2 entrances
    const numEntrances = 1 + Math.floor(Math.random() * 2);
    const possibleSides = ["north", "south", "east", "west"];

    // Shuffle sides
    for (let i = possibleSides.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [possibleSides[i], possibleSides[j]] = [
        possibleSides[j],
        possibleSides[i],
      ];
    }

    // Add entrances to selected sides
    for (let i = 0; i < numEntrances; i++) {
      const side = possibleSides[i];
      const entrance = this.createEntrance(camp, side);
      if (entrance) {
        camp.entrances.push(entrance);
      }
    }
  }

  private createEntrance(camp: CampSpace, side: string): Entrance | null {
    const minDistFromCorner = this.GRID_SIZE;
    let x = camp.bounds.x;
    let y = camp.bounds.y;
    let width = this.ENTRANCE_WIDTH;
    let height = this.WALL_THICKNESS;
    let direction: "horizontal" | "vertical" = "horizontal";

    switch (side) {
      case "north":
        x =
          camp.bounds.x +
          minDistFromCorner +
          Math.random() *
            (camp.bounds.width - 2 * minDistFromCorner - this.ENTRANCE_WIDTH);
        y = camp.bounds.y;
        break;
      case "south":
        x =
          camp.bounds.x +
          minDistFromCorner +
          Math.random() *
            (camp.bounds.width - 2 * minDistFromCorner - this.ENTRANCE_WIDTH);
        y = camp.bounds.y + camp.bounds.height - this.WALL_THICKNESS;
        break;
      case "east":
        x = camp.bounds.x + camp.bounds.width - this.WALL_THICKNESS;
        y =
          camp.bounds.y +
          minDistFromCorner +
          Math.random() *
            (camp.bounds.height - 2 * minDistFromCorner - this.ENTRANCE_WIDTH);
        width = this.WALL_THICKNESS;
        height = this.ENTRANCE_WIDTH;
        direction = "vertical";
        break;
      case "west":
        x = camp.bounds.x;
        y =
          camp.bounds.y +
          minDistFromCorner +
          Math.random() *
            (camp.bounds.height - 2 * minDistFromCorner - this.ENTRANCE_WIDTH);
        width = this.WALL_THICKNESS;
        height = this.ENTRANCE_WIDTH;
        direction = "vertical";
        break;
    }

    return { x, y, width, height, direction };
  }

  private generateLShapedCamp(position: {
    x: number;
    y: number;
  }): CampSection[] {
    const mainWidth = this.MIN_SECTION_SIZE + 2;
    const mainHeight = this.MIN_SECTION_SIZE + 2;
    const wingWidth = this.MIN_SECTION_SIZE;
    const wingHeight = this.MIN_SECTION_SIZE;

    return [
      {
        bounds: {
          x: position.x,
          y: position.y,
          width: mainWidth * this.GRID_SIZE,
          height: mainHeight * this.GRID_SIZE,
        },
        type: "main",
      },
      {
        bounds: {
          x: position.x + mainWidth * this.GRID_SIZE - this.WALL_THICKNESS * 2,
          y: position.y,
          width: wingWidth * this.GRID_SIZE,
          height: wingHeight * this.GRID_SIZE,
        },
        type: "wing",
      },
    ];
  }

  private generateCourtyardCamp(position: {
    x: number;
    y: number;
  }): CampSection[] {
    const size = this.MIN_SECTION_SIZE + 4;
    const courtyardOffset = Math.floor((size - this.COURTYARD_SIZE) / 2);

    return [
      {
        bounds: {
          x: position.x,
          y: position.y,
          width: size * this.GRID_SIZE,
          height: size * this.GRID_SIZE,
        },
        type: "main",
      },
      {
        bounds: {
          x: position.x + courtyardOffset * this.GRID_SIZE,
          y: position.y + courtyardOffset * this.GRID_SIZE,
          width: this.COURTYARD_SIZE * this.GRID_SIZE,
          height: this.COURTYARD_SIZE * this.GRID_SIZE,
        },
        type: "courtyard",
      },
    ];
  }

  private generateUShapedCamp(position: {
    x: number;
    y: number;
  }): CampSection[] {
    const mainWidth = this.MIN_SECTION_SIZE + 4;
    const mainHeight = this.MIN_SECTION_SIZE;
    const wingWidth = this.MIN_SECTION_SIZE;
    const wingHeight = this.MIN_SECTION_SIZE + 2;

    return [
      {
        bounds: {
          x: position.x,
          y: position.y,
          width: mainWidth * this.GRID_SIZE,
          height: mainHeight * this.GRID_SIZE,
        },
        type: "main",
      },
      {
        bounds: {
          x: position.x,
          y: position.y + mainHeight * this.GRID_SIZE - this.WALL_THICKNESS * 2,
          width: wingWidth * this.GRID_SIZE,
          height: wingHeight * this.GRID_SIZE,
        },
        type: "wing",
      },
      {
        bounds: {
          x: position.x + (mainWidth - wingWidth) * this.GRID_SIZE,
          y: position.y + mainHeight * this.GRID_SIZE - this.WALL_THICKNESS * 2,
          width: wingWidth * this.GRID_SIZE,
          height: wingHeight * this.GRID_SIZE,
        },
        type: "wing",
      },
    ];
  }

  private calculateCampBounds(sections: CampSection[]): {
    x: number;
    y: number;
    width: number;
    height: number;
  } {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const section of sections) {
      minX = Math.min(minX, section.bounds.x);
      minY = Math.min(minY, section.bounds.y);
      maxX = Math.max(maxX, section.bounds.x + section.bounds.width);
      maxY = Math.max(maxY, section.bounds.y + section.bounds.height);
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  private generateWalls(camp: CampSpace) {
    console.log(`Generating walls for camp ${camp.id}`);
    const walls: (Wall | null)[] = [];

    // Generate walls for each section
    for (const section of camp.sections) {
      if (section.type === "courtyard") {
        console.log("Skipping courtyard walls");
        continue;
      }

      const { x, y, width, height } = section.bounds;
      console.log(`Adding walls for ${section.type} section at (${x}, ${y})`);

      // Top wall
      walls.push(new Wall(x, y, width, this.WALL_THICKNESS));
      // Bottom wall
      walls.push(
        new Wall(
          x,
          y + height - this.WALL_THICKNESS,
          width,
          this.WALL_THICKNESS
        )
      );
      // Left wall
      walls.push(new Wall(x, y, this.WALL_THICKNESS, height));
      // Right wall
      walls.push(
        new Wall(
          x + width - this.WALL_THICKNESS,
          y,
          this.WALL_THICKNESS,
          height
        )
      );
    }

    console.log(`Generated ${walls.length} initial walls`);

    // Remove wall segments where sections connect
    let removedWalls = 0;
    walls.forEach((wall, i) => {
      if (!wall) return;

      // Check if this wall intersects with any section
      for (const section of camp.sections) {
        if (
          section.type !== "courtyard" &&
          this.wallIntersectsSection(wall, section)
        ) {
          walls[i] = null;
          removedWalls++;
          break;
        }
      }
    });
    console.log(`Removed ${removedWalls} intersecting walls`);

    // Get non-null walls
    const nonNullWalls = walls.filter((w): w is Wall => w !== null);
    console.log(`${nonNullWalls.length} walls after removing nulls`);

    // Remove wall segments where entrances are and filter out nulls
    camp.walls = this.createWallsWithEntrances(nonNullWalls, camp.entrances);
    console.log(`Final wall count for camp: ${camp.walls.length}`);
  }

  private wallIntersectsSection(wall: Wall, section: CampSection): boolean {
    // For walls that are part of this section's bounds, don't consider them as intersecting
    if (
      // If the wall is on any edge of the section, it's not intersecting
      (Math.abs(wall.x - section.bounds.x) < 1 &&
        wall.y >= section.bounds.y &&
        wall.y <= section.bounds.y + section.bounds.height) || // Left edge
      (Math.abs(
        wall.x + wall.width - (section.bounds.x + section.bounds.width)
      ) < 1 &&
        wall.y >= section.bounds.y &&
        wall.y <= section.bounds.y + section.bounds.height) || // Right edge
      (Math.abs(wall.y - section.bounds.y) < 1 &&
        wall.x >= section.bounds.x &&
        wall.x <= section.bounds.x + section.bounds.width) || // Top edge
      (Math.abs(
        wall.y + wall.height - (section.bounds.y + section.bounds.height)
      ) < 1 &&
        wall.x >= section.bounds.x &&
        wall.x <= section.bounds.x + section.bounds.width) // Bottom edge
    ) {
      return false;
    }

    // Check if the wall is from another section and crosses this section
    const wallCenterX = wall.x + wall.width / 2;
    const wallCenterY = wall.y + wall.height / 2;

    return (
      wallCenterX > section.bounds.x &&
      wallCenterX < section.bounds.x + section.bounds.width &&
      wallCenterY > section.bounds.y &&
      wallCenterY < section.bounds.y + section.bounds.height
    );
  }

  private createWallsWithEntrances(
    walls: Wall[],
    entrances: Entrance[]
  ): Wall[] {
    console.log(
      `Processing ${walls.length} walls with ${entrances.length} entrances`
    );
    const finalWalls: Wall[] = [];

    for (const wall of walls) {
      let shouldKeepWall = true;

      for (const entrance of entrances) {
        if (this.wallIntersectsEntrance(wall, entrance)) {
          shouldKeepWall = false;
          console.log(
            `Wall at (${wall.x}, ${wall.y}) intersects with entrance`
          );

          // Split wall if needed
          if (entrance.direction === "horizontal") {
            // Create left segment if needed
            if (wall.x < entrance.x) {
              finalWalls.push(
                new Wall(wall.x, wall.y, entrance.x - wall.x, wall.height)
              );
              console.log("Added left segment");
            }
            // Create right segment if needed
            if (wall.x + wall.width > entrance.x + entrance.width) {
              finalWalls.push(
                new Wall(
                  entrance.x + entrance.width,
                  wall.y,
                  wall.x + wall.width - (entrance.x + entrance.width),
                  wall.height
                )
              );
              console.log("Added right segment");
            }
          } else {
            // Create top segment if needed
            if (wall.y < entrance.y) {
              finalWalls.push(
                new Wall(wall.x, wall.y, wall.width, entrance.y - wall.y)
              );
              console.log("Added top segment");
            }
            // Create bottom segment if needed
            if (wall.y + wall.height > entrance.y + entrance.height) {
              finalWalls.push(
                new Wall(
                  wall.x,
                  entrance.y + entrance.height,
                  wall.width,
                  wall.y + wall.height - (entrance.y + entrance.height)
                )
              );
              console.log("Added bottom segment");
            }
          }
          break;
        }
      }

      if (shouldKeepWall) {
        finalWalls.push(wall);
      }
    }

    console.log(
      `Created ${finalWalls.length} final walls after processing entrances`
    );
    return finalWalls;
  }

  private wallIntersectsEntrance(wall: Wall, entrance: Entrance): boolean {
    return !(
      wall.x + wall.width <= entrance.x ||
      entrance.x + entrance.width <= wall.x ||
      wall.y + wall.height <= entrance.y ||
      entrance.y + entrance.height <= wall.y
    );
  }

  getWalls(): Wall[] {
    console.log(`Getting walls from ${this.camps.length} camps`);
    const walls: Wall[] = [];
    for (const camp of this.camps) {
      console.log(`Camp ${camp.id} has ${camp.walls.length} walls`);
      walls.push(...camp.walls);
    }
    console.log(`Total walls generated: ${walls.length}`);
    return walls;
  }
}
