import { Gameplay } from "../../scenes/Gameplay";
import { Player } from "../unit/Player";
import { Aura } from "../tower/healer/Aura";

export interface healable {
	needsHealing(): boolean;
	heal(amount: number);
	id: string;
}

//TODO: idea, have lock-var that only is true  every x seconds, which is when we heal ( more peformant?)
export class HealerAura {
	constructor(scene: Gameplay, healerGroup, shooterGroup, playerGroup) {
		scene.physics.add.overlap(healerGroup, shooterGroup, this.heal.bind(this), this.needsHealing.bind(this));
		scene.physics.add.overlap(healerGroup, playerGroup, this.heal.bind(this), this.needsHealing.bind(this));
	}

	private playerNeedsHealing(first, second) {
		//TODO: healing player, method on player?
		return false;
	}

	private needsHealing(first: Aura, second: healable) {
		if (first.canHeal) {
			if (second instanceof Player) {
				return this.playerNeedsHealing(first, second);
			} else {
				return second.needsHealing();
			}
		}
		return false;
	}

	private heal(first, second: healable) {
		second.heal(5);
	}
}
