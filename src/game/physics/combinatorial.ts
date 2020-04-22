import { Gameplay } from "../../scenes/Gameplay";

export function addCombinatorialOverlap(scene: Gameplay, combinatorialArr, collideCallback, processCallback) {
	for (let arr of combinatorialArr) {
		let firstsArr = arr[0];
		let secondsArr = arr[1];
		for (let first of firstsArr) {
			for (let second of secondsArr) {
				scene.physics.add.overlap(first, second, collideCallback, processCallback);
			}
		}
	}
}

export function addCombinatorialCollider(scene: Gameplay, combinatorialArr, collideCallback, processCallback) {
	for (let arr of combinatorialArr) {
		let firstsArr = arr[0];
		let secondsArr = arr[1];
		for (let first of firstsArr) {
			for (let second of secondsArr) {
				scene.physics.add.collider(first, second, collideCallback, processCallback);
			}
		}
	}
}
