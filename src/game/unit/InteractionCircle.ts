import { EventSetup } from "../setup/EventSetup";
import { CircleUnit } from "./CircleUnit";

export class InteractionCircle extends CircleUnit {
	stateHandler = { spotted: null, obstacle: null };

	destroy() {
		EventSetup.destroyInteractionCircle(this.scene, this.campID);
		super.destroy();
	}
}
