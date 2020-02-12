import { Gameplay } from "../../scenes/Gameplay";

//TODO: find out why Units are crashing into the wall in the first place
//TODO: idea: path gets aborted?
export class StandardCollision {
	constructor(scene: Gameplay, combinatorialArr) {
		combinatorialArr.forEach(arr => {
			let firstsArr = arr[0];
			let secondsArr = arr[1];
			firstsArr.forEach(first => {
				secondsArr.forEach(second => {
					scene.physics.add.collider(first, second);
				});
			});
		});
	}
}
