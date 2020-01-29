import { Gameplay } from "../../scenes/Gameplay";
import { EnemyCircle } from "../enemies/unit/EnemyCircle";
import { WallSide } from "../area/wall/WallSide";

//TODO: find bug, that executes too many collisions, I think it executes a loop at some point
export class BounceCollision {
	constructor(scene: Gameplay, combinatorialArr) {
		combinatorialArr.forEach(arr => {
			let firstsArr = arr[0];
			let secondsArr = arr[1];
			firstsArr.forEach(first => {
				secondsArr.forEach(second => {
					scene.physics.add.collider(first, second, this.bounceCallback);
				});
			});
		});
	}

	private bounceCallback(unit: EnemyCircle, obj) {
		if (obj instanceof WallSide) {
			//TODO
			unit.setVelocity(0, 0);
		} else if (unit.color !== "blue") {
			let dontAttackList = unit.scene.cgaa.camps[unit.color].dontAttackList;
			if (dontAttackList && !dontAttackList.includes(obj.color)) {
				unit.barrier = obj;
				unit.state = "obstacle";
			}
		}
	}
}
