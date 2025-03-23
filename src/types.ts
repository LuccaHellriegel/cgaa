export enum RenderType {
  Circle = "circle",
  Triangle = "triangle",
  Rectangle = "rectangle",
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface Wall {
  position: Vector2D;
  width: number;
  height: number;
  rotation: number;
}

export interface Camp {
  id: number;
  position: Vector2D;
  radius: number;
  color: string;
  walls: Wall[];
  entrances: Entrance[];
}

export interface Entrance {
  position: Vector2D;
  width: number;
  direction: Vector2D;
}
