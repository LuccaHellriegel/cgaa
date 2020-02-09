import { Image } from "../../base/BasePhaser";
import { EnvSetup } from "../../setup/EnvSetup";

export class Aura extends Image {
	hasHealed = {};
	constructor(config) {
		super(config);
		this.setSize(EnvSetup.gridPartSize + 5, EnvSetup.gridPartSize + 5);
	}
}
