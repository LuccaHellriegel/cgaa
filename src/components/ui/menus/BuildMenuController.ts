import { TowerType } from "../../Tower";
import { GameState } from "../../../controllers/GameController";
import { assert } from "../../../utils/assert";

export class BuildMenuController {
  private selectedTower: TowerType | null = null;
  private gameState: GameState | null = null;

  constructor() {
    // No initialization needed
  }

  public updateState(state: GameState): void {
    assert(state !== undefined, "State must be defined");
    assert(
      typeof state.gold === "number" && state.gold >= 0,
      "State must have valid gold amount",
      { gold: state.gold }
    );
    assert(typeof state.mode === "string", "State must have valid mode", {
      mode: state.mode,
    });

    this.gameState = state;
  }

  public selectTower(tower: TowerType): void {
    assert(typeof tower === "string", "Tower must be a string", { tower });

    // If the same tower is selected, deselect it
    if (this.selectedTower === tower) {
      this.selectedTower = null;
    } else {
      this.selectedTower = tower;
    }
  }

  public getSelectedTower(): TowerType | null {
    return this.selectedTower;
  }

  public clearSelection(): void {
    this.selectedTower = null;
  }

  public canAffordTower(cost: number): boolean {
    assert(
      typeof cost === "number" && cost >= 0,
      "Cost must be a non-negative number",
      { cost }
    );

    if (!this.gameState) {
      return false;
    }

    return this.gameState.gold >= cost;
  }

  public isInBuildMode(): boolean {
    if (!this.gameState) {
      return false;
    }

    return this.gameState.mode === "build";
  }
}
