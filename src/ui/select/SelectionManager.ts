import { SelectorRect } from "../SelectorRect";
import { TowerSelectBar } from "./bars/TowerSelectBar";
import { InteractionSelectBar } from "./bars/InteractionSelectBar";
import { Shooter } from "../../towers/Shooter";
import { Healer } from "../../towers/Healer";
export class SelectionManager {
  selectedUnit;
  healerSelectBar: TowerSelectBar;
  shooterSelectBar: TowerSelectBar;
  interactionSelectBar: InteractionSelectBar;

  constructor(private selectorRect: SelectorRect) {}
  setSelectBars(
    healerSelectBar: TowerSelectBar,
    shooterSelectBar: TowerSelectBar,
    interactionSelectBar: InteractionSelectBar
  ) {
    this.healerSelectBar = healerSelectBar;
    this.shooterSelectBar = shooterSelectBar;
    this.interactionSelectBar = interactionSelectBar;
  }

  select(unit) {
    this.selectedUnit = unit;
    this.lockOn();

    if (unit instanceof Shooter) {
      this.shooterSelectBar.show();
    } else if (unit instanceof Healer) {
      this.healerSelectBar.show();
    } else {
      this.interactionSelectBar.show();
    }
  }

  lockOn() {
    this.selectorRect.setPosition(this.selectedUnit.x, this.selectedUnit.y);
    this.selectorRect.setVisible(true).setActive(false);
  }
}
