import { Gameplay } from "../../scenes/Gameplay";
import { DangerousCircle } from "../unit/DangerousCircle";
import { Shooter } from "../tower/shooter/Shooter";
import { Cooperation } from "../state/Cooperation";
import { ChainWeapon } from "../weapon/chain/weapon";
import { addCombinatorialOverlap } from "./Collision";

export class SightOverlap {
	constructor(scene: Gameplay, combinatorialArr, private cooperation: Cooperation) {
		addCombinatorialOverlap(scene, combinatorialArr, this.isInSight.bind(this), null);
	}

	private isInSight(chainWeapon: ChainWeapon, enemy) {
		let isNotInCooperation = !this.cooperation.hasCooperation(
			(chainWeapon.owner as DangerousCircle).campID,
			enemy.campID
		);

		if (isNotInCooperation) {
			if (enemy instanceof Shooter) {
				enemy.fire(chainWeapon.owner);
			} else {
				(chainWeapon.owner as DangerousCircle).stateHandler.spotted = enemy;
			}

			return false;
		}
	}
}
