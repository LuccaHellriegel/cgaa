export interface TowerRange {
  x: number;
  y: number;
  radius: number;
}

export interface GameEvents {
  SOUL_COLLECTED: string;
  PLAYER_DAMAGED: string;
  PLAYER_HEALED: string;
  TOWER_PLACED: string;
  TOWER_REMOVED: string;
  ENEMY_KILLED: string;
  MODE_CHANGED: string;
  GOLD_CHANGED: string;
}

export const GameEvents: GameEvents = {
  SOUL_COLLECTED: "soul-collected",
  PLAYER_DAMAGED: "player-damaged",
  PLAYER_HEALED: "player-healed",
  TOWER_PLACED: "tower-placed",
  TOWER_REMOVED: "tower-removed",
  ENEMY_KILLED: "enemy-killed",
  MODE_CHANGED: "mode-changed",
  GOLD_CHANGED: "gold-changed",
};
