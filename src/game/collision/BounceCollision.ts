import { WallSide } from "../env/wall/WallSide";
import { Building } from "../building/Building";
import { Gameplay } from "../../scenes/Gameplay";
import { EnemyCircle } from "../unit/EnemyCircle";
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

	//TODO: find out why Units are crashing into the wall in the first place
	private bounceCallback(unit: EnemyCircle, obj) {
		if (
			(obj instanceof WallSide || obj instanceof Building) &&
			unit.type !== "player" &&
			unit.stateHandler &&
			unit.stateHandler.lastPositions
		) {
			unit.setVelocity(0, 0);
			let lastPos = unit.stateHandler.lastPositions[0];
			unit.setPosition(lastPos.x, lastPos.y);
			unit.state = "guard";
			//TODO: this really might be the source of the lag? Sometimes at least
			console.log("WallSide collision", unit.campID);
		} else if (unit.campID !== "blue") {
			let cooperationSet = this.cooperation.dict[unit.campID] as Set<CampID>;
			if (!cooperationSet.has(obj.campID)) {
				unit.barrier = obj;
				unit.state = "obstacle";
			}
		}
	}
}
