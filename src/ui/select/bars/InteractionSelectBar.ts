import { HUD } from "../../../scenes/HUD";
import { Rect } from "../../rect/Rect";
import { SelectBar } from "./SelectBar";
import { UnitCompositeRect } from "../../rect/UnitCompositeRect";
import { SelectionManager } from "../SelectionManager";
import { ClickableTextRect, ClickableImageRect } from "../../rect/DoubleRect";
import { Quests } from "../../../engine/quest/Quests";
import { TextGUIElement } from "../../TextGUIElement";
import { Quest } from "../../../engine/quest/Quest";
import { CampSetup } from "../../../config/CampSetup";
import { InteractionCircle } from "../../../units/InteractionCircle/InteractionCircle";
import { BitwiseCooperation } from "../../../engine/BitwiseCooperation";

export class InteractionSelectBar extends SelectBar {
  cooperation: BitwiseCooperation;
  selectionManager: SelectionManager;
  quests;
  constructor(
    sceneToUse: HUD,
    x,
    y,
    cooperation: BitwiseCooperation,
    selectionManager: SelectionManager,
    quests: Quests
  ) {
    let baseRect = new Rect(sceneToUse, x, y, 180, 80, 0xd3d3d3);

    let textRect = new ClickableTextRect(
      sceneToUse,
      x - 50,
      y,
      60,
      60,
      0xffffff,
      "Accept\nQuest"
    );
    textRect.textObj.setPosition(textRect.textObj.x - 8, textRect.textObj.y);
    let unitRect = new UnitCompositeRect(sceneToUse, "diplomat", x + 40, y + 2);
    (unitRect.rects[1] as TextGUIElement).textObj.setStyle({
      font: "18px Verdana ",
      fill: "#000000",
      fontWeight: "bold",
    });
    (unitRect.rects[1] as TextGUIElement).textObj.setPosition(
      (unitRect.rects[1] as TextGUIElement).textObj.x - 5,
      (unitRect.rects[1] as TextGUIElement).textObj.y
    );

    super(baseRect, [textRect, unitRect]);

    this.cooperation = cooperation;
    this.selectionManager = selectionManager;
    this.quests = quests;

    //TODO: oh man
    (
      (this.contentElements[1] as UnitCompositeRect)
        .rects[0] as ClickableImageRect
    ).image.setScale(1, 1);
  }

  updateClickableText(newText: string) {
    (this.contentElements[0] as ClickableTextRect).setText(newText);
  }

  show() {
    let interactedCampMask = (
      this.selectionManager.selectedUnit as InteractionCircle
    ).campMask;
    let hasCooperation = this.cooperation.has(
      interactedCampMask,
      CampSetup.playerCampMask
    );
    //TODO: switch quest to bitwise too?
    let quest: Quest = this.quests.get(
      (this.selectionManager.selectedUnit as InteractionCircle).campID
    );

    if (hasCooperation) {
      this.updateClickableText("Switch\nTarget");
    } else if (quest.activeOrSuccess()) {
      this.updateClickableText("Check\nQuest");
    } else {
      this.updateClickableText("Accept\nQuest");
    }
    super.show();
  }
}
//TODO: change text rect if quest fullfilled!
