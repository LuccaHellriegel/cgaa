import { Vec2 } from './core/types';

// --- Constants ---
export const MAX_ENEMIES = 200;
export const MAX_TOWERS = 50;
export const MAX_PROJECTILES = 300;
export const MAX_FRIENDS = 10;
export const MAX_CAMPS = 10;

// --- Entity Types ---
export type EnemyType = 'small' | 'medium' | 'large'; // Example types
export type TowerType = 'Shooter' | 'Healer'; // Example types
export type ProjectileType = 'player' | 'tower';
export type PlayerMode = 'attack' | 'interact';
export type GameStatus = 'playing' | 'won' | 'lost';
export type PathfindingStatus = 'idle' | 'pending' | 'found' | 'failed';

// --- Placeholder Types (to be defined later) ---
export type GridData = { width: number; height: number; walls: boolean[][] }; // Placeholder
export type KingState = { hp: number /* ... other king properties */ }; // Placeholder

// --- GameData Interface (SoA) ---
export interface GameData {
  // Global State
  gameStatus: GameStatus;
  canvasWidth: number;
  canvasHeight: number;
  waveTimer: number;
  currentWaveIndex: number;
  playerSouls: number;
  activeEnemyCount: number;
  activeTowerCount: number;
  activeProjectileCount: number;
  activeFriendCount: number;
  activeCampCount: number;

  // Player State
  playerX: number;
  playerY: number;
  playerHp: number;
  playerMode: PlayerMode;
  playerAttackCooldown: number;

  // Grid & King (Placeholders for now)
  grid: GridData | null; // Will be initialized later
  king: KingState | null; // Will be initialized later

  // --- Entity Component Arrays (SoA) ---

  // Enemies
  enemy_isActive: boolean[];
  enemy_id: number[]; // Unique ID for targeting
  enemy_type: EnemyType[];
  enemy_x: number[];
  enemy_y: number[];
  enemy_hp: number[];
  enemy_targetId: (number | null)[]; // Target entity ID (e.g., a friend or player)
  enemy_pathfindingStatus: PathfindingStatus[];
  enemy_currentPathSegmentIndex: number[];
  enemy_pathSegments: Vec2[][];

  // Towers
  tower_isActive: boolean[];
  tower_id: number[];
  tower_type: TowerType[];
  tower_x: number[]; // Grid cell X
  tower_y: number[]; // Grid cell Y
  tower_hp: number[];
  tower_cooldown: number[];
  tower_targetId: (number | null)[]; // Target enemy ID

  // Projectiles
  projectile_isActive: boolean[];
  projectile_id: number[];
  projectile_type: ProjectileType[];
  projectile_x: number[];
  projectile_y: number[];
  projectile_targetId: number[]; // Target entity ID
  projectile_damage: number[];
  projectile_speed: number[]; // Example, maybe comes from Balance

  // Friends
  friend_isActive: boolean[];
  friend_id: number[];
  friend_x: number[];
  friend_y: number[];
  friend_hp: number[];
  friend_isFleeing: boolean[];

  // Camps
  camp_isActive: boolean[];
  camp_id: number[];
  camp_x: number[]; // Grid cell X
  camp_y: number[]; // Grid cell Y
  camp_type: string[]; // Example: 'goblin', 'skeleton'
  camp_hp: number[];
  camp_isFriendly: boolean[];
  // ... other camp properties (e.g., quest status)
}

// --- Initialization Function ---
export function createGameData(): GameData {
  return {
    // Global State Defaults
    gameStatus: 'playing',
    canvasWidth: 0,
    canvasHeight: 0,
    waveTimer: 0,
    currentWaveIndex: -1, // Start before the first wave
    playerSouls: 100, // Starting souls
    activeEnemyCount: 0,
    activeTowerCount: 0,
    activeProjectileCount: 0,
    activeFriendCount: 0,
    activeCampCount: 0,

    // Player State Defaults
    playerX: 5, // Example starting position
    playerY: 5,
    playerHp: 100, // Example starting HP (Balance might override)
    playerMode: 'attack',
    playerAttackCooldown: 0,

    // Placeholders
    grid: null,
    king: null,

    // --- Pre-allocated SoA Arrays ---

    // Enemies
    enemy_isActive: new Array(MAX_ENEMIES).fill(false),
    enemy_id: new Array(MAX_ENEMIES).fill(0),
    enemy_type: new Array(MAX_ENEMIES).fill('small'), // Default type
    enemy_x: new Array(MAX_ENEMIES).fill(0),
    enemy_y: new Array(MAX_ENEMIES).fill(0),
    enemy_hp: new Array(MAX_ENEMIES).fill(0),
    enemy_targetId: new Array(MAX_ENEMIES).fill(null),
    enemy_pathfindingStatus: new Array(MAX_ENEMIES).fill('idle'),
    enemy_currentPathSegmentIndex: new Array(MAX_ENEMIES).fill(-1),
    enemy_pathSegments: new Array(MAX_ENEMIES).fill([]),

    // Towers
    tower_isActive: new Array(MAX_TOWERS).fill(false),
    tower_id: new Array(MAX_TOWERS).fill(0),
    tower_type: new Array(MAX_TOWERS).fill('Shooter'),
    tower_x: new Array(MAX_TOWERS).fill(0),
    tower_y: new Array(MAX_TOWERS).fill(0),
    tower_hp: new Array(MAX_TOWERS).fill(0),
    tower_cooldown: new Array(MAX_TOWERS).fill(0),
    tower_targetId: new Array(MAX_TOWERS).fill(null),

    // Projectiles
    projectile_isActive: new Array(MAX_PROJECTILES).fill(false),
    projectile_id: new Array(MAX_PROJECTILES).fill(0),
    projectile_type: new Array(MAX_PROJECTILES).fill('player'),
    projectile_x: new Array(MAX_PROJECTILES).fill(0),
    projectile_y: new Array(MAX_PROJECTILES).fill(0),
    projectile_targetId: new Array(MAX_PROJECTILES).fill(0),
    projectile_damage: new Array(MAX_PROJECTILES).fill(0),
    projectile_speed: new Array(MAX_PROJECTILES).fill(0),

    // Friends
    friend_isActive: new Array(MAX_FRIENDS).fill(false),
    friend_id: new Array(MAX_FRIENDS).fill(0),
    friend_x: new Array(MAX_FRIENDS).fill(0),
    friend_y: new Array(MAX_FRIENDS).fill(0),
    friend_hp: new Array(MAX_FRIENDS).fill(0),
    friend_isFleeing: new Array(MAX_FRIENDS).fill(false),

    // Camps
    camp_isActive: new Array(MAX_CAMPS).fill(false),
    camp_id: new Array(MAX_CAMPS).fill(0),
    camp_x: new Array(MAX_CAMPS).fill(0),
    camp_y: new Array(MAX_CAMPS).fill(0),
    camp_type: new Array(MAX_CAMPS).fill(''), // Empty string default
    camp_hp: new Array(MAX_CAMPS).fill(0),
    camp_isFriendly: new Array(MAX_CAMPS).fill(false),
  };
}
