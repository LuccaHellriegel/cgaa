import { Modi } from "./modi/Modi";
import { Gameplay } from "../../../scenes/Gameplay";

function rotatePlayerTowardsMouse(newX, newY, player) {
	let x = player.x;
	let y = player.y;

	let rotation = Phaser.Math.Angle.Between(x, y, newX, newY);

	let correctionForPhasersMinus90DegreeTopPostion = (Math.PI / 180) * 90;
	player.setRotation(rotation + correctionForPhasersMinus90DegreeTopPostion);
}

export function setupPointerEvents(scene: Gameplay, player, ghostTower, modi: Modi) {
	let input = scene.input;

	input.on("pointermove", function(pointer) {
		let mainCamera = scene.cameras.main;
		let scrollX = mainCamera.scrollX;
		let scrollY = mainCamera.scrollY;
		let x = pointer.x + scrollX;
		let y = pointer.y + scrollY;

		rotatePlayerTowardsMouse(x, y, player);
		if (ghostTower.active) {
			ghostTower.setPosition(x, y);
		}
	});

	input.on("pointerdown", () => {
		if (!modi.checkModi()) player.attack();
	});
}
