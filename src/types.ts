export interface Vector2D {
  x: number;
  y: number;
}

export interface GameObject {
  x: number;
  y: number;
  radius: number;
  color: string;
}

export interface Player extends GameObject {
  speed: number;
  direction: Vector2D;
}

export interface Enemy extends GameObject {}

export interface ChainLink extends GameObject {}

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
