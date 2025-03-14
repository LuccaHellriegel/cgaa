import { TowerData } from "../components/TowerMenu";

export type TowerType = "basic" | "splash" | "sniper";

export interface TowerUpgrade {
  cost: number;
  damageIncrease: number;
  rangeIncrease: number;
  attackSpeedIncrease: number;
}

export const TOWER_UPGRADES: Record<number, TowerUpgrade> = {
  1: {
    cost: 100,
    damageIncrease: 5,
    rangeIncrease: 20,
    attackSpeedIncrease: 0.1,
  },
  2: {
    cost: 200,
    damageIncrease: 10,
    rangeIncrease: 30,
    attackSpeedIncrease: 0.2,
  },
  3: {
    cost: 300,
    damageIncrease: 15,
    rangeIncrease: 40,
    attackSpeedIncrease: 0.3,
  },
};

export const TowerTypes: Record<TowerType, TowerData> = {
  basic: {
    name: "Basic Tower",
    damage: 10,
    range: 100,
    cost: 50,
    level: 1,
    attackSpeed: 1.0,
  },
  splash: {
    name: "Splash Tower",
    damage: 15,
    range: 120,
    cost: 100,
    level: 1,
    attackSpeed: 0.8,
  },
  sniper: {
    name: "Sniper Tower",
    damage: 30,
    range: 200,
    cost: 150,
    level: 1,
    attackSpeed: 0.5,
  },
};
