import { Image } from "../../../base/classes/BasePhaser";
import { gridPartHalfSize } from "../../../base/globals/globalSizes";

export class Aura extends Image {
	hasHealed = {};
	constructor(config) {
		super(config);
		this.setSize(2 * gridPartHalfSize + 5, 2 * gridPartHalfSize + 5);
	}
}
