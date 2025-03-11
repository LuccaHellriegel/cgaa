import { TowerType } from "../types/TowerTypes";

export interface GameState {
  showBuildMenu: boolean;
  showTowerMenu: boolean;
  selectedTower: TowerType | null;
  souls: number;
}

export class GameController {
  private state: GameState = {
    showBuildMenu: false,
    showTowerMenu: false,
    selectedTower: null,
    souls: 0,
  };

  public getState(): GameState {
    return this.state;
  }

  public updateState(newState: Partial<GameState>): void {
    this.state = { ...this.state, ...newState };
  }
}
