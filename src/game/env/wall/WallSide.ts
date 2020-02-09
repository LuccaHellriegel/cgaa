import { WallPart } from "./WallPart";
import { EnvSetup } from "../../setup/EnvSetup";
import { Gameplay } from "../../../scenes/Gameplay";
import { Point } from "../../base/types";

export class WallSide extends Phaser.Physics.Arcade.Image {
	constructor(scene: Gameplay, physicGroup: Phaser.Physics.Arcade.StaticGroup, partPositions: Point[]) {
		let firstPositionX = partPositions[0].x;
		let lastPositionX = partPositions[partPositions.length - 1].x;
		let width = lastPositionX - firstPositionX + EnvSetup.gridPartSize;

		let firstPositionY = partPositions[0].y;
		let lastPositionY = partPositions[partPositions.length - 1].y;
		let height = lastPositionY - firstPositionY + EnvSetup.gridPartSize;

		super(
			scene,
			firstPositionX + width / 2 - EnvSetup.halfGridPartSize,
			firstPositionY + height / 2 - EnvSetup.halfGridPartSize,
			""
		);

		scene.add.existing(this);
		physicGroup.add(this);
		this.setSize(width, height);

		partPositions.forEach(partPosition => {
			new WallPart(scene, partPosition.x, partPosition.y);
		});
	}
}
