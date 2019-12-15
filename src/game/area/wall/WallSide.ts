import { Gameplay } from "../../../scenes/Gameplay";
import { WallPart } from "./WallPart";
import { gridPartHalfSize } from "../../base/globals/globalSizes";

export class WallSide extends Phaser.Physics.Arcade.Image {
	constructor(scene: Gameplay, physicGroup: Phaser.Physics.Arcade.StaticGroup, partPositions) {
		let firstPositionX = partPositions[0].x;
		let lastPositionX = partPositions[partPositions.length - 1].x;
		let width = lastPositionX - firstPositionX + 2 * gridPartHalfSize;

		let firstPositionY = partPositions[0].y;
		let lastPositionY = partPositions[partPositions.length - 1].y;
		let height = lastPositionY - firstPositionY + 2 * gridPartHalfSize;

		// if (height > width) {
		// 	let temp = height;
		// 	height = width;
		// 	width = temp;
		// }

		super(scene, firstPositionX + width / 2 - gridPartHalfSize, firstPositionY + height / 2 - gridPartHalfSize, "");

		scene.add.existing(this);
		physicGroup.add(this);
		this.setSize(width, height);

		partPositions.forEach(partPosition => {
			new WallPart(scene, partPosition.x, partPosition.y);
		});
	}
}
