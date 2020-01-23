import { Weapon } from "../weapons/Weapon";
import { InteractionCircle } from "../enemies/unit/InteractionCircle";
import { EnemyCircle } from "../enemies/unit/EnemyCircle";
import { Shooter } from "../player/unit/shooter/Shooter";
import { WeaponHandler } from "./WeaponHandler";
import { Gameplay } from "../../scenes/Gameplay";

export class SightOverlap {
	constructor(private scene: Gameplay, combinatorialArr) {
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
		let isNotSameCamp = (weapon.owner as EnemyCircle).color !== enemy.color;
		let isNotAlreadyGuard = weapon.owner.state !== "guard";
		let isNotInCooperation =
			weapon.owner instanceof EnemyCircle &&
			!(weapon.owner as EnemyCircle).scene.cgaa.camps[(weapon.owner as EnemyCircle).color].dontAttackList.includes(
				enemy.color
			);
		return (
			isNotPlayer && isNotInAmbush && isNotInteractionCircle && isNotSameCamp && isNotAlreadyGuard && isNotInCooperation
		);
	}

	private isInSight(weapon: Weapon, enemy) {
		let isNotInCooperationWithPlayer =
			weapon.owner instanceof EnemyCircle &&
			!(weapon.owner as EnemyCircle).scene.cgaa.camps[(weapon.owner as EnemyCircle).color].dontAttackList.includes(
				"blue"
			);
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
