import { Gameplay } from "../../scenes/Gameplay";
import { Player } from "../player/unit/Player";

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

	private needsHealing(first, second: healable) {
		if (second instanceof Player) {
			return this.playerNeedsHealing(first, second);
		} else {
			//TODO: research if timeouts for overlaps exists
			const curTimeInSec = Math.floor(Date.now() / 1000);

			const notAlreadyBeenHealedInTheLastSeconds =
				first.hasHealed[second.id] && curTimeInSec - first.hasHealed[second.id] > 5;
			//TODO: does not work -> every overlap gives health
			console.log(second.needsHealing(), second.id, JSON.stringify(first.hasHealed[second.id]));

			return second.needsHealing() && notAlreadyBeenHealedInTheLastSeconds;
		}
	}

	private heal(first, second: healable) {
		second.heal(5);
		first.hasHealed[second.id] = Math.floor(Date.now() / 1000);
		console.log(second.id, JSON.stringify(first.hasHealed[second.id]));
	}
}
