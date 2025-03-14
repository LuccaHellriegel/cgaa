export const GameEvents = {
  // Player events
  PLAYER_DAMAGED: "player-damaged" as const,
  PLAYER_HEALED: "player-healed" as const,
  PLAYER_DEATH: "player-death" as const,
  PLAYER_READY: "player-ready" as const,
  PLAYER_SHOOT: "player-shoot" as const,

  // Enemy events
  ENEMY_DAMAGED: "enemy-damaged" as const,
  ENEMY_DEATH: "enemy-death" as const,
  ENEMY_SPAWN: "enemy-spawn" as const,

  // Wave events
  WAVE_START: "wave-start" as const,
  WAVE_END: "wave-end" as const,

  // Camp events
  CAMP_DESTROYED: "camp-destroyed" as const,
  CAMP_CAPTURED: "camp-captured" as const,
  CAMP_COOPERATING: "camp-cooperating" as const,

  // Quest events
  QUEST_STARTED: "quest-started" as const,
  QUEST_COMPLETED: "quest-completed" as const,
  QUEST_FAILED: "quest-failed" as const,

  // UI events
  UI_TOWER_SELECTED: "ui-tower-selected" as const,
  UI_TOWER_PLACED: "ui-tower-placed" as const,
  UI_TOWER_SOLD: "ui-tower-sold" as const,
  UI_TOWER_UPGRADED: "ui-tower-upgraded" as const,

  // Game state events
  GAME_STATE_CHANGED: "game-state-changed" as const,
  GAME_VICTORY: "game-victory" as const,
  GAME_DEFEAT: "game-defeat" as const,
  GAME_WIN: "game-win" as const,

  // Game object events
  SOUL_COLLECTED: "soul-collected" as const,
  TOWER_PLACED: "tower-placed" as const,
  TOWER_REMOVED: "tower-removed" as const,
  TOWER_STATS_UPDATED: "tower-stats-updated" as const,
  ENEMY_KILLED: "enemy-killed" as const,
  ENEMY_SPAWNED: "enemy-spawned" as const,
  DAMAGE_DEALT: "damage-dealt" as const,
  KING_DEFEATED: "king-defeated" as const,

  // Game state events
  MODE_CHANGED: "mode-changed" as const,
  GOLD_CHANGED: "gold-changed" as const,
} as const;

export type GameEventType = (typeof GameEvents)[keyof typeof GameEvents];
