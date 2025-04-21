/**
 * Defines the structure for player-specific balance settings.
 */
export interface PlayerBalance {
  maxHp: number;
  speed: number;
  // Add other player stats here later (e.g., damage, attack speed)
}

/**
 * Defines the structure for a single tower type's balance settings.
 */
export interface TowerTypeBalance {
  cost: number;
  // Add other tower stats here later (e.g., range, damage/heal amount, fire rate)
}

/**
 * Defines the structure for tower-related balance settings.
 */
export interface TowerBalance {
  types: {
    [key: string]: TowerTypeBalance; // e.g., 'Shooter', 'Healer'
  };
  maxTowers: number;
}

/**
 * Defines the overall structure for immutable game balance data.
 * This data is loaded once at the start and remains constant.
 */
export interface Balance {
  player: PlayerBalance;
  towers: TowerBalance;
  // Add other balance categories later (e.g., enemies, waves, camps, king)
}

/**
 * Loads the game's balance data.
 * Initially uses hardcoded values.
 * TODO: Replace with loading from JSON files in a future story.
 * @returns The immutable Balance object.
 */
export function loadBalanceData(): Balance {
  // Hardcoded values for now
  const balance: Balance = {
    player: {
      maxHp: 100,
      speed: 3, // Units per second
    },
    towers: {
      types: {
        Shooter: {
          cost: 50,
        },
        Healer: {
          cost: 75,
        },
      },
      maxTowers: 10,
    },
  };

  // Deep freeze the object to enforce immutability during development
  // Note: This has a performance cost, consider removing for production builds if needed.
  const deepFreeze = (obj: any): any => {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    Object.keys(obj).forEach((prop) => {
      if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) {
        deepFreeze(obj[prop]);
      }
    });
    return Object.freeze(obj);
  };

  return deepFreeze(balance);
}
