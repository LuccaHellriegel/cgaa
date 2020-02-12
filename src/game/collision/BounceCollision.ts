import { Gameplay } from "../../scenes/Gameplay";
import { Cooperation } from "../state/Cooperation";
import { CampID } from "../setup/CampSetup";

export class BounceCollision {
	constructor(scene: Gameplay, combinatorialArr, private cooperation: Cooperation) {
		combinatorialArr.forEach(arr => {
			let firstsArr = arr[0];
			let secondsArr = arr[1];
			firstsArr.forEach(first => {
				secondsArr.forEach(second => {
					scene.physics.add.collider(first, second, this.bounceCallback.bind(this));
				});
			});
		});
	}

	private bounceCallback(unit, obj) {
		if (unit.campID === obj.campID) {
			unit.stateHandler.moveBack();
		} else {
			let cooperationSet = this.cooperation.dict[unit.campID] as Set<CampID>;
			if (!cooperationSet.has(obj.campID)) {
				unit.stateHandler.obstacle = obj;
			}
		}
	}
}
