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

	private setback(unit) {
		let lastPos = unit.stateHandler.lastPositions[0];
		unit.setPosition(lastPos.x, lastPos.y);
	}
	private bounceCallback(unit, obj) {
		if (unit.campID === obj.campID) {
			this.setback(unit);
		} else {
			//TODO: this really might be the source of the lag? Sometimes at least
			//TODO: hypothesis -> tries to attack wall? walk to wall position?
			let cooperationSet = this.cooperation.dict[unit.campID] as Set<CampID>;
			if (!cooperationSet.has(obj.campID)) {
				unit.barrier = obj;
				unit.state = "obstacle";
			}
		}
	}
}
