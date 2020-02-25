import { WeaponHandler } from "./WeaponHandler";
import { Gameplay } from "../../scenes/Gameplay";
import { Weapon } from "../weapon/Weapon";
import { DangerousCircle } from "../unit/DangerousCircle";
import { Shooter } from "../tower/shooter/Shooter";
import { Cooperation } from "../state/Cooperation";

export class SightOverlap {
	constructor(private scene: Gameplay, combinatorialArr, private cooperation: Cooperation) {
		combinatorialArr.forEach(arr => {
			let firstsArr = arr[0];
			let secondsArr = arr[1];
			firstsArr.forEach(first => {
				secondsArr.forEach(second => {
					scene.physics.add.overlap(first, second, this.doDamage.bind(this), this.isInSight.bind(this));
				});
			});
		});
	}

	private doDamage(weapon, enemy) {
		WeaponHandler.doDamage(this.scene, weapon, enemy);
	}

	private isInSight(weapon: Weapon, enemy) {
		let isNotInCooperation = !this.cooperation.hasCooperation((weapon.owner as DangerousCircle).campID, enemy.campID);

		if (isNotInCooperation) {
			if (enemy instanceof Shooter) {
				enemy.fire(weapon.owner);
			}

			if (WeaponHandler.shouldTryDamage(weapon, enemy)) {
				return WeaponHandler.tryCollision(weapon, enemy);
			} else {
				(weapon.owner as DangerousCircle).stateHandler.spotted = enemy;
			}
		}

		return false;
	}
}
