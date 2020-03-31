import { WeaponHandler } from "./WeaponHandler";
import { Gameplay } from "../../scenes/Gameplay";
import { ChainWeapon } from "../weapon/ChainWeapon";
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

	private doDamage(ChainWeapon, enemy) {
		WeaponHandler.doDamage(this.scene, ChainWeapon, enemy);
	}

	private isInSight(ChainWeapon: ChainWeapon, enemy) {
		let isNotInCooperation = !this.cooperation.hasCooperation(
			(ChainWeapon.owner as DangerousCircle).campID,
			enemy.campID
		);

		if (isNotInCooperation) {
			if (enemy instanceof Shooter) {
				enemy.fire(ChainWeapon.owner);
			}

			if (WeaponHandler.shouldTryDamage(ChainWeapon, enemy)) {
				return WeaponHandler.tryCollision(ChainWeapon, enemy);
			} else {
				(ChainWeapon.owner as DangerousCircle).stateHandler.spotted = enemy;
			}
		}

		return false;
	}
}
