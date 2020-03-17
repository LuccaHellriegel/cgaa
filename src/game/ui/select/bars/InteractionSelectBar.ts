import { ClickableTextRect, ClickableImageRect } from "../../DoubleRect";
import { HUD } from "../../../../scenes/HUD";
import { Rect } from "../../Rect";
import { SelectBar } from "../SelectBar";
import { UnitCompositeRect } from "../../CompositeRect";
import { Cooperation } from "../../../state/Cooperation";
import { SelectionManager } from "../SelectionManager";
import { InteractionCircle } from "../../../unit/InteractionCircle";
import { CampSetup } from "../../../setup/CampSetup";
export class InteractionSelectBar extends SelectBar {
	cooperation: Cooperation;
	selectionManager: SelectionManager;
	constructor(sceneToUse: HUD, x, y, cooperation: Cooperation, selectionManager: SelectionManager) {
		let baseRect = new Rect(sceneToUse, x, y, 180, 80, 0xd3d3d3);

		super(baseRect, [
			new ClickableTextRect(sceneToUse, x - 50, y, 60, 60, 0xffffff, "Accept\nQuest"),
			new UnitCompositeRect(sceneToUse, "diplomat", x + 40, y)
		]);

		this.cooperation = cooperation;
		this.selectionManager = selectionManager;

		//TODO: oh man
		((this.contentElements[1] as UnitCompositeRect).rects[0] as ClickableImageRect).image.setScale(1, 1);
	}

	updateClickableText(newText: string) {
		(this.contentElements[0] as ClickableTextRect).setText(newText);
	}

	show() {
		let interactedCampID = (this.selectionManager.selectedUnit as InteractionCircle).campID;
		let hasCooperation = this.cooperation.hasCooperation(interactedCampID, CampSetup.playerCampID);

		console.log(hasCooperation, this.cooperation.dict);

		if (hasCooperation) {
			this.updateClickableText("Switch\nAttack\nTarget");
		} else if (this.cooperation.quests.hasAccepted(interactedCampID)) {
			this.updateClickableText("Test if\nQuest done");
		} else {
			this.updateClickableText("Accept\nQuest");
		}
		super.show();
	}
}
//TODO: change text rect if quest fullfilled!
