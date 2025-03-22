import { ChainWeapon } from "./ChainWeapon";
import { Vector2D } from "./types";

export interface Entity {
  // Core entity properties
  id: number; // Unique entity ID
  isDead: boolean; // Entity state flag

  // Position and physics
  position: Vector2D; // Using existing Vector2D interface
  radius: number; // Collision radius

  // Components
  movement: {
    speed: number;
    direction: Vector2D;
    turnSpeed: number;
  };

  health: {
    current: number;
    max: number;
    invulnerableUntil: number;
  };

  combat: {
    weapon: ChainWeapon | null;
    detectionRange: number;
    attackCooldown: number;
    lastAttackTime: number;
  };

  render: {
    color: string;
    targetAngle: number;
  };
}
