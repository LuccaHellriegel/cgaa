import { WeaponHandler } from "./WeaponHandler";
import { Gameplay } from "../../scenes/Gameplay";
import { Weapon } from "../weapon/Weapon";
import { EnemyCircle } from "../unit/EnemyCircle";
import { InteractionCircle } from "../unit/InteractionCircle";
import { King } from "../unit/King";
import { Shooter } from "../tower/shooter/Shooter";
import { Cooperation } from "../state/Cooperation";
import { CampID, CampSetup } from "../setup/CampSetup";

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

	private shouldSwitchToGuard(weapon: Weapon, enemy) {
		let isNotPlayer = weapon.owner.unitType !== "player";
		let isNotInAmbush = weapon.owner.state !== "ambush";
		let isNotInteractionCircle = !(weapon.owner instanceof InteractionCircle);
		let isNotSameCamp = (weapon.owner as EnemyCircle).campID !== enemy.campID;
		let isNotAlreadyGuard = weapon.owner.state !== "guard";

		//TODO: fix instanceof
		//TODO: King should always move back to his start-position
		let isNotInCooperation =
			(weapon.owner instanceof EnemyCircle || weapon.owner instanceof King) &&
			!this.cooperation.hasCooperation((weapon.owner as EnemyCircle).campID, enemy.campID);
		return (
			isNotPlayer && isNotInAmbush && isNotInteractionCircle && isNotSameCamp && isNotAlreadyGuard && isNotInCooperation
		);
	}

	private isInSight(weapon: Weapon, enemy) {
		let isNotInCooperationWithPlayer =
			weapon.owner instanceof EnemyCircle &&
			!this.cooperation.hasCooperation((weapon.owner as EnemyCircle).campID, CampSetup.playerCampID);
		if (enemy instanceof Shooter && isNotInCooperationWithPlayer) {
			enemy.fire(weapon.owner);
		}
		if (WeaponHandler.shouldTryDamage(weapon, enemy)) {
			return WeaponHandler.tryCollision(weapon, enemy);
		} else if (this.shouldSwitchToGuard(weapon, enemy)) {
			(weapon.owner as EnemyCircle).stateHandler.spotted = enemy;
			weapon.owner.state = "guard";
		}

		return false;
	}
}
