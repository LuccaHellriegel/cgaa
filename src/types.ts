import { ChainWeapon } from "./ChainWeapon";

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

export interface Health {
  current: number;
  max: number;
}

export interface Player extends GameObject {
  speed: number;
  direction: Vector2D;
  health: Health;
  invulnerableUntil: number;
}

export interface Enemy extends GameObject {
  speed: number;
  direction: Vector2D;
  weapon: ChainWeapon | null;
  detectionRange: number;
  attackCooldown: number;
  lastAttackTime: number;
  targetAngle: number;
  turnSpeed: number;
}

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
