import { Gameplay } from "../../scenes/Gameplay";
import { Player } from "../unit/Player";
import { Aura } from "../tower/healer/Aura";

export interface healable {
	needsHealing(): boolean;
	heal(amount: number);
	id: string;
}

export class HealerAura {
	constructor(scene: Gameplay, healerGroup, shooterGroup, playerGroup) {
		scene.physics.add.overlap(healerGroup, shooterGroup, this.heal.bind(this), this.needsHealing.bind(this));
		scene.physics.add.overlap(healerGroup, playerGroup, this.heal.bind(this), this.needsHealing.bind(this));
	}

	private needsHealing(first: Aura, second: healable) {
		if (first.canHeal) {
			return second.needsHealing();
		}
		return false;
	}

	private heal(first, second: healable) {
		second.heal(5);
	}
}
