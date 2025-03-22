export interface Vector2D {
  x: number;
  y: number;
}

export interface TriangleTip {
  size: number;
  x: number;
  y: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

export type ChainWeaponState = "IDLE" | "EXTENDING" | "EXTENDED" | "RETRACTING";

export interface Wall {
  position: Vector2D;
  width: number;
  height: number;
  rotation: number;
}

export interface Entrance {
  position: Vector2D;
  width: number;
  direction: Vector2D;
}

export interface Camp {
  id: number;
  position: Vector2D;
  radius: number;
  color: string;
  walls: Wall[];
  entrances: Entrance[];
}
