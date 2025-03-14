export const GameEvents = {
  // Player events
  PLAYER_DAMAGED: "player-damaged",
  PLAYER_HEALED: "player-healed",
  PLAYER_DEATH: "player-death",
  PLAYER_READY: "player-ready",
  PLAYER_SHOOT: "player-shoot",

  // Game object events
  SOUL_COLLECTED: "soul-collected",
  TOWER_PLACED: "tower-placed",
  TOWER_REMOVED: "tower-removed",
  ENEMY_KILLED: "enemy-killed",
  ENEMY_SPAWNED: "enemy-spawned",

  // Game state events
  MODE_CHANGED: "mode-changed",
  GOLD_CHANGED: "gold-changed",
  WAVE_START: "wave-start",
  WAVE_END: "wave-end",
  GAME_OVER: "game-over",
  GAME_WIN: "game-win",

  // UI events
  UI_TOWER_SELECTED: "ui-tower-selected",
  UI_TOWER_DESELECTED: "ui-tower-deselected",
  UI_TOWER_UPGRADED: "ui-tower-upgraded",
  UI_TOWER_SOLD: "ui-tower-sold",
} as const;

export type GameEventType = (typeof GameEvents)[keyof typeof GameEvents];
