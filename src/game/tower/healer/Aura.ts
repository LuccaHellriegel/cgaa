import { Image } from "../../base/BasePhaser";
import { EnvSetup } from "../../setup/EnvSetup";

//TODO: healer should not be able to heal itself
export class Aura extends Image {
	canHeal = true;
	intervalID: number;
	constructor(config) {
		super(config);
		this.setSize(EnvSetup.gridPartSize + 5, EnvSetup.gridPartSize + 5);
	}

	deactivate() {
		if (this.intervalID) clearInterval(this.intervalID);
	}

	activate() {
		this.intervalID = setInterval(this.toggle.bind(this), 10000);
	}

	toggle() {
		this.canHeal = !this.canHeal;
	}
}
