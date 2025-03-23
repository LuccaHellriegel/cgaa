import { ChainWeapon } from "./ChainWeapon";
import { Vector2D, RenderType } from "./types";

export interface AttackComponent {
  attackValue: number;
}

export interface CameraComponent {
  position: Vector2D;
  smoothFactor: number;
}

export interface ScreenComponent {
  viewportWidth: number;
  viewportHeight: number;
  worldWidth: number;
  worldHeight: number;
}

export interface MovementComponent {
  speed: number;
  direction: Vector2D;
  turnSpeed: number;
}

export interface HealthComponent {
  current: number;
  max: number;
  invulnerableUntil: number;
}

export interface CombatComponent {
  weapon: ChainWeapon | null;
  detectionRange: number;
  attackCooldown: number;
  lastAttackTime: number;
}

export interface RenderComponent {
  type: RenderType;
  color: string;
  targetAngle: number;
}

export interface PathfindingComponent {
  path: Vector2D[];
  currentPathIndex: number;
  targetPosition: Vector2D | null;
  needsPathUpdate: boolean;
  lastPathUpdateTime: number;
}

export interface AIComponent {
  state: "IDLE" | "WANDERING" | "WAITING";
  waitUntil: number;
  idleTime: number;
  waitTime: number;
}

export interface CampComponent {
  campId: number;
}

export interface PositionComponent {
  x: number;
  y: number;
  size: number;
}
