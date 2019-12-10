import { TowerModus } from "./TowerModus";
import { InteractionModus } from "./InteractionModus";

export function setupPointerEvents(
	scene,
	player,
	towerModus: TowerModus,
	towerManager,
	interactionModus: InteractionModus
) {
	let input = scene.input;

	input.on("pointermove", function(pointer) {
		let mainCamera = scene.cameras.main;
		let scrollX = mainCamera.scrollX;
		let scrollY = mainCamera.scrollY;
		let x = pointer.x + scrollX;
		let y = pointer.y + scrollY;

		rotatePlayerTowardsMouse(x, y, player);
		towerModus.syncGhostTowerWithMouse(x, y);
	});

	input.on("pointerdown", function(pointer) {
		//TODO: only left click
		if (pointer) {
			if (interactionModus.isOn) {
				interactionModus.interactWithClosestEle();
			} else if (towerModus.isOn) {
				towerManager.spawnNewTower(towerModus.ghostTower.x, towerModus.ghostTower.y);
			} else {
				player.attack();
			}
		}
	});
}

function rotatePlayerTowardsMouse(newX, newY, player) {
	let x = player.x;
	let y = player.y;

	let rotation = Phaser.Math.Angle.Between(x, y, newX, newY);

	let correctionForPhasersMinus90DegreeTopPostion = (Math.PI / 180) * 90;
	player.setRotation(rotation + correctionForPhasersMinus90DegreeTopPostion);
}
